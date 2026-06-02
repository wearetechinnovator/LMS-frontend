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
    const [showQuickAdd, setShowQuickAdd] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState(null)
    const [isDraggingActive, setIsDraggingActive] = useState(false)
    const [toastMessage, setToastMessage] = useState(null)
    const triggerLocalToast = (msg) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
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

    React.useEffect(() => {
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
        { type: 'city', label: 'City', icon: 'location_city' }
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
        // Clean up any remaining hover classes in the DOM
        document.querySelectorAll('.drag-hover-active').forEach(el => {
            el.classList.remove('drag-hover-active')
        })
    }

    const handleDrop = (e, targetIndex) => {
        e.preventDefault()
        // Clean up class on drop
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
                    label: `New ${fieldType === 'text' ? 'Field' : fieldType}`,
                    required: false,
                    placeholder: '',
                    helperText: '',
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
            // Find target index based on drag mouse coordinate relative to existing cards
            const cards = Array.from(e.currentTarget.querySelectorAll('.form-builder-card-item'))
            let targetIndex = formFields.length // default to append at the end
            
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
                    label: `New ${fieldType === 'text' ? 'Field' : fieldType}`,
                    required: false,
                    placeholder: '',
                    helperText: '',
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

    return (
        <div className="w-full h-full flex bg-background border border-outline-variant rounded-lg overflow-hidden form-builder-scope">

            <div
                className="bg-surface-container-lowest border-r border-outline-variant flex flex-col shrink-0"
                style={{
                    width: `${leftWidth}px`,
                    transition: isResizingLeft ? 'none' : 'width 0.2s',
                    position: 'relative'
                }}
            >
                <div className="p-2 border-b border-outline-variant flex flex-col items-start gap-0.5 justify-center">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="font-headline-md text-headline-md text-on-background text-[12px] field-library-title">Field Library</h2>
                        <span className="material-symbols-outlined text-on-surface-variant text-[16px] cursor-pointer hover:text-on-surface">search</span>
                    </div>
                    <span className="text-[8.5px] text-slate-400 font-semibold select-none leading-none mt-0.5">Click standard fields to add them to your form</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-3">
                    <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[9px] field-library-section-title">STANDARD FIELDS</h3>
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
                                    className="w-full flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors field-library-btn cursor-grab active:cursor-grabbing select-none"
                                    role="button"
                                >
                                    <span className="material-symbols-outlined text-outline-variant text-[14px]">drag_indicator</span>
                                    <span className="material-symbols-outlined text-primary text-[14px]">{field.icon}</span>
                                    <span className="font-body-md text-body-md text-on-surface text-[11px]">{field.label}</span>
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
                                    <span className="material-symbols-outlined text-tertiary text-[14px]">{field.icon}</span>
                                    <span className="font-body-md text-body-md text-on-surface text-[11px]">{field.label}</span>
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
                                    <span className="material-symbols-outlined text-primary text-[14px]">{field.icon}</span>
                                    <span className="font-body-md text-body-md text-on-surface text-[11px]">{field.label}</span>
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

            <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 py-3">
                <div className="w-full max-w-[800px]">

                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-4 pb-3 border-b border-outline-variant/60 font-sans w-full">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-full">
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

                        <div 
                            className="p-3 space-y-3"
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
                                        className={`form-builder-card-item relative rounded transition-all cursor-pointer p-4 bg-white border ${isSelected
                                            ? 'border-primary border-2 shadow-xs'
                                            : 'border-outline-variant hover:border-slate-300'
                                            } ${draggedIndex === index ? 'opacity-40' : ''}`}
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

                                        <div className={`relative text-left ${isDraggingActive ? 'pointer-events-none' : ''}`}>
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
                                                        <div className="flex items-center gap-1.5">
                                                            {/* Label input */}
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

                                                            {/* Value input */}
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

                                                            {/* Condition Toggle Button */}
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
                                                                    alt_route
                                                                </span>
                                                            </button>

                                                            {index === 0 && (
                                                                <span className="text-[7px] font-semibold text-on-surface-variant/50 shrink-0 select-none whitespace-nowrap">
                                                                    add condition
                                                                </span>
                                                            )}

                                                            {/* Delete Button */}
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
                                        <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                            Bulk Import Options (Comma-separated)
                                        </label>
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

                            {/* ── Conditional Logic Section ── */}
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
                                        Show or hide this field dynamically based on other fields' responses.
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
                                        <div className="rounded-lg border border-outline-variant/60 bg-surface-container/40 overflow-hidden mt-1.5">

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