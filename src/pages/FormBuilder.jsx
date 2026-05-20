import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FormBuilder() {
    const [formFields, setFormFields] = useState([
        { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe', helperText: '', options: [] },
        { id: 2, type: 'phone', label: 'Phone Number', required: true, placeholder: '(555) 000-0000', helperText: "We'll use this to text you reminders.", options: [] },
        { id: 3, type: 'date', label: 'Date Selection', required: false, placeholder: 'Select Date', helperText: '', options: [] },
        { id: 4, type: 'date', label: 'Preferred Appointment Date', required: false, placeholder: 'MM/DD/YYYY', helperText: '', options: [] }
    ])
    const [selectedFieldId, setSelectedFieldId] = useState(2)
    const [formTitle, setFormTitle] = useState('Doctor Appointment Inquiry')
    const [formDescription, setFormDescription] = useState('Please fill out the form below to request an appointment. Our staff will contact you shortly to confirm.')
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

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
            options: (type === 'select' || type === 'radio' || type === 'checkbox') ? ['Option 1'] : []
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
        <div className="w-full h-full  flex bg-background border border-outline-variant rounded-lg overflow-hidden">

            <div className=" bg-surface-container-lowest border-r border-outline-variant flex flex-col shrink-0">
                <div className="p-2 border-b border-outline-variant flex justify-between items-center">
                    <h2 className="font-headline-md text-headline-md text-on-background text-[12px]">Field Library</h2>
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] cursor-pointer hover:text-on-surface">search</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-3">
                    <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[9px]">STANDARD FIELDS</h3>
                        <div className="space-y-1">
                            {standardFields.map(field => (
                                <button
                                    key={field.label}
                                    onClick={() => addField(field.type)}
                                    className="w-full flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors"
                                >
                                    <span className="material-symbols-outlined text-outline-variant text-[14px]">drag_indicator</span>
                                    <span className="material-symbols-outlined text-primary text-[14px]">{field.icon}</span>
                                    <span className="font-body-md text-body-md text-on-surface text-[11px]">{field.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[9px]">ADVANCED</h3>
                        <div className="space-y-1">
                            {advancedFields.map(field => (
                                <button
                                    key={field.label}
                                    onClick={() => addField(field.type)}
                                    className="w-full flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors"
                                >
                                    <span className="material-symbols-outlined text-outline-variant text-[14px]">drag_indicator</span>
                                    <span className="material-symbols-outlined text-tertiary text-[14px]">{field.icon}</span>
                                    <span className="font-body-md text-body-md text-on-surface text-[11px]">{field.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[9px]">SECURITY & CUSTOM</h3>
                        <div className="space-y-1">
                            {securityFields.map(field => (
                                <button
                                    key={field.label}
                                    onClick={() => addField(field.type)}
                                    className="w-full flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-surface-container-low transition-colors"
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

                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <span className="text-primary font-label-caps text-label-caps text-[9px]">Status: Draft</span>
                            {isEditingTitle ? (
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    onBlur={() => setIsEditingTitle(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                                    autoFocus
                                    className="w-full font-headline-lg text-headline-lg text-on-background border border-primary rounded px-2 py-0.5 mt-0.5 focus:outline-none text-[14px]"
                                />
                            ) : (
                                <h1
                                    onClick={() => setIsEditingTitle(true)}
                                    className="font-headline-lg text-headline-lg text-on-background mt-0.5 cursor-pointer text-[16px]"
                                >
                                    {formTitle}
                                </h1>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowPreview(true)}
                                className="px-3 py-0.5 text-[10px] border border-outline-variant rounded text-on-surface bg-surface-container-lowest shadow-sm hover:bg-surface-container-low transition-colors"
                            >
                                Preview
                            </button>
                            <button className="px-3 py-0.5 text-[10px] bg-primary hover:bg-primary/90 text-on-primary rounded shadow-sm transition-colors">
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
                                    className="w-full font-body-md text-body-md text-on-surface-variant border border-primary rounded px-2 py-1 focus:outline-none resize-none text-[10px]"
                                    rows="1"
                                />
                            ) : (
                                <p
                                    onClick={() => setIsEditingDescription(true)}
                                    className="font-body-md text-body-md text-on-surface-variant cursor-pointer text-[10px]"
                                >
                                    {formDescription}
                                </p>
                            )}
                        </div>

                        <div className="p-3 space-y-2">
                            {formFields.map((field) => {
                                const isSelected = selectedFieldId === field.id
                                return (
                                    <div
                                        key={field.id}
                                        onClick={() => setSelectedFieldId(field.id)}
                                        className={`relative rounded border-2 transition-all cursor-pointer p-2 ${isSelected
                                                ? 'border-primary bg-surface-container'
                                                : 'border-transparent hover:border-outline-variant bg-transparent'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute -top-2 right-2 flex bg-surface-container-lowest border border-outline-variant rounded shadow-sm z-10 overflow-hidden">
                                                <button className="p-0.5 text-primary hover:bg-surface-container-low flex items-center justify-center transition-colors">
                                                    <span className="material-symbols-outlined text-[14px]">settings</span>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                                                    className="p-0.5 text-on-surface-variant hover:bg-error-container hover:text-error border-l border-outline-variant flex items-center justify-center transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                                </button>
                                            </div>
                                        )}

                                        <div className="relative">
                                            <label className="flex items-center font-body-md text-body-md font-bold text-on-background mb-1 text-[11px]">
                                                {isSelected && (
                                                    <span className="material-symbols-outlined text-primary text-[14px] absolute -left-5 top-1/2 -translate-y-1/2">drag_indicator</span>
                                                )}
                                                {field.label} {field.required && <span className="text-error ml-0.5">*</span>}
                                            </label>

                                            <div className="relative">
                                                {field.type === 'select' ? (
                                                    <select disabled className="w-full h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-[10px] appearance-none">
                                                        <option>{field.placeholder || 'Select...'}</option>
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <option key={idx}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : field.type === 'radio' ? (
                                                    <div className="space-y-1">
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <label key={idx} className="flex items-center gap-2 text-[10px]">
                                                                <input type="radio" disabled className="w-4 h-4 accent-primary" />
                                                                <span>{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : field.type === 'checkbox' ? (
                                                    <div className="space-y-1">
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <label key={idx} className="flex items-center gap-2 text-[10px]">
                                                                <input type="checkbox" disabled className="w-4 h-4 accent-primary" />
                                                                <span>{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <input
                                                            type={field.type === 'phone' ? 'tel' : 'text'}
                                                            placeholder={field.placeholder}
                                                            disabled
                                                            className="w-full h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-[10px]"
                                                        />
                                                        {field.type === 'date' && (
                                                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">calendar_today</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {field.helperText && (
                                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-[9px]">{field.helperText}</p>
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
                    <h2 className="text-[12px] font-bold text-on-background">Field Settings</h2>
                </div>

                {selectedField ? (
                    <div className="flex-1 overflow-y-auto">

                        <div className="p-2.5 bg-surface-container border-b border-outline-variant flex items-center gap-1.5 text-primary text-[10px]">
                            <span className="material-symbols-outlined text-[14px]">
                                {selectedField.type === 'phone' ? 'phone' : selectedField.type === 'date' ? 'calendar_today' : 'text_fields'}
                            </span>
                            {selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)}
                        </div>

                        <div className="p-3 space-y-2.5">

                            <div>
                                <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px]">Field Label</label>
                                <input
                                    type="text"
                                    value={selectedField.label}
                                    onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                                    className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
                                />
                            </div>

                            <div>
                                <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px]">Placeholder</label>
                                <input
                                    type="text"
                                    value={selectedField.placeholder}
                                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                                    placeholder="(555) 000-0000"
                                    className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] placeholder:text-[8px]"
                                />
                            </div>

                            <div>
                                <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px]">Helper Text</label>
                                <input
                                    type="text"
                                    value={selectedField.helperText || ''}
                                    onChange={(e) => updateField(selectedField.id, { helperText: e.target.value })}
                                    className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
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
                                    {selectedField.options && selectedField.options.map((option, index) => (
                                        <div key={index} className="flex gap-1">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => {
                                                    const newOptions = [...(selectedField.options || [])];
                                                    newOptions[index] = e.target.value;
                                                    updateField(selectedField.id, { options: newOptions });
                                                }}
                                                className="flex-1 h-7 px-2 border border-outline-variant rounded bg-surface text-[10px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newOptions = selectedField.options.filter((_, i) => i !== index);
                                                    updateField(selectedField.id, { options: newOptions });
                                                }}
                                                className="p-1 hover:bg-error-container hover:text-error text-on-surface-variant transition-colors rounded"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">close</span>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newOptions = [...(selectedField.options || []), ''];
                                            updateField(selectedField.id, { options: newOptions });
                                        }}
                                        className="w-full h-7 border border-dashed border-outline-variant rounded text-[9px] text-on-surface-variant hover:bg-surface-container transition-colors font-semibold"
                                    >
                                        + Add Option
                                    </button>
                                    <hr className="border-outline-variant my-1.5" />
                                </div>
                            )}

                            <div>
                                <h4 className="font-headline-md text-headline-md text-on-background mb-1.5 text-[11px]">Advanced</h4>
                                <div className="mb-2">
                                    <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px]">Custom ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., phone_input_01"
                                        className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-label-caps text-label-caps text-on-surface mb-1 text-[8px]">CSS Classes</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., custom-style p-4"
                                        className="w-full h-7 px-2 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => deleteField(selectedField.id)}
                                className="w-full py-1.5 border border-error text-error font-body-md text-body-md font-bold rounded bg-surface-container-lowest hover:bg-error-container transition-colors flex items-center justify-center gap-1 mt-3 text-[10px]"
                            >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                Delete
                            </button>

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
                                    {formFields.map((field) => (
                                        <div key={field.id}>
                                            <label className="block font-body-md text-body-md font-bold text-on-background mb-1 text-[11px]">
                                                {field.label} {field.required && <span className="text-error ml-1">*</span>}
                                            </label>
                                            <div className="relative">
                                                {field.type === 'select' ? (
                                                    <select className="w-full h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px] appearance-none">
                                                        <option>{field.placeholder || 'Select...'}</option>
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <option key={idx}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : field.type === 'radio' ? (
                                                    <div className="space-y-1">
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <label key={idx} className="flex items-center gap-2 text-[10px]">
                                                                <input type="radio" className="w-4 h-4 accent-primary" />
                                                                <span>{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : field.type === 'checkbox' ? (
                                                    <div className="space-y-1">
                                                        {field.options && field.options.map((opt, idx) => (
                                                            <label key={idx} className="flex items-center gap-2 text-[10px]">
                                                                <input type="checkbox" className="w-4 h-4 accent-primary" />
                                                                <span>{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <input
                                                            type={field.type === 'phone' ? 'tel' : 'text'}
                                                            placeholder={field.placeholder}
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
                                    ))}
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

        </div>
    )
}