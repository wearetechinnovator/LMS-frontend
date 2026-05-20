import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FormBuilder() {
  const [formFields, setFormFields] = useState([
    { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe', options: [] },
    { id: 2, type: 'phone', label: 'Phone Number', required: true, placeholder: '(555) 000-0000', options: [] },
    { id: 3, type: 'date', label: 'Date Selection', required: false, placeholder: 'Select Date', options: [] },
    { id: 4, type: 'date', label: 'Preferred Appointment Date', required: false, placeholder: 'MM/DD/YYYY', options: [] }
  ])
  const [selectedFieldId, setSelectedFieldId] = useState(1)
  const [formTitle, setFormTitle] = useState('Doctor Appointment Inquiry')
  const [formDescription, setFormDescription] = useState('Please fill out the form below to request an appointment. Our staff will contact you shortly to confirm.')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [newOptionValue, setNewOptionValue] = useState('')

  const fieldLibrary = [
    { type: 'text', label: 'Text Input', icon: 'text_fields' },
    { type: 'email', label: 'Email', icon: 'mail' },
    { type: 'phone', label: 'Phone', icon: 'phone' },
    { type: 'date', label: 'Date Picker', icon: 'calendar_today' },
    { type: 'select', label: 'Dropdown', icon: 'unfold_more' },
    { type: 'textarea', label: 'Text Area', icon: 'description' },
    { type: 'checkbox', label: 'Checkbox', icon: 'check_box' },
    { type: 'radio', label: 'Radio', icon: 'radio_button_checked' },
    { type: 'custom', label: 'Custom Field', icon: 'grid_on' }
  ]

  const selectedField = formFields.find(f => f.id === selectedFieldId)

  const addField = (type) => {
    const newId = Math.max(...formFields.map(f => f.id), 0) + 1
    const newField = {
      id: newId,
      type: type,
      label: `New ${type === 'text' ? 'Field' : type}`,
      required: false,
      placeholder: ''
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
      setSelectedFieldId(formFields[0]?.id)
    }
  }

  const duplicateField = (id) => {
    const field = formFields.find(f => f.id === id)
    const newId = Math.max(...formFields.map(f => f.id), 0) + 1
    const newField = { ...field, id: newId, label: `${field.label} (Copy)` }
    setFormFields([...formFields, newField])
  }

  const moveFieldUp = (id) => {
    const index = formFields.findIndex(f => f.id === id)
    if (index > 0) {
      const newFields = [...formFields]
      ;[newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]]
      setFormFields(newFields)
    }
  }

  const moveFieldDown = (id) => {
    const index = formFields.findIndex(f => f.id === id)
    if (index < formFields.length - 1) {
      const newFields = [...formFields]
      ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
      setFormFields(newFields)
    }
  }

  const addOption = (fieldId) => {
    if (newOptionValue.trim()) {
      setFormFields(formFields.map(f => 
        f.id === fieldId 
          ? { ...f, options: [...(f.options || []), { id: Date.now(), value: newOptionValue }] }
          : f
      ))
      setNewOptionValue('')
    }
  }

  const removeOption = (fieldId, optionId) => {
    setFormFields(formFields.map(f =>
      f.id === fieldId
        ? { ...f, options: f.options.filter(opt => opt.id !== optionId) }
        : f
    ))
  }

  return (
    <div className="w-full h-full flex gap-0 bg-background">
      {/* Left Sidebar - Field Library */}
      <motion.div
        className="w-64 bg-surface border-r border-outline-variant flex flex-col overflow-hidden"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-3 border-b border-outline-variant bg-surface-container">
          <h2 className="font-headline-md text-headline-md text-on-background text-[14px]">Field Library</h2>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-outline-variant">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search fields..."
              className="w-full pl-10 pr-3 h-8 bg-surface-container-lowest border border-outline-variant rounded text-[12px] placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Fields Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Standard Fields */}
          <div className="border-b border-outline-variant/50">
            <div className="px-3 py-2 bg-surface-container/50 sticky top-0 z-10">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">STANDARD FIELDS</h3>
            </div>
            <div className="p-2 space-y-1">
              {fieldLibrary.slice(0, 5).map((field) => (
                <motion.button
                  key={field.type}
                  onClick={() => addField(field.type)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 text-on-surface text-[12px] transition-all cursor-grab active:cursor-grabbing group"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  draggable
                >
                  <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">{field.icon}</span>
                  <span className="font-medium">{field.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Advanced Fields */}
          <div className="border-b border-outline-variant/50">
            <div className="px-3 py-2 bg-surface-container/50 sticky top-0 z-10">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">ADVANCED</h3>
            </div>
            <div className="p-2 space-y-1">
              {fieldLibrary.slice(5).map((field) => (
                <motion.button
                  key={field.type}
                  onClick={() => addField(field.type)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded bg-surface-container/50 border border-outline-variant hover:bg-surface-container hover:border-outline text-on-surface text-[12px] transition-all cursor-grab active:cursor-grabbing group"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  draggable
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-on-surface transition-colors">{field.icon}</span>
                  <span className="font-medium">{field.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Security & Custom Section */}
          <div>
            <div className="px-3 py-2 bg-surface-container/50 sticky top-0 z-10">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">SECURITY & CUSTOM</h3>
            </div>
            <div className="p-2 space-y-1">
              {[
                { type: 'captcha', label: 'CAPTCHA', icon: 'verified_user' },
                { type: 'custom_button', label: 'Custom Button', icon: 'smart_button' }
              ].map((field) => (
                <motion.button
                  key={field.type}
                  onClick={() => addField(field.type)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded bg-warning/5 border border-warning/20 hover:bg-warning/10 hover:border-warning/40 text-on-surface text-[12px] transition-all cursor-grab active:cursor-grabbing group"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="material-symbols-outlined text-[18px] text-warning group-hover:scale-110 transition-transform">{field.icon}</span>
                  <span className="font-medium">{field.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-2 border-t border-outline-variant bg-surface-container/30 text-center">
          <p className="text-[10px] text-on-surface-variant">Click to add • Drag to reorder</p>
        </div>
      </motion.div>

      {/* Center - Form Builder */}
      <motion.div
        className="flex-1 flex flex-col overflow-hidden bg-surface-container-lowest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Top Bar */}
        <div className="p-3 border-b border-outline-variant bg-surface flex justify-between items-center">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-background text-[13px]">Status: Draft</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowPreview(true)}
              className="px-3 h-8 border border-outline-variant rounded text-on-surface text-[12px] font-semibold hover:bg-surface-container transition-colors"
            >
              Preview
            </button>
            <button className="px-3 h-8 bg-primary hover:bg-primary/90 rounded text-on-primary text-[12px] font-semibold transition-colors">
              Publish Form
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Form Title & Description */}
            <div className="mb-6 bg-surface rounded p-4 border border-outline-variant">
              {isEditingTitle ? (
                <div className="mb-3">
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                    autoFocus
                    className="w-full text-[24px] font-bold text-on-background bg-surface-container-lowest border border-primary rounded px-3 py-2 focus:outline-none"
                  />
                </div>
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="font-headline-lg text-headline-lg text-on-background mb-2 cursor-pointer hover:text-primary transition-colors text-[20px]"
                >
                  {formTitle}
                </h1>
              )}
              
              {isEditingDescription ? (
                <div>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    onBlur={() => setIsEditingDescription(false)}
                    onKeyDown={(e) => e.key === 'Escape' && setIsEditingDescription(false)}
                    autoFocus
                    className="w-full px-3 py-2 text-[12px] text-on-surface-variant bg-surface-container-lowest border border-primary rounded focus:outline-none resize-none"
                    rows="3"
                  />
                </div>
              ) : (
                <p
                  onClick={() => setIsEditingDescription(true)}
                  className="text-body-md text-on-surface-variant text-[12px] cursor-pointer hover:text-on-surface transition-colors"
                >
                  {formDescription}
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              {formFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  className={`p-3 border-2 rounded transition-all cursor-pointer ${
                    selectedFieldId === field.id
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant hover:border-outline bg-surface'
                  }`}
                  onClick={() => setSelectedFieldId(field.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Field Label */}
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-body-md font-body-md text-on-background text-[12px]">
                      {field.label} {field.required && <span className="text-error">*</span>}
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveFieldUp(field.id)
                        }}
                        className="p-1 hover:bg-surface-container rounded transition-colors"
                        title="Move up"
                      >
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_upward</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          moveFieldDown(field.id)
                        }}
                        className="p-1 hover:bg-surface-container rounded transition-colors"
                        title="Move down"
                      >
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_downward</span>
                      </button>
                    </div>
                  </div>

                  {/* Field Preview */}
                  <div className="mb-2">
                    {field.type === 'text' && (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        disabled
                        className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface-variant placeholder:text-on-surface-variant/50"
                      />
                    )}
                    {field.type === 'email' && (
                      <input
                        type="email"
                        placeholder={field.placeholder}
                        disabled
                        className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface-variant placeholder:text-on-surface-variant/50"
                      />
                    )}
                    {field.type === 'phone' && (
                      <input
                        type="tel"
                        placeholder={field.placeholder}
                        disabled
                        className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface-variant placeholder:text-on-surface-variant/50"
                      />
                    )}
                    {field.type === 'date' && (
                      <input
                        type="date"
                        disabled
                        className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface-variant"
                      />
                    )}
                    {field.type === 'textarea' && (
                      <textarea
                        placeholder={field.placeholder}
                        disabled
                        className="w-full px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface-variant placeholder:text-on-surface-variant/50 resize-none"
                        rows="3"
                      />
                    )}
                    {field.type === 'select' && (
                      <select disabled className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface-variant">
                        <option>Select option</option>
                        {field.options?.map(opt => <option key={opt.id}>{opt.value}</option>)}
                      </select>
                    )}
                    {field.type === 'checkbox' && (
                      <div className="space-y-2">
                        {field.options && field.options.length > 0 ? (
                          field.options.map(opt => (
                            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" disabled className="w-4 h-4 rounded" />
                              <span className="text-[12px] text-on-surface">{opt.value}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-[11px] text-on-surface-variant italic">No options added yet</p>
                        )}
                      </div>
                    )}
                    {field.type === 'radio' && (
                      <div className="space-y-2">
                        {field.options && field.options.length > 0 ? (
                          field.options.map(opt => (
                            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" disabled className="w-4 h-4" />
                              <span className="text-[12px] text-on-surface">{opt.value}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-[11px] text-on-surface-variant italic">No options added yet</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Field Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateField(field.id)
                      }}
                      className="px-2 py-1 text-[11px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors"
                      title="Duplicate"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteField(field.id)
                      }}
                      className="px-2 py-1 text-[11px] text-error hover:bg-error/10 rounded transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Drag & Drop Area */}
              <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 text-center flex flex-col items-center justify-center min-h-32 hover:bg-surface-container/50 transition-colors">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30 mb-2">add_circle</span>
                <p className="text-body-md text-on-surface-variant text-[12px]">Drag and drop fields here</p>
              </div>
            </div>

            {/* Submit Button Preview */}
            <div className="mt-4">
              <button className="w-full px-4 h-8 bg-primary hover:bg-primary/90 rounded text-on-primary font-semibold text-[12px] transition-colors">
                Submit Request
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Sidebar - Field Settings */}
      <motion.div
        className="w-72 bg-surface border-l border-outline-variant flex flex-col overflow-hidden"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {selectedField ? (
          <>
            {/* Header */}
            <div className="p-3 border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-on-background text-[14px]">
                <span className="material-symbols-outlined text-[16px] align-middle mr-2">{selectedField.type === 'phone' ? 'phone' : 'text_fields'}</span>
                {selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)} Input
              </h3>
            </div>

            {/* Settings */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Field Label */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 text-[10px]">Field Label</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Placeholder */}
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 text-[10px]">Placeholder Text</label>
                <input
                  type="text"
                  value={selectedField.placeholder}
                  onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                  placeholder="WM use this to tell you remember"
                  className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Validation */}
              <div className="border-t border-outline-variant pt-3">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2 text-[10px]">Validation</h4>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={selectedField.required}
                    onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-body-md text-on-surface text-[12px]">Required Field</span>
                </label>
              </div>

              {/* Advanced */}
              <div className="border-t border-outline-variant pt-3">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2 text-[10px]">Advanced</h4>
                <div>
                  <label className="block font-body-md text-on-surface-variant text-[11px] mb-1">Custom ID</label>
                  <input
                    type="text"
                    placeholder="e.g., phone_input_01"
                    className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="mt-2">
                  <label className="block font-body-md text-on-surface-variant text-[11px] mb-1">CSS Classes</label>
                  <input
                    type="text"
                    placeholder="e.g., custom input d-4"
                    className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Options Management - For Select, Radio, Checkbox */}
              {['select', 'radio', 'checkbox'].includes(selectedField.type) && (
                <div className="border-t border-outline-variant pt-3">
                  <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2 text-[10px]">Options</h4>
                  
                  {/* Existing Options */}
                  <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
                    {selectedField.options && selectedField.options.map(option => (
                      <div key={option.id} className="flex items-center justify-between gap-2 p-2 bg-surface-container rounded text-[11px]">
                        <span className="text-on-surface truncate">{option.value}</span>
                        <button
                          onClick={() => removeOption(selectedField.id, option.id)}
                          className="p-0.5 hover:bg-error/10 rounded transition-colors text-error"
                          title="Delete option"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Option */}
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addOption(selectedField.id)}
                      placeholder="Add option..."
                      className="flex-1 px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={() => addOption(selectedField.id)}
                      className="px-2 h-8 bg-primary hover:bg-primary/90 rounded text-on-primary text-[11px] font-semibold transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <div className="p-3 border-t border-outline-variant">
              <button
                onClick={() => deleteField(selectedField.id)}
                className="w-full px-4 h-8 border border-error text-error rounded text-[12px] font-semibold hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px] align-middle mr-1">delete</span>
                Delete Field
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-on-surface-variant">
            <p className="text-[12px]">Select a field to configure</p>
          </div>
        )}
      </motion.div>

      {/* Form Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="bg-surface rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Header */}
              <div className="sticky top-0 p-3 border-b border-outline-variant bg-surface flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md text-on-background text-[14px]">Form Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-surface-container rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
                </button>
              </div>

              {/* Preview Content */}
              <div className="p-4">
                <div className="mb-4">
                  <h2 className="font-headline-lg text-headline-lg text-on-background mb-2 text-[20px]">{formTitle}</h2>
                  <p className="text-body-md text-on-surface-variant text-[12px]">{formDescription}</p>
                </div>

                {/* Form Fields Preview */}
                <div className="space-y-3">
                  {formFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-body-md font-body-md text-on-background text-[12px] mb-2">
                        {field.label} {field.required && <span className="text-error">*</span>}
                      </label>

                      {field.type === 'text' && (
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      )}
                      {field.type === 'email' && (
                        <input
                          type="email"
                          placeholder={field.placeholder}
                          className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      )}
                      {field.type === 'phone' && (
                        <input
                          type="tel"
                          placeholder={field.placeholder}
                          className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      )}
                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                          rows="3"
                        />
                      )}
                      {field.type === 'select' && (
                        <select className="w-full px-3 h-8 border border-outline-variant rounded bg-surface-container-lowest text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                          <option>Select option</option>
                          {field.options?.map(opt => <option key={opt.id}>{opt.value}</option>)}
                        </select>
                      )}
                      {field.type === 'checkbox' && (
                        <div className="space-y-2">
                          {field.options?.map(opt => (
                            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                              <span className="text-[12px] text-on-surface">{opt.value}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {field.type === 'radio' && (
                        <div className="space-y-2">
                          {field.options?.map(opt => (
                            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" className="w-4 h-4 accent-primary" />
                              <span className="text-[12px] text-on-surface">{opt.value}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <button className="w-full mt-4 px-4 h-8 bg-primary hover:bg-primary/90 rounded text-on-primary font-semibold text-[12px] transition-colors">
                  Submit Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

