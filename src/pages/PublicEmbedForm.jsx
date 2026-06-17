import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicEmbedForm() {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [vals, setVals] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1';

    const isFieldVisible = (field, allFields, values, visited = new Set()) => {
        if (!field.conditional || !field.conditional.enabled) return true;
        const depId = Number(field.conditional.dependentFieldId);
        if (!depId) return true;

        const depField = allFields.find(f => f.id === depId);
        if (!depField) return true;

        if (!visited.has(depId)) {
            visited.add(depId);
            const parentVisible = isFieldVisible(depField, allFields, values, visited);
            if (!parentVisible) return false;
        }

        const depValue = values[depId];
        const targetValue = field.conditional.value;
        const operator = field.conditional.operator || 'equals';

        if (Array.isArray(depValue)) {
            switch (operator) {
                case 'equals':
                case 'contains':
                    return depValue.includes(targetValue);
                case 'not_equals':
                    return !depValue.includes(targetValue);
                case 'empty':
                    return depValue.length === 0;
                case 'not_empty':
                    return depValue.length > 0;
                default:
                    return true;
            }
        }

        switch (operator) {
            case 'equals':
                return String(depValue || '') === String(targetValue || '');
            case 'not_equals':
                return String(depValue || '') !== String(targetValue || '');
            case 'contains':
                return String(depValue || '').toLowerCase().includes(String(targetValue || '').toLowerCase());
            case 'empty':
                return !depValue || String(depValue).trim() === '';
            case 'not_empty':
                return !!depValue && String(depValue).trim() !== '';
            default:
                return true;
        }
    };

    const isOptionVisible = (option, allFields, values) => {
        if (typeof option !== 'object' || !option || !option.conditionalEnabled) return true;
        const depId = Number(option.dependentFieldId);
        if (!depId) return true;

        const depField = allFields.find(f => f.id === depId);
        if (!depField) return true;

        const depValue = values[depId];
        const targetValue = option.conditionalValue;
        const operator = option.conditionalOperator || 'equals';

        if (Array.isArray(depValue)) {
            switch (operator) {
                case 'equals':
                case 'contains':
                    return depValue.includes(targetValue);
                case 'not_equals':
                    return !depValue.includes(targetValue);
                case 'empty':
                    return depValue.length === 0;
                case 'not_empty':
                    return depValue.length > 0;
                default:
                    return true;
            }
        }

        switch (operator) {
            case 'equals':
                return String(depValue || '') === String(targetValue || '');
            case 'not_equals':
                return String(depValue || '') !== String(targetValue || '');
            case 'contains':
                return String(depValue || '').toLowerCase().includes(String(targetValue || '').toLowerCase());
            case 'empty':
                return !depValue || String(depValue).trim() === '';
            case 'not_empty':
                return !!depValue && String(depValue).trim() !== '';
            default:
                return true;
        }
    };

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/form/public/get-form/${formId}`);
                if (response.ok) {
                    const data = await response.json();
                    setForm(data);
                    const initialVals = {};
                    (data.fields || []).forEach(field => {
                        if (field.type === 'checkbox') {
                            initialVals[field.id] = [];
                        } else {
                            initialVals[field.id] = '';
                        }
                    });
                    setVals(initialVals);
                } else {
                    const errData = await response.json().catch(() => ({}));
                    setError(errData.error || "Form not found or inactive.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load form. Please check your network connection.");
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [formId, API_BASE_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const fields = form.fields || [];
        const submissionBody = {};
        fields.forEach(f => {
            if (isFieldVisible(f, fields, vals)) {
                submissionBody[f.label] = vals[f.id];
            }
        });

        try {
            const response = await fetch(`${API_BASE_URL}/form/public/submit/${formId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionBody)
            });
            if (response.ok) {
                setSubmitted(true);
                const settings = form.settings || {};
                if (settings.redirect && settings.redirectUrl) {
                    setTimeout(() => {
                        try {
                            if (window.top) {
                                window.top.location.href = settings.redirectUrl;
                            } else {
                                window.location.href = settings.redirectUrl;
                            }
                        } catch (e) {
                            window.location.href = settings.redirectUrl;
                        }
                    }, 800);
                }
            } else {
                const errData = await response.json().catch(() => ({}));
                setError(errData.error || "Failed to submit form.");
            }
        } catch (err) {
            console.error("Submission error:", err);
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold text-slate-500">Loading form...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-[24px]">warning</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Unable to Load Form</h3>
                        <p className="text-sm text-slate-500 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-5"
                >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                        <span className="material-symbols-outlined text-[32px] font-bold">check</span>
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="font-extrabold text-slate-800 text-xl">Thank you!</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Your submission has been received successfully. We will get back to you shortly.</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    const fields = form.fields || [];

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-extrabold text-slate-800 text-lg">{form.name}</h2>
                    <p className="text-xs text-slate-400 mt-1">Please fill out the form below.</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {fields.filter(field => isFieldVisible(field, fields, vals)).map((field) => (
                        <div key={field.id} className="space-y-1.5 text-left">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {field.label}
                                {field.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                            </label>
                            {field.type === 'select' ? (
                                <select
                                    value={vals[field.id] || ''}
                                    onChange={e => setVals({ ...vals, [field.id]: e.target.value })}
                                    required={field.required}
                                    className="w-full h-10 px-3.5 border border-slate-205 rounded-xl bg-white text-slate-700 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer font-semibold"
                                >
                                    <option value="">{field.placeholder || 'Select option...'}</option>
                                    {(field.options || [])
                                        .filter(opt => isOptionVisible(opt, fields, vals))
                                        .map((opt, i) => {
                                            const val = typeof opt === 'object' && opt !== null ? (opt.value !== undefined ? opt.value : opt.label) : opt;
                                            const label = typeof opt === 'object' && opt !== null ? (opt.label !== undefined ? opt.label : opt.value) : opt;
                                            return <option key={i} value={val}>{label}</option>;
                                        })}
                                </select>
                            ) : field.type === 'radio' ? (
                                <div className="space-y-2 pt-1">
                                    {(field.options || [])
                                        .filter(opt => isOptionVisible(opt, fields, vals))
                                        .map((opt, i) => {
                                            const val = typeof opt === 'object' && opt !== null ? (opt.value !== undefined ? opt.value : opt.label) : opt;
                                            const label = typeof opt === 'object' && opt !== null ? (opt.label !== undefined ? opt.label : opt.value) : opt;
                                            return (
                                                <label key={i} className="flex items-center gap-2.5 cursor-pointer group select-none">
                                                    <input
                                                        type="radio"
                                                        name={`field-${field.id}`}
                                                        value={val}
                                                        checked={vals[field.id] === val}
                                                        onChange={() => setVals({ ...vals, [field.id]: val })}
                                                        required={field.required}
                                                        className="w-4 h-4 accent-sky-600 cursor-pointer"
                                                    />
                                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-sky-600 transition-colors">{label}</span>
                                                </label>
                                            );
                                        })}
                                </div>
                            ) : field.type === 'checkbox' ? (
                                <div className="space-y-2 pt-1">
                                    {(field.options || [])
                                        .filter(opt => isOptionVisible(opt, fields, vals))
                                        .map((opt, i) => {
                                            const val = typeof opt === 'object' && opt !== null ? (opt.value !== undefined ? opt.value : opt.label) : opt;
                                            const label = typeof opt === 'object' && opt !== null ? (opt.label !== undefined ? opt.label : opt.value) : opt;
                                            return (
                                                <label key={i} className="flex items-center gap-2.5 cursor-pointer group select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={(vals[field.id] || []).includes(val)}
                                                        onChange={(e) => {
                                                            const cur = vals[field.id] || [];
                                                            setVals({
                                                                ...vals,
                                                                [field.id]: e.target.checked ? [...cur, val] : cur.filter(v => v !== val)
                                                            });
                                                        }}
                                                        className="w-4 h-4 accent-sky-600 cursor-pointer rounded"
                                                    />
                                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-sky-600 transition-colors">{label}</span>
                                                </label>
                                            );
                                        })}
                                </div>
                            ) : (
                                <input
                                    type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                                    value={vals[field.id] || ''}
                                    onChange={e => setVals({ ...vals, [field.id]: e.target.value })}
                                    placeholder={field.placeholder || ''}
                                    required={field.required}
                                    className="w-full h-10 px-3.5 border border-slate-205 rounded-xl bg-white text-slate-700 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-semibold placeholder:text-slate-300"
                                />
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </>
                        ) : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
