import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Toast from '../components/Toast'
import '../assets/formebed/formebed.css'

export default function FormEmbed() {
    const [selectedForm, setSelectedForm] = useState(null)
    const [embedType, setEmbedType] = useState('iframe')
    const [embedCode, setEmbedCode] = useState('')
    const [copiedCode, setCopiedCode] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [showToast, setShowToast] = useState(false)

    const triggerToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
    }

    const forms = [
        { id: 1, name: 'Lead Qualification Form', type: 'Lead Gen', status: 'Active', created: '2026-05-15', fields: 12 },
        { id: 2, name: 'Student Admission Inquiry', type: 'Admission', status: 'Active', created: '2026-05-10', fields: 18 },
        { id: 3, name: 'Course Interest Survey', type: 'Survey', status: 'Active', created: '2026-05-05', fields: 8 },
        { id: 4, name: 'Scholarship Application', type: 'Application', status: 'Draft', created: '2026-04-28', fields: 25 }
    ]

    const generateEmbedCode = (formId, type, shouldCopy = false) => {
        const form = forms.find(f => f.id === formId)
        let code = ''

        switch (type) {
            case 'iframe':
                code = `<iframe src="${window.location.origin}/embed/form/${formId}" width="100%" height="800" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`
                break
            case 'script':
                code = `<div id="lms-form-${formId}"></div>\n<script src="${window.location.origin}/embed/js/form-${formId}.js" data-form-id="${formId}"></script>`
                break
            case 'api':
                code = `fetch('${window.location.origin}/api/forms/${formId}/embed', {\n  method: 'GET',\n  headers: { 'Content-Type': 'application/json' }\n})\n.then(response => response.json())\n.then(data => {\n  document.getElementById('form-container').innerHTML = data.html\n})\n.catch(error => console.error('Error:', error))`
                break
            case 'widget':
                code = `<script>\nwindow.LMSFormWidget = {\n  formId: ${formId},\n  containerId: 'form-widget-${formId}',\n  apiUrl: '${window.location.origin}/api'\n}\n</script>\n<div id="form-widget-${formId}"></div>\n<script src="${window.location.origin}/embed/widget/form-widget.js"></script>`
                break
            default:
                code = ''
        }

        setEmbedCode(code)
        setSelectedForm(form)

        if (shouldCopy && code) {
            navigator.clipboard.writeText(code)
            setCopiedCode(true)
            triggerToast(`${type.toUpperCase()} embed code copied to clipboard!`)
            setTimeout(() => setCopiedCode(false), 2000)
        } else {
            triggerToast(`${type.toUpperCase()} embed code generated for "${form.name}"`)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode)
        setCopiedCode(true)
        triggerToast('Embed code copied to clipboard!')
        setTimeout(() => setCopiedCode(false), 2000)
    }

    return (
        <div className="form-embed-container-compact">
            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            {/* Header */}
            <div className="form-embed-header-compact">
                <div>
                    <h1 className="form-embed-title-compact">Form Embed & Distribution</h1>
                    <p className="form-embed-subtitle-compact">Generate embed codes for your forms</p>
                </div>
            </div>

            <div className="form-embed-grid-compact">
                {/* Forms List */}
                <div className="form-embed-left-compact">
                    <div className="form-embed-section-compact">
                        <h2 className="form-embed-section-title-compact">Forms</h2>

                        <div className="form-embed-list-compact">
                            {forms.map((form) => (
                                <motion.div
                                    key={form.id}
                                    className={`form-embed-item-compact ${selectedForm?.id === form.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedForm(form)
                                        setEmbedType('iframe')
                                        generateEmbedCode(form.id, 'iframe')
                                    }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className="form-embed-item-header-compact">
                                        <div>
                                            <h3 className="form-embed-item-name-compact">{form.name}</h3>
                                            <p className="form-embed-item-meta-compact">{form.fields} fields</p>
                                        </div>
                                        <span className={`form-embed-status-compact ${form.status === 'Active' ? 'active' : 'draft'}`}>
                                            {form.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Embed Code Preview */}
                <div className="form-embed-right-compact">
                    {selectedForm ? (
                        <motion.div
                            className="form-embed-section-compact"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {/* Embed Type Tabs */}
                            <div className="form-embed-type-tabs">
                                {[
                                    { type: 'iframe', icon: 'devices', label: 'iFrame' },
                                    { type: 'script', icon: 'code', label: 'Script' },
                                    { type: 'widget', icon: 'smart_toy', label: 'Widget' },
                                    { type: 'api', icon: 'api', label: 'API' }
                                ].map((item) => (
                                    <button
                                        key={item.type}
                                        className={`form-embed-type-tab ${embedType === item.type ? 'active' : ''}`}
                                        onClick={() => {
                                            setEmbedType(item.type)
                                            generateEmbedCode(selectedForm.id, item.type, true)
                                        }}
                                    >
                                        <span className="material-symbols-outlined form-embed-tab-icon">
                                            {item.icon}
                                        </span>
                                        <span className="form-embed-type-label">{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Code Display */}
                            <div className="form-embed-code-wrapper-compact">
                                <pre className="form-embed-code-compact">
                                    <code>{embedCode}</code>
                                </pre>
                                <button
                                    onClick={copyToClipboard}
                                    className={`form-embed-copy-btn-compact ${copiedCode ? 'copied' : ''}`}
                                    title="Copy to clipboard"
                                >
                                    <span className="material-symbols-outlined">
                                        {copiedCode ? 'check' : 'content_copy'}
                                    </span>
                                    {copiedCode ? 'Copied!' : 'Copy'}
                                </button>
                            </div>

                            {/* Quick Info */}
                            <div className="form-embed-quick-info">
                                <div className="form-embed-info-item">
                                    <span className="form-embed-info-label">Form</span>
                                    <span className="form-embed-info-value">{selectedForm.name}</span>
                                </div>
                                <div className="form-embed-info-item">
                                    <span className="form-embed-info-label">Type</span>
                                    <span className="form-embed-info-value">{embedType.toUpperCase()}</span>
                                </div>
                                <div className="form-embed-info-item">
                                    <span className="form-embed-info-label">Fields</span>
                                    <span className="form-embed-info-value">{selectedForm.fields}</span>
                                </div>
                            </div>

                            {/* Type-specific Instructions */}
                            <div className="form-embed-type-instructions">
                                <h3 className="form-embed-instructions-title-compact">Usage</h3>
                                {embedType === 'iframe' && (
                                    <p className="form-embed-instruction-text">Paste the code above into your HTML to embed the form as an iframe.</p>
                                )}
                                {embedType === 'script' && (
                                    <p className="form-embed-instruction-text">Add both script tags to your page. The form will load dynamically.</p>
                                )}
                                {embedType === 'widget' && (
                                    <p className="form-embed-instruction-text">Include the widget script to render form with custom styling.</p>
                                )}
                                {embedType === 'api' && (
                                    <p className="form-embed-instruction-text">Call the API endpoint to fetch form HTML and inject into your app.</p>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="form-embed-empty-compact">
                            <span className="material-symbols-outlined form-embed-empty-icon-compact">
                                description
                            </span>
                            <p className="form-embed-empty-text-compact">Select a form</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}