import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ExportButton({ triggerToast }) {
  const [showExportModal, setShowExportModal] = useState(false)

  const exportFormats = [
    { id: 'Excel', label: 'Microsoft Excel', ext: '.xlsx', icon: 'grid_on', color: '#107c41', desc: 'Best for standard tables and calculations.' },
    { id: 'CSV', label: 'CSV Document', ext: '.csv', icon: 'description', color: '#2563eb', desc: 'Universal raw data format, light and fast.' },
    { id: 'PDF', label: 'PDF Report', ext: '.pdf', icon: 'picture_as_pdf', color: '#dc2626', desc: 'Formatted presentation, ready to share.' },
    { id: 'JSON', label: 'JSON Data', ext: '.json', icon: 'code', color: '#7c3aed', desc: 'Structured developer-friendly raw format.' }
  ]

  return (
    <div className="export-dropdown-wrapper">
      <button className="export-btn" onClick={() => setShowExportModal(!showExportModal)}>
        <span className="material-symbols-outlined">download</span>
        Export
      </button>

      <AnimatePresence>
        {showExportModal && (
          <>
            <div className="dropdown-click-outside" onClick={() => setShowExportModal(false)} />
            <motion.div
              className="export-dropdown-menu"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              <div className="export-dropdown-header">
                <h4>Choose Format</h4>
              </div>
              <div className="export-dropdown-list">
                {exportFormats.map((format) => (
                  <div
                    key={format.id}
                    className="export-dropdown-item"
                    onClick={() => {
                      setShowExportModal(false)
                      if (triggerToast) {
                        triggerToast(`Dashboard data successfully exported to ${format.id} format!`)
                      }
                    }}
                  >
                    <div className="export-dropdown-icon-wrapper" style={{ backgroundColor: `${format.color}12`, color: format.color }}>
                      <span className="material-symbols-outlined">{format.icon}</span>
                    </div>
                    <div className="export-dropdown-details">
                      <div className="export-dropdown-name">
                        {format.label}
                        <span className="export-dropdown-ext">{format.ext}</span>
                      </div>
                      <span className="export-dropdown-desc">{format.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
