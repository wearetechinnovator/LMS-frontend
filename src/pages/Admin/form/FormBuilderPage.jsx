import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormBuilder from './FormBuilder'
import FormBuilderHeader from '../../../components/FormbuilderPage/FormBuilderHeader'
import Toast from '../../../components/Toast'
import './form.css'

export default function FormBuilderPage() {
  const [activeFormSchema, setActiveFormSchema] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [toastMessage, setToastMessage] = useState('')
  const [hoveredForm, setHoveredForm] = useState(null)
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 })
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [activePreviewTemplate, setActivePreviewTemplate] = useState(null)
  const [publishedForm, setPublishedForm] = useState(null)
  const hideTimer = useRef(null)

  const showPreview = (form, e) => {
    clearTimeout(hideTimer.current)
    const rect = e.currentTarget.getBoundingClientRect()
    setPreviewPos({ x: rect.right + 12, y: rect.top })
    setHoveredForm(form)
  }

  const hidePreview = () => {
    hideTimer.current = setTimeout(() => setHoveredForm(null), 150)
  }

  const keepPreview = () => {
    clearTimeout(hideTimer.current)
  }

  const triggerToast = (msg) => {
    setToastMessage(msg)
  }

  // Detailed mock forms data structures matching the uploaded screenshot as fallback
  const [formsList, setFormsList] = useState([])

  // Fetch forms from database on mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token || token === 'mock-jwt-token') return;
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/form/get-form`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormsList(data);
        }
      } catch (err) {
        console.error("Failed to load forms from backend:", err);
      }
    };
    fetchForms();
  }, []);

  // Filter forms based on search query and status option selection
  const filteredForms = formsList.filter(form => {
    const nameStr = form.name || '';
    const creatorStr = form.createdBy || '';
    const matchesSearch = nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creatorStr.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Set up action to open fresh blank form builder
  const handleCreateNewForm = () => {
    setActiveFormSchema({
      id: `FRM-${Math.floor(1000 + Math.random() * 9000)}-N`,
      title: 'New Lead Capture Form',
      description: 'Please fill out the form fields below. The sales team will be notified upon submission.',
      status: 'Draft',
      fields: [
        { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe', helperText: '', options: [] },
        { id: 2, type: 'email', label: 'Email Address', required: true, placeholder: 'john@example.com', helperText: '', options: [] }
      ]
    })
  }

  // Handle template selection & clone to launch builder
  const handleSelectTemplate = (template) => {
    setActiveFormSchema({
      id: `FRM-${Math.floor(1000 + Math.random() * 9000)}-N`,
      title: `${template.name} (Copy)`,
      description: template.description,
      status: 'Draft',
      fields: template.fields.map((field, idx) => ({
        ...field,
        id: idx + 1
      }))
    })
    setShowTemplateModal(false)
  }

  // Duplicate form
  const handleDuplicateForm = async (form) => {
    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/form/create-form`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: `${form.name} (Copy)`,
            description: form.description,
            fields: form.fields,
            status: 'DRAFT'
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to duplicate form');
        }
        const saved = await response.json();
        setFormsList(prev => [saved, ...prev]);
        triggerToast(`Form "${form.name}" duplicated successfully!`);
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
      }
    } else {
      const duplicated = {
        ...form,
        id: `FRM-${Math.floor(1000 + Math.random() * 9000)}-D`,
        name: `${form.name} (Copy)`,
        status: 'DRAFT',
        responses: 0,
        conversionRate: '0%',
        createdBy: 'System Admin',
        createdDate: 'Just now'
      }
      setFormsList([duplicated, ...formsList])
      triggerToast(`Form "${form.name}" duplicated successfully!`)
    }
  }

  // Save edited or created form
  const handleSaveForm = async (updatedData) => {
    const token = localStorage.getItem('authToken');
    const isExisting = activeFormSchema.id && formsList.some(form => form.id === activeFormSchema.id);
    const hasNetworkToken = token && token !== 'mock-jwt-token';
    const isRealDatabaseId = isExisting && !String(activeFormSchema.id).startsWith('FRM-') && !String(activeFormSchema.id).startsWith('TMP-');

    if (hasNetworkToken) {
      if (isRealDatabaseId) {
        // Edit existing form
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/form/edit-form/${activeFormSchema.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: updatedData.title,
              description: updatedData.description,
              fields: updatedData.fields,
              status: updatedData.status
            })
          });
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Failed to save form');
          }
          const saved = await response.json();
          setFormsList(prev => prev.map(form => form.id === activeFormSchema.id ? saved : form));
          triggerToast(`Form "${updatedData.title}" saved successfully!`);
        } catch (err) {
          triggerToast(`Error: ${err.message}`);
          return;
        }
      } else {
        // Create new form
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/form/create-form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: updatedData.title,
              description: updatedData.description,
              fields: updatedData.fields,
              status: updatedData.status
            })
          });
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Failed to create form');
          }
          const saved = await response.json();
          setFormsList(prev => [saved, ...prev]);
          triggerToast(`New form "${updatedData.title}" created successfully!`);
        } catch (err) {
          triggerToast(`Error: ${err.message}`);
          return;
        }
      }
    } else {
      // Local mock fallback
      if (isExisting) {
        setFormsList(prev => prev.map(form => {
          if (form.id === activeFormSchema.id) {
            return {
              ...form,
              name: updatedData.title,
              description: updatedData.description,
              fields: updatedData.fields,
              status: updatedData.status
            }
          }
          return form
        }))
        triggerToast(`Form "${updatedData.title}" saved successfully!`)
      } else {
        const newForm = {
          id: activeFormSchema.id || `FRM-${Math.floor(1000 + Math.random() * 9000)}-N`,
          name: updatedData.title,
          description: updatedData.description,
          fields: updatedData.fields,
          status: updatedData.status,
          responses: 0,
          conversionRate: '0%',
          createdBy: 'System Admin',
          createdDate: 'Just now'
        }
        setFormsList([newForm, ...formsList])
        triggerToast(`New form "${updatedData.title}" created successfully!`)
      }
    }

    setActiveFormSchema(null)
  }

  // Save form as template
  const handleSaveAsTemplate = async (updatedData) => {
    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/form/create-form`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: updatedData.title,
            description: updatedData.description,
            fields: updatedData.fields,
            status: 'TEMPLATE'
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to save template');
        }
        const saved = await response.json();
        setFormsList(prev => [saved, ...prev]);
        triggerToast(`Form saved as template successfully!`);
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
      }
    } else {
      const templateForm = {
        id: `TMP-${Math.floor(1000 + Math.random() * 9000)}-T`,
        name: `${updatedData.title} (Template)`,
        description: updatedData.description,
        fields: updatedData.fields,
        status: 'TEMPLATE',
        responses: null,
        conversionRate: null,
        createdBy: 'System Admin',
        createdDate: 'Just now'
      }
      setFormsList([templateForm, ...formsList])
      triggerToast(`Form saved as template successfully!`)
    }
    setActiveFormSchema(null)
  }

  return (
    <div className="p-6 h-full flex flex-col font-sans select-none overflow-y-auto">
      <AnimatePresence mode="wait">
        {!activeFormSchema ? (
          /* FORM MANAGEMENT LIST DASHBOARD VIEW */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full space-y-5"
          >
            <FormBuilderHeader
              handleCreateFromScratch={handleCreateNewForm}
              handleOpenTemplateModal={() => {
                const templates = formsList.filter(f => f.status === 'TEMPLATE')
                setActivePreviewTemplate(templates[0] || null)
                setShowTemplateModal(true)
              }}
              triggerToast={triggerToast}
            />

            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 flex-1 max-w-lg">
                {/* Search Bar Input */}
                <div className="relative flex-1">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search forms by name or creator..."
                    className="w-full h-8 pl-9 pr-3 border border-outline-variant rounded bg-surface text-[12px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Filter Trigger Dropdown */}
                <div className="flex items-center gap-1 px-3 h-8 border border-outline-variant rounded bg-surface cursor-pointer text-[12px] text-slate-700 hover:bg-slate-50 transition-colors select-none">
                  <span className="material-symbols-outlined text-[16px] text-slate-500">filter_alt</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent border-none outline-none text-[12px] cursor-pointer"
                  >
                    <option value="all">Filter: All</option>
                    <option value="PUBLISHED">Published Only</option>
                    <option value="DRAFT">Drafts Only</option>
                  </select>
                </div>
              </div>

              {/* Total Forms Stat Counter */}
              <div className="text-[11px] font-bold text-slate-500 tracking-wider">
                TOTAL FORMS: <span className="text-slate-800 text-[13px]">{formsList.length}</span>
              </div>
            </div>

            {/* Forms Data Table */}
            <div className="bg-surface rounded-lg border border-outline-variant overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container/60">
                    <th className="px-5 py-1 text-slate-500 text-[11px] font-bold tracking-wider">Form Name</th>
                    <th className="px-5 py-1 text-slate-500 text-[11px] font-bold tracking-wider">Status</th>
                    <th className="px-5 py-1 text-slate-500 text-[11px] font-bold tracking-wider text-right">Responses (Leads)</th>
                    <th className="px-5 py-1 text-slate-500 text-[11px] font-bold tracking-wider text-right">Conversion Rate</th>
                    <th className="px-5 py-1 text-slate-500 text-[11px] font-bold tracking-wider">Created By</th>
                    <th className="px-5 py-1 text-slate-500 text-[11px] font-bold tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForms.map((form) => (
                    <tr
                      key={form.id}
                      className="border-b border-outline-variant hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Name & ID Cell with hover preview */}
                      <td className="px-5 py-1 text-left relative">
                        <button
                          onClick={() => setActiveFormSchema(form)}
                          onMouseEnter={(e) => showPreview(form, e)}
                          onMouseLeave={hidePreview}
                          className="font-bold text-[12.5px] text-slate-800 hover:text-primary hover:underline transition-colors text-left cursor-pointer"
                        >
                          {form.name}
                        </button>
                        <p className="text-[10px] text-slate-400 font-mono mt-0">ID: {form.id}</p>
                      </td>

                      {/* Status Badges */}
                      <td className="px-5 py-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${form.status === 'PUBLISHED'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : form.status === 'TEMPLATE'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                        >
                          {form.status}
                        </span>
                      </td>

                      {/* Lead Responses Count */}
                      <td className="px-5 py-1 text-right font-mono text-[12px] text-slate-700 font-medium">
                        {form.responses !== null ? form.responses.toLocaleString() : '--'}
                      </td>

                      {/* Conversion Performance */}
                      <td className="px-5 py-1 text-right font-mono text-[12px] text-slate-700 font-medium">
                        {form.conversionRate || '--'}
                      </td>

                      {/* Author Details & Created Time */}
                      <td className="px-5 py-1 text-left">
                        <span className="font-semibold text-[11.5px] text-slate-700">{form.createdBy}</span>
                        <p className="text-[10px] text-slate-400 mt-0">{form.createdDate}</p>
                      </td>

                      {/* Action Triggers */}
                      <td className="px-5 py-1 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setActiveFormSchema(form)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-primary transition-colors cursor-pointer"
                            title="Edit Form Layout"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDuplicateForm(form)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="Duplicate Form"
                          >
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredForms.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-on-surface-variant text-[12px] italic">
                        No forms found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          /* FORM BUILDER DETAIL WORKSPACE VIEW */
          <motion.div
            key="builder"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col"
          >
            {/* Prefilled Form Builder component mapping approved fields states */}
            <FormBuilder
              initialTitle={activeFormSchema.name || activeFormSchema.title}
              initialDescription={activeFormSchema.description}
              initialFields={activeFormSchema.fields}
              initialStatus={activeFormSchema.status ? (activeFormSchema.status.charAt(0).toUpperCase() + activeFormSchema.status.slice(1).toLowerCase()) : 'Draft'}
              initialId={activeFormSchema.id || 'new'}
              onBack={() => setActiveFormSchema(null)}
              onSave={handleSaveForm}
              onSaveAsTemplate={handleSaveAsTemplate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Form Preview on Hover */}
      <AnimatePresence>
        {hoveredForm && (
          <motion.div
            key={hoveredForm.id}
            initial={{ opacity: 0, scale: 0.95, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -8 }}
            transition={{ duration: 0.15 }}
            style={{ top: previewPos.y, left: previewPos.x }}
            className="fixed z-50 w-[280px] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
            onMouseEnter={keepPreview}
            onMouseLeave={hidePreview}
          >
            {/* Preview Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary/8 to-primary/4 border-b border-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-800 leading-snug truncate">{hoveredForm.name}</p>
                  <p className="text-[9px] font-mono text-slate-400 mt-0.5">{hoveredForm.id}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold border mt-0.5 ${hoveredForm.status === 'PUBLISHED'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                  {hoveredForm.status}
                </span>
              </div>
              {hoveredForm.description && (
                <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{hoveredForm.description}</p>
              )}
            </div>

            {/* Fields List */}
            <div className="px-4 py-3">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Fields ({hoveredForm.fields?.length || 0})
              </p>
              <div className="space-y-1.5">
                {hoveredForm.fields?.slice(0, 5).map((field, idx) => (
                  <div key={field.id || idx} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[13px] text-primary/70 shrink-0">
                      {field.type === 'email' ? 'mail' : field.type === 'phone' ? 'phone' : field.type === 'select' ? 'arrow_drop_down_circle' : field.type === 'radio' ? 'radio_button_checked' : field.type === 'date' ? 'calendar_today' : field.type === 'checkbox' ? 'check_box' : 'text_fields'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-medium text-slate-700 truncate block">{field.label}</span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 shrink-0">{field.type}</span>
                    {field.required && <span className="text-rose-500 text-[10px] shrink-0">*</span>}
                  </div>
                ))}
                {(hoveredForm.fields?.length || 0) > 5 && (
                  <p className="text-[9px] text-slate-400 pt-1">+{hoveredForm.fields.length - 5} more fields…</p>
                )}
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-slate-400">mouse</span>
              <p className="text-[9px] text-slate-400">Click to open in Form Builder</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Selection Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTemplateModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden relative z-10 flex flex-col max-h-[85vh] template-modal-scope"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50 to-white">
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600 text-[22px]">grid_view</span>
                    Create from Template
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Select a pre-configured template blueprint below to start editing. All templates are fully customizable.
                  </p>
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Master-Detail Split Content */}
              <div className="p-6 overflow-hidden flex-1 bg-slate-50/50 flex flex-col md:flex-row gap-5 h-[480px]">
                {/* Left side: templates list */}
                <div className="flex-1 md:w-5/12 overflow-y-auto pr-1 space-y-2 flex flex-col">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Available Blueprints
                  </p>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {formsList.filter(f => f.status === 'TEMPLATE').map(template => {
                      const isActive = activePreviewTemplate?.id === template.id
                      return (
                        <div
                          key={template.id}
                          onMouseEnter={() => setActivePreviewTemplate(template)}
                          onClick={() => handleSelectTemplate(template)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${isActive
                              ? 'border-purple-500 bg-purple-50/70 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50'
                            }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`material-symbols-outlined text-[18px] shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-400'}`}>
                              article
                            </span>
                            <div className="min-w-0">
                              <p className={`text-[11.5px] font-bold truncate ${isActive ? 'text-purple-950 font-bold' : 'text-slate-800'}`}>
                                {template.name}
                              </p>
                              <p className="text-[9px] font-mono text-slate-400 mt-0.5">{template.id}</p>
                            </div>
                          </div>
                          <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded border shrink-0 ${isActive
                              ? 'bg-purple-100/80 text-purple-800 border-purple-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                            {template.fields?.length || 0} fields
                          </span>
                        </div>
                      )
                    })}
                    {formsList.filter(f => f.status === 'TEMPLATE').length === 0 && (
                      <div className="py-8 text-center text-[12px] text-slate-400 italic">
                        No templates found. Save a form as a template to see it here!
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: form details view on hover */}
                <div className="flex-1 md:w-7/12 flex flex-col bg-white border border-slate-200 rounded-xl p-5 shadow-xs overflow-hidden">
                  {activePreviewTemplate ? (
                    <motion.div
                      key={activePreviewTemplate.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col justify-between overflow-hidden flex-1 min-h-0"
                    >
                      <div className="space-y-3.5 overflow-y-auto pr-1 flex-1 min-h-0">
                        {/* Title Block */}
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div>
                            <h4 className="font-bold text-[14px] text-slate-800 leading-snug">
                              {activePreviewTemplate.name}
                            </h4>
                            <p className="text-[9px] font-mono text-slate-400 mt-0.5">Template ID: {activePreviewTemplate.id}</p>
                          </div>
                          <span className="bg-purple-50 text-purple-700 text-[9px] font-bold px-2.5 py-0.5 rounded border border-purple-100 shrink-0">
                            {activePreviewTemplate.fields?.length || 0} fields
                          </span>
                        </div>

                        {/* Description */}
                        {activePreviewTemplate.description && (
                          <div className="space-y-1">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Description</p>
                            <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50">
                              {activePreviewTemplate.description}
                            </p>
                          </div>
                        )}

                        {/* Fields preview lists */}
                        <div className="space-y-1.5 flex-1 min-h-0 flex flex-col">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Fields Outline</p>
                          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3 space-y-2 shrink-0">
                            {activePreviewTemplate.fields?.map((field, idx) => (
                              <div key={field.id || idx} className="flex items-center justify-between border-b border-slate-200/40 pb-1.5 last:border-b-0 last:pb-0 gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="material-symbols-outlined text-[13px] text-purple-600/70 shrink-0">
                                    {field.type === 'email' ? 'mail' : field.type === 'phone' ? 'phone' : field.type === 'select' ? 'arrow_drop_down_circle' : field.type === 'radio' ? 'radio_button_checked' : field.type === 'date' ? 'calendar_today' : field.type === 'checkbox' ? 'check_box' : 'text_fields'}
                                  </span>
                                  <span className="text-[10.5px] font-semibold text-slate-700 truncate">{field.label}</span>
                                  {field.required && <span className="text-rose-500 text-[10px] shrink-0 font-bold">*</span>}
                                </div>
                                <span className="text-[8px] font-mono text-slate-400 bg-white border border-slate-200/80 rounded px-1.5 py-0.5 shrink-0 uppercase tracking-wider">{field.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* CTA block */}
                      <div className="mt-4 pt-3 border-t border-slate-100 shrink-0 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400">Created by: {activePreviewTemplate.createdBy || 'System'}</span>
                          <span className="text-[8px] text-slate-400 mt-0.5">{activePreviewTemplate.createdDate}</span>
                        </div>
                        <button
                          onClick={() => handleSelectTemplate(activePreviewTemplate)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[11.5px] font-bold rounded-lg shadow-sm transition-all duration-150 flex items-center gap-1.5 active:scale-98 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                          Use Template
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <span className="material-symbols-outlined text-[36px]">article</span>
                      <p className="text-[12px] italic">Hover over a template to view details</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 rounded text-slate-600 text-[11.5px] font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/*Toast Banner */}
      <Toast
        message={toastMessage}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  )
}
