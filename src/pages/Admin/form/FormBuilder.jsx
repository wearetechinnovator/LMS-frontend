import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Toast from '../../../components/Toast'
import './form.css'

export default function FormBuilder({
    initialTitle = 'Doctor Appointment Inquiry',
    initialDescription = 'Please fill out the form below to request an appointment. Our staff will contact you shortly to confirm.',
    initialFields = [
        { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe', helperText: '', options: [] },
        { id: 2, type: 'phone', label: 'Phone Number', required: true, placeholder: '(555) 000-0000', helperText: "We'll use this to text you reminders.", options: [] },
        { id: 3, type: 'date', label: 'Date Selection', required: false, placeholder: 'Select Date', helperText: '', options: [] },
        { id: 4, type: 'date', label: 'Preferred Appointment Date', required: false, placeholder: 'MM/DD/YYYY', helperText: '', options: [] }
    ],
    initialStatus = 'Draft',
    initialId = 'new',
    initialSettings = {},
    onBack,
    onSave,
    onSaveAsTemplate
}) {
    const [formFields, setFormFields] = useState(initialFields)
    const [selectedFieldId, setSelectedFieldId] = useState(initialFields[0]?.id || null)
    const [formTitle, setFormTitle] = useState(initialTitle)
    const [formDescription, setFormDescription] = useState(initialDescription)
    const [formSettings, setFormSettings] = useState(initialSettings)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [previewValues, setPreviewValues] = useState({})
    const [captchaData, setCaptchaData] = useState({})
    const [showQuickAdd, setShowQuickAdd] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState(null)
    const [isDraggingActive, setIsDraggingActive] = useState(false)
    const [toastMessage, setToastMessage] = useState(null)
    
    const triggerLocalToast = (msg) => {
        setToastMessage(msg)
    }

    const [showPublishDropdown, setShowPublishDropdown] = useState(false)
    const [showMoreMenu, setShowMoreMenu] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const canvasRef = React.useRef(null)

    const [formStatus, setFormStatus] = useState(initialStatus || 'Draft')
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [lastSavedText, setLastSavedText] = useState('✓ Saved Just Now')
    const [lastSavedTime, setLastSavedTime] = useState(Date.now())
    const [savedSnapshot, setSavedSnapshot] = useState({
        title: initialTitle,
        description: initialDescription,
        fields: JSON.stringify(initialFields),
        status: initialStatus || 'Draft'
    })

    useEffect(() => {
        if (!showMoreMenu) return
        const handleClickOutside = (e) => {
            if (!e.target.closest('.more-menu-container')) {
                setShowMoreMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showMoreMenu])

    useEffect(() => {
        const isChanged = formTitle !== savedSnapshot.title ||
            formDescription !== savedSnapshot.description ||
            JSON.stringify(formFields) !== savedSnapshot.fields ||
            formStatus !== savedSnapshot.status;
        setHasUnsavedChanges(isChanged);
    }, [formTitle, formDescription, formFields, formStatus, savedSnapshot])

    useEffect(() => {
        if (hasUnsavedChanges) return;
        const interval = setInterval(() => {
            const diff = Math.floor((Date.now() - lastSavedTime) / 1000);
            if (diff < 5) {
                setLastSavedText('✓ Saved Just Now');
            } else if (diff < 60) {
                setLastSavedText(`✓ Saved ${diff} seconds ago`);
            } else {
                const mins = Math.floor(diff / 60);
                setLastSavedText(`✓ Saved ${mins} minute${mins > 1 ? 's' : ''} ago`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastSavedTime, hasUnsavedChanges]);

    useEffect(() => {
        if (!showPublishDropdown) return
        const handleClickOutside = (e) => {
            if (!e.target.closest('.publish-dropdown-container')) {
                setShowPublishDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showPublishDropdown])

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', onFullscreenChange)
        return () => document.removeFullscreenChange || document.removeEventListener('fullscreenchange', onFullscreenChange)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'q' || e.key === 'Q') {
                const activeEl = document.activeElement
                if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
                    return
                }
                if (document.fullscreenElement) {
                    document.exitFullscreen()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (canvasRef.current) {
                canvasRef.current.requestFullscreen().catch((err) => {
                    console.error(`Error entering fullscreen: ${err.message}`)
                })
            }
        } else {
            document.exitFullscreen()
        }
    }

    const [leftWidth, setLeftWidth] = useState(() => {
        const saved = localStorage.getItem('formBuilderLeftWidth')
        return saved ? parseInt(saved, 10) : 220
    })
    const [isResizingLeft, setIsResizingLeft] = useState(false)

    const [rightWidth, setRightWidth] = useState(() => {
        const saved = localStorage.getItem('formBuilderRightWidth')
        return saved ? parseInt(saved, 10) : 256
    })
    const [isResizingRight, setIsResizingRight] = useState(false)

    const startResizingLeft = (e) => {
        e.preventDefault()
        setIsResizingLeft(true)
    }

    const stopResizingLeft = () => {
        setIsResizingLeft(false)
    }

    const resizeLeft = React.useCallback((e) => {
        if (isResizingLeft) {
            const container = document.querySelector('.form-builder-scope')
            if (container) {
                const rect = container.getBoundingClientRect()
                const newWidth = e.clientX - rect.left
                if (newWidth >= 160 && newWidth <= 350) {
                    setLeftWidth(newWidth)
                    localStorage.setItem('formBuilderLeftWidth', newWidth.toString())
                }
            }
        }
    }, [isResizingLeft])

    React.useEffect(() => {
        if (isResizingLeft) {
            window.addEventListener('mousemove', resizeLeft)
            window.addEventListener('mouseup', stopResizingLeft)
        }
        return () => {
            window.removeEventListener('mousemove', resizeLeft)
            window.removeEventListener('mouseup', stopResizingLeft)
        }
    }, [isResizingLeft, resizeLeft])

    const startResizingRight = (e) => {
        e.preventDefault()
        setIsResizingRight(true)
    }

    const stopResizingRight = () => {
        setIsResizingRight(false)
    }

    const resizeRight = React.useCallback((e) => {
        if (isResizingRight) {
            const container = document.querySelector('.form-builder-scope')
            if (container) {
                const rect = container.getBoundingClientRect()
                const newWidth = rect.right - e.clientX
                if (newWidth >= 200 && newWidth <= 450) {
                    setRightWidth(newWidth)
                    localStorage.setItem('formBuilderRightWidth', newWidth.toString())
                }
            }
        }
    }, [isResizingRight])

    useEffect(() => {
        if (isResizingRight) {
            window.addEventListener('mousemove', resizeRight)
            window.addEventListener('mouseup', stopResizingRight)
        }
        return () => {
            window.removeEventListener('mousemove', resizeRight)
            window.removeEventListener('mouseup', stopResizingRight)
        }
    }, [isResizingRight, resizeRight])

    const isFieldVisible = (field, allFields, values, _visited = new Set()) => {
        if (!field.conditional || !field.conditional.enabled) return true;
        const depId = Number(field.conditional.dependentFieldId);
        if (!depId) return true;

        const depField = allFields.find(f => f.id === depId);
        if (!depField) return true;

        if (!_visited.has(depId)) {
            _visited.add(depId);
            const parentVisible = isFieldVisible(depField, allFields, values, _visited);
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

    const loadCaptcha = async (fieldId, captchaType) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1';
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

    const handleOpenPreview = () => {
        const initialVals = {};
        formFields.forEach(field => {
            if (field.type === 'checkbox') {
                initialVals[field.id] = [];
            } else if (field.type === 'phone') {
                initialVals[`${field.id}-code`] = '+1';
                initialVals[`${field.id}-num`] = '';
                initialVals[field.id] = '';
            } else if (field.type === 'select') {
                initialVals[field.id] = field.options && field.options.length > 0
                    ? (typeof field.options[0] === 'object' && field.options[0] ? field.options[0].value : field.options[0])
                    : '';
            } else {
                initialVals[field.id] = '';
            }
        });
        setPreviewValues(initialVals);
        formFields.forEach(field => {
            if (field.type === 'captcha') {
                loadCaptcha(field.id, field.captchaType || 'math');
            }
        });
        setShowPreview(true);
    };

    useEffect(() => {
        if (!showPreview) return;

        const recaptchaFields = formFields.filter(f => 
            f.type === 'captcha' && 
            ['recaptcha_v2_checkbox', 'recaptcha_v2_invisible', 'recaptcha_v3'].includes(f.captchaType)
        );

        if (recaptchaFields.length === 0) return;

        // Load the reCAPTCHA script dynamically
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
                    const containerId = `recaptcha-preview-${field.id}`;
                    const el = document.getElementById(containerId);
                    if (el && el.innerHTML === '') {
                        if (field.captchaType === 'recaptcha_v2_checkbox') {
                            window.grecaptcha.render(containerId, {
                                sitekey: field.recaptchaSiteKey,
                                callback: (token) => {
                                    setPreviewValues(prev => ({ ...prev, [field.id]: token }));
                                },
                                'expired-callback': () => {
                                    setPreviewValues(prev => ({ ...prev, [field.id]: '' }));
                                }
                            });
                        } else if (field.captchaType === 'recaptcha_v2_invisible') {
                            window.grecaptcha.render(containerId, {
                                sitekey: field.recaptchaSiteKey,
                                size: 'invisible',
                                callback: (token) => {
                                    setPreviewValues(prev => ({ ...prev, [field.id]: token }));
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
    }, [showPreview, formFields]);

    const handlePreviewSubmit = async (e) => {
        e.preventDefault();
        
        const recaptchaFields = formFields.filter(f => 
            f.type === 'captcha' && 
            ['recaptcha_v2_checkbox', 'recaptcha_v2_invisible', 'recaptcha_v3'].includes(f.captchaType)
        );

        let finalVals = { ...previewValues };

        for (const field of recaptchaFields) {
            if (!field.recaptchaSiteKey) {
                triggerLocalToast(`Please configure Site Key for "${field.label}" first.`);
                return;
            }

            if (field.captchaType === 'recaptcha_v3') {
                if (window.grecaptcha) {
                    try {
                        const token = await window.grecaptcha.execute(field.recaptchaSiteKey, { action: 'submit' });
                        finalVals[field.id] = token;
                        triggerLocalToast(`✓ reCAPTCHA v3 verified! Token: ${token.substring(0, 12)}...`);
                    } catch (err) {
                        triggerLocalToast("reCAPTCHA v3 verification failed: " + err.message);
                        return;
                    }
                } else {
                    triggerLocalToast("Google reCAPTCHA v3 is not loaded.");
                    return;
                }
            } else if (field.captchaType === 'recaptcha_v2_invisible') {
                if (window.grecaptcha) {
                    try {
                        window.grecaptcha.execute();
                        triggerLocalToast("reCAPTCHA v2 Invisible challenge executed.");
                        return;
                    } catch (err) {
                        triggerLocalToast("reCAPTCHA v2 Invisible execution failed.");
                        return;
                    }
                }
            } else {
                if (!finalVals[field.id]) {
                    triggerLocalToast(`Please check "I'm not a robot" for "${field.label}".`);
                    return;
                }
            }
        }

        const selfFields = formFields.filter(f => f.type === 'captcha' && !['recaptcha_v2_checkbox', 'recaptcha_v2_invisible', 'recaptcha_v3'].includes(f.captchaType));
        for (const field of selfFields) {
            if (!finalVals[field.id]) {
                triggerLocalToast(`Please enter the CAPTCHA for "${field.label}".`);
                return;
            }
        }

        triggerLocalToast("✓ Request submitted successfully (Preview Mode)");
    };

    const standardFields = [
        { type: 'text', label: 'Name', icon: 'text_fields' },
        { type: 'email', label: 'Email', icon: 'mail' },
        { type: 'phone', label: 'Phone', icon: 'phone' },
        { type: 'date', label: 'Date Picker', icon: 'calendar_today' },
        { type: 'select', label: 'Drop Box', icon: 'arrow_drop_down' },
        { type: 'radio', label: 'Radio Button', icon: 'radio_button_checked' },
        { type: 'city', label: 'City', icon: 'location_city' }
    ]

    const advancedFields = [
        { type: 'custom', label: 'Custom Field', icon: 'tune' }
    ]

    const securityFields = [
        { type: 'captcha', label: 'CAPTCHA', icon: 'verified_user' },
        // { type: 'custom_button', label: 'Custom Button', icon: 'smart_button' }
    ]

    const selectedField = formFields.find(f => f.id === selectedFieldId)

    const addField = (type) => {
        const newId = Math.max(...formFields.map(f => f.id), 0) + 1
        if (type === 'city') {
            const stateId = newId
            const cityId = newId + 1

            const stateField = {
                id: stateId,
                type: 'select',
                label: 'Select State',
                required: true,
                placeholder: 'Choose State...',
                helperText: '',
                options: ['California', 'Texas', 'New York'],
                conditional: { enabled: false, dependentFieldId: '', operator: 'equals', value: '' }
            }

            const cityField = {
                id: cityId,
                type: 'select',
                label: 'Select City',
                required: true,
                placeholder: 'Choose City...',
                helperText: '',
                options: [
                    { label: 'Los Angeles', value: 'Los Angeles', conditionalEnabled: true, dependentFieldId: stateId.toString(), conditionalOperator: 'equals', conditionalValue: 'California' },
                    { label: 'Houston', value: 'Houston', conditionalEnabled: true, dependentFieldId: stateId.toString(), conditionalOperator: 'equals', conditionalValue: 'Texas' },
                    { label: 'New York City', value: 'New York City', conditionalEnabled: true, dependentFieldId: stateId.toString(), conditionalOperator: 'equals', conditionalValue: 'New York' }
                ],
                conditional: {
                    enabled: true,
                    dependentFieldId: stateId.toString(),
                    operator: 'not_empty',
                    value: ''
                }
            }

            setFormFields([...formFields, stateField, cityField])
            setSelectedFieldId(cityId)
            return
        }

        const newField = {
            id: newId,
            type: type,
            label: type === 'captcha' ? 'Verify you are human' : `New ${type === 'text' ? 'Field' : type}`,
            required: type === 'captcha' ? true : false,
            placeholder: '',
            helperText: '',
            captchaType: type === 'captcha' ? 'math' : undefined,
            options: (type === 'select' || type === 'radio' || type === 'checkbox') ? ['Option 1'] : [],
            conditional: {
                enabled: false,
                dependentFieldId: '',
                operator: 'equals',
                value: ''
            }
        }
        setFormFields([...formFields, newField])
        setSelectedFieldId(newId)
    }

    const updateField = (id, updates) => {
        setFormFields(formFields.map(f => f.id === id ? { ...f, ...updates } : f))
    }

    const deleteField = (id) => {
        setFormFields(formFields.filter(f => f.id !== id))
        if (selectedFieldId === id) {
            setSelectedFieldId(formFields[0]?.id || null)
        }
    }

    const handleDragStart = (e, index) => {
        setDraggedIndex(index)
        setIsDraggingActive(true)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
        setIsDraggingActive(false)
        document.querySelectorAll('.drag-hover-active').forEach(el => {
            el.classList.remove('drag-hover-active')
        })
    }

    const handleDrop = (e, targetIndex) => {
        e.preventDefault()
        e.currentTarget.classList.remove('drag-hover-active')
        const fieldType = e.dataTransfer.getData('fieldType')
        if (fieldType) {
            const newId = Math.max(...formFields.map(f => f.id), 0) + 1
            if (fieldType === 'city') {
                const stateId = newId
                const cityId = newId + 1

                const stateField = {
                    id: stateId,
                    type: 'select',
                    label: 'Select State',
                    required: true,
                    placeholder: 'Choose State...',
                    helperText: '',
                    options: ['California', 'Texas', 'New York'],
                    conditional: { enabled: false, dependentFieldId: '', operator: 'equals', value: '' }
                }

                const cityField = {
                    id: cityId,
                    type: 'select',
                    label: 'Select City',
                    required: true,
                    placeholder: 'Choose City...',
                    helperText: '',
                    options: [
                        { label: 'Los Angeles', value: 'Los Angeles', conditionalEnabled: true, dependentFieldId: stateId.toString(), conditionalOperator: 'equals', conditionalValue: 'California' },
                        { label: 'Houston', value: 'Houston', conditionalEnabled: true, dependentFieldId: stateId.toString(), conditionalOperator: 'equals', conditionalValue: 'Texas' },
                        { label: 'New York City', value: 'New York City', conditionalEnabled: true, dependentFieldId: stateId.toString(), conditionalOperator: 'equals', conditionalValue: 'New York' }
                    ],
                    conditional: {
                        enabled: true,
                        dependentFieldId: stateId.toString(),
                        operator: 'not_empty',
                        value: ''
                    }
                }

                const updatedFields = [...formFields]
                updatedFields.splice(targetIndex, 0, stateField, cityField)
                setFormFields(updatedFields)
                setSelectedFieldId(cityId)
            } else {
                const newField = {
                    id: newId,
                    type: fieldType,
                    label: fieldType === 'captcha' ? 'Verify you are human' : `New ${fieldType === 'text' ? 'Field' : fieldType}`,
                    required: fieldType === 'captcha' ? true : false,
                    placeholder: '',
                    helperText: '',
                    captchaType: fieldType === 'captcha' ? 'math' : undefined,
                    options: (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') ? ['Option 1'] : [],
                    conditional: {
                        enabled: false,
                        dependentFieldId: '',
                        operator: 'equals',
                        value: ''
                    }
                }
                const updatedFields = [...formFields]
                updatedFields.splice(targetIndex, 0, newField)
                setFormFields(updatedFields)
                setSelectedFieldId(newId)
            }
        } else if (draggedIndex !== null && draggedIndex !== targetIndex) {
            const updatedFields = [...formFields]
            const [movedField] = updatedFields.splice(draggedIndex, 1)
            updatedFields.splice(targetIndex, 0, movedField)
            setFormFields(updatedFields)
        }
        setDraggedIndex(null)
        setIsDraggingActive(false)
        document.querySelectorAll('.drag-hover-active').forEach(el => {
            el.classList.remove('drag-hover-active')
        })
    }

    const handleCanvasDrop = (e) => {
        e.preventDefault()
        const fieldType = e.dataTransfer.getData('fieldType')
        if (fieldType) {
            const cards = Array.from(e.currentTarget.querySelectorAll('.form-builder-card-item'))
            let targetIndex = formFields.length

            for (let i = 0; i < cards.length; i++) {
                const rect = cards[i].getBoundingClientRect()
                const cardMiddleY = rect.top + rect.height / 2
                if (e.clientY < cardMiddleY) {
                    targetIndex = i
                    break
                }
            }

            const newId = Math.max(...formFields.map(f => f.id), 0) + 1
            if (fieldType === 'city') {
                const stateId = newId
                const cityId = newId + 1

                const stateField = {
                    id: stateId,
                    type: 'select',
                    label: 'Select State',
                    required: true,
                    placeholder: 'Choose State...',
                    helperText: '',
                    options: ['California', 'Texas', 'New York'],
                    conditional: { enabled: false, dependentFieldId: '', operator: 'equals', value: '' }
                }

                const cityField = {
                    id: cityId,
                    type: 'select',
                    label: 'Select City',
                    required: true,
                    placeholder: 'Choose City...',
                    helperText: '',
                    options: [
                        { label: 'Los Angeles', value: 'Los Angeles', conditionalEnabled: true, dependentFieldId: stateId.toString(), conditionalOperator: 'equals', conditionalValue: 'California' },
                        { label: 'Houston', value: 'Houston', conditionalEnabled: true, dependentFieldId: stateId.toString(), conditionalOperator: 'equals', conditionalValue: 'Texas' },
                        { label: 'New York City', value: 'New York City', conditionalEnabled: true, dependentFieldId: stateId.toString(), conditionalOperator: 'equals', conditionalValue: 'New York' }
                    ],
                    conditional: {
                        enabled: true,
                        dependentFieldId: stateId.toString(),
                        operator: 'not_empty',
                        value: ''
                    }
                }

                const updatedFields = [...formFields]
                updatedFields.splice(targetIndex, 0, stateField, cityField)
                setFormFields(updatedFields)
                setSelectedFieldId(cityId)
            } else {
                const newField = {
                    id: newId,
                    type: fieldType,
                    label: fieldType === 'captcha' ? 'Verify you are human' : `New ${fieldType === 'text' ? 'Field' : fieldType}`,
                    required: fieldType === 'captcha' ? true : false,
                    placeholder: '',
                    helperText: '',
                    captchaType: fieldType === 'captcha' ? 'math' : undefined,
                    options: (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') ? ['Option 1'] : [],
                    conditional: {
                        enabled: false,
                        dependentFieldId: '',
                        operator: 'equals',
                        value: ''
                    }
                }
                const updatedFields = [...formFields]
                updatedFields.splice(targetIndex, 0, newField)
                setFormFields(updatedFields)
                setSelectedFieldId(newId)
            }
        }
        setDraggedIndex(null)
        setIsDraggingActive(false)
        document.querySelectorAll('.drag-hover-active').forEach(el => {
            el.classList.remove('drag-hover-active')
        })
    }

    const statusBadges = {
        'Draft': { bg: 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs', dot: 'bg-amber-500 animate-pulse', label: 'Draft' },
        'Published': { bg: 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs', dot: 'bg-indigo-500', label: 'Published' },
        'Archived': { bg: 'bg-slate-50 border-slate-300 text-slate-700 shadow-2xs', dot: 'bg-slate-500', label: 'Archived' }
    }

    const handleSaveDraft = () => {
        setFormStatus('Draft')
        const updatedSnapshot = {
            title: formTitle,
            description: formDescription,
            fields: JSON.stringify(formFields),
            status: 'Draft',
            settings: formSettings
        }
        setSavedSnapshot(updatedSnapshot)
        setLastSavedTime(Date.now())
        setLastSavedText('✓ Saved Just Now')
        if (onSave) {
            onSave({
                title: formTitle,
                description: formDescription,
                fields: formFields,
                status: 'DRAFT',
                settings: formSettings
            })
        }
        triggerLocalToast("✓ Draft saved successfully!")
    }

    return (
        <div ref={canvasRef} className="w-full h-full flex bg-background border border-outline-variant rounded-lg overflow-hidden form-builder-scope">

            <div
                className="bg-surface-container-lowest border-r border-outline-variant flex flex-col shrink-0"
                data-tour="field-library"
                style={{
                    width: `${leftWidth}px`,
                    transition: isResizingLeft ? 'none' : 'width 0.2s',
                    position: 'relative'
                }}
            >
                <div className="p-2 border-b border-outline-variant flex flex-col items-start gap-0.5 justify-center">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="font-headline-md text-headline-md text-on-background text-[12px] field-library-title">Field Library</h2>
                    </div>
                    <span className="text-[8.5px] text-slate-400 font-semibold select-none leading-none mt-0.5">Click standard fields to add them to your form</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-3">
                    <div>
                        <h3 className="font-label-caps text-on-surface-variant mb-1 text-[9px] field-library-section-title">STANDARD FIELDS</h3>
                        <div className="space-y-1">
                            {standardFields.map(field => (
                                <div
                                    key={field.label}
                                    onClick={() => addField(field.type)}
                                    draggable={true}
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('fieldType', field.type)
                                        setIsDraggingActive(true)
                                    }}
                                    onDragEnd={handleDragEnd}
                                    className="w-full h-8 flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors field-library-btn cursor-grab active:cursor-grabbing select-none"
                                    role="button"
                                >
                                    <span className="material-symbols-outlined text-outline-variant text-body-md">drag_indicator</span>
                                    <span className="material-symbols-outlined text-primary text-[15px]!">{field.icon}</span>
                                    <span className="font-body-md text-on-surface text-[12px]!">{field.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[9px] field-library-section-title">ADVANCED</h3>
                        <div className="space-y-1">
                            {advancedFields.map(field => (
                                <div
                                    key={field.label}
                                    onClick={() => addField(field.type)}
                                    draggable={true}
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('fieldType', field.type)
                                        setIsDraggingActive(true)
                                    }}
                                    onDragEnd={handleDragEnd}
                                    className="w-full flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors field-library-btn cursor-grab active:cursor-grabbing select-none"
                                    role="button"
                                >
                                    <span className="material-symbols-outlined text-outline-variant text-[14px]">drag_indicator</span>
                                    <span className="material-symbols-outlined text-tertiary text-[15px]!">{field.icon}</span>
                                    <span className="font-body-md text-on-surface text-[12px]!">{field.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[9px] field-library-section-title">SECURITY & CUSTOM</h3>
                        <div className="space-y-1">
                            {securityFields.map(field => (
                                <div
                                    key={field.label}
                                    onClick={() => addField(field.type)}
                                    draggable={true}
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('fieldType', field.type)
                                        setIsDraggingActive(true)
                                    }}
                                    onDragEnd={handleDragEnd}
                                    className="w-full flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors field-library-btn cursor-grab active:cursor-grabbing select-none"
                                    role="button"
                                >
                                    <span className="material-symbols-outlined text-outline-variant text-[14px]">drag_indicator</span>
                                    <span className="material-symbols-outlined text-primary text-[15px]!">{field.icon}</span>
                                    <span className="font-body-md text-on-surface text-[12px]!">{field.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className={`panel-resize-handle absolute right-0 top-0 h-full ${isResizingLeft ? 'resizing' : ''}`}
                    onMouseDown={startResizingLeft}
                    style={{ width: '4px', right: '-2px' }}
                />
            </div>

            <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 py-3 form-builder-canvas" data-tour="form-canvas">
                <div className="w-full max-w-[880px] form-builder-content-container">
                    <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-outline-variant/60 font-sans w-full">

                        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                            <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
                                {onBack && (
                                    <button
                                        onClick={onBack}
                                        className="flex items-center gap-1 px-2.5 py-1 hover:bg-slate-100/80 active:bg-slate-200/50 rounded-lg text-slate-700 hover:text-slate-900 transition-all font-semibold text-[11px] cursor-pointer shrink-0 border border-slate-200/60 bg-white/50 shadow-2xs h-[30px]"
                                        title="Back to Form Management"
                                    >
                                        <span className="material-symbols-outlined text-[14px] font-bold">arrow_back</span>
                                        Back
                                    </button>
                                )}
                                <div className="flex items-center gap-2 min-w-0">
                                    {isEditingTitle ? (
                                        <input
                                            type="text"
                                            value={formTitle}
                                            onChange={(e) => setFormTitle(e.target.value)}
                                            onBlur={() => setIsEditingTitle(false)}
                                            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                                            autoFocus
                                            className="font-bold text-[14px] text-slate-800 rounded-lg px-2 py-0.5 focus:outline-none canvas-title bg-white shadow-2xs"
                                        />
                                    ) : (
                                        <h1
                                            onClick={() => setIsEditingTitle(true)}
                                            className="font-bold text-[14px] text-slate-800 cursor-pointer canvas-title truncate hover:bg-slate-50 px-1 rounded-md transition-colors"
                                            title={formTitle}
                                        >
                                            {formTitle}
                                        </h1>
                                    )}

                                    {(() => {
                                        const badge = statusBadges[formStatus] || statusBadges['Draft'];
                                        return (
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium tracking-wide ${badge.bg}`}>
                                                <span className={`w-1 h-1 rounded-full ${badge.dot}`} />
                                                {badge.label}
                                            </span>
                                        )
                                    })()}
                                </div>
                            </div>

                            <div className="flex gap-2 items-center justify-end shrink-0 flex-wrap">
                                <button
                                    onClick={handleOpenPreview}
                                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-705 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-200/65 rounded-lg border border-slate-200/50 bg-white/40 transition-colors cursor-pointer flex items-center gap-1 h-[30px] shadow-2xs"
                                >
                                    <span className="material-symbols-outlined text-[14px] text-slate-550">visibility</span>
                                    Preview
                                </button>

                                <button
                                    onClick={handleSaveDraft}
                                    className="px-3 py-1 text-[11px] font-semibold text-slate-750 bg-white hover:bg-slate-50 border border-slate-250 rounded-lg shadow-2xs transition-colors cursor-pointer h-[30px]"
                                >
                                    Save Draft
                                </button>

                                <div className="publish-dropdown-container relative shrink-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPublishDropdown(!showPublishDropdown);
                                        }}
                                        className="px-3 py-1 h-[30px] text-[11px] bg-primary hover:bg-primary-hover text-white rounded-lg shadow-sm transition-all font-semibold cursor-pointer flex items-center justify-center gap-1.5 leading-none"
                                    >
                                        Publish Form
                                        <span className="material-symbols-outlined text-[14px]">{showPublishDropdown ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
                                    </button>

                                    <AnimatePresence>
                                        {showPublishDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-1.5 w-[170px] bg-white border border-slate-200 rounded-lg shadow-xl z-[999] overflow-hidden"
                                            >
                                                <div className="p-1 flex flex-col gap-0.5">
                                                    {formStatus !== 'Published' && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFormStatus('Published');
                                                                const updatedSnapshot = {
                                                                    title: formTitle,
                                                                    description: formDescription,
                                                                    fields: JSON.stringify(formFields),
                                                                    status: 'Published'
                                                                };
                                                                setSavedSnapshot(updatedSnapshot);
                                                                setLastSavedTime(Date.now());
                                                                setLastSavedText('✓ Saved Just Now');
                                                                if (onSave) {
                                                                    onSave({
                                                                        title: formTitle,
                                                                        description: formDescription,
                                                                        fields: formFields,
                                                                        status: 'PUBLISHED',
                                                                        settings: formSettings
                                                                    });
                                                                }
                                                                setShowPublishDropdown(false);
                                                                triggerLocalToast("✓ Form published successfully!");
                                                            }}
                                                            className="flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 transition-colors text-[11px] font-semibold text-primary rounded-md cursor-pointer border border-primary/20 mb-1"
                                                        >
                                                            <span className="material-symbols-outlined text-[13px] text-primary">publish</span>
                                                            Publish Form
                                                        </button>
                                                    )}
                                                    {[
                                                        {
                                                            type: 'iframe',
                                                            label: 'Copy iFrame Code',
                                                            icon: 'devices',
                                                            code: `<iframe src="${window.location.origin}/embed/form/${initialId}" width="100%" height="800" frameborder="0" style="border: none; border-radius: 3px;"></iframe>`
                                                        },
                                                        {
                                                            type: 'script',
                                                            label: 'Copy Script Code',
                                                            icon: 'code',
                                                            code: `<div id="lms-form-${initialId}"></div>\n<script src="${window.location.origin}/embed/js/form-${initialId}.js" data-form-id="${initialId}"></script>`
                                                        },
                                                        {
                                                            type: 'widget',
                                                            label: 'Copy Widget Code',
                                                            icon: 'smart_toy',
                                                            code: `<script>\nwindow.LMSFormWidget = {\n  formId: "${initialId}",\n  containerId: 'form-widget-${initialId}',\n  apiUrl: '${window.location.origin}/api'\n}\n</script>\n<div id="form-widget-${initialId}"></div>\n<script src="${window.location.origin}/embed/widget/form-widget.js"></script>`
                                                        },
                                                        {
                                                            type: 'api',
                                                            label: 'Copy API Code',
                                                            icon: 'api',
                                                            code: `fetch('${window.location.origin}/api/forms/${initialId}/embed', {\n  method: 'GET',\n  headers: { 'Content-Type': 'application/json' }\n})\n.then(response => response.json())\n.then(data => {\n  document.getElementById('form-container').innerHTML = data.html\n})\n.catch(error => console.error('Error:', error))`
                                                        }
                                                    ].map((opt) => (
                                                        <button
                                                            key={opt.type}
                                                            type="button"
                                                            onClick={async (e) => {
                                                                e.stopPropagation()
                                                                try {
                                                                    await navigator.clipboard.writeText(opt.code)
                                                                    triggerLocalToast(`${opt.label.replace('Copy ', '')} copied!`)
                                                                } catch (err) {
                                                                    console.error('Failed to copy to clipboard', err)
                                                                }
                                                                setShowPublishDropdown(false)
                                                            }}
                                                            className="flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 hover:bg-slate-50 transition-colors text-[11px] font-semibold text-slate-700 rounded-md cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[13px] text-slate-400">{opt.icon}</span>
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={toggleFullscreen}
                                    className="p-1.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-655 hover:text-slate-900 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center h-[30px] w-[30px] shrink-0"
                                    title="Toggle Fullscreen"
                                >
                                    <span className="material-symbols-outlined text-[16px]">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
                                </button>

                                <div className="more-menu-container relative shrink-0">
                                    <button
                                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                                        className="p-1.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-950 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center h-[30px] w-[30px]"
                                        title="More Actions"
                                    >
                                        <span className="material-symbols-outlined text-[16px] font-semibold">more_horiz</span>
                                    </button>
                                    <AnimatePresence>
                                        {showMoreMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                                transition={{ duration: 0.1 }}
                                                className="absolute right-0 mt-2 w-[190px] bg-white border border-slate-200/80 rounded-xl shadow-xl z-[999] p-1.5 flex flex-col gap-0.5"
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        onClick={() => {
                                                            setShowMoreMenu(false);
                                                            if (onSaveAsTemplate) {
                                                                onSaveAsTemplate({
                                                                    title: formTitle,
                                                                    description: formDescription,
                                                                    fields: formFields,
                                                                    status: 'TEMPLATE',
                                                                    settings: formSettings
                                                                });
                                                            } else {
                                                                triggerLocalToast("✓ Saved as Template");
                                                            }
                                                        }}
                                                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400">article</span>
                                                        Save as Template
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowMoreMenu(false);
                                                            triggerLocalToast("✓ Form duplicated successfully!");
                                                        }}
                                                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400">content_copy</span>
                                                        Duplicate Form
                                                    </button>
                                                </div>

                                                <div className="h-px bg-slate-100 my-1.5 mx-1" />

                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        onClick={() => {
                                                            setShowMoreMenu(false);
                                                            triggerLocalToast("✓ Schema imported successfully!");
                                                        }}
                                                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400">upload</span>
                                                        Import Form
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            setShowMoreMenu(false);
                                                            try {
                                                                const schema = { title: formTitle, description: formDescription, fields: formFields };
                                                                await navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
                                                                triggerLocalToast("✓ Schema copied to clipboard!");
                                                            } catch (err) {
                                                                triggerLocalToast("Export failed.");
                                                            }
                                                        }}
                                                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400">download</span>
                                                        Export Form
                                                    </button>
                                                </div>

                                                <div className="h-px bg-slate-100 my-1.5 mx-1" />

                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        onClick={() => {
                                                            setShowMoreMenu(false);
                                                            triggerLocalToast("✓ Opening version history...");
                                                        }}
                                                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400">history</span>
                                                        Version History
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowMoreMenu(false);
                                                            setFormStatus('Archived');
                                                            triggerLocalToast("✓ Form archived.");
                                                        }}
                                                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400">archive</span>
                                                        Archive Form
                                                    </button>
                                                </div>

                                                <div className="h-px bg-slate-100 my-1.5 mx-1" />

                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        onClick={() => {
                                                            setShowMoreMenu(false);
                                                            triggerLocalToast("✓ Form deleted.");
                                                            if (onBack) onBack();
                                                        }}
                                                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 bg-rose-50/50 hover:bg-rose-100/80 text-rose-600 hover:text-rose-700 rounded-lg text-[11.5px] font-semibold transition-colors cursor-pointer border border-rose-100/30"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px] text-rose-500">delete</span>
                                                        Delete Form
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded flex flex-col">
                        <div className="p-3 border-b border-outline-variant">
                            {isEditingDescription ? (
                                <textarea
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    onBlur={() => setIsEditingDescription(false)}
                                    autoFocus
                                    className="w-full font-body-md text-slate-500 border border-primary rounded px-3 py-1.5 focus:outline-none resize-none text-[12.5px] canvas-desc"
                                    rows="1"
                                />
                            ) : (
                                <p
                                    onClick={() => setIsEditingDescription(true)}
                                    className="font-body-md text-slate-550 cursor-pointer text-[12.5px] canvas-desc font-normal"
                                >
                                    {formDescription}
                                </p>
                            )}
                        </div>

                        <div
                            className="p-5 space-y-5"
                            onDragOver={handleDragOver}
                            onDrop={handleCanvasDrop}
                        >
                            {formFields.map((field, index) => {
                                const isSelected = selectedFieldId === field.id
                                return (
                                    <div
                                        key={field.id}
                                        onClick={() => setSelectedFieldId(field.id)}
                                        draggable={true}
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={handleDragOver}
                                        onDragEnter={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-hover-active'); }}
                                        onDragLeave={(e) => { e.currentTarget.classList.remove('drag-hover-active'); }}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className={`form-builder-card-item relative rounded-xl transition-all duration-200 cursor-pointer p-5 bg-white border ${isSelected
                                            ? 'border-primary border-2 shadow-md my-6 scale-[1.005]'
                                            : 'border-outline-variant hover:border-slate-300 shadow-2xs my-2 hover:shadow-sm'
                                            } ${draggedIndex === index ? 'opacity-40' : ''}`}
                                    >
                                        {isSelected && (
                                            <>
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex justify-center items-center bg-white border border-primary/30 rounded shadow-sm z-10 w-[16px] h-[22px] text-primary hover:bg-slate-50 cursor-grab">
                                                    <span className="material-symbols-outlined text-[12px]">drag_indicator</span>
                                                </div>

                                                <div className="absolute -top-3 right-4 flex gap-2 z-10">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); }}
                                                        className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-primary text-primary hover:bg-primary/5 active:bg-primary/10 flex items-center justify-center transition-all shadow-md hover:shadow-lg cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">settings</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                                                        className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 active:bg-rose-100/50 flex items-center justify-center transition-all shadow-md hover:shadow-lg cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        <div className={`relative text-left ${isDraggingActive ? 'pointer-events-none' : ''}`}>
                                            <label className="flex items-center font-medium text-slate-700 mb-2.5 text-[10px]! field-card-label">
                                                {field.label} {field.required && <span className="text-error ml-0.5">*</span>}
                                            </label>

                                            {field.conditional?.enabled && (
                                                <div className="field-conditional-badge">
                                                    <span className="material-symbols-outlined">settings_accessibility</span>
                                                    <span>
                                                        Show only when <strong>{formFields.find(f => f.id === Number(field.conditional.dependentFieldId))?.label || `Field #${field.conditional.dependentFieldId}`}</strong>{' '}
                                                        {field.conditional.operator === 'equals' ? 'equals' : field.conditional.operator === 'not_equals' ? 'does not equal' : field.conditional.operator === 'contains' ? 'contains' : field.conditional.operator === 'empty' ? 'is empty' : 'is not empty'}
                                                        {field.conditional.operator !== 'empty' && field.conditional.operator !== 'not_empty' && ` "${field.conditional.value}"`}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="relative">
                                                {field.type === 'select' ? (
                                                    <select disabled className="w-full h-9 px-3 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-[12.5px] appearance-none field-card-input">
                                                        <option>{field.placeholder || 'Select...'}</option>
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <option key={idx}>{typeof opt === 'object' && opt ? opt.label : opt}</option>
                                                        ))}
                                                    </select>
                                                ) : field.type === 'radio' ? (
                                                    <div className="space-y-1.5">
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <label key={idx} className="flex items-center gap-2 text-[12.5px] text-slate-600">
                                                                <input type="radio" disabled className="w-4 h-4 accent-primary" />
                                                                <span>{typeof opt === 'object' && opt ? opt.label : opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : field.type === 'checkbox' ? (
                                                    <div className="space-y-1.5">
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <label key={idx} className="flex items-center gap-2 text-[12.5px] text-slate-600">
                                                                <input type="checkbox" disabled className="w-4 h-4 accent-primary" />
                                                                <span>{typeof opt === 'object' && opt ? opt.label : opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : field.type === 'phone' ? (
                                                    <div className="flex gap-2">
                                                        <select disabled className="w-24 h-9 px-1.5 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface text-[12px]">
                                                            <option>US (+1)</option>
                                                        </select>
                                                        <input
                                                            type="tel"
                                                            placeholder={field.placeholder || 'Phone Number'}
                                                            disabled
                                                            className="flex-1 h-9 px-3 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-[12.5px] field-card-input"
                                                        />
                                                    </div>
                                                ) : field.type === 'captcha' ? (
                                                    <div className="flex flex-col gap-2 p-2.5 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                                                        {field.captchaType === 'recaptcha_v2_checkbox' ? (
                                                            <div className="w-[280px] h-[74px] border border-slate-250 bg-white rounded flex items-center justify-between p-3 select-none shadow-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 border-2 border-slate-350 rounded bg-slate-50"></div>
                                                                    <span className="text-[12.5px] font-semibold text-slate-600 font-sans">I'm not a robot</span>
                                                                </div>
                                                                <div className="flex flex-col items-center gap-0.5 opacity-80 shrink-0">
                                                                    <span className="material-symbols-outlined text-sky-500 text-[20px]">sync</span>
                                                                    <span className="text-[7.5px] font-black text-slate-400 font-sans">reCAPTCHA</span>
                                                                    <span className="text-[6.5px] text-slate-400 font-sans">Privacy - Terms</span>
                                                                </div>
                                                            </div>
                                                        ) : field.captchaType === 'recaptcha_v2_invisible' ? (
                                                            <div className="w-[240px] border border-slate-250 bg-white rounded p-2.5 flex items-center justify-between select-none shadow-sm text-slate-500">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-sky-500 text-[18px]">verified_user</span>
                                                                    <span className="text-[11px] font-semibold">reCAPTCHA v2 (Invisible) Active</span>
                                                                </div>
                                                            </div>
                                                        ) : field.captchaType === 'recaptcha_v3' ? (
                                                            <div className="w-[240px] border border-slate-250 bg-white rounded p-2.5 flex items-center justify-between select-none shadow-sm text-slate-500">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-sky-600 text-[18px]">security</span>
                                                                    <span className="text-[11px] font-semibold">reCAPTCHA v3 Active (Score verify)</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-[150px] h-[45px] rounded bg-slate-200 border border-slate-300 flex items-center justify-center font-mono font-bold text-slate-500 text-sm select-none">
                                                                        {field.captchaType === 'alphanumeric' ? 'aB3xD (Mock)' : '7 + 4 = ? (Mock)'}
                                                                    </div>
                                                                    <span className="material-symbols-outlined text-slate-400 text-[18px] cursor-not-allowed">refresh</span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter CAPTCHA answer"
                                                                    disabled
                                                                    className="w-full h-9 px-3 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-[12.5px] field-card-input"
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <input
                                                            type={field.type === 'email' ? 'email' : 'text'}
                                                            placeholder={field.placeholder}
                                                            disabled
                                                            className="w-full h-9 px-3 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-[12.5px] field-card-input"
                                                        />
                                                        {field.type === 'date' && (
                                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">calendar_today</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {field.helperText && (
                                                <p className="font-normal text-slate-400 mt-1.5 text-[11px] field-card-helper">{field.helperText}</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                            {showQuickAdd ? (
                                <div className="mt-4 border-2 border-dashed border-primary rounded p-4 bg-surface-container-low transition-colors select-none">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-body-md text-body-md font-semibold text-[10px] text-primary">Choose a field type to add:</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowQuickAdd(false); }}
                                            className="text-on-surface-variant hover:text-on-surface text-[10px] font-bold border border-outline-variant rounded px-1.5 py-0.5 bg-surface-container-lowest transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {[...standardFields, ...advancedFields, ...securityFields].map(field => (
                                            <button
                                                key={field.label}
                                                onClick={() => {
                                                    addField(field.type);
                                                    setShowQuickAdd(false);
                                                }}
                                                className="flex items-center gap-2 p-2 bg-surface-container-lowest border border-outline-variant rounded shadow-xs hover:border-primary hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-primary text-[14px]">{field.icon}</span>
                                                <span className="font-body-md text-body-md text-on-surface text-[10px]">{field.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setShowQuickAdd(true)}
                                    className="mt-4 border-2 border-dashed border-outline-variant rounded p-4 flex flex-col items-center justify-center text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors select-none cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[20px] mb-1 text-primary">add_circle</span>
                                    <span className="font-body-md text-body-md font-semibold text-[10px]">Click standard fields on the left to add them here</span>
                                    <span className="text-[8px] text-slate-400 mt-1">Or drag and drop standard fields to reorder</span>
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-outline-variant flex justify-end">
                            <button className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded font-body-md text-body-md font-bold shadow-sm transition-colors text-[10px]">
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="bg-surface-container-lowest border-l border-outline-variant flex flex-col h-full shrink-0"
                data-tour="properties-panel"
                style={{
                    width: `${rightWidth}px`,
                    transition: isResizingRight ? 'none' : 'width 0.2s',
                    position: 'relative'
                }}
            >
                <div
                    className={`panel-resize-handle absolute left-0 top-0 h-full ${isResizingRight ? 'resizing' : ''}`}
                    onMouseDown={startResizingRight}
                    style={{ width: '4px', left: '-2px' }}
                />
                <div className="flex border-b border-outline-variant select-none bg-slate-50 shrink-0">
                    <button
                        type="button"
                        onClick={() => setSelectedFieldId(null)}
                        className={`flex-1 py-2 text-[10px] font-extrabold text-center uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                            !selectedField
                                ? 'border-primary text-primary bg-white font-black'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Form Settings
                    </button>
                    <button
                        type="button"
                        disabled={!selectedFieldId}
                        className={`flex-1 py-2 text-[10px] font-extrabold text-center uppercase tracking-wider border-b-2 transition-all ${
                            selectedField
                                ? 'border-primary text-primary bg-white font-black cursor-pointer'
                                : 'border-transparent text-slate-300 cursor-not-allowed'
                        }`}
                    >
                        Field Settings
                    </button>
                </div>

                {selectedField ? (
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-2.5 bg-surface-container border-b border-outline-variant flex items-center gap-1.5 text-primary text-[10px] settings-type-header">
                            <span className="material-symbols-outlined text-[14px]">
                                {selectedField.type === 'phone' ? 'phone' : selectedField.type === 'date' ? 'calendar_today' : 'text_fields'}
                            </span>
                            {selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)}
                        </div>

                        <div className="p-3 space-y-2.5">
                            <div>
                                <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">Field Label</label>
                                <input
                                    type="text"
                                    value={selectedField.label}
                                    onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                                    className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] settings-input"
                                />
                            </div>

                            <div>
                                <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">Placeholder</label>
                                <input
                                    type="text"
                                    value={selectedField.placeholder}
                                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                                    placeholder="(555) 000-0000"
                                    className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] placeholder:text-[8px] settings-input"
                                />
                            </div>

                            <div>
                                <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">Helper Text</label>
                                <input
                                    type="text"
                                    value={selectedField.helperText || ''}
                                    onChange={(e) => updateField(selectedField.id, { helperText: e.target.value })}
                                    className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] settings-input"
                                />
                            </div>

                            <div className="flex items-center gap-2 py-1">
                                <input
                                    type="checkbox"
                                    id="field-required-toggle"
                                    checked={!!selectedField.required}
                                    onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                                    className="w-3.5 h-3.5 accent-primary rounded cursor-pointer"
                                />
                                <label htmlFor="field-required-toggle" className="font-body-md text-body-md text-on-surface text-[10px] font-bold cursor-pointer select-none">
                                    Required Field
                                </label>
                            </div>

                            <hr className="border-outline-variant my-1.5" />

                            {selectedField.type === 'captcha' && (
                                <div className="space-y-2.5">
                                    <h4 className="font-headline-md text-headline-md text-on-background mb-1 text-[10px]">CAPTCHA Settings</h4>
                                    <div>
                                        <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">CAPTCHA Type</label>
                                        <div className="relative">
                                            <select
                                                value={selectedField.captchaType || 'math'}
                                                onChange={(e) => updateField(selectedField.id, { captchaType: e.target.value })}
                                                className="w-full h-8 px-1.5 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px] cursor-pointer"
                                            >
                                                <option value="math">Math CAPTCHA (Self-Hosted SVG)</option>
                                                <option value="alphanumeric">Alphanumeric CAPTCHA (Self-Hosted SVG)</option>
                                                <option value="recaptcha_v2_checkbox">Google reCAPTCHA v2 (Checkbox)</option>
                                                <option value="recaptcha_v2_invisible">Google reCAPTCHA v2 (Invisible)</option>
                                                <option value="recaptcha_v3">Google reCAPTCHA v3</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {['recaptcha_v2_checkbox', 'recaptcha_v2_invisible', 'recaptcha_v3'].includes(selectedField.captchaType) && (
                                        <div className="space-y-2 pt-1 border-t border-outline-variant/30">
                                            <div>
                                                <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">Site Key</label>
                                                <input
                                                    type="text"
                                                    value={selectedField.recaptchaSiteKey || ''}
                                                    onChange={(e) => updateField(selectedField.id, { recaptchaSiteKey: e.target.value })}
                                                    placeholder="Enter Google Site Key"
                                                    className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] settings-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">Secret Key</label>
                                                <input
                                                    type="password"
                                                    value={selectedField.recaptchaSecretKey || ''}
                                                    onChange={(e) => updateField(selectedField.id, { recaptchaSecretKey: e.target.value })}
                                                    placeholder="Enter Google Secret Key"
                                                    className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] settings-input"
                                                />
                                            </div>
                                            {selectedField.captchaType === 'recaptcha_v3' && (
                                                <div>
                                                    <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">Score Threshold (0.0 to 1.0)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0.0"
                                                        max="1.0"
                                                        value={selectedField.recaptchaScoreThreshold !== undefined ? selectedField.recaptchaScoreThreshold : 0.5}
                                                        onChange={(e) => updateField(selectedField.id, { recaptchaScoreThreshold: parseFloat(e.target.value) || 0.5 })}
                                                        className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] settings-input"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <hr className="border-outline-variant my-1.5" />
                                </div>
                            )}

                            {selectedField.type === 'phone' && (
                                <div>
                                    <h4 className="font-headline-md text-headline-md text-on-background mb-1 text-[10px]">Validation</h4>
                                    <label className="block font-body-md text-body-md text-on-surface mb-1 text-[8px]">Required</label>
                                    <label className="block font-label-caps text-label-caps text-on-surface mb-0.5 text-[7px]">Format</label>
                                    <div className="relative">
                                        <select
                                            value={selectedField.phoneFormat || 'US Phone (XXX) XXX-XXXX'}
                                            onChange={(e) => {
                                                const newFormat = e.target.value;
                                                let newPlaceholder = selectedField.placeholder;
                                                if (newFormat.includes('US Phone')) {
                                                    newPlaceholder = '(555) 000-0000';
                                                } else if (newFormat.includes('India')) {
                                                    newPlaceholder = '+91 XXXXX-XXXXX';
                                                } else if (newFormat.includes('UK')) {
                                                    newPlaceholder = '+44 XXXX XXXXXX';
                                                } else if (newFormat.includes('Germany')) {
                                                    newPlaceholder = '+49 XXX XXXXXXX';
                                                } else if (newFormat.includes('France')) {
                                                    newPlaceholder = '+33 X XX XX XX XX';
                                                } else if (newFormat.includes('Australia')) {
                                                    newPlaceholder = '+61 X XXXX XXXX';
                                                } else if (newFormat.includes('UAE')) {
                                                    newPlaceholder = '+971 X-XXX-XXXX';
                                                } else if (newFormat.includes('Saudi Arabia')) {
                                                    newPlaceholder = '+966 X XXX XXXX';
                                                } else if (newFormat.includes('South Africa')) {
                                                    newPlaceholder = '+27 XX XXX XXXX';
                                                } else if (newFormat === 'International') {
                                                    newPlaceholder = '+X XXX XXX XXXX';
                                                }
                                                updateField(selectedField.id, { 
                                                    phoneFormat: newFormat,
                                                    placeholder: newPlaceholder
                                                });
                                            }}
                                            className="w-full h-8 px-1.5 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px] cursor-pointer"
                                        >
                                            <option value="US Phone (XXX) XXX-XXXX">US/Canada (+1) (XXX) XXX-XXXX</option>
                                            <option value="India Phone +91 XXXXX-XXXXX">India (+91) +91 XXXXX-XXXXX</option>
                                            <option value="UK Phone +44 XXXX XXXXXX">UK (+44) +44 XXXX XXXXXX</option>
                                            <option value="Germany Phone +49 XXX XXXXXXX">Germany (+49) +49 XXX XXXXXXX</option>
                                            <option value="France Phone +33 X XX XX XX XX">France (+33) +33 X XX XX XX XX</option>
                                            <option value="Australia Phone +61 X XXXX XXXX">Australia (+61) +61 X XXXX XXXX</option>
                                            <option value="UAE Phone +971 X-XXX-XXXX">UAE (+971) +971 X-XXX-XXXX</option>
                                            <option value="Saudi Arabia Phone +966 X XXX XXXX">Saudi Arabia (+966) +966 X XXX XXXX</option>
                                            <option value="South Africa Phone +27 XX XXX XXXX">South Africa (+27) +27 XX XXX XXXX</option>
                                            <option value="International">International (+X...)</option>
                                        </select>
                                    </div>
                                    <hr className="border-outline-variant my-1.5" />
                                </div>
                            )}

                            {(selectedField.type === 'select' || selectedField.type === 'radio' || selectedField.type === 'checkbox') && (
                                <div className="space-y-2 pb-2 border-b border-outline-variant">
                                    <p className="text-label-caps font-label-caps text-[8px]">Options</p>
                                    <div className="space-y-1.5">
                                        {selectedField.options && selectedField.options.map((option, index) => {
                                            const optLabel = typeof option === 'object' && option ? option.label : option;
                                            const conditionalEnabled = typeof option === 'object' && option ? option.conditionalEnabled : false;

                                            return (
                                                <div key={index} className="flex flex-col gap-1 border-b border-outline-variant/30 pb-1.5 last:border-b-0 last:pb-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <input
                                                            type="text"
                                                            value={optLabel}
                                                            onChange={(e) => {
                                                                const newOptions = [...(selectedField.options || [])];
                                                                const rawOpt = newOptions[index];
                                                                const newLabel = e.target.value;
                                                                if (typeof rawOpt === 'object' && rawOpt) {
                                                                    const shouldSyncValue = !rawOpt.value || rawOpt.value === rawOpt.label;
                                                                    newOptions[index] = {
                                                                        ...rawOpt,
                                                                        label: newLabel,
                                                                        value: shouldSyncValue ? newLabel : rawOpt.value
                                                                    };
                                                                } else {
                                                                    newOptions[index] = { label: newLabel, value: newLabel };
                                                                }
                                                                updateField(selectedField.id, { options: newOptions });
                                                            }}
                                                            placeholder={`Option ${index + 1}`}
                                                            className="flex-[1.2] min-w-0 h-6 px-1.5 border border-outline-variant rounded bg-surface text-[9px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />

                                                        <input
                                                            type="text"
                                                            value={typeof option === 'object' && option ? (option.value || '') : (option || '')}
                                                            onChange={(e) => {
                                                                const newOptions = [...(selectedField.options || [])];
                                                                const rawOpt = newOptions[index];
                                                                newOptions[index] = typeof rawOpt === 'object' && rawOpt
                                                                    ? { ...rawOpt, value: e.target.value }
                                                                    : { label: rawOpt || '', value: e.target.value };
                                                                updateField(selectedField.id, { options: newOptions });
                                                            }}
                                                            placeholder="value"
                                                            className="flex-1 min-w-0 h-6 px-1.5 border border-outline-variant rounded bg-surface text-[9px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />

                                                        <button
                                                            onClick={() => {
                                                                const newOptions = [...(selectedField.options || [])];
                                                                const rawOpt = newOptions[index];
                                                                const nextVal = typeof rawOpt === 'object' && rawOpt
                                                                    ? { ...rawOpt, conditionalEnabled: !rawOpt.conditionalEnabled }
                                                                    : { label: rawOpt || '', value: rawOpt || '', conditionalEnabled: true };
                                                                newOptions[index] = nextVal;
                                                                updateField(selectedField.id, { options: newOptions });
                                                                triggerLocalToast(`${optLabel || `Option ${index + 1}`} conditional logic toggled!`);
                                                            }}
                                                            className={`flex items-center justify-center rounded-full hover:bg-surface-container transition-colors shrink-0 p-0.5 ${conditionalEnabled ? 'text-primary' : 'text-on-surface-variant/35'}`}
                                                            title="Toggle Option-level Conditional Logic"
                                                        >
                                                            <span className="material-symbols-outlined text-[13px]">alt_route</span>
                                                        </button>

                                                        {index === 0 && (
                                                            <span className="text-[7px] font-semibold text-on-surface-variant/50 shrink-0 select-none whitespace-nowrap">add condition</span>
                                                        )}

                                                        <button
                                                            onClick={() => {
                                                                const newOptions = selectedField.options.filter((_, i) => i !== index);
                                                                updateField(selectedField.id, { options: newOptions });
                                                            }}
                                                            className="flex items-center justify-center hover:bg-error-container hover:text-error text-on-surface-variant/35 transition-colors rounded shrink-0 p-0.5"
                                                            title="Delete Option"
                                                        >
                                                            <span className="material-symbols-outlined text-[12px]">close</span>
                                                        </button>
                                                    </div>

                                                    {conditionalEnabled && (
                                                        <div className="flex items-center gap-1.5 mt-1.5 pl-2 pr-1 py-1.5 bg-slate-50 rounded-md border border-slate-200/50 text-[8.5px] text-left transition-all overflow-x-auto">
                                                            <span className="text-slate-400 font-bold shrink-0">Show if</span>
                                                            <select
                                                                value={typeof option === 'object' && option ? (option.dependentFieldId || '') : ''}
                                                                onChange={(e) => {
                                                                    const newOptions = [...(selectedField.options || [])];
                                                                    const rawOpt = newOptions[index];
                                                                    newOptions[index] = typeof rawOpt === 'object' && rawOpt
                                                                        ? { ...rawOpt, dependentFieldId: e.target.value, conditionalValue: '' }
                                                                        : { label: rawOpt || '', value: rawOpt || '', dependentFieldId: e.target.value, conditionalValue: '' };
                                                                    updateField(selectedField.id, { options: newOptions });
                                                                }}
                                                                className="h-5 px-1 border border-outline-variant rounded bg-white text-[8px] focus:outline-none focus:ring-1 focus:ring-primary max-w-[85px] font-sans"
                                                            >
                                                                <option value="">Field...</option>
                                                                {formFields
                                                                    .filter(f => f.id !== selectedField.id)
                                                                    .map(f => (
                                                                        <option key={f.id} value={f.id}>{f.label || `Field #${f.id}`}</option>
                                                                    ))
                                                                }
                                                            </select>

                                                            {(typeof option === 'object' && option && option.dependentFieldId) && (
                                                                <>
                                                                    <select
                                                                        value={option.conditionalOperator || 'equals'}
                                                                        onChange={(e) => {
                                                                            const newOptions = [...(selectedField.options || [])];
                                                                            newOptions[index] = {
                                                                                ...option,
                                                                                conditionalOperator: e.target.value
                                                                            };
                                                                            updateField(selectedField.id, { options: newOptions });
                                                                        }}
                                                                        className="h-5 px-0.5 border border-outline-variant rounded bg-white text-[8px] focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                                                                    >
                                                                        <option value="equals">is</option>
                                                                        <option value="not_equals">is not</option>
                                                                        <option value="contains">contains</option>
                                                                        <option value="empty">is empty</option>
                                                                        <option value="not_empty">has value</option>
                                                                    </select>

                                                                    {option.conditionalOperator !== 'empty' && option.conditionalOperator !== 'not_empty' && (
                                                                        <>
                                                                            {(() => {
                                                                                const depField = formFields.find(f => f.id === Number(option.dependentFieldId));
                                                                                if (depField && (depField.type === 'select' || depField.type === 'radio' || depField.type === 'checkbox') && depField.options && depField.options.length > 0) {
                                                                                    return (
                                                                                        <select
                                                                                            value={option.conditionalValue || ''}
                                                                                            onChange={(e) => {
                                                                                                const newOptions = [...(selectedField.options || [])];
                                                                                                newOptions[index] = {
                                                                                                    ...option,
                                                                                                    conditionalValue: e.target.value
                                                                                                };
                                                                                                updateField(selectedField.id, { options: newOptions });
                                                                                            }}
                                                                                            className="h-5 px-1 border border-outline-variant rounded bg-white text-[8px] focus:outline-none focus:ring-1 focus:ring-primary max-w-[80px]"
                                                                                        >
                                                                                            <option value="">Value...</option>
                                                                                            {depField.options.map((opt, idx) => {
                                                                                                const val = typeof opt === 'object' && opt ? opt.value : opt;
                                                                                                const lbl = typeof opt === 'object' && opt ? opt.label : opt;
                                                                                                return <option key={idx} value={val}>{lbl}</option>;
                                                                                            })}
                                                                                        </select>
                                                                                    );
                                                                                }
                                                                                return (
                                                                                    <input
                                                                                        type="text"
                                                                                        value={option.conditionalValue || ''}
                                                                                        onChange={(e) => {
                                                                                            const newOptions = [...(selectedField.options || [])];
                                                                                            newOptions[index] = {
                                                                                                ...option,
                                                                                                conditionalValue: e.target.value
                                                                                            };
                                                                                            updateField(selectedField.id, { options: newOptions });
                                                                                        }}
                                                                                        placeholder="Value..."
                                                                                        className="h-5 w-16 px-1 border border-outline-variant rounded bg-white text-[8px] focus:outline-none focus:ring-1 focus:ring-primary"
                                                                                    />
                                                                                );
                                                                            })()}
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newOptions = [...(selectedField.options || []), { label: '', value: '' }];
                                            updateField(selectedField.id, { options: newOptions });
                                        }}
                                        className="w-full h-7 border border-dashed border-outline-variant rounded text-[9px] text-on-surface-variant hover:bg-surface-container transition-colors font-semibold mt-1"
                                    >
                                        + Add Option
                                    </button>

                                    <div className="mt-2.5 p-2 border border-dashed border-outline-variant rounded-md bg-slate-50 text-left">
                                        <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bulk Import Options (Comma-separated)</label>
                                        <textarea
                                            id="bulk-import-options"
                                            placeholder="e.g. Option 1, Option 2, Option 3"
                                            className="w-full h-12 p-1.5 border border-outline-variant rounded text-[9.5px] bg-white resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const ta = document.getElementById('bulk-import-options');
                                                if (ta && ta.value.trim()) {
                                                    const rawList = ta.value.split(',');
                                                    const parsed = rawList
                                                        .map(item => item.trim())
                                                        .filter(Boolean)
                                                        .map(item => ({ label: item, value: item }));
                                                    if (parsed.length > 0) {
                                                        const currentOptions = selectedField.options || [];
                                                        updateField(selectedField.id, {
                                                            options: [...currentOptions, ...parsed]
                                                        });
                                                        ta.value = '';
                                                        triggerLocalToast(`Added ${parsed.length} options from bulk import!`);
                                                    }
                                                }
                                            }}
                                            className="w-full mt-1.5 h-6 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded text-[8px] flex items-center justify-center cursor-pointer transition-colors"
                                        >
                                            Bulk Import
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[13px] text-primary">rule</span>
                                        <h4 className="text-[10px] font-bold text-on-background uppercase tracking-wider">Show/Hide Rules</h4>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const enabled = !(selectedField.conditional?.enabled);
                                            updateField(selectedField.id, {
                                                conditional: {
                                                    ...(selectedField.conditional || { dependentFieldId: '', operator: 'equals', value: '' }),
                                                    enabled
                                                }
                                            });
                                        }}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none shrink-0 ${selectedField.conditional?.enabled ? 'bg-primary' : 'bg-outline-variant'}`}
                                        title={selectedField.conditional?.enabled ? 'Disable rule' : 'Enable rule'}
                                    >
                                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${selectedField.conditional?.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                                    </button>
                                </div>

                                {!selectedField.conditional?.enabled && (
                                    <p className="text-[8.5px] text-on-surface-variant/70 leading-relaxed">Show or hide this field dynamically based on other fields' responses.</p>
                                )}

                                {selectedField.conditional?.enabled && (() => {
                                    const cond = selectedField.conditional;
                                    const depField = formFields.find(f => f.id === Number(cond.dependentFieldId));
                                    const hasOptions = depField && (depField.type === 'select' || depField.type === 'radio' || depField.type === 'checkbox') && depField.options?.length > 0;
                                    const needsValue = cond.operator !== 'empty' && cond.operator !== 'not_empty';

                                    const operatorLabel = {
                                        equals: 'is',
                                        not_equals: 'is not',
                                        contains: 'contains',
                                        empty: 'is empty',
                                        not_empty: 'has any value'
                                    }[cond.operator || 'equals'];

                                    return (
                                        <div className="rounded-lg border border-outline-variant/60 bg-surface-container/40 overflow-hidden mt-1.5">
                                            <div className="p-2.5 space-y-2">
                                                <p className="text-[8px] font-semibold text-on-surface-variant/80 uppercase tracking-wider">Show this field when…</p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary text-[8px] font-bold flex items-center justify-center">1</span>
                                                    <select
                                                        value={cond.dependentFieldId || ''}
                                                        onChange={(e) => updateField(selectedField.id, {
                                                            conditional: { ...cond, dependentFieldId: e.target.value, value: '' }
                                                        })}
                                                        className={`flex-1 min-w-0 h-7 px-1.5 border rounded text-[9px] bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${cond.dependentFieldId ? 'border-primary/40 text-on-surface font-medium' : 'border-outline-variant text-on-surface-variant'}`}
                                                    >
                                                        <option value="">pick a field...</option>
                                                        {formFields
                                                            .filter(f => f.id !== selectedField.id)
                                                            .map(f => (
                                                                <option key={f.id} value={f.id}>{f.label || `Field #${f.id}`}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                {cond.dependentFieldId && (
                                                    <>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary text-[8px] font-bold flex items-center justify-center">2</span>
                                                            <div className="flex-1 flex flex-wrap gap-1">
                                                                {[
                                                                    { value: 'equals', label: 'is' },
                                                                    { value: 'not_equals', label: 'is not' },
                                                                    { value: 'contains', label: 'contains' },
                                                                    { value: 'empty', label: 'is empty' },
                                                                    { value: 'not_empty', label: 'has value' },
                                                                ].map(op => (
                                                                    <button
                                                                        key={op.value}
                                                                        onClick={() => updateField(selectedField.id, {
                                                                            conditional: { ...cond, operator: op.value }
                                                                        })}
                                                                        className={`px-2 py-0.5 rounded-full text-[8px] font-semibold border transition-colors ${(cond.operator || 'equals') === op.value
                                                                            ? 'bg-primary text-on-primary border-primary'
                                                                            : 'bg-surface border-outline-variant text-on-surface-variant hover:border-primary/40 hover:text-primary'}`}
                                                                    >
                                                                        {op.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {needsValue && (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary text-[8px] font-bold flex items-center justify-center">3</span>
                                                                {hasOptions ? (
                                                                    <select
                                                                        value={cond.value || ''}
                                                                        onChange={(e) => updateField(selectedField.id, {
                                                                            conditional: { ...cond, value: e.target.value }
                                                                        })}
                                                                        className={`flex-1 min-w-0 h-7 px-1.5 border rounded text-[9px] bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${cond.value ? 'border-primary/40 text-on-surface font-medium' : 'border-outline-variant text-on-surface-variant'}`}
                                                                    >
                                                                        <option value="">pick a value...</option>
                                                                        {depField.options.map((opt, idx) => {
                                                                            const val = typeof opt === 'object' && opt ? opt.value : opt;
                                                                            const lbl = typeof opt === 'object' && opt ? opt.label : opt;
                                                                            return <option key={idx} value={val}>{lbl}</option>;
                                                                        })}
                                                                    </select>
                                                                ) : (
                                                                    <input
                                                                        type="text"
                                                                        value={cond.value || ''}
                                                                        onChange={(e) => updateField(selectedField.id, {
                                                                            conditional: { ...cond, value: e.target.value }
                                                                        })}
                                                                        placeholder="type a value..."
                                                                        className="flex-1 min-w-0 h-7 px-1.5 border border-outline-variant rounded text-[9px] bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {cond.dependentFieldId && (
                                                <div className={`px-2.5 py-2 border-t text-[8.5px] leading-relaxed flex items-start gap-1.5 ${(needsValue && cond.value) || !needsValue ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-surface-container border-outline-variant/40 text-on-surface-variant'}`}>
                                                    <span className="material-symbols-outlined text-[12px] shrink-0 mt-px">
                                                        {((needsValue && cond.value) || !needsValue) ? 'check_circle' : 'info'}
                                                    </span>
                                                    <span>
                                                        {((needsValue && cond.value) || !needsValue)
                                                            ? <>This field will <strong>appear</strong> when <strong>{depField?.label}</strong> {operatorLabel}{needsValue && cond.value ? <> <strong>"{cond.value}"</strong></> : ''}</>
                                                            : 'Complete the rule above to activate this condition'
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                            <hr className="border-outline-variant my-1.5" />

                            <div>
                                <h4 className="font-headline-md text-headline-md text-on-background mb-1.5 text-[11px] settings-section-title">Advanced</h4>
                                <div className="mb-2">
                                    <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">Custom ID</label>
                                    <input
                                        type="text"
                                        value={selectedField.customId || ''}
                                        onChange={(e) => updateField(selectedField.id, { customId: e.target.value })}
                                        placeholder="e.g., phone_input_01"
                                        className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] settings-input"
                                    />
                                </div>
                                <div>
                                    <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">CSS Classes</label>
                                    <input
                                        type="text"
                                        value={selectedField.customClasses || ''}
                                        onChange={(e) => updateField(selectedField.id, { customClasses: e.target.value })}
                                        placeholder="e.g., custom-style p-4"
                                        className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] settings-input"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-3 w-full">
                                <button
                                    onClick={() => deleteField(selectedField.id)}
                                    className="flex-1 py-1.5 border border-error text-error font-body-md text-body-md font-bold rounded bg-surface-container-lowest hover:bg-error-container transition-colors flex items-center justify-center gap-1 text-[10px] settings-btn-delete cursor-pointer whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        triggerLocalToast(`Field "${selectedField.label}" configurations applied!`);
                                    }}
                                    className="flex-1 py-1.5 bg-primary hover:bg-primary/90 text-on-primary font-body-md text-body-md font-bold rounded transition-colors flex items-center justify-center gap-1 text-[10px] cursor-pointer shadow-sm whitespace-nowrap settings-btn-save"
                                >
                                    <span className="material-symbols-outlined text-[14px]">check</span>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-2.5 bg-surface-container border-b border-outline-variant flex items-center gap-1.5 text-primary text-[10px] settings-type-header select-none">
                            <span className="material-symbols-outlined text-[14px]">settings</span>
                            Form Settings
                        </div>
                        <div className="p-4 space-y-4">
                            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                                <input
                                    type="checkbox"
                                    checked={formSettings.redirect || false}
                                    onChange={(e) => setFormSettings({ ...formSettings, redirect: e.target.checked })}
                                    className="w-4 h-4 accent-primary cursor-pointer rounded"
                                />
                                <span className="text-[11.5px] font-bold text-slate-700">Redirect after submission</span>
                            </label>

                            {formSettings.redirect && (
                                <div className="space-y-1.5 animate-fade-in">
                                    <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label select-none">Redirect URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/thank-you"
                                        value={formSettings.redirectUrl || ''}
                                        onChange={(e) => setFormSettings({ ...formSettings, redirectUrl: e.target.value })}
                                        className="w-full h-8 px-2.5 border border-outline-variant rounded font-body-md text-body-md text-slate-705 bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                    />
                                    <p className="text-[9px] text-slate-400 select-none leading-relaxed">Users will be automatically redirected to this URL after submitting.</p>
                                </div>
                            )}

                            <label className="flex items-center gap-2.5 cursor-pointer group select-none pt-2 border-t border-outline-variant/30">
                                <input
                                    type="checkbox"
                                    checked={formSettings.useCustomSubmitButton || false}
                                    onChange={(e) => setFormSettings({ ...formSettings, useCustomSubmitButton: e.target.checked })}
                                    className="w-4 h-4 accent-primary cursor-pointer rounded"
                                />
                                <span className="text-[11.5px] font-bold text-slate-700">Custom Submit Button</span>
                            </label>

                            {formSettings.useCustomSubmitButton && (
                                <div className="space-y-1.5 animate-fade-in">
                                    <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label select-none">Submit Button Text</label>
                                    <input
                                        type="text"
                                        placeholder="Submit Request"
                                        value={formSettings.submitButtonText || ''}
                                        onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
                                        className="w-full h-8 px-2.5 border border-outline-variant rounded font-body-md text-body-md text-slate-705 bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                    />
                                    <p className="text-[9px] text-slate-400 select-none leading-relaxed">Customize the text displayed on the main form submission button.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        className="fixed inset-0 bg-on-background/40 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPreview(false)}
                    >
                        <motion.div
                            className="bg-surface-container-lowest rounded shadow-2xl max-w-[800px] w-full max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center z-10">
                                <h3 className="font-headline-md text-headline-md text-on-background">Form Preview</h3>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant"
                                >
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>

                            <form onSubmit={handlePreviewSubmit} className="p-4">
                                <div className="mb-3 border-b border-outline-variant pb-3">
                                    <h2 className="font-headline-lg text-headline-lg text-on-background mb-1 text-[14px]">{formTitle}</h2>
                                    <p className="font-body-md text-body-md text-on-surface-variant text-[10px]">{formDescription}</p>
                                </div>

                                <div className="space-y-3">
                                    <AnimatePresence initial={false}>
                                        {formFields.map((field) => {
                                            const visible = isFieldVisible(field, formFields, previewValues);
                                            if (!visible) return null;
                                            return (
                                                <motion.div
                                                    key={field.id}
                                                    initial={{ opacity: 0, y: -8, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                    exit={{ opacity: 0, y: -8, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="py-1">
                                                        <label className="block font-body-md text-body-md font-bold text-on-background mb-1 text-[11px]">
                                                            {field.label} {field.required && <span className="text-error ml-1">*</span>}
                                                        </label>
                                                        <div className="relative">
                                                            {field.type === 'select' ? (
                                                                <select
                                                                    value={previewValues[field.id] || ''}
                                                                    onChange={(e) => {
                                                                        const newVal = e.target.value;
                                                                        const updatedVals = { ...previewValues, [field.id]: newVal };
                                                                        const clearDescendants = (changedId) => {
                                                                            formFields.forEach(f => {
                                                                                if (Number(f.conditional?.dependentFieldId) === changedId) {
                                                                                    updatedVals[f.id] = f.type === 'checkbox' ? [] : '';
                                                                                    clearDescendants(f.id);
                                                                                }
                                                                            });
                                                                        };
                                                                        clearDescendants(field.id);
                                                                        setPreviewValues(updatedVals);
                                                                    }}
                                                                    className="w-full h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] appearance-none"
                                                                >
                                                                    <option value="">{field.placeholder || 'Select...'}</option>
                                                                    {field.options && field.options.filter(opt => isOptionVisible(opt, formFields, previewValues)).map((opt, idx) => {
                                                                        const val = typeof opt === 'object' && opt ? opt.value : opt;
                                                                        const lbl = typeof opt === 'object' && opt ? opt.label : opt;
                                                                        return <option key={idx} value={val}>{lbl}</option>;
                                                                    })}
                                                                </select>
                                                            ) : field.type === 'radio' ? (
                                                                <div className="space-y-1">
                                                                    {field.options && field.options.map((opt, idx) => {
                                                                        const val = typeof opt === 'object' && opt ? opt.value : opt;
                                                                        const lbl = typeof opt === 'object' && opt ? opt.label : opt;
                                                                        return (
                                                                            <label key={idx} className="flex items-center gap-2 text-[10px] cursor-pointer">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`preview-${field.id}`}
                                                                                    checked={previewValues[field.id] === val}
                                                                                    onChange={() => {
                                                                                        const updatedVals = { ...previewValues, [field.id]: val };
                                                                                        const clearDescendants = (changedId) => {
                                                                                            formFields.forEach(f => {
                                                                                                if (Number(f.conditional?.dependentFieldId) === changedId) {
                                                                                                    updatedVals[f.id] = f.type === 'checkbox' ? [] : '';
                                                                                                    clearDescendants(f.id);
                                                                                                }
                                                                                            });
                                                                                        };
                                                                                        clearDescendants(field.id);
                                                                                        setPreviewValues(updatedVals);
                                                                                    }}
                                                                                    className="w-4 h-4 accent-primary"
                                                                                />
                                                                                <span>{lbl}</span>
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : field.type === 'checkbox' ? (
                                                                <div className="space-y-1">
                                                                    {field.options && field.options.map((opt, idx) => {
                                                                        const val = typeof opt === 'object' && opt ? opt.value : opt;
                                                                        const lbl = typeof opt === 'object' && opt ? opt.label : opt;
                                                                        const currentVals = previewValues[field.id] || [];
                                                                        const isChecked = currentVals.includes(val);
                                                                        return (
                                                                            <label key={idx} className="flex items-center gap-2 text-[10px] cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={isChecked}
                                                                                    onChange={(e) => {
                                                                                        const newVal = e.target.checked
                                                                                            ? [...currentVals, val]
                                                                                            : currentVals.filter(v => v !== val);
                                                                                        setPreviewValues({ ...previewValues, [field.id]: newVal });
                                                                                    }}
                                                                                    className="w-4 h-4 accent-primary"
                                                                                />
                                                                                <span>{lbl}</span>
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : field.type === 'phone' ? (
                                                                <div className="flex gap-2">
                                                                    <select
                                                                        value={previewValues[`${field.id}-code`] || '+1'}
                                                                        onChange={(e) => {
                                                                            const code = e.target.value;
                                                                            const num = previewValues[`${field.id}-num`] || '';
                                                                            setPreviewValues({
                                                                                ...previewValues,
                                                                                [`${field.id}-code`]: code,
                                                                                [field.id]: `${code} ${num}`
                                                                            });
                                                                        }}
                                                                        className="w-24 h-8 px-1.5 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] cursor-pointer"
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
                                                                        placeholder={field.placeholder || 'Phone Number'}
                                                                        value={previewValues[`${field.id}-num`] || ''}
                                                                        onChange={(e) => {
                                                                            const num = e.target.value;
                                                                            const code = previewValues[`${field.id}-code`] || '+1';
                                                                            setPreviewValues({
                                                                                ...previewValues,
                                                                                [`${field.id}-num`]: num,
                                                                                [field.id]: `${code} ${num}`
                                                                            });
                                                                        }}
                                                                        className="flex-1 h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
                                                                    />
                                                                </div>
                                                            ) : field.type === 'captcha' ? (
                                                                <div className="flex flex-col gap-2">
                                                                    {['recaptcha_v2_checkbox', 'recaptcha_v2_invisible', 'recaptcha_v3'].includes(field.captchaType) ? (
                                                                        <div className="py-1">
                                                                            {field.recaptchaSiteKey ? (
                                                                                <>
                                                                                    {field.captchaType === 'recaptcha_v2_checkbox' && (
                                                                                        <div id={`recaptcha-preview-${field.id}`} className="g-recaptcha-container"></div>
                                                                                    )}
                                                                                    {field.captchaType === 'recaptcha_v2_invisible' && (
                                                                                        <div className="text-xs text-slate-500 flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded">
                                                                                            <span className="material-symbols-outlined text-sky-500 text-[16px] font-bold">verified_user</span>
                                                                                            <span>Google reCAPTCHA v2 (Invisible) Loaded</span>
                                                                                            <div id={`recaptcha-preview-${field.id}`} style={{ display: 'none' }}></div>
                                                                                        </div>
                                                                                    )}
                                                                                    {field.captchaType === 'recaptcha_v3' && (
                                                                                        <div className="text-xs text-slate-500 flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded">
                                                                                            <span className="material-symbols-outlined text-sky-650 text-[16px] font-bold">security</span>
                                                                                            <span>Google reCAPTCHA v3 Active (Site Key configured)</span>
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                <div className="text-[10px] text-amber-600 border border-amber-250 bg-amber-50 p-2 rounded flex items-center gap-1.5 font-bold">
                                                                                    <span className="material-symbols-outlined text-[14px]">warning</span>
                                                                                    Please configure reCAPTCHA Site Key in Settings
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
                                                                                    className="flex items-center justify-center p-1.5 rounded-full hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors"
                                                                                    title="Refresh CAPTCHA"
                                                                                >
                                                                                    <span className="material-symbols-outlined text-[16px] font-bold">refresh</span>
                                                                                </button>
                                                                            </div>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Enter verification code"
                                                                                value={previewValues[field.id] || ''}
                                                                                onChange={(e) => setPreviewValues({ ...previewValues, [field.id]: e.target.value })}
                                                                                required={field.required}
                                                                                className="w-full h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
                                                                            />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type={field.type === 'email' ? 'email' : 'text'}
                                                                        placeholder={field.placeholder}
                                                                        value={previewValues[field.id] || ''}
                                                                        onChange={(e) => setPreviewValues({ ...previewValues, [field.id]: e.target.value })}
                                                                        className="w-full h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
                                                                    />
                                                                    {field.type === 'date' && (
                                                                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">calendar_today</span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                        {field.helperText && (
                                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-[9px]">{field.helperText}</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                </div>

                                <div className="flex justify-end mt-4 border-t border-outline-variant pt-3">
                                    <button className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded font-body-md text-body-md font-bold shadow-sm transition-colors text-[10px]">
                                        {formSettings.useCustomSubmitButton ? (formSettings.submitButtonText || 'Submit Request') : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Toast
                message={toastMessage?.startsWith('✓ ') ? toastMessage.substring(2) : toastMessage}
                isVisible={!!toastMessage}
                onClose={() => setToastMessage(null)}
            />
        </div>
    )
}