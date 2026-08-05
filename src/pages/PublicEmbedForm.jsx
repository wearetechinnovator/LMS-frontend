import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';

const PHONE_VALIDATION = {
    '+1': {
        pattern: /^\d{10}$/,
        length: '10 digits',
        desc: 'US phone number must be exactly 10 digits.'
    },
    '+91': {
        pattern: /^[6-9]\d{9}$/,
        length: '10 digits',
        desc: 'Indian phone number must be exactly 10 digits and start with 6, 7, 8, or 9.'
    },
    '+44': {
        pattern: /^7\d{9}$/,
        fallbackPattern: /^\d{9,11}$/,
        length: '10 digits starting with 7',
        desc: 'UK mobile number must be exactly 10 digits starting with 7.'
    },
    '+49': {
        pattern: /^\d{10,11}$/,
        length: '10 or 11 digits',
        desc: 'Germany phone number must be 10 or 11 digits.'
    },
    '+33': {
        pattern: /^[67]\d{8}$/,
        fallbackPattern: /^\d{9}$/,
        length: '9 digits',
        desc: 'France phone number must be exactly 9 digits.'
    },
    '+61': {
        pattern: /^4\d{8}$/,
        fallbackPattern: /^\d{9}$/,
        length: '9 digits',
        desc: 'Australia phone number must be exactly 9 digits.'
    },
    '+971': {
        pattern: /^5[024568]\d{7}$/,
        fallbackPattern: /^\d{9}$/,
        length: '9 digits',
        desc: 'UAE phone number must be exactly 9 digits.'
    },
    '+966': {
        pattern: /^5\d{8}$/,
        fallbackPattern: /^\d{9}$/,
        length: '9 digits',
        desc: 'Saudi Arabia phone number must be exactly 9 digits starting with 5.'
    },
    '+27': {
        pattern: /^[678]\d{8}$/,
        fallbackPattern: /^\d{9}$/,
        length: '9 digits',
        desc: 'South Africa phone number must be exactly 9 digits.'
    }
};

export default function PublicEmbedForm() {
    const isEmbedded = window.self !== window.top;
    const { formId } = useParams();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState(null);
    const [vals, setVals] = useState({});
    const [captchaData, setCaptchaData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    const [countriesList, setCountriesList] = useState([]);
    const [statesMap, setStatesMap] = useState({});
    const [citiesMap, setCitiesMap] = useState({});

    // Fetch countries list
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch('https://countriesnow.space/api/v0.1/countries/iso');
                const data = await res.json();
                if (data && !data.error) {
                    setCountriesList(data.data.map(c => c.name).sort());
                }
            } catch (e) {
                console.error('Failed to fetch countries', e);
            }
        };
        fetchCountries();
    }, []);

    // Fetch states reactively
    useEffect(() => {
        if (!form || !form.fields) return;
        form.fields.forEach(field => {
            if (field.type === 'city') {
                const mode = field.locationMode || 'all';
                const country = mode === 'all' ? vals[`${field.id}-country`] : field.selectedCountry;
                if (country) {
                    const fetchStates = async () => {
                        try {
                            const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ country })
                            });
                            const data = await res.json();
                            if (data && !data.error && data.data && data.data.states) {
                                setStatesMap(prev => ({ ...prev, [field.id]: data.data.states.map(s => s.name).sort() }));
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    };
                    fetchStates();
                } else {
                    setStatesMap(prev => ({ ...prev, [field.id]: [] }));
                }
            }
        });
    }, [vals, form]);

    // Fetch cities reactively
    useEffect(() => {
        if (!form || !form.fields) return;
        form.fields.forEach(field => {
            if (field.type === 'city') {
                const mode = field.locationMode || 'all';
                const country = mode === 'all' ? vals[`${field.id}-country`] : field.selectedCountry;
                const state = mode === 'city_only' ? field.selectedState : vals[`${field.id}-state`];
                if (country && state) {
                    const fetchCities = async () => {
                        try {
                            const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ country, state })
                            });
                            const data = await res.json();
                            if (data && !data.error && data.data) {
                                setCitiesMap(prev => ({ ...prev, [field.id]: data.data.sort() }));
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    };
                    fetchCities();
                } else {
                    setCitiesMap(prev => ({ ...prev, [field.id]: [] }));
                }
            }
        });
    }, [vals, form]);

    const isAdmin = useMemo(() => {
        const token = localStorage.getItem('authToken');
        return !!(token && token !== 'mock-jwt-token');
    }, []);

    // Parse appearance customisation from URL params
    const appearance = useMemo(() => {
        const p = (key, fallback) => searchParams.get(key) || fallback;
        const pColor = (key, fallback) => {
            const v = searchParams.get(key);
            return v ? `#${v}` : fallback;
        };
        const pInt = (key, fallback) => {
            const v = searchParams.get(key);
            return v ? parseInt(v, 10) : fallback;
        };
        return {
            bgColor: pColor('bg', '#f8fafc'),
            cardBg: pColor('cardBg', '#ffffff'),
            textColor: pColor('textColor', '#1e293b'),
            labelColor: pColor('labelColor', '#64748b'),
            btnColor: pColor('btnColor', '#0284c7'),
            btnTextColor: pColor('btnText', '#ffffff'),
            borderRadius: pInt('radius', 16),
            inputRadius: pInt('inputRadius', 12),
            fontFamily: p('font', 'System'),
            maxWidth: pInt('maxW', 512),
            padding: pInt('pad', 24),
            hideHeader: searchParams.get('hideHeader') === '1',
            onlyBody: searchParams.get('onlyBody') === '1',
        };
    }, [searchParams]);

    // Load Google Font if a custom font is specified
    useEffect(() => {
        if (appearance.fontFamily && appearance.fontFamily !== 'System') {
            const fontName = appearance.fontFamily.replace(/ /g, '+');
            const linkId = `gfont-${fontName}`;
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700;800&display=swap`;
                document.head.appendChild(link);
            }
        }
    }, [appearance.fontFamily]);

    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://lms-backend-xt66.onrender.com/api/v1';

    const loadCaptcha = async (fieldId, captchaType) => {
        try {
            const response = await fetch(`${API_BASE_URL}/form/public/captcha/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ captchaType })
            });
            if (response.ok) {
                const data = await response.json();
                setCaptchaData(prev => ({
                    ...prev,
                    [fieldId]: { svg: data.svg, token: data.token }
                }));
            }
        } catch (err) {
            console.error("Failed to load captcha:", err);
        }
    };

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
                        } else if (field.type === 'phone') {
                            initialVals[`${field.id}-code`] = '+1';
                            initialVals[`${field.id}-num`] = '';
                            initialVals[field.id] = '';
                        } else {
                            initialVals[field.id] = '';
                        }
                    });
                    setVals(initialVals);
                    (data.fields || []).forEach(field => {
                        if (field.type === 'captcha' && !['recaptcha_v2_checkbox', 'recaptcha_v2_invisible', 'recaptcha_v3'].includes(field.captchaType)) {
                            loadCaptcha(field.id, field.captchaType || 'math');
                        }
                    });
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

    useEffect(() => {
        if (!form) return;

        const recaptchaFields = (form.fields || []).filter(f =>
            f.type === 'captcha' &&
            ['recaptcha_v2_checkbox', 'recaptcha_v2_invisible', 'recaptcha_v3'].includes(f.captchaType)
        );

        if (recaptchaFields.length === 0) return;

        const hasV3 = recaptchaFields.some(f => f.captchaType === 'recaptcha_v3');
        const v3Field = recaptchaFields.find(f => f.captchaType === 'recaptcha_v3');
        const siteKey = v3Field?.recaptchaSiteKey || recaptchaFields[0]?.recaptchaSiteKey;

        if (!siteKey) return;

        const scriptId = 'google-recaptcha-script';
        let script = document.getElementById(scriptId);

        const initializeWidgets = () => {
            if (!window.grecaptcha) return;
            window.grecaptcha.ready(() => {
                recaptchaFields.forEach(field => {
                    const containerId = `recaptcha-public-${field.id}`;
                    const el = document.getElementById(containerId);
                    if (el && el.innerHTML === '') {
                        if (field.captchaType === 'recaptcha_v2_checkbox') {
                            window.grecaptcha.render(containerId, {
                                sitekey: field.recaptchaSiteKey,
                                callback: (token) => {
                                    setVals(prev => ({ ...prev, [field.id]: token }));
                                },
                                'expired-callback': () => {
                                    setVals(prev => ({ ...prev, [field.id]: '' }));
                                }
                            });
                        } else if (field.captchaType === 'recaptcha_v2_invisible') {
                            window.grecaptcha.render(containerId, {
                                sitekey: field.recaptchaSiteKey,
                                size: 'invisible',
                                callback: (token) => {
                                    setVals(prev => ({ ...prev, [field.id]: token }));
                                }
                            });
                        }
                    }
                });
            });
        };

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            if (hasV3) {
                script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
            } else {
                script.src = 'https://www.google.com/recaptcha/api.js';
            }
            script.async = true;
            script.defer = true;
            script.onload = () => {
                setTimeout(initializeWidgets, 300);
            };
            document.body.appendChild(script);
        } else {
            setTimeout(initializeWidgets, 300);
        }
    }, [form]);

    useEffect(() => {
        const originalBg = document.body.style.background;
        const originalBgImage = document.body.style.backgroundImage;
        const originalBgColor = document.body.style.backgroundColor;
        if (isEmbedded || appearance.onlyBody) {
            document.body.style.background = 'transparent';
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = 'transparent';
        } else {
            document.body.style.background = appearance.bgColor || '#f8fafc';
        }
        return () => {
            document.body.style.background = originalBg;
            document.body.style.backgroundImage = originalBgImage;
            document.body.style.backgroundColor = originalBgColor;
        };
    }, [isEmbedded, appearance.onlyBody, appearance.bgColor]);

    useEffect(() => {
        if (window.self === window.top) return;
        
        const sendHeight = () => {
            const height = document.body.scrollHeight || document.documentElement.scrollHeight;
            window.parent.postMessage({ type: 'lms-form-resize', height }, '*');
        };

        sendHeight();
        const timers = [
            setTimeout(sendHeight, 100),
            setTimeout(sendHeight, 300),
            setTimeout(sendHeight, 600),
            setTimeout(sendHeight, 1200)
        ];
        
        const observer = new MutationObserver(sendHeight);
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });

        window.addEventListener('resize', sendHeight);
        
        return () => {
            timers.forEach(clearTimeout);
            observer.disconnect();
            window.removeEventListener('resize', sendHeight);
        };
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        setError(null);

        if (isAdmin) {
            setSubmitError("As an administrator, you cannot submit live responses/leads to this form. Please open this link in an Incognito window or log out to perform a live submission test.");
            return;
        }

        setSubmitting(true);

        const fields = form.fields || [];
        const submissionBody = {};
        const captchaTokens = {};

        // 1. Resolve Google reCAPTCHA tokens before sending
        let resolvedVals = { ...vals };

        for (const f of fields) {
            if (isFieldVisible(f, fields, vals) && f.type === 'captcha') {
                if (f.captchaType === 'recaptcha_v3') {
                    if (window.grecaptcha) {
                        try {
                            const token = await window.grecaptcha.execute(f.recaptchaSiteKey, { action: 'submit' });
                            resolvedVals[f.id] = token;
                        } catch (err) {
                            setSubmitError("reCAPTCHA v3 verification failed: " + err.message);
                            setSubmitting(false);
                            return;
                        }
                    } else {
                        setSubmitError("Google reCAPTCHA v3 script is not loaded yet.");
                        setSubmitting(false);
                        return;
                    }
                } else if (f.captchaType === 'recaptcha_v2_invisible') {
                    if (window.grecaptcha) {
                        try {
                            if (!resolvedVals[f.id]) {
                                window.grecaptcha.execute();
                                let attempts = 0;
                                while (!window.grecaptcha.getResponse() && attempts < 50) {
                                    await new Promise(r => setTimeout(r, 100));
                                    attempts++;
                                }
                                const token = window.grecaptcha.getResponse();
                                if (token) {
                                    resolvedVals[f.id] = token;
                                } else {
                                    setSubmitError("Invisible reCAPTCHA challenge not completed. Please try again.");
                                    setSubmitting(false);
                                    return;
                                }
                            }
                        } catch (err) {
                            setSubmitError("Invisible reCAPTCHA execution failed.");
                            setSubmitting(false);
                            return;
                        }
                    }
                } else if (f.captchaType === 'recaptcha_v2_checkbox') {
                    if (!resolvedVals[f.id]) {
                        setSubmitError("Please complete the reCAPTCHA checkbox to verify.");
                        setSubmitting(false);
                        return;
                    }
                }
            }
        }
        // Validate phone number formats
        for (const f of fields) {
            if (isFieldVisible(f, fields, resolvedVals) && f.type === 'phone') {
                const code = resolvedVals[`${f.id}-code`] || '+1';
                const rawNum = resolvedVals[`${f.id}-num`] || '';
                let digits = rawNum.replace(/\D/g, '');

                // Strip redundant country code prefix if user typed it manually
                const codePrefix = code.replace(/\D/g, '');
                if (codePrefix && digits.startsWith(codePrefix) && digits.length > codePrefix.length) {
                    digits = digits.substring(codePrefix.length);
                }

                if (f.required || digits.length > 0) {
                    if (digits.length === 0) {
                        setSubmitError(`Phone number is required for "${f.label}".`);
                        setSubmitting(false);
                        return;
                    }

                    const rule = PHONE_VALIDATION[code];
                    if (rule) {
                        const isValid = rule.pattern.test(digits) || (rule.fallbackPattern && rule.fallbackPattern.test(digits));
                        if (!isValid) {
                            setSubmitError(`Invalid phone number for "${f.label}": ${rule.desc}`);
                            setSubmitting(false);
                            return;
                        }
                    } else {
                        if (digits.length < 7 || digits.length > 15) {
                            setSubmitError(`Phone number for "${f.label}" must be between 7 and 15 digits.`);
                            setSubmitting(false);
                            return;
                        }
                    }
                }
            }
        }

        // 2. Map form fields to submission body
        fields.forEach(f => {
            if (isFieldVisible(f, fields, resolvedVals)) {
                if (f.type === 'city') {
                    const mode = f.locationMode || 'all';
                    const country = mode === 'all' ? resolvedVals[`${f.id}-country`] : f.selectedCountry;
                    const state = mode === 'city_only' ? f.selectedState : resolvedVals[`${f.id}-state`];
                    const city = resolvedVals[f.id] || '';

                    const components = [country, state, city].filter(Boolean);
                    submissionBody[f.label] = components.join(', ');
                } else {
                    submissionBody[f.label] = resolvedVals[f.id];
                }
                if (f.type === 'captcha' && !['recaptcha_v2_checkbox', 'recaptcha_v2_invisible', 'recaptcha_v3'].includes(f.captchaType) && captchaData[f.id]?.token) {
                    captchaTokens[f.id] = captchaData[f.id].token;
                }
            }
        });

        if (Object.keys(captchaTokens).length > 0) {
            submissionBody._captchaTokens = captchaTokens;
        }

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
                setSubmitError(errData.error || "Failed to submit form.");
            }
        } catch (err) {
            console.error("Submission error:", err);
            setSubmitError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const fontStyle = appearance.fontFamily !== 'System' ? { fontFamily: `'${appearance.fontFamily}', sans-serif` } : {};
    const wrapperClass = `flex flex-col items-center ${isEmbedded ? 'min-h-0 justify-start' : 'min-h-screen justify-center'}`;

    if (loading) {
        return (
            <div className={`${wrapperClass} ${isEmbedded ? '' : 'p-4'}`} style={{ background: (isEmbedded || appearance.onlyBody) ? 'transparent' : appearance.bgColor, ...fontStyle }}>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${appearance.btnColor}40`, borderTopColor: 'transparent', borderLeftColor: appearance.btnColor }}></div>
                    <p className="text-sm font-semibold" style={{ color: appearance.labelColor }}>Loading form...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${wrapperClass} ${isEmbedded ? '' : 'p-4'}`} style={{ background: (isEmbedded || appearance.onlyBody) ? 'transparent' : appearance.bgColor, ...fontStyle }}>
                <div
                    className="max-w-md w-full p-6 text-center space-y-4"
                    style={{
                        background: appearance.onlyBody ? 'transparent' : appearance.cardBg,
                        borderRadius: appearance.onlyBody ? '0px' : `${appearance.borderRadius}px`,
                        border: appearance.onlyBody ? 'none' : '1px solid rgba(0,0,0,0.08)',
                        boxShadow: appearance.onlyBody ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                        <Icon name="warning" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg" style={{ color: appearance.textColor }}>Unable to Load Form</h3>
                        <p className="text-sm mt-1" style={{ color: appearance.labelColor }}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className={`${wrapperClass} ${isEmbedded ? '' : 'p-4'}`} style={{ background: (isEmbedded || appearance.onlyBody) ? 'transparent' : appearance.bgColor, ...fontStyle }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full p-8 text-center space-y-5"
                    style={{
                        background: appearance.onlyBody ? 'transparent' : appearance.cardBg,
                        borderRadius: appearance.onlyBody ? '0px' : `${appearance.borderRadius}px`,
                        border: appearance.onlyBody ? 'none' : '1px solid rgba(0,0,0,0.08)',
                        boxShadow: appearance.onlyBody ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                        <Icon name="check" size={32} />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="font-extrabold text-xl" style={{ color: appearance.textColor }}>Thank you!</h3>
                        <p className="text-sm leading-relaxed" style={{ color: appearance.labelColor }}>Your submission has been received successfully. We will get back to you shortly.</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    const fields = form.fields || [];

    return (
        <div className={wrapperClass} style={{ background: (isEmbedded || appearance.onlyBody) ? 'transparent' : appearance.bgColor, padding: appearance.onlyBody ? '0px' : `${appearance.padding}px`, ...fontStyle }}>
            <div className="w-full overflow-hidden transition-all duration-200" style={{
                maxWidth: `${appearance.maxWidth}px`,
                background: appearance.onlyBody ? 'transparent' : appearance.cardBg,
                borderRadius: appearance.onlyBody ? '0px' : `${appearance.borderRadius}px`,
                border: appearance.onlyBody ? 'none' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: appearance.onlyBody ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
                {!appearance.hideHeader && (
                    <div className="px-6 py-5" style={{ background: appearance.onlyBody ? 'transparent' : appearance.cardBg, borderBottom: appearance.onlyBody ? 'none' : '1px solid #f1f5f9' }}>
                        <h2 className="font-extrabold text-lg" style={{ color: appearance.textColor }}>{form.name}</h2>
                        <p className="text-xs mt-1" style={{ color: appearance.labelColor }}>Please fill out the form below.</p>
                    </div>
                )}
                {isAdmin && (
                    <div className="mx-6 mt-4 p-1.5 bg-amber-50 border border-amber-250 text-amber-800 text-[11px] rounded-lg flex items-center gap-2.5 font-medium leading-relaxed text-left">
                        <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0 select-none">warning</span>
                        <div>
                            <span className="font-bold">Admin Mode Enabled</span>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5" style={{ padding: `${appearance.padding}px` }}>
                    {submitError && (
                        <div className="p-3.5 bg-rose-50 border border-rose-250 text-rose-800 text-[11px] rounded-lg flex items-start gap-2.5 font-medium leading-relaxed text-left">
                            <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0 select-none">error_outline</span>
                            <div>
                                <span className="font-bold">Form Submission Error: </span>
                                {submitError}
                            </div>
                        </div>
                    )}
                    {fields.filter(field => isFieldVisible(field, fields, vals)).map((field) => (
                        <div key={field.id} className="space-y-1.5 text-left">
                            <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: appearance.labelColor }}>
                                {field.label}
                                {field.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                            </label>
                            {field.type === 'select' ? (
                                <select
                                    value={vals[field.id] || ''}
                                    onChange={e => setVals({ ...vals, [field.id]: e.target.value })}
                                    required={field.required}
                                    className="w-full h-10 px-3.5 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer font-semibold"
                                    style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor, borderColor: '#e2e8f0', '--tw-ring-color': `${appearance.btnColor}20` }}
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
                                                        className="w-4 h-4 cursor-pointer"
                                                        style={{ accentColor: appearance.btnColor }}
                                                    />
                                                    <span className="text-sm font-semibold transition-colors" style={{ color: appearance.textColor }}>{label}</span>
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
                                                        className="w-4 h-4 cursor-pointer rounded"
                                                        style={{ accentColor: appearance.btnColor }}
                                                    />
                                                    <span className="text-sm font-semibold transition-colors" style={{ color: appearance.textColor }}>{label}</span>
                                                </label>
                                            );
                                        })}
                                </div>
                            ) : field.type === 'phone' ? (
                                <div className="flex gap-2">
                                    <select
                                        value={vals[`${field.id}-code`] || '+1'}
                                        onChange={(e) => {
                                            const code = e.target.value;
                                            const num = vals[`${field.id}-num`] || '';
                                            setVals({
                                                ...vals,
                                                [`${field.id}-code`]: code,
                                                [field.id]: `${code} ${num}`
                                            });
                                        }}
                                        className="w-28 h-10 px-3 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer font-semibold"
                                        style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                    >
                                        <option value="+1">US (+1)</option>
                                        <option value="+91">IN (+91)</option>
                                        <option value="+44">UK (+44)</option>
                                        <option value="+49">DE (+49)</option>
                                        <option value="+33">FR (+33)</option>
                                        <option value="+61">AU (+61)</option>
                                        <option value="+971">AE (+971)</option>
                                        <option value="+966">SA (+966)</option>
                                        <option value="+27">ZA (+27)</option>
                                    </select>
                                    <input
                                        type="tel"
                                        value={vals[`${field.id}-num`] || ''}
                                        onChange={(e) => {
                                            const num = e.target.value;
                                            const code = vals[`${field.id}-code`] || '+1';
                                            setVals({
                                                ...vals,
                                                [`${field.id}-num`]: num,
                                                [field.id]: `${code} ${num}`
                                            });
                                        }}
                                        placeholder={field.placeholder || ''}
                                        required={field.required}
                                        className="flex-1 h-10 px-3.5 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all font-semibold placeholder:text-slate-300"
                                        style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                    />
                                </div>
                            ) : field.type === 'captcha' ? (
                                <div className="flex flex-col gap-2">
                                    {['recaptcha_v2_checkbox', 'recaptcha_v2_invisible', 'recaptcha_v3'].includes(field.captchaType) ? (
                                        <div className="py-1">
                                            {field.recaptchaSiteKey ? (
                                                <>
                                                    {field.captchaType === 'recaptcha_v2_checkbox' && (
                                                        <div id={`recaptcha-public-${field.id}`} className="g-recaptcha-container"></div>
                                                    )}
                                                    {field.captchaType === 'recaptcha_v2_invisible' && (
                                                        <div id={`recaptcha-public-${field.id}`} style={{ display: 'none' }}></div>
                                                    )}
                                                    {field.captchaType === 'recaptcha_v3' && (
                                                        <div className="text-[11px] text-slate-400 bg-slate-50 border p-2 rounded flex items-center gap-1.5 font-medium">
                                                            <Icon name="security" size={14} className="text-slate-555" />
                                                            Secured by Google reCAPTCHA v3
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-xs text-amber-600 border border-amber-250 bg-amber-50 p-2.5 rounded flex items-center gap-1.5 font-bold">
                                                    <Icon name="warning" size={16} />
                                                    reCAPTCHA site key is not configured.
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                {captchaData[field.id]?.svg ? (
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: captchaData[field.id].svg }}
                                                        className="w-[150px] h-[45px] shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-[150px] h-[45px] shrink-0 bg-slate-100 border rounded flex items-center justify-center text-[10px] text-slate-400 font-semibold animate-pulse">
                                                        Loading...
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => loadCaptcha(field.id, field.captchaType || 'math')}
                                                    className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors cursor-pointer"
                                                    title="Refresh CAPTCHA"
                                                >
                                                    <Icon name="refresh" size={16} />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={vals[field.id] || ''}
                                                onChange={e => setVals({ ...vals, [field.id]: e.target.value })}
                                                placeholder={field.placeholder || 'Enter verification code'}
                                                required={field.required}
                                                className="w-full h-10 px-3.5 border border-slate-205 rounded-xl bg-white text-slate-700 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-semibold placeholder:text-slate-300"
                                            />
                                        </>
                                    )}
                                </div>
                            ) : field.type === 'file' ? (
                                <div className="space-y-2">
                                    <div
                                        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer relative"
                                        style={{ borderRadius: `${appearance.inputRadius}px` }}
                                        onClick={() => document.getElementById(`file-input-${field.id}`).click()}
                                    >
                                        <Icon name="cloud_upload" size={28} className="text-slate-400" />
                                        <div className="text-[12.5px] font-bold text-slate-700 mt-1">
                                            {vals[field.id] && vals[field.id].length > 0
                                                ? `${vals[field.id].length} file(s) selected`
                                                : "Drag and drop files here, or browse"
                                            }
                                        </div>
                                        <div className="text-[9.5px] text-slate-400 mt-0.5">
                                            Minimum: {field.minFiles || 1}, Maximum: {field.maxFiles || 1} file(s) ({field.minFileSize || 0.1}MB - {field.maxFileSize || 10}MB)
                                        </div>
                                        <input
                                            type="file"
                                            id={`file-input-${field.id}`}
                                            multiple={(field.maxFiles || 1) > 1}
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                const min = field.minFiles || 1;
                                                const max = field.maxFiles || 1;
                                                const minSize = field.minFileSize || 0.1;
                                                const maxSize = field.maxFileSize || 10;

                                                if (files.length < min) {
                                                    alert(`Minimum ${min} file(s) required.`);
                                                    return;
                                                }
                                                if (files.length > max) {
                                                    alert(`Maximum ${max} file(s) allowed.`);
                                                    return;
                                                }

                                                for (const file of files) {
                                                    const sizeInMB = file.size / (1024 * 1024);
                                                    if (sizeInMB < minSize) {
                                                        alert(`File "${file.name}" is too small. Minimum file size allowed is ${minSize}MB.`);
                                                        return;
                                                    }
                                                    if (sizeInMB > maxSize) {
                                                        alert(`File "${file.name}" is too large. Maximum file size allowed is ${maxSize}MB.`);
                                                        return;
                                                    }
                                                }

                                                setVals({
                                                    ...vals,
                                                    [field.id]: files.map(f => f.name)
                                                });
                                            }}
                                        />
                                    </div>
                                    {vals[field.id] && vals[field.id].length > 0 && (
                                        <div className="text-[10px] text-slate-550 font-semibold space-y-1 pl-1">
                                            Selected files:
                                            <ul className="list-disc list-inside font-medium text-slate-650">
                                                {vals[field.id].map((fname, fidx) => (
                                                    <li key={fidx}>{fname}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : field.type === 'city' ? (
                                <div className="space-y-3">
                                    {/* Country Dropdown */}
                                    {(field.locationMode === 'all' || !field.locationMode) && (
                                        <select
                                            value={vals[`${field.id}-country`] || ''}
                                            onChange={(e) => {
                                                setVals(prev => ({
                                                    ...prev,
                                                    [`${field.id}-country`]: e.target.value,
                                                    [`${field.id}-state`]: '',
                                                    [field.id]: ''
                                                }));
                                            }}
                                            required={field.required}
                                            className="w-full h-10 px-3 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer font-semibold"
                                            style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                        >
                                            <option value="">Choose Country...</option>
                                            {countriesList.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    )}

                                    {/* State Dropdown */}
                                    {(field.locationMode === 'all' || field.locationMode === 'state_city' || !field.locationMode) && (
                                        <select
                                            value={vals[`${field.id}-state`] || ''}
                                            disabled={field.locationMode === 'all' && !vals[`${field.id}-country`]}
                                            onChange={(e) => {
                                                setVals(prev => ({
                                                    ...prev,
                                                    [`${field.id}-state`]: e.target.value,
                                                    [field.id]: ''
                                                }));
                                            }}
                                            required={field.required}
                                            className="w-full h-10 px-3 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer font-semibold"
                                            style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                        >
                                            <option value="">Choose State...</option>
                                            {(statesMap[field.id] || []).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    )}

                                    {/* City Dropdown */}
                                    <select
                                        value={vals[field.id] || ''}
                                        disabled={
                                            (field.locationMode === 'all' && (!vals[`${field.id}-country`] || !vals[`${field.id}-state`])) ||
                                            (field.locationMode === 'state_city' && !vals[`${field.id}-state`])
                                        }
                                        onChange={(e) => {
                                            setVals(prev => ({
                                                ...prev,
                                                [field.id]: e.target.value
                                            }));
                                        }}
                                        required={field.required}
                                        className="w-full h-10 px-3 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer font-semibold"
                                        style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                    >
                                        <option value="">Choose City...</option>
                                        {(citiesMap[field.id] || []).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            ) : field.type === 'fullname' ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={vals[`${field.id}-first`] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const mid = vals[`${field.id}-middle`] || '';
                                            const lst = vals[`${field.id}-last`] || '';
                                            setVals({
                                                ...vals,
                                                [`${field.id}-first`]: val,
                                                [field.id]: [val, mid, lst].filter(Boolean).join(' ')
                                            });
                                        }}
                                        required={!field.firstOptional}
                                        className="w-full h-10 px-3.5 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all font-semibold placeholder:text-slate-300"
                                        style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Middle Name"
                                        value={vals[`${field.id}-middle`] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const fst = vals[`${field.id}-first`] || '';
                                            const lst = vals[`${field.id}-last`] || '';
                                            setVals({
                                                ...vals,
                                                [`${field.id}-middle`]: val,
                                                [field.id]: [fst, val, lst].filter(Boolean).join(' ')
                                            });
                                        }}
                                        required={!field.middleOptional}
                                        className="w-full h-10 px-3.5 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all font-semibold placeholder:text-slate-300"
                                        style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={vals[`${field.id}-last`] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const fst = vals[`${field.id}-first`] || '';
                                            const mid = vals[`${field.id}-middle`] || '';
                                            setVals({
                                                ...vals,
                                                [`${field.id}-last`]: val,
                                                [field.id]: [fst, mid, val].filter(Boolean).join(' ')
                                            });
                                        }}
                                        required={!field.lastOptional}
                                        className="w-full h-10 px-3.5 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all font-semibold placeholder:text-slate-300"
                                        style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                    />
                                </div>
                            ) : field.type === 'textarea' ? (
                                <textarea
                                    value={vals[field.id] || ''}
                                    onChange={e => setVals({ ...vals, [field.id]: e.target.value })}
                                    placeholder={field.placeholder || ''}
                                    required={field.required}
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all font-semibold placeholder:text-slate-300 resize-none"
                                    style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                />
                            ) : (
                                <input
                                    type={field.type === 'email' ? 'email' : 'text'}
                                    value={vals[field.id] || ''}
                                    onChange={e => setVals({ ...vals, [field.id]: e.target.value })}
                                    placeholder={field.placeholder || ''}
                                    required={field.required}
                                    className="w-full h-10 px-3.5 border border-slate-205 bg-white text-sm focus:outline-none focus:ring-2 transition-all font-semibold placeholder:text-slate-300"
                                    style={{ borderRadius: `${appearance.inputRadius}px`, color: appearance.textColor }}
                                />
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={submitting || isAdmin}
                        className="w-full h-11 font-bold text-sm transition-all shadow-xs hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: appearance.btnColor, color: appearance.btnTextColor, borderRadius: `${appearance.inputRadius}px`, border: 'none' }}
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${appearance.btnTextColor}60`, borderTopColor: 'transparent' }}></div>
                                Submitting...
                            </>
                        ) : (form?.settings?.useCustomSubmitButton ? (form?.settings?.submitButtonText || 'Submit') : 'Submit')}
                    </button>
                </form>
            </div>
        </div>
    );
}