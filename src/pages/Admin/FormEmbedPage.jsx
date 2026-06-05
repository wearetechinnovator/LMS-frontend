import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ---------- Shared mock forms (same data as FormBuilderPage) ----------
const MOCK_FORMS = [
    {
        id: 'FRM-8921-A',
        name: 'Q3 Enterprise Webinar Registration',
        status: 'PUBLISHED',
        responses: 1245,
        fields: [
            { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe' },
            { id: 2, type: 'email', label: 'Work Email', required: true, placeholder: 'john.doe@company.com' },
            { id: 3, type: 'text', label: 'Company Name', required: true, placeholder: 'Acme Corp' },
            { id: 4, type: 'text', label: 'Job Title', required: false, placeholder: 'Director of Product' },
            { id: 5, type: 'select', label: 'Company Size', required: true, placeholder: 'Select...', options: ['1-50 employees', '51-200 employees', '201-1000 employees', '1000+ employees'] }
        ]
    },
    {
        id: 'FRM-3320-B',
        name: 'SaaS Demo Request - Main Landing',
        status: 'PUBLISHED',
        responses: 8982,
        fields: [
            { id: 1, type: 'text', label: 'First Name', required: true, placeholder: 'Sarah' },
            { id: 2, type: 'text', label: 'Last Name', required: true, placeholder: 'Miller' },
            { id: 3, type: 'email', label: 'Corporate Email', required: true, placeholder: 'sarah.miller@example.com' },
            { id: 4, type: 'phone', label: 'Phone Number', required: true, placeholder: '+1 (555) 019-2834' },
            { id: 5, type: 'radio', label: 'Primary Goal', required: true, options: ['Improve Conversion Rate', 'Automate Lead Routing', 'Audit Logging & Compliance', 'Other'] }
        ]
    },
    {
        id: 'FRM-0091-F',
        name: 'Newsletter Signup - Footer',
        status: 'PUBLISHED',
        responses: 45192,
        fields: [
            { id: 1, type: 'email', label: 'Email Address', required: true, placeholder: 'subscriber@domain.com' },
            { id: 2, type: 'checkbox', label: 'Interests', required: false, options: ['Product Updates', 'Weekly Tips & Tricks', 'Partner Integrations', 'Case Studies'] }
        ]
    },
    {
        id: 'TMP-0001-C',
        name: 'General Contact Inquiry',
        status: 'TEMPLATE',
        responses: null,
        fields: [
            { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe' },
            { id: 2, type: 'email', label: 'Email Address', required: true, placeholder: 'john@example.com' },
            { id: 3, type: 'text', label: 'Inquiry Subject', required: true, placeholder: 'How can we help?' },
            { id: 4, type: 'text', label: 'Detailed Message', required: true, placeholder: 'Type your message...' }
        ]
    },
]

// ---------- Mini live form preview ----------
function LiveFormPreview({ form }) {
    const [vals, setVals] = useState({})
    const [submitted, setSubmitted] = useState(false)

    if (!form) return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16 text-on-surface-variant/50">
            <span className="material-symbols-outlined text-[40px]">integration_instructions</span>
            <p className="text-sm font-medium">Select a form to preview it live</p>
        </div>
    )

    if (submitted) return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
        >
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-[28px]">check_circle</span>
            </div>
            <div>
                <p className="font-bold text-on-background text-base">Submitted!</p>
                <p className="text-sm text-on-surface-variant mt-1">This is how it looks for your leads.</p>
            </div>
            <button
                onClick={() => { setSubmitted(false); setVals({}) }}
                className="mt-2 px-4 py-1.5 text-sm border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors"
            >
                Reset Preview
            </button>
        </motion.div>
    )

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
            className="space-y-4 py-2"
        >
            {form.fields.map((field) => (
                <div key={field.id}>
                    <label className="block text-sm font-semibold text-on-background mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'select' ? (
                        <select
                            value={vals[field.id] || ''}
                            onChange={e => setVals({ ...vals, [field.id]: e.target.value })}
                            required={field.required}
                            className="w-full h-10 px-3 border border-outline-variant rounded-lg bg-surface text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="">{field.placeholder || 'Select...'}</option>
                            {(field.options || []).map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ) : field.type === 'radio' ? (
                        <div className="space-y-2">
                            {(field.options || []).map((opt, i) => (
                                <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name={`field-${field.id}`}
                                        value={opt}
                                        checked={vals[field.id] === opt}
                                        onChange={() => setVals({ ...vals, [field.id]: opt })}
                                        required={field.required}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{opt}</span>
                                </label>
                            ))}
                        </div>
                    ) : field.type === 'checkbox' ? (
                        <div className="space-y-2">
                            {(field.options || []).map((opt, i) => (
                                <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={(vals[field.id] || []).includes(opt)}
                                        onChange={(e) => {
                                            const cur = vals[field.id] || []
                                            setVals({
                                                ...vals,
                                                [field.id]: e.target.checked ? [...cur, opt] : cur.filter(v => v !== opt)
                                            })
                                        }}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{opt}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <input
                            type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                            value={vals[field.id] || ''}
                            onChange={e => setVals({ ...vals, [field.id]: e.target.value })}
                            placeholder={field.placeholder || ''}
                            required={field.required}
                            className="w-full h-10 px-3 border border-outline-variant rounded-lg bg-surface text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50"
                        />
                    )}
                </div>
            ))}
            <button
                type="submit"
                className="w-full mt-2 h-10 bg-primary hover:bg-primary/90 text-on-primary font-bold rounded-lg text-sm transition-colors shadow-sm"
            >
                Submit
            </button>
        </form>
    )
}

// ---------- Embed tab content ----------
const BASE_URL = 'https://your-lms-domain.com'

function EmbedOptions({ form, copiedKey, onCopy }) {
    const formUrl = `${BASE_URL}/embed/form/${form.id}`

    const iframeCode = `<iframe
  src="${formUrl}"
  width="100%"
  height="600"
  frameborder="0"
  style="border:none;border-radius:12px;"
  title="${form.name}"
></iframe>`

    const scriptCode = `<div id="lms-form-${form.id}"></div>
<script src="${BASE_URL}/embed/loader.js"
  data-form="${form.id}"
  data-target="lms-form-${form.id}">
</script>`

    const popupCode = `<button onclick="LMSForms.open('${form.id}')">
  Open Form
</button>
<script src="${BASE_URL}/embed/popup.js"></script>`

    const methods = [
        {
            key: 'iframe',
            icon: 'code',
            label: 'iFrame Embed',
            description: 'Paste this into any HTML page. Works everywhere.',
            code: iframeCode,
            recommended: true
        },
        {
            key: 'script',
            icon: 'integration_instructions',
            label: 'JavaScript Snippet',
            description: 'Renders natively in your page without an iframe.',
            code: scriptCode,
        },
        {
            key: 'popup',
            icon: 'open_in_new',
            label: 'Popup / Modal',
            description: 'Trigger the form as a popup from any button.',
            code: popupCode,
        },
        {
            key: 'link',
            icon: 'link',
            label: 'Direct Link',
            description: 'Share a standalone form URL via email or social.',
            code: formUrl,
        }
    ]

    return (
        <div className="space-y-4">
            {methods.map(m => (
                <div key={m.key} className="border border-outline-variant rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-surface-container/60">
                        <div className="flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-primary text-[18px]">{m.icon}</span>
                            <div>
                                <p className="text-sm font-bold text-on-background flex items-center gap-1.5">
                                    {m.label}
                                    {m.recommended && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-semibold">Recommended</span>
                                    )}
                                </p>
                                <p className="text-xs text-on-surface-variant">{m.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onCopy(m.key, m.code)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${copiedKey === m.key
                                ? 'bg-green-50 border-green-300 text-green-700'
                                : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container hover:border-primary/30'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[14px]">
                                {copiedKey === m.key ? 'check' : 'content_copy'}
                            </span>
                            {copiedKey === m.key ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <pre className="px-4 py-3 text-[11px] font-mono text-on-surface-variant bg-surface overflow-x-auto whitespace-pre-wrap break-all leading-relaxed border-t border-outline-variant/40">
                        {m.code}
                    </pre>
                </div>
            ))}
        </div>
    )
}

// ---------- Main Page ----------
export default function FormEmbedPage() {
    const [selectedForm, setSelectedForm] = useState(MOCK_FORMS[0])
    const [activeTab, setActiveTab] = useState('embed') // 'embed' | 'preview'
    const [copiedKey, setCopiedKey] = useState(null)
    const [search, setSearch] = useState('')

    const filtered = MOCK_FORMS.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleCopy = (key, text) => {
        navigator.clipboard.writeText(text).catch(() => { })
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    const statusColor = {
        PUBLISHED: 'bg-green-100 text-green-700',
        DRAFT: 'bg-yellow-100 text-yellow-700',
        TEMPLATE: 'bg-blue-100 text-blue-700',
    }

    return (
        <div className="min-h-screen bg-background p-6">

            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-[22px]">integration_instructions</span>
                    <h1 className="text-xl font-bold text-on-background">Form Embed</h1>
                </div>
                <p className="text-sm text-on-surface-variant">
                    Embed your lead-capture forms into any website, landing page, or email campaign.
                </p>
            </div>

            <div className="flex gap-5 items-start">

                {/* ── Left: Form Selector ── */}
                <div className="w-72 shrink-0 flex flex-col gap-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search forms..."
                            className="w-full h-9 pl-8 pr-3 border border-outline-variant rounded-lg bg-surface text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50"
                        />
                    </div>

                    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                        {filtered.length === 0 && (
                            <p className="text-sm text-center text-on-surface-variant py-8">No forms found</p>
                        )}
                        {filtered.map(form => (
                            <button
                                key={form.id}
                                onClick={() => setSelectedForm(form)}
                                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedForm?.id === form.id
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-outline-variant bg-surface hover:border-primary/30 hover:bg-surface-container/50'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <p className="text-sm font-semibold text-on-background leading-snug line-clamp-2">{form.name}</p>
                                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusColor[form.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {form.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">dataset</span>
                                        {form.fields.length} fields
                                    </span>
                                    {form.responses != null && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">person</span>
                                            {form.responses.toLocaleString()} responses
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Right: Embed Panel ── */}
                <div className="flex-1 min-w-0">
                    {selectedForm ? (
                        <motion.div
                            key={selectedForm.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm"
                        >
                            {/* Panel header */}
                            <div className="px-5 py-4 border-b border-outline-variant bg-surface-container/40 flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-on-background text-base">{selectedForm.name}</h2>
                                    <p className="text-xs text-on-surface-variant mt-0.5">ID: {selectedForm.id} · {selectedForm.fields.length} fields</p>
                                </div>
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusColor[selectedForm.status] || ''}`}>
                                    {selectedForm.status}
                                </span>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-outline-variant px-5 gap-0">
                                {[
                                    { id: 'embed', icon: 'code', label: 'Embed Code' },
                                    { id: 'preview', icon: 'visibility', label: 'Live Preview' },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-on-surface-variant hover:text-on-surface'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab content */}
                            <div className="p-5">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'embed' ? (
                                        <motion.div
                                            key="embed"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            {/* Info bar */}
                                            <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl mb-5 text-sm text-blue-800">
                                                <span className="material-symbols-outlined text-blue-500 text-[18px] shrink-0 mt-0.5">info</span>
                                                <div>
                                                    <p className="font-semibold mb-0.5">How embedding works</p>
                                                    <p className="text-xs leading-relaxed text-blue-700">
                                                        Copy any of the code snippets below and paste it into your website's HTML.
                                                        All submissions will be captured as leads in your LMS dashboard automatically.
                                                    </p>
                                                </div>
                                            </div>

                                            <EmbedOptions
                                                form={selectedForm}
                                                copiedKey={copiedKey}
                                                onCopy={handleCopy}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            {/* Preview wrapper */}
                                            <div className="flex items-start gap-5">
                                                {/* Simulated browser frame */}
                                                <div className="flex-1 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                                                    {/* Fake browser bar */}
                                                    <div className="flex items-center gap-2 px-3 py-2 bg-surface-container border-b border-outline-variant">
                                                        <div className="flex gap-1.5">
                                                            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                                            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                                        </div>
                                                        <div className="flex-1 mx-2 h-5 bg-surface rounded flex items-center px-2 gap-1.5">
                                                            <span className="material-symbols-outlined text-[11px] text-on-surface-variant">lock</span>
                                                            <span className="text-[10px] text-on-surface-variant truncate">
                                                                your-website.com/contact
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Form area */}
                                                    <div className="p-6 bg-white min-h-[400px]">
                                                        <div className="max-w-md mx-auto">
                                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedForm.name}</h3>
                                                            <p className="text-sm text-gray-500 mb-5">Fill out the form below and we'll be in touch shortly.</p>
                                                            <LiveFormPreview form={selectedForm} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tips sidebar */}
                                                <div className="w-56 shrink-0 space-y-3">
                                                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tips</p>
                                                    {[
                                                        { icon: 'palette', tip: 'Customize colors to match your brand in Form Builder.' },
                                                        { icon: 'devices', tip: 'This form is fully responsive on mobile and desktop.' },
                                                        { icon: 'notifications', tip: 'Every submission triggers a real-time lead notification.' },
                                                        { icon: 'hub', tip: 'Connect to CRMs or webhooks via Integrations settings.' },
                                                    ].map((t, i) => (
                                                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-outline-variant/60 bg-surface">
                                                            <span className="material-symbols-outlined text-primary text-[15px] shrink-0 mt-px">{t.icon}</span>
                                                            <p className="text-[11px] text-on-surface-variant leading-relaxed">{t.tip}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-on-surface-variant/50 text-sm">
                            Select a form from the left to get started
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
