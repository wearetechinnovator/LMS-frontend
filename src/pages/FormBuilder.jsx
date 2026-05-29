import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../assets/formbuilderpage/formbuilder.css'

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
    onBack,
    onSave,
    onSaveAsTemplate
}) {
    const [formFields, setFormFields] = useState(initialFields)
    const [selectedFieldId, setSelectedFieldId] = useState(initialFields[0]?.id || null)
    const [formTitle, setFormTitle] = useState(initialTitle)
    const [formDescription, setFormDescription] = useState(initialDescription)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [previewValues, setPreviewValues] = useState({})
    const [toastMessage, setToastMessage] = useState(null)
    const triggerLocalToast = (msg) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const isFieldVisible = (field, allFields, values, _visited = new Set()) => {
        if (!field.conditional || !field.conditional.enabled) return true;
        const depId = Number(field.conditional.dependentFieldId);
        if (!depId) return true;

        const depField = allFields.find(f => f.id === depId);
        if (!depField) return true;

        // ── Chain logic: if the parent field is itself hidden, child is hidden too ──
        if (!_visited.has(depId)) {
            _visited.add(depId);
            const parentVisible = isFieldVisible(depField, allFields, values, _visited);
            if (!parentVisible) return false;  // cascade: parent hidden → child hidden
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

    const handleOpenPreview = () => {
        const initialVals = {};
        formFields.forEach(field => {
            if (field.type === 'checkbox') {
                initialVals[field.id] = [];
            } else if (field.type === 'select') {
                initialVals[field.id] = field.options && field.options.length > 0
                    ? (typeof field.options[0] === 'object' && field.options[0] ? field.options[0].value : field.options[0])
                    : '';
            } else {
                initialVals[field.id] = '';
            }
        });
        setPreviewValues(initialVals);
        setShowPreview(true);
    };

    const standardFields = [
        { type: 'text', label: 'Name', icon: 'text_fields' },
        { type: 'email', label: 'Email', icon: 'mail' },
        { type: 'phone', label: 'Phone', icon: 'phone' },
        { type: 'date', label: 'Date Picker', icon: 'calendar_today' },
        { type: 'select', label: 'Select Box', icon: 'arrow_drop_down' },
        { type: 'radio', label: 'Radio Button', icon: 'radio_button_checked' },
        { type: 'text', label: 'City', icon: 'location_city' }
    ]

    const advancedFields = [
        { type: 'custom', label: 'Custom Field', icon: 'tune' }
    ]

    const securityFields = [
        { type: 'captcha', label: 'CAPTCHA', icon: 'verified_user' },
        { type: 'custom_button', label: 'Custom Button', icon: 'smart_button' }
    ]

    const selectedField = formFields.find(f => f.id === selectedFieldId)

    const addField = (type) => {
        const newId = Math.max(...formFields.map(f => f.id), 0) + 1
        const newField = {
            id: newId,
            type: type,
            label: `New ${type === 'text' ? 'Field' : type}`,
            required: false,
            placeholder: '',
            helperText: '',
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

    return (
        <div className="w-full h-full flex bg-background border border-outline-variant rounded-lg overflow-hidden form-builder-scope">

            <div className=" bg-surface-container-lowest border-r border-outline-variant flex flex-col shrink-0">
                <div className="p-2 border-b border-outline-variant flex justify-between items-center">
                    <h2 className="font-headline-md text-headline-md text-on-background text-[12px] field-library-title">Field Library</h2>
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] cursor-pointer hover:text-on-surface">search</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-3">
                    <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[9px] field-library-section-title">STANDARD FIELDS</h3>
                        <div className="space-y-1">
                            {standardFields.map(field => (
                                <button
                                    key={field.label}
                                    onClick={() => addField(field.type)}
                                    className="w-full flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors field-library-btn"
                                >
                                    <span className="material-symbols-outlined text-outline-variant text-[14px]">drag_indicator</span>
                                    <span className="material-symbols-outlined text-primary text-[14px]">{field.icon}</span>
                                    <span className="font-body-md text-body-md text-on-surface text-[11px]">{field.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[9px] field-library-section-title">ADVANCED</h3>
                        <div className="space-y-1">
                            {advancedFields.map(field => (
                                <button
                                    key={field.label}
                                    onClick={() => addField(field.type)}
                                    className="w-full flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors field-library-btn"
                                >
                                    <span className="material-symbols-outlined text-outline-variant text-[14px]">drag_indicator</span>
                                    <span className="material-symbols-outlined text-tertiary text-[14px]">{field.icon}</span>
                                    <span className="font-body-md text-body-md text-on-surface text-[11px]">{field.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[9px] field-library-section-title">SECURITY & CUSTOM</h3>
                        <div className="space-y-1">
                            {securityFields.map(field => (
                                <button
                                    key={field.label}
                                    onClick={() => addField(field.type)}
                                    className="w-full flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors field-library-btn"
                                >
                                    <span className="material-symbols-outlined text-outline-variant text-[14px]">drag_indicator</span>
                                    <span className="material-symbols-outlined text-primary text-[14px]">{field.icon}</span>
                                    <span className="font-body-md text-body-md text-on-surface text-[11px]">{field.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 py-3">
                <div className="w-full max-w-[800px]">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-outline-variant/60 font-sans w-full">
                        <div className="flex items-center gap-2 min-w-0">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer flex items-center justify-center mr-1 shrink-0"
                                    title="Back to Form Management"
                                >
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                </button>
                            )}
                            <div className="min-w-0">
                                <span className="text-primary font-label-caps text-label-caps text-[9px] canvas-status">Status: {initialStatus}</span>
                                {isEditingTitle ? (
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        onBlur={() => setIsEditingTitle(false)}
                                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                                        autoFocus
                                        className="w-full font-headline-lg text-headline-lg text-on-background border border-primary rounded px-2 py-0.5 mt-0.5 focus:outline-none text-[14px] canvas-title"
                                    />
                                ) : (
                                    <h1
                                        onClick={() => setIsEditingTitle(true)}
                                        className="font-headline-lg text-headline-lg text-on-background mt-0.5 cursor-pointer text-[15px] font-bold canvas-title truncate"
                                        title={formTitle}
                                    >
                                        {formTitle}
                                    </h1>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-1.5 items-center shrink-0 flex-wrap">
                            <button
                                onClick={handleOpenPreview}
                                className="px-2.5 py-1 text-[10px] border border-outline-variant rounded text-on-surface bg-surface-container-lowest shadow-sm hover:bg-surface-container-low transition-colors cursor-pointer"
                            >
                                Preview
                            </button>
                            <button
                                onClick={() => onSave && onSave({
                                    title: formTitle,
                                    description: formDescription,
                                    fields: formFields,
                                    status: initialStatus === 'Published' ? 'PUBLISHED' : 'DRAFT'
                                })}
                                className="px-2.5 py-1 text-[10px] border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 rounded shadow-sm transition-colors font-bold cursor-pointer"
                            >
                                Save Form
                            </button>
                            <button
                                onClick={() => onSaveAsTemplate && onSaveAsTemplate({
                                    title: formTitle,
                                    description: formDescription,
                                    fields: formFields,
                                    status: 'TEMPLATE'
                                })}
                                className="px-2.5 py-1 text-[10px] border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded shadow-sm transition-colors font-bold cursor-pointer"
                            >
                                Save as Template
                            </button>
                            <button
                                onClick={() => onSave && onSave({
                                    title: formTitle,
                                    description: formDescription,
                                    fields: formFields,
                                    status: 'PUBLISHED'
                                })}
                                className="px-2.5 py-1 text-[10px] bg-green-600 hover:bg-green-700 text-on-primary rounded shadow-sm transition-colors font-bold cursor-pointer"
                            >
                                Publish Form
                            </button>
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
                                    className="w-full font-body-md text-body-md text-on-surface-variant border border-primary rounded px-2 py-1 focus:outline-none resize-none text-[10px] canvas-desc"
                                    rows="1"
                                />
                            ) : (
                                <p
                                    onClick={() => setIsEditingDescription(true)}
                                    className="font-body-md text-body-md text-on-surface-variant cursor-pointer text-[10px] canvas-desc"
                                >
                                    {formDescription}
                                </p>
                            )}
                        </div>

                        <div className="p-3 space-y-3">
                            {formFields.map((field) => {
                                const isSelected = selectedFieldId === field.id
                                return (
                                    <div
                                        key={field.id}
                                        onClick={() => setSelectedFieldId(field.id)}
                                        className={`relative rounded transition-all cursor-pointer p-4 bg-white border ${isSelected
                                            ? 'border-primary border-2'
                                            : 'border-outline-variant hover:border-slate-300'
                                            }`}
                                    >
                                        {isSelected && (
                                            <>
                                                {/* Left-edge overlapping drag indicator handle */}
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex justify-center items-center bg-white border border-primary/30 rounded shadow-sm z-10 w-[16px] h-[22px] text-primary hover:bg-slate-50 cursor-grab">
                                                    <span className="material-symbols-outlined text-[12px]">drag_indicator</span>
                                                </div>

                                                {/* Top-right card actions menu */}
                                                <div className="absolute top-2 right-2 flex bg-white border border-outline-variant rounded shadow-sm z-10 overflow-hidden">
                                                    <button className="p-[3px] text-primary hover:bg-slate-50 border-r border-outline-variant flex items-center justify-center transition-colors">
                                                        <span className="material-symbols-outlined text-[12px]">settings</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                                                        className="p-[3px] text-on-surface-variant hover:bg-error-container hover:text-error flex items-center justify-center transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[12px]">delete</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        <div className="relative text-left">
                                            <label className="flex items-center font-body-md text-body-md font-bold text-on-background mb-1.5 text-[11px] field-card-label">
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
                                                    <select disabled className="w-full h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-[10px] appearance-none field-card-input">
                                                        <option>{field.placeholder || 'Select...'}</option>
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <option key={idx}>{typeof opt === 'object' && opt ? opt.label : opt}</option>
                                                        ))}
                                                    </select>
                                                ) : field.type === 'radio' ? (
                                                    <div className="space-y-1">
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <label key={idx} className="flex items-center gap-2 text-[10px]">
                                                                <input type="radio" disabled className="w-4 h-4 accent-primary" />
                                                                <span>{typeof opt === 'object' && opt ? opt.label : opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : field.type === 'checkbox' ? (
                                                    <div className="space-y-1">
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <label key={idx} className="flex items-center gap-2 text-[10px]">
                                                                <input type="checkbox" disabled className="w-4 h-4 accent-primary" />
                                                                <span>{typeof opt === 'object' && opt ? opt.label : opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <input
                                                            type={field.type === 'phone' ? 'tel' : 'text'}
                                                            placeholder={field.placeholder}
                                                            disabled
                                                            className="w-full h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-[10px] field-card-input"
                                                        />
                                                        {field.type === 'date' && (
                                                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">calendar_today</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {field.helperText && (
                                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-[9px] field-card-helper">{field.helperText}</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                            <div className="mt-4 border-2 border-dashed border-outline-variant rounded p-4 flex flex-col items-center justify-center text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                                <span className="material-symbols-outlined text-[20px] mb-1 text-outline-variant">add_circle</span>
                                <span className="font-body-md text-body-md font-semibold text-[9px]">Drag and drop fields here</span>
                            </div>
                        </div>

                        <div className="p-3 border-t border-outline-variant flex justify-end">
                            <button className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded font-body-md text-body-md font-bold shadow-sm transition-colors text-[10px]">
                                Submit Request
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="w-64 bg-surface-container-lowest border-l border-outline-variant flex flex-col h-full shrink-0">
                <div className="px-3 py-1.5 border-b border-outline-variant">
                    <h2 className="text-[12px] font-bold text-on-background settings-pane-title">Field Settings</h2>
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

                            <hr className="border-outline-variant my-1.5" />

                            {selectedField.type === 'phone' && (
                                <div>
                                    <h4 className="font-headline-md text-headline-md text-on-background mb-1 text-[10px]">Validation</h4>
                                    <label className="block font-body-md text-body-md text-on-surface mb-1 text-[8px]">Required</label>

                                    <label className="block font-label-caps text-label-caps text-on-surface mb-0.5 text-[7px]">Format</label>
                                    <div className="relative">
                                        <select className="w-full h-8 px-1.5 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]">
                                            <option>US Phone (XXX) XXX-XXXX</option>
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
                                                        {/* Label row */}
                                                        <input
                                                            type="text"
                                                            value={optLabel}
                                                            onChange={(e) => {
                                                                const newOptions = [...(selectedField.options || [])];
                                                                const rawOpt = newOptions[index];
                                                                newOptions[index] = typeof rawOpt === 'object' && rawOpt 
                                                                    ? { ...rawOpt, label: e.target.value } 
                                                                    : { label: e.target.value, value: e.target.value };
                                                                updateField(selectedField.id, { options: newOptions });
                                                            }}
                                                            placeholder={`Option ${index + 1}`}
                                                            className="w-full h-6 px-1.5 border border-outline-variant rounded bg-surface text-[9px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                                        />
                                                        {/* Value + controls row */}
                                                        <div className="flex items-center gap-1">
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
                                                                className={`flex items-center justify-center rounded-full hover:bg-surface-container transition-colors shrink-0 p-0.5 ${
                                                                    conditionalEnabled ? 'text-primary' : 'text-on-surface-variant/35'
                                                                }`}
                                                                title="Toggle Option-level Conditional Logic"
                                                            >
                                                                <span className="material-symbols-outlined text-[13px]">
                                                                    {conditionalEnabled ? 'radio_button_checked' : 'radio_button_unchecked'}
                                                                </span>
                                                            </button>
                                                            {index === 0 && (
                                                                <span className="text-[7px] font-semibold text-on-surface-variant/50 shrink-0 select-none whitespace-nowrap">
                                                                    add condition
                                                                </span>
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

                                                     {/* Option-level Conditional Panel */}
                                                     {conditionalEnabled && (
                                                         <div className="pl-2 pr-1 py-1.5 bg-surface-container/40 border border-outline-variant/60 rounded-md my-0.5 space-y-1 text-left transition-all">
                                                             <div className="flex flex-col">
                                                                 <span className="text-[7px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-0.5">Show when field</span>
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
                                                                     className="w-full h-6 px-1.5 border border-outline-variant rounded bg-surface-container-lowest text-[8px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                                                                 >
                                                                     <option value="">Select a field...</option>
                                                                     {formFields
                                                                         .filter(f => f.id !== selectedField.id)
                                                                         .map(f => (
                                                                             <option key={f.id} value={f.id}>{f.label || `Field #${f.id}`}</option>
                                                                         ))
                                                                     }
                                                                 </select>
                                                             </div>
 
                                                             {(typeof option === 'object' && option && option.dependentFieldId) && (
                                                                 <div className="grid grid-cols-2 gap-1 mt-1">
                                                                     <div className="flex flex-col">
                                                                         <span className="text-[7px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-0.5">Operator</span>
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
                                                                             className="w-full h-6 px-1 border border-outline-variant rounded bg-surface-container-lowest text-[8px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                                                                         >
                                                                             <option value="equals">Equals</option>
                                                                             <option value="not_equals">Not Equal</option>
                                                                             <option value="contains">Contains</option>
                                                                             <option value="empty">Empty</option>
                                                                             <option value="not_empty">Not Empty</option>
                                                                         </select>
                                                                     </div>
 
                                                                     {option.conditionalOperator !== 'empty' && option.conditionalOperator !== 'not_empty' && (
                                                                         <div className="flex flex-col">
                                                                             <span className="text-[7px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-0.5">Value</span>
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
                                                                                             className="w-full h-6 px-1 border border-outline-variant rounded bg-surface-container-lowest text-[8px] focus:outline-none"
                                                                                         >
                                                                                             <option value="">Select...</option>
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
                                                                                         className="w-full h-6 px-1.5 border border-outline-variant rounded bg-surface-container-lowest text-[8px] focus:outline-none"
                                                                                     />
                                                                                 );
                                                                             })()}
                                                                         </div>
                                                                     )}
                                                                 </div>
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
                                    <hr className="border-outline-variant my-1.5" />
                                </div>
                            )}

                                {/* ── Conditional Logic Section ── */}
                                <div className="space-y-2">

                                    {/* Header row with pill toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[13px] text-on-surface-variant">rule</span>
                                            <h4 className="text-[10px] font-bold text-on-background">Show/Hide Rules</h4>
                                        </div>
                                        {/* Pill toggle */}
                                        <button
                                            onClick={() => {
                                                const enabled = !(selectedField.conditional?.enabled);
                                                updateField(selectedField.id, {
                                                    conditional: {
                                                        ...(selectedField.conditional || { dependentFieldId: '', operator: 'equals', value: '' }),
                                                        enabled
                                                    }
                                                });
                                            }}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none shrink-0 ${
                                                selectedField.conditional?.enabled ? 'bg-primary' : 'bg-outline-variant'
                                            }`}
                                            title={selectedField.conditional?.enabled ? 'Disable rule' : 'Enable rule'}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                                                selectedField.conditional?.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
                                            }`} />
                                        </button>
                                    </div>

                                    {!selectedField.conditional?.enabled && (
                                        <p className="text-[8.5px] text-on-surface-variant/70 leading-relaxed">
                                            Turn on to make this field appear only under certain conditions.
                                        </p>
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
                                            <div className="rounded-lg border border-outline-variant/60 bg-surface-container/40 overflow-hidden">

                                                {/* Sentence builder */}
                                                <div className="p-2.5 space-y-2">
                                                    <p className="text-[8px] font-semibold text-on-surface-variant/80 uppercase tracking-wider">Show this field when…</p>

                                                    {/* Step 1: Which field */}
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary text-[8px] font-bold flex items-center justify-center">1</span>
                                                        <select
                                                            value={cond.dependentFieldId || ''}
                                                            onChange={(e) => updateField(selectedField.id, {
                                                                conditional: { ...cond, dependentFieldId: e.target.value, value: '' }
                                                            })}
                                                            className={`flex-1 min-w-0 h-7 px-1.5 border rounded text-[9px] bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${
                                                                cond.dependentFieldId ? 'border-primary/40 text-on-surface font-medium' : 'border-outline-variant text-on-surface-variant'
                                                            }`}
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
                                                            {/* Step 2: Operator */}
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
                                                                            className={`px-2 py-0.5 rounded-full text-[8px] font-semibold border transition-colors ${
                                                                                (cond.operator || 'equals') === op.value
                                                                                    ? 'bg-primary text-on-primary border-primary'
                                                                                    : 'bg-surface border-outline-variant text-on-surface-variant hover:border-primary/40 hover:text-primary'
                                                                            }`}
                                                                        >
                                                                            {op.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Step 3: Value (only when needed) */}
                                                            {needsValue && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary text-[8px] font-bold flex items-center justify-center">3</span>
                                                                    {hasOptions ? (
                                                                        <select
                                                                            value={cond.value || ''}
                                                                            onChange={(e) => updateField(selectedField.id, {
                                                                                conditional: { ...cond, value: e.target.value }
                                                                            })}
                                                                            className={`flex-1 min-w-0 h-7 px-1.5 border rounded text-[9px] bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${
                                                                                cond.value ? 'border-primary/40 text-on-surface font-medium' : 'border-outline-variant text-on-surface-variant'
                                                                            }`}
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

                                                {/* Live summary card */}
                                                {cond.dependentFieldId && (
                                                    <div className={`px-2.5 py-2 border-t text-[8.5px] leading-relaxed flex items-start gap-1.5 ${
                                                        (needsValue && cond.value) || !needsValue
                                                            ? 'bg-primary/5 border-primary/20 text-primary'
                                                            : 'bg-surface-container border-outline-variant/40 text-on-surface-variant'
                                                    }`}>
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
                                        placeholder="e.g., phone_input_01"
                                        className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] settings-input"
                                    />
                                </div>
                                <div>
                                    <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px] settings-label">CSS Classes</label>
                                    <input
                                        type="text"
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
                    <div className="flex items-center justify-center h-full text-on-surface-variant font-body-md text-body-md text-[9px] text-center px-2">
                        Select a field to configure
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

                            <div className="p-4">
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
                                                                        // Cascade-clear all fields that depend (directly or transitively) on this field
                                                                        const updatedVals = { ...previewValues, [field.id]: newVal };
                                                                        const clearDescendants = (changedId) => {
                                                                            formFields.forEach(f => {
                                                                                if (Number(f.conditional?.dependentFieldId) === changedId) {
                                                                                    updatedVals[f.id] = f.type === 'checkbox' ? [] : '';
                                                                                    clearDescendants(f.id); // recurse deeper
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
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
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
                                        Submit Request
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Toast Banner */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        className="fixed top-6 right-6 bg-success text-on-success border border-success-container px-4 py-2.5 rounded-lg shadow-xl z-50 flex items-center gap-2"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    >
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span className="text-[11px] font-semibold">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}