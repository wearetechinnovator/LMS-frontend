import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormBuilder from './FormBuilder'

export default function FormBuilderPage() {
  const [activeFormSchema, setActiveFormSchema] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Detailed mock forms data structures matching the uploaded screenshot
  const createdForms = [
    {
      id: 'FRM-8921-A',
      name: 'Q3 Enterprise Webinar Registration',
      status: 'PUBLISHED',
      responses: 1245,
      conversionRate: '24.8%',
      createdBy: 'Sarah Jenkins',
      createdDate: '2 days ago',
      description: 'Register now to reserve your spot for our upcoming Q3 executive webinar series. Learn industry best practices for lead pipeline optimizations.',
      fields: [
        { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe', helperText: '', options: [] },
        { id: 2, type: 'email', label: 'Work Email', required: true, placeholder: 'john.doe@company.com', helperText: '', options: [] },
        { id: 3, type: 'text', label: 'Company Name', required: true, placeholder: 'Acme Corp', helperText: '', options: [] },
        { id: 4, type: 'text', label: 'Job Title', required: false, placeholder: 'Director of Product', helperText: '', options: [] },
        { id: 5, type: 'select', label: 'Company Size', required: true, placeholder: 'Select...', helperText: '', options: ['1-50 employees', '51-200 employees', '201-1000 employees', '1000+ employees'] }
      ]
    },
    {
      id: 'FRM-3320-B',
      name: 'SaaS Demo Request - Main Landing',
      status: 'PUBLISHED',
      responses: 8982,
      conversionRate: '12.1%',
      createdBy: 'System Admin',
      createdDate: '1 month ago',
      description: 'Request a personalized product demo of our LMS and CRM platform. Our solution architects will build a sandbox tailormade for your workflow.',
      fields: [
        { id: 1, type: 'text', label: 'First Name', required: true, placeholder: 'Sarah', helperText: '', options: [] },
        { id: 2, type: 'text', label: 'Last Name', required: true, placeholder: 'Miller', helperText: '', options: [] },
        { id: 3, type: 'email', label: 'Corporate Email', required: true, placeholder: 'sarah.miller@example.com', helperText: '', options: [] },
        { id: 4, type: 'phone', label: 'Phone Number', required: true, placeholder: '+1 (555) 019-2834', helperText: "We'll call you at this number to schedule your demo.", options: [] },
        { id: 5, type: 'radio', label: 'Primary Goal', required: true, placeholder: 'Select...', helperText: '', options: ['Improve Conversion Rate', 'Automate Lead Routing', 'Audit Logging & Compliance', 'Other'] }
      ]
    },
    {
      id: 'FRM-1102-C',
      name: 'Partner Program Application 2024',
      status: 'DRAFT',
      responses: null,
      conversionRate: null,
      createdBy: 'Marcus Chen',
      createdDate: '5 hours ago',
      description: 'Apply to become an official integration partner. Gain exclusive access to beta features, partner commission models, and mutual co-marketing campaigns.',
      fields: [
        { id: 1, type: 'text', label: 'Contact Name', required: true, placeholder: 'Alex Chen', helperText: '', options: [] },
        { id: 2, type: 'email', label: 'Email Address', required: true, placeholder: 'partnerships@alliance.net', helperText: '', options: [] },
        { id: 3, type: 'text', label: 'Website URL', required: true, placeholder: 'https://alliance.net', helperText: '', options: [] },
        { id: 4, type: 'select', label: 'Partner Type', required: true, placeholder: 'Select type...', helperText: '', options: ['System Integrator', 'Technology Partner', 'Affiliate / Agency', 'Strategic Advisor'] },
        { id: 5, type: 'text', label: 'Comments / Notes', required: false, placeholder: 'Describe your integration goals...', helperText: '', options: [] }
      ]
    },
    {
      id: 'FRM-0091-F',
      name: 'Newsletter Signup - Footer',
      status: 'PUBLISHED',
      responses: 45192,
      conversionRate: '3.2%',
      createdBy: 'System Admin',
      createdDate: '6 months ago',
      description: 'Subscribe to our weekly newsletter to get the latest product release notes, tutorials, and success stories delivered straight to your inbox.',
      fields: [
        { id: 1, type: 'email', label: 'Email Address', required: true, placeholder: 'subscriber@domain.com', helperText: '', options: [] },
        { id: 2, type: 'checkbox', label: 'Interests', required: false, placeholder: '', helperText: '', options: ['Product Updates', 'Weekly Tips & Tricks', 'Partner Integrations', 'Case Studies'] }
      ]
    }
  ]

  // Filter forms based on search query and status option selection
  const filteredForms = createdForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Set up action to open fresh blank form builder
  const handleCreateNewForm = () => {
    setActiveFormSchema({
      title: 'New Lead Capture Form',
      description: 'Please fill out the form fields below. The sales team will be notified upon submission.',
      status: 'Draft',
      fields: [
        { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe', helperText: '', options: [] },
        { id: 2, type: 'email', label: 'Email Address', required: true, placeholder: 'john@example.com', helperText: '', options: [] }
      ]
    })
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
            {/* Header: Title Block & Create Action */}
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <div className="text-left">
                <h1 className="text-xl font-bold text-slate-800 leading-tight">Form Management</h1>
                <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">Manage lead capture forms and monitor conversion metrics.</p>
              </div>
              <button
                onClick={handleCreateNewForm}
                className="px-3.5 py-1.5 bg-primary hover:bg-primary/95 text-white rounded text-[12px] font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer select-none"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                Create New Form
              </button>
            </div>

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
                TOTAL FORMS: <span className="text-slate-800 text-[13px]">{createdForms.length}</span>
              </div>
            </div>

            {/* Forms Data Table */}
            <div className="bg-surface rounded-lg border border-outline-variant overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container/60">
                    <th className="px-5 py-3 text-slate-500 text-[11px] font-bold tracking-wider">Form Name</th>
                    <th className="px-5 py-3 text-slate-500 text-[11px] font-bold tracking-wider">Status</th>
                    <th className="px-5 py-3 text-slate-500 text-[11px] font-bold tracking-wider text-right">Responses (Leads)</th>
                    <th className="px-5 py-3 text-slate-500 text-[11px] font-bold tracking-wider text-right">Conversion Rate</th>
                    <th className="px-5 py-3 text-slate-500 text-[11px] font-bold tracking-wider">Created By</th>
                    <th className="px-5 py-3 text-slate-500 text-[11px] font-bold tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForms.map((form) => (
                    <tr
                      key={form.id}
                      className="border-b border-outline-variant hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Name & ID Cell */}
                      <td className="px-5 py-3.5 text-left">
                        <button
                          onClick={() => setActiveFormSchema(form)}
                          className="font-bold text-[12.5px] text-slate-800 hover:text-primary hover:underline transition-colors text-left cursor-pointer"
                        >
                          {form.name}
                        </button>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {form.id}</p>
                      </td>

                      {/* Status Badges */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${form.status === 'PUBLISHED'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                        >
                          {form.status}
                        </span>
                      </td>

                      {/* Lead Responses Count */}
                      <td className="px-5 py-3.5 text-right font-mono text-[12px] text-slate-700 font-medium">
                        {form.responses !== null ? form.responses.toLocaleString() : '--'}
                      </td>

                      {/* Conversion Performance */}
                      <td className="px-5 py-3.5 text-right font-mono text-[12px] text-slate-700 font-medium">
                        {form.conversionRate || '--'}
                      </td>

                      {/* Author Details & Created Time */}
                      <td className="px-5 py-3.5 text-left">
                        <span className="font-semibold text-[11.5px] text-slate-700">{form.createdBy}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{form.createdDate}</p>
                      </td>

                      {/* Action Triggers */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setActiveFormSchema(form)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-primary transition-colors cursor-pointer"
                            title="Edit Form Layout"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
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
              initialStatus={activeFormSchema.status.charAt(0).toUpperCase() + activeFormSchema.status.slice(1).toLowerCase()}
              onBack={() => setActiveFormSchema(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
