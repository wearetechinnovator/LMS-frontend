import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import csv from '../assets/csv.png'
import excel from '../assets/excel.png'
import pdf from '../assets/pdf.png'
import json from '../assets/json.png'

import Icon from './Icon'

export default function ExportButton({ data = [], triggerToast }) {
  const [showExportModal, setShowExportModal] = useState(false)

  const exportFormats = [
    { id: 'Excel', label: 'Microsoft Excel', ext: '.xlsx', icon: excel, color: '#107c41', desc: 'Best for standard tables and calculations.' },
    { id: 'CSV', label: 'CSV Document', ext: '.csv', icon: csv, color: '#2563eb', desc: 'Universal raw data format, light and fast.' },
    { id: 'PDF', label: 'PDF Report', ext: '.pdf', icon: pdf, color: '#dc2626', desc: 'Formatted presentation, ready to share.' },
    { id: 'JSON', label: 'JSON Data', ext: '.json', icon: json, color: '#7c3aed', desc: 'Structured developer-friendly raw format.' }
  ]

  const exportJSON = () => {
    if (!data || data.length === 0) {
      if (triggerToast) triggerToast('No data available to export')
      return
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', jsonString)
    downloadAnchor.setAttribute('download', `leads_export_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    if (triggerToast) {
      triggerToast('✓ Leads successfully exported to JSON!')
    }
  }

  const exportCSV = () => {
    if (!data || data.length === 0) {
      if (triggerToast) triggerToast('No data available to export')
      return
    }
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Assigned To', 'Source', 'Score', 'Location', 'Campaign', 'Tier', 'Verified', 'Created At']
    const rows = data.map(l => [
      l.id || '',
      l.name || '',
      l.email || '',
      l.phone || '',
      l.status || '',
      l.assignedTo || '',
      l.source || '',
      l.score !== undefined ? l.score : '',
      l.location || '',
      l.campaign || '',
      l.tier || '',
      l.verified ? 'Yes' : 'No',
      l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''
    ])

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `leads_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    if (triggerToast) {
      triggerToast('✓ Leads successfully exported to CSV!')
    }
  }

  const exportExcel = () => {
    if (!data || data.length === 0) {
      if (triggerToast) triggerToast('No data available to export')
      return
    }
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Assigned To', 'Source', 'Score', 'Location', 'Campaign', 'Tier', 'Verified', 'Created At']
    const rows = data.map(l => [
      l.id || '',
      l.name || '',
      l.email || '',
      l.phone || '',
      l.status || '',
      l.assignedTo || '',
      l.source || '',
      l.score !== undefined ? l.score : '',
      l.location || '',
      l.campaign || '',
      l.tier || '',
      l.verified ? 'Yes' : 'No',
      l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''
    ])

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Leads List</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
          th { background-color: #4f46e5; color: #ffffff; font-weight: bold; text-align: left; padding: 8px; border: 1px solid #cbd5e1; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `leads_export_${Date.now()}.xls`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    if (triggerToast) {
      triggerToast('✓ Leads successfully exported to Microsoft Excel!')
    }
  }

  const exportPDF = () => {
    if (!data || data.length === 0) {
      if (triggerToast) triggerToast('No data available to export')
      return
    }
    
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Assigned To', 'Source', 'Location', 'Created At']
    const rows = data.map(l => [
      l.id || '',
      l.name || '',
      l.email || '',
      l.phone || '',
      l.status || '',
      l.assignedTo || '',
      l.source || '',
      l.location || '',
      l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''
    ])

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
      <head>
        <title>Leads Management System - Export Report</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: 800; color: #4f46e5; margin: 0; }
          .meta { font-size: 11px; color: #64748b; font-weight: 600; text-align: right; }
          table { border-collapse: collapse; width: 100%; font-size: 11px; margin-top: 10px; }
          th { background-color: #f1f5f9; color: #475569; font-weight: 700; text-transform: uppercase; text-align: left; padding: 8px 10px; border: 1px solid #e2e8f0; }
          td { padding: 8px 10px; border: 1px solid #e2e8f0; color: #334155; }
          tr:nth-child(even) { background-color: #f8fafc; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">Lead Management System</h1>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #475569; font-weight: 500;">Export Report — Total ${data.length} Leads</p>
          </div>
          <div class="meta">
            Generated: ${new Date().toLocaleString()}<br/>
            Scope: Active Dashboard filter
          </div>
        </div>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `)
    printWindow.document.close()
    if (triggerToast) {
      triggerToast('✓ PDF print document successfully opened!')
    }
  }

  const handleExport = (id) => {
    switch (id) {
      case 'Excel':
        exportExcel()
        break;
      case 'CSV':
        exportCSV()
        break;
      case 'PDF':
        exportPDF()
        break;
      case 'JSON':
        exportJSON()
        break;
      default:
        break;
    }
  }

  return (
    <div className="export-dropdown-wrapper">
      <button className="export-btn" onClick={() => setShowExportModal(!showExportModal)}>
        <Icon name="download" size={16} />
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
                      handleExport(format.id)
                    }}
                  >
                    <div className="export-dropdown-icon-wrapper">
                      <img src={format.icon} alt={format.id} className="export-dropdown-icon" style={{ width: '25px', height: '25px' }} />
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
