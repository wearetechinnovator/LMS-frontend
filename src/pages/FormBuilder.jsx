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
    { type: 'select', label: 'Gender', icon: 'person' },
    { type: 'text', label: 'City', icon: 'location_city' },
    { type: 'text', label: 'State', icon: 'apps' }
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
      helperText: ''
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
    <div className="w-full h-screen flex bg-[#f4f7fb] text-slate-800 font-sans overflow-hidden">
      
      <div className="w-[260px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-sm">Field Library</h2>
          <span className="material-symbols-outlined text-slate-500 text-[18px] cursor-pointer hover:text-slate-700">search</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Standard Fields</h3>
            <div className="space-y-2">
              {standardFields.map(field => (
                <button
                  key={field.label}
                  onClick={() => addField(field.type)}
                  className="w-full flex items-center gap-3 p-2 bg-white border border-slate-200 rounded shadow-sm hover:border-[#4c84db] transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-300 text-[16px]">drag_indicator</span>
                  <span className="material-symbols-outlined text-[#0053db] text-[16px]">{field.icon}</span>
                  <span className="text-[13px] text-slate-700 font-semibold">{field.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Advanced</h3>
            <div className="space-y-2">
              {advancedFields.map(field => (
                <button
                  key={field.label}
                  onClick={() => addField(field.type)}
                  className="w-full flex items-center gap-3 p-2 bg-white border border-slate-200 rounded shadow-sm hover:border-[#4c84db] transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-300 text-[16px]">drag_indicator</span>
                  <span className="material-symbols-outlined text-orange-500 text-[16px]">{field.icon}</span>
                  <span className="text-[13px] text-slate-700 font-semibold">{field.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Security & Custom</h3>
            <div className="space-y-2">
              {securityFields.map(field => (
                <button
                  key={field.label}
                  onClick={() => addField(field.type)}
                  className="w-full flex items-center gap-3 p-2 bg-white border border-slate-200 rounded shadow-sm hover:border-[#4c84db] transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-300 text-[16px]">drag_indicator</span>
                  <span className="material-symbols-outlined text-[#0053db] text-[16px]">{field.icon}</span>
                  <span className="text-[13px] text-slate-700 font-semibold">{field.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center overflow-y-auto px-8 py-8">
        <div className="w-full max-w-[800px]">
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-[#0053db] font-bold text-xs">Status: Draft</span>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="w-full text-2xl font-bold text-slate-900 border border-slate-300 rounded px-2 py-1 mt-1 focus:outline-none focus:border-[#4c84db]"
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="text-2xl font-bold text-slate-900 mt-1 cursor-pointer"
                >
                  {formTitle}
                </h1>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPreview(true)}
                className="px-6 py-2 border border-slate-300 rounded font-bold text-sm text-slate-800 bg-white shadow-sm hover:bg-slate-50 transition-colors"
              >
                Preview
              </button>
              <button className="px-6 py-2 bg-[#0053db] hover:bg-[#004ac6] text-white rounded font-bold text-sm shadow-sm transition-colors">
                Publish Form
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded flex flex-col">
            
            <div className="p-8 border-b border-slate-200">
              {isEditingDescription ? (
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  onBlur={() => setIsEditingDescription(false)}
                  autoFocus
                  className="w-full text-sm text-slate-600 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-[#4c84db] resize-none"
                  rows="2"
                />
              ) : (
                <p
                  onClick={() => setIsEditingDescription(true)}
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  {formDescription}
                </p>
              )}
            </div>

            <div className="p-8 space-y-2">
              {formFields.map((field) => {
                const isSelected = selectedFieldId === field.id
                return (
                  <div
                    key={field.id}
                    onClick={() => setSelectedFieldId(field.id)}
                    className={`relative rounded border-2 transition-all cursor-pointer p-4 ${
                      isSelected
                        ? 'border-[#4c84db] bg-[#f4f8ff]'
                        : 'border-transparent hover:border-slate-200 bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex bg-white border border-slate-200 rounded shadow-sm z-10">
                        <button className="p-1.5 text-[#0053db] hover:bg-slate-50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[16px]">settings</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                          className="p-1.5 text-slate-600 hover:bg-slate-50 border-l border-slate-200 flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    )}

                    <div className="relative">
                      <label className="flex items-center text-[13px] font-bold text-slate-900 mb-2">
                        {isSelected && (
                          <span className="material-symbols-outlined text-[#4c84db] text-[18px] absolute -left-6 top-1/2 -translate-y-1/2">drag_indicator</span>
                        )}
                        {field.label} {field.required && <span className="text-red-600 ml-1">*</span>}
                      </label>

                      <div className="relative">
                        <input
                          type={field.type === 'phone' ? 'tel' : 'text'}
                          placeholder={field.placeholder}
                          disabled
                          className="w-full h-10 px-3 border border-slate-300 rounded bg-white text-[13px] text-slate-700 placeholder:text-slate-400"
                        />
                        {field.type === 'date' && (
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">calendar_today</span>
                        )}
                      </div>

                      {field.helperText && (
                        <p className="text-[12px] text-slate-600 mt-2">{field.helperText}</p>
                      )}
                    </div>
                  </div>
                )
              })}

              <div className="mt-8 border-2 border-dashed border-slate-300 rounded p-10 flex flex-col items-center justify-center text-slate-600 bg-slate-50/50">
                <span className="material-symbols-outlined text-[28px] mb-2 text-slate-400">add_circle</span>
                <span className="text-sm font-semibold">Drag and drop fields here</span>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 flex justify-end">
              <button className="px-6 py-2 bg-[#6b99de] text-white rounded font-bold text-sm shadow-sm">
                Submit Request
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="w-[300px] bg-[#f9fafb] border-l border-slate-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-bold text-slate-900 text-sm">Field Settings</h2>
        </div>

        {selectedField ? (
          <div className="flex-1 overflow-y-auto">
            
            <div className="p-4 bg-[#eff4ff] border-b border-[#dce5fc] flex items-center gap-2 text-[#0053db] font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">
                {selectedField.type === 'phone' ? 'phone' : selectedField.type === 'date' ? 'calendar_today' : 'text_fields'}
              </span>
              {selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)} Input
            </div>

            <div className="p-5 space-y-6">
              
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-2">Field Label</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-[13px] text-slate-700 bg-white focus:outline-none focus:border-[#0053db]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-2">Placeholder Text</label>
                <input
                  type="text"
                  value={selectedField.placeholder}
                  onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-[13px] text-slate-700 bg-white focus:outline-none focus:border-[#0053db]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-2">Helper Text</label>
                <input
                  type="text"
                  value={selectedField.helperText || ''}
                  onChange={(e) => updateField(selectedField.id, { helperText: e.target.value })}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-[13px] text-slate-700 bg-white focus:outline-none focus:border-[#0053db]"
                />
              </div>

              <hr className="border-slate-200" />

              <div>
                <h4 className="text-[13px] font-bold text-slate-900 mb-4">Validation</h4>
                <label className="block text-[12px] font-medium text-slate-700 mb-5">Required Field</label>

                <label className="block text-[11px] font-bold text-slate-800 mb-2">Format</label>
                <div className="relative">
                  <select className="w-full h-8 px-2 border border-slate-300 rounded text-[12px] text-slate-700 bg-white appearance-none focus:outline-none focus:border-[#0053db]">
                    <option>US Phone (XXX) XXX-XXXX</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] pointer-events-none">expand_more</span>
                </div>
              </div>

              <hr className="border-slate-200" />

              <div>
                <h4 className="text-[13px] font-bold text-slate-900 mb-4">Advanced</h4>
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-slate-800 mb-2">Custom ID</label>
                  <input
                    type="text"
                    placeholder="e.g., phone_input_01"
                    className="w-full h-8 px-2 border border-slate-300 rounded text-[12px] text-slate-700 bg-white focus:outline-none focus:border-[#0053db]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 mb-2">CSS Classes</label>
                  <input
                    type="text"
                    placeholder="e.g., custom-style p-4"
                    className="w-full h-8 px-2 border border-slate-300 rounded text-[12px] text-slate-700 bg-white focus:outline-none focus:border-[#0053db]"
                  />
                </div>
              </div>

              <button
                onClick={() => deleteField(selectedField.id)}
                className="w-full py-2 border border-red-500 text-red-600 font-bold text-sm rounded bg-white hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Delete Field
              </button>

            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            Select a field to configure
          </div>
        )}
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="bg-white rounded shadow-2xl max-w-[800px] w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 p-4 border-b border-slate-200 bg-white flex justify-between items-center z-10">
                <h3 className="font-bold text-slate-900 text-[16px]">Form Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-500"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-8">
                <div className="mb-6 border-b border-slate-200 pb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{formTitle}</h2>
                  <p className="text-sm text-slate-600">{formDescription}</p>
                </div>

                <div className="space-y-6">
                  {formFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-[13px] font-bold text-slate-900 mb-2">
                        {field.label} {field.required && <span className="text-red-600 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={field.type === 'phone' ? 'tel' : 'text'}
                          placeholder={field.placeholder}
                          className="w-full h-10 px-3 border border-slate-300 rounded bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0053db]"
                        />
                        {field.type === 'date' && (
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">calendar_today</span>
                        )}
                      </div>
                      {field.helperText && (
                        <p className="text-[12px] text-slate-600 mt-2">{field.helperText}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-8 border-t border-slate-100 pt-8">
                  <button className="px-6 py-2 bg-[#6b99de] text-white rounded font-bold text-sm shadow-sm">
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