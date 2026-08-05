import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
    Building2,
    Send,
    CheckCircle2,
    AlertCircle,
    Phone,
    HelpCircle,
    FileText,
    Clock,
    Sparkles,
    RefreshCw,
} from "lucide-react";

export default function PublicEmbedForm() {
    const { formId } = useParams();
    const [searchParams] = useSearchParams();

    const themeParam = searchParams.get("theme") || "light";
    const hideTitleParam = searchParams.get("hideTitle") === "1";
    const hideDescParam = searchParams.get("hideDesc") === "1";
    const autoResizeParam = searchParams.get("autoResize") === "1";

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formConfig, setFormConfig] = useState(null);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [successMessage, setSubmitSuccessMessage] = useState("");

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

    useEffect(() => {
        fetchForm();
    }, [formId]);

    useEffect(() => {
        if (!autoResizeParam) return;

        const sendHeight = () => {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: "LMS_FORM_RESIZE", height, formId }, "*");
        };

        sendHeight();

        const observer = new ResizeObserver(sendHeight);
        observer.observe(document.body);

        return () => observer.disconnect();
    }, [autoResizeParam, formConfig, submitSuccess, formErrors]);

    const fetchForm = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${apiBaseUrl}/api/forms/embed/${formId}`);
            const data = await response.json();
            if (response.ok && data.success) {
                setFormConfig(data.data);
                const initialData = {};
                (data.data.fields || []).forEach((field) => {
                    initialData[field.id] = field.defaultValue || "";
                });
                setFormData(initialData);
            } else {
                setError(data.message || "Failed to load form.");
            }
        } catch (err) {
            console.error("Error fetching embed form:", err);
            setError(err.message || "Form not found or unavailable.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (fieldId, value) => {
        setFormData((prev) => ({ ...prev, [fieldId]: value }));
        if (formErrors[fieldId]) {
            setFormErrors((prev) => {
                const copy = { ...prev };
                delete copy[fieldId];
                return copy;
            });
        }
    };

    const validate = () => {
        const errors = {};
        if (!formConfig || !formConfig.fields) return true;

        formConfig.fields.forEach((field) => {
            const val = formData[field.id];
            if (field.required && (!val || (typeof val === "string" && !val.trim()))) {
                errors[field.id] = `${field.label || "This field"} is required.`;
            }
            if (val && field.type === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val)) {
                    errors[field.id] = "Invalid email format.";
                }
            }
            if (field.type === "phone" && val) {
                const phoneRegex = /^[0-9+\s-]{7,15}$/;
                if (!phoneRegex.test(val)) {
                    errors[field.id] = "Invalid phone number.";
                }
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSubmitting(true);
            const response = await fetch(`${apiBaseUrl}/api/forms/embed/${formId}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: formData })
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitSuccess(true);
                setSubmitSuccessMessage(data.message || "Thank you! Your submission has been received.");
            } else {
                alert(data.message || "Failed to submit form.");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            alert(err.message || "Failed to submit form. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-6 bg-transparent">
                <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Loading form...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto my-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-slate-800 mb-1">Form Unavailable</h2>
                <p className="text-slate-600 text-sm">{error}</p>
            </div>
        );
    }

    const isDark = themeParam === "dark";

    return (
        <div className="w-full flex justify-center p-2 sm:p-4 bg-transparent">
            <div
                className={`w-full max-w-lg rounded-2xl border transition-all shadow-sm ${isDark
                        ? "bg-slate-900 border-slate-800 text-slate-100"
                        : "bg-white border-slate-100 text-slate-800"
                    }`}
            >
                {submitSuccess ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold">Submitted Successfully!</h2>
                        <p className="text-slate-600 text-sm">{successMessage}</p>
                        <button
                            onClick={() => {
                                setSubmitSuccess(false);
                                const initialData = {};
                                (formConfig?.fields || []).forEach((field) => {
                                    initialData[field.id] = field.defaultValue || "";
                                });
                                setFormData(initialData);
                            }}
                            className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all"
                        >
                            Submit Another Response
                        </button>
                    </div>
                ) : (
                    <div className="p-6 sm:p-8">
                        {(!hideTitleParam || !hideDescParam) && (
                            <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                {!hideTitleParam && (
                                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                        {formConfig?.title || "Form"}
                                    </h1>
                                )}
                                {!hideDescParam && formConfig?.description && (
                                    <p className="text-slate-500 text-sm mt-1">
                                        {formConfig.description}
                                    </p>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {(formConfig?.fields || []).map((field) => {
                                const errorMsg = formErrors[field.id];
                                return (
                                    <div key={field.id} className="space-y-1.5">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                            {field.label}
                                            {field.required && <span className="text-rose-500 ml-1">*</span>}
                                        </label>

                                        {field.type === "textarea" ? (
                                            <textarea
                                                value={formData[field.id] || ""}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                placeholder={field.placeholder}
                                                rows={3}
                                                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${errorMsg
                                                        ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-200"
                                                        : isDark
                                                            ? "bg-slate-800 border-slate-700 focus:border-blue-500"
                                                            : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    }`}
                                            />
                                        ) : field.type === "select" ? (
                                            <select
                                                value={formData[field.id] || ""}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${errorMsg
                                                        ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-200"
                                                        : isDark
                                                            ? "bg-slate-800 border-slate-700 focus:border-blue-500"
                                                            : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    }`}
                                            >
                                                <option value="">
                                                    {field.placeholder || "Select an option"}
                                                </option>
                                                {(field.options || []).map((opt, idx) => (
                                                    <option key={idx} value={typeof opt === "string" ? opt : opt.value}>
                                                        {typeof opt === "string" ? opt : opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : field.type === "phone" ? (
                                            <div className="flex gap-2">
                                                <select
                                                    value={formData[`${field.id}_code`] || "US (+1)"}
                                                    onChange={(e) => handleInputChange(`${field.id}_code`, e.target.value)}
                                                    className="px-3 py-2.5 rounded-xl border text-sm bg-white border-slate-300 outline-none"
                                                >
                                                    <option value="US (+1)">US (+1)</option>
                                                    <option value="IN (+91)">IN (+91)</option>
                                                    <option value="UK (+44)">UK (+44)</option>
                                                </select>
                                                <input
                                                    type="tel"
                                                    value={formData[field.id] || ""}
                                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                    placeholder={field.placeholder || "Enter phone number"}
                                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${errorMsg
                                                            ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-200"
                                                            : isDark
                                                                ? "bg-slate-800 border-slate-700 focus:border-blue-500"
                                                                : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                        }`}
                                                />
                                            </div>
                                        ) : (
                                            <input
                                                type={field.type || "text"}
                                                value={formData[field.id] || ""}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                placeholder={field.placeholder}
                                                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${errorMsg
                                                        ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-200"
                                                        : isDark
                                                            ? "bg-slate-800 border-slate-700 focus:border-blue-500"
                                                            : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    }`}
                                            />
                                        )}

                                        {errorMsg && (
                                            <p className="text-xs font-medium text-rose-500">{errorMsg}</p>
                                        )}
                                    </div>
                                );
                            })}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <span>Submit</span>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
