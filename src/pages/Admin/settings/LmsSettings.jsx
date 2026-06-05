import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COUNSELORS = ['Sarah Jenkins', 'Marcus Chan', 'Michael Chen', 'Unassigned']
const SOURCES = ['Website Organic', 'Paid Search', 'Referral', 'Webinar', 'Cold Outreach', 'Direct Mail', 'Bulk Offline CSV']

export default function LmsSettings() {
  const role = localStorage.getItem('userRole')
  const isMasked = role === 'counselor' || role === 'vendor'
  const maskEmail = (email) => {
    if (!email) return ''
    const atIdx = email.indexOf('@')
    if (atIdx <= 0) return email
    const local = email.substring(0, atIdx)
    const domain = email.substring(atIdx)
    return local.charAt(0) + '***' + domain
  }
  const maskPhone = (phone) => {
    if (!phone) return ''
    const str = String(phone).trim()
    if (str.length <= 4) return '******'
    return str.slice(0, 2) + '******' + str.slice(-2)
  }
  const [activeSettingsTab, setActiveSettingsTab] = useState('session')
  const [toastMsg, setToastMsg] = useState(null)

  // -- TAB 1: Session Creation States --
  const [sessionOption, setSessionOption] = useState('yes') // 'yes' | 'inline_two'
  const [sessionPhone, setSessionPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState(null)
  const [currentSessionDate, setCurrentSessionDate] = useState('01/15/2020 - 02/21/2020')
  const [newSessionDate, setNewSessionDate] = useState('06/04/2026 - 07/04/2026')
  const [creatingSession, setCreatingSession] = useState(false)

  // -- TAB 2: Import Leads States --
  const [assignedTo, setAssignedTo] = useState('Sarah Jenkins')
  const [leadSource, setLeadSource] = useState('Website Organic')
  const [file, setFile] = useState(null)
  const [parsedData, setParsedData] = useState([])
  const [parseError, setParseError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)

  // -- TAB 3: Export Leads States --
  const [exportFormat, setExportFormat] = useState('CSV') // 'CSV' | 'JSON'
  const [filterCounselor, setFilterCounselor] = useState('All Counselors')
  const [filterSource, setFilterSource] = useState('All Sources')
  const [filterStatus, setFilterStatus] = useState('All Statuses')
  const [exporting, setExporting] = useState(false)

  // -- TAB 4: Bulk Messaging States --
  const [campaignTitle, setCampaignTitle] = useState('')
  const [deliveryChannel, setDeliveryChannel] = useState('both') // 'email' | 'sms' | 'both'
  const [campaignSubject, setCampaignSubject] = useState('')
  const [campaignMessage, setCampaignMessage] = useState('')
  const [targetMode, setTargetMode] = useState('database') // 'database' | 'manual'
  const [minScore, setMinScore] = useState('0')
  const [maxScore, setMaxScore] = useState('100')
  const [targetCounselor, setTargetCounselor] = useState('All Counselors')
  const [manualRecipients, setManualRecipients] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendingProgress, setSendingProgress] = useState(0)

  // -- Leads Database Sync state (for Export preview) --
  const [leadsList, setLeadsList] = useState(() => {
    const localLeads = localStorage.getItem('lms_leads_database')
    if (localLeads) {
      try {
        return JSON.parse(localLeads)
      } catch (err) {
        console.error(err)
      }
    }
    return []
  })

  // Sync leads from localStorage when event fires
  useEffect(() => {
    const handleLeadsUpdate = () => {
      const localLeads = localStorage.getItem('lms_leads_database')
      if (localLeads) {
        try {
          setLeadsList(JSON.parse(localLeads))
        } catch (err) {
          console.error(err)
        }
      }
    }
    window.addEventListener('lms-leads-updated', handleLeadsUpdate)
    return () => {
      window.removeEventListener('lms-leads-updated', handleLeadsUpdate)
    }
  }, [])

  // Memoize filtered leads for the Export tab preview
  const filteredLeads = useMemo(() => {
    return leadsList.filter(lead => {
      const matchCounselor = filterCounselor === 'All Counselors' || lead.assignedTo === filterCounselor
      const matchSource = filterSource === 'All Sources' || lead.source === filterSource
      const matchStatus = filterStatus === 'All Statuses' || lead.status === filterStatus
      return matchCounselor && matchSource && matchStatus
    })
  }, [leadsList, filterCounselor, filterSource, filterStatus])

  // Memoize targeted leads for bulk messaging selection
  const bulkTargetedLeads = useMemo(() => {
    return leadsList.filter(lead => {
      const matchCounselor = targetCounselor === 'All Counselors' || lead.assignedTo === targetCounselor
      const score = lead.score ?? 0
      const parsedMin = parseInt(minScore) || 0
      const parsedMax = parseInt(maxScore) || 100
      const matchScore = score >= parsedMin && score <= parsedMax
      return matchCounselor && matchScore
    })
  }, [leadsList, targetCounselor, minScore, maxScore])

  // Helper to parse manual input into lists of valid emails and phone numbers
  const parsedManualRecipients = useMemo(() => {
    if (!manualRecipients) return { emails: [], phones: [], total: 0 }
    
    // Split by comma, newline, or whitespace
    const tokens = manualRecipients.split(/[\s,\n\r]+/).map(t => t.trim()).filter(Boolean)
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/
    
    const emails = []
    const phones = []
    
    tokens.forEach(token => {
      if (emailRegex.test(token)) {
        emails.push(token)
      } else if (phoneRegex.test(token) && token.replace(/\D/g, '').length >= 7) {
        phones.push(token)
      }
    })
    
    return {
      emails,
      phones,
      total: emails.length + phones.length
    }
  }, [manualRecipients])

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg(null)
    }, 3500)
  }

  // --- BULK MESSAGING HANDLER ---
  const handleBulkMessageSubmit = (e) => {
    e.preventDefault()
    
    if (!campaignTitle.trim()) {
      triggerToast("Error: Campaign title is required.")
      return
    }
    if ((deliveryChannel === 'email' || deliveryChannel === 'both') && !campaignSubject.trim()) {
      triggerToast("Error: Subject is required for email delivery.")
      return
    }
    if (!campaignMessage.trim()) {
      triggerToast("Error: Message body is required.")
      return
    }

    let recipientsCount = 0
    let targets = []
    if (targetMode === 'database') {
      targets = bulkTargetedLeads
      recipientsCount = targets.length
    } else {
      recipientsCount = parsedManualRecipients.total
    }

    if (recipientsCount === 0) {
      triggerToast("Error: No valid recipients found.")
      return
    }

    setIsSending(true)
    setSendingProgress(0)

    // Simulate progress sending
    const duration = 2000 // 2 seconds
    const intervalTime = 100
    const steps = duration / intervalTime
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = Math.min(Math.round((currentStep / steps) * 100), 100)
      setSendingProgress(progress)

      if (currentStep >= steps) {
        clearInterval(timer)
        
        // If targeting database leads, append activity log to their timelines
        if (targetMode === 'database' && targets.length > 0) {
          const localLeads = localStorage.getItem('lms_leads_database')
          let dbLeads = []
          if (localLeads) {
            try {
              dbLeads = JSON.parse(localLeads)
            } catch (err) {
              console.error(err)
            }
          }

          // Build a set of matching lead IDs for efficient lookup
          const targetedIds = new Set(targets.map(l => l.id))
          
          const updatedDbLeads = dbLeads.map(lead => {
            if (targetedIds.has(lead.id)) {
              // Prepend new activity item
              const newActivity = {
                id: Date.now() + Math.random(),
                type: 'OUTBOUND',
                title: `Bulk Message: ${campaignTitle}`,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
                body: `Channel: ${deliveryChannel.toUpperCase()}\nSubject: ${campaignSubject || 'N/A'}\nMessage: ${campaignMessage}`,
                user: 'Admin',
                ip: '192.168.1.100',
                icon: deliveryChannel === 'email' ? 'mail' : deliveryChannel === 'sms' ? 'sms' : 'chat',
                color: 'blue-600'
              }
              return {
                ...lead,
                timeline: [newActivity, ...(lead.timeline || [])],
                activityCount: (lead.activityCount || 0) + 1,
                lastContacted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              }
            }
            return lead
          })

          localStorage.setItem('lms_leads_database', JSON.stringify(updatedDbLeads))
          window.dispatchEvent(new CustomEvent('lms-leads-updated'))
        }

        setIsSending(false)
        triggerToast(`Bulk campaign '${campaignTitle}' successfully sent to ${recipientsCount} recipients!`)
        
        // Reset bulk form
        setCampaignTitle('')
        setCampaignSubject('')
        setCampaignMessage('')
        setManualRecipients('')
      }
    }, intervalTime)
  }

  // --- OTP HANDLERS (Session Creation) ---
  const handleSendOtp = () => {
    if (!sessionPhone.trim()) {
      setOtpError("Please enter a valid mobile number.")
      return
    }
    setOtpError(null)
    setOtpSent(true)
    triggerToast("Verification code dispatched! Hint: Enter mock OTP '1234'.")
  }

  const handleVerifyOtp = () => {
    if (otpCode === '1234') {
      setOtpError(null)
      setOtpVerified(true)
      triggerToast("Mobile verification completed!")
    } else {
      setOtpError("Invalid verification code. Use '1234'.")
    }
  }

  const handleCreateSessionSubmit = (e) => {
    e.preventDefault()
    if (!otpVerified) {
      triggerToast("Error: OTP must be verified to start a session.")
      return
    }
    setCreatingSession(true)
    setTimeout(() => {
      setCurrentSessionDate(newSessionDate)
      triggerToast(`Session successfully created! Range: ${newSessionDate}`)
      
      // Reset Verification
      setOtpSent(false)
      setOtpVerified(false)
      setOtpCode('')
      setSessionPhone('')
      setNewSessionDate('06/04/2026 - 07/04/2026')
      setCreatingSession(false)
    }, 1200)
  }

  // --- CSV PARSING HANDLERS (Lead Import) ---
  const parseCSVText = (text) => {
    const lines = text.split(/\r?\n/)
    if (lines.length === 0 || !lines[0].trim()) {
      throw new Error("The file is empty or invalid.")
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase())
    const required = ['name', 'email', 'phone']
    const missing = required.filter(r => !headers.includes(r))
    if (missing.length > 0) {
      throw new Error(`Missing required headers: ${missing.join(', ')}`)
    }

    const records = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = []
      let currentVal = ''
      let insideQuotes = false
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"' || char === "'") {
          insideQuotes = !insideQuotes
        } else if (char === ',' && !insideQuotes) {
          values.push(currentVal.trim().replace(/^["']|["']$/g, ''))
          currentVal = ''
        } else {
          currentVal += char
        }
      }
      values.push(currentVal.trim().replace(/^["']|["']$/g, ''))
      
      const record = {}
      headers.forEach((header, idx) => {
        record[header] = values[idx] || ''
      })
      
      if (record.name || record.email || record.phone) {
        records.push(record)
      }
    }
    return records
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null
    processSelectedFile(selectedFile)
  }

  const processSelectedFile = (selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.name.endsWith('.csv')) {
      setParseError("Invalid file type. Please upload a valid .csv file.")
      setFile(null)
      setParsedData([])
      return
    }
    
    setFile(selectedFile)
    setParseError(null)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target.result
        const data = parseCSVText(text)
        setParsedData(data)
      } catch (err) {
        setParseError(err.message || "Failed to parse the CSV file.")
        setParsedData([])
      }
    }
    reader.onerror = () => {
      setParseError("Error reading file.")
      setParsedData([])
    }
    reader.readAsText(selectedFile)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setParsedData([])
    setParseError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDownloadSample = () => {
    const csvContent = 
      "name,email,phone,location,campaign,score\n" +
      "John Doe,john.doe@example.com,+1 (555) 123-4567,\"Chicago, IL\",Summer_Admissions_2026,82\n" +
      "Aisha Sharma,aisha.s@techcorp.in,+91 98765 43210,\"Mumbai, IN\",Webinar_Signups,95\n" +
      "Chloe Dupont,chloe.d@edu.fr,+33 6 1234 5678,\"Paris, FR\",International_Referral,72"
      
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'lms_sample_leads_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    triggerToast("Sample CSV Template downloaded!")
  }

  const handleImportLeadsSubmit = (e) => {
    e.preventDefault()
    if (!file || parsedData.length === 0) {
      triggerToast("Error: Please provide a valid parsed CSV file before importing.")
      return
    }

    setImporting(true)
    setTimeout(() => {
      // Load current leads from localStorage
      const localLeads = localStorage.getItem('lms_leads_database')
      let leadsList = []
      if (localLeads) {
        try {
          leadsList = JSON.parse(localLeads)
        } catch (err) {
          console.error(err)
        }
      }

      let nextIdNumber = 1022
      if (leadsList.length > 0) {
        const ids = leadsList.map(l => parseInt(l.id.replace('LS-', ''))).filter(n => !isNaN(n))
        if (ids.length > 0) {
          nextIdNumber = Math.max(...ids) + 1
        }
      }

      const newLeads = parsedData.map((row, index) => {
        const idNum = nextIdNumber + index
        const leadId = `LS-${idNum}`
        const scoreValue = parseInt(row.score) || Math.floor(40 + Math.random() * 45)
        
        return {
          id: leadId,
          name: row.name || 'Anonymous Lead',
          email: row.email || 'no-email@domain.com',
          phone: row.phone || 'N/A',
          status: 'NEW',
          assignedTo: assignedTo,
          source: leadSource,
          score: scoreValue,
          location: row.location || 'Unknown',
          campaign: row.campaign || 'CSV_Ingestion',
          tier: scoreValue >= 80 ? 'Primary' : scoreValue >= 50 ? 'Secondary' : 'Tertiary',
          verified: Math.random() > 0.3,
          formName: 'Bulk Offline CSV',
          createdToday: true,
          lastContacted: 'None',
          nextFollowUp: 'None',
          age: '1 day',
          priority: scoreValue >= 80 ? 'High' : scoreValue >= 50 ? 'Medium' : 'Low',
          tags: ['CSV Import'],
          activityCount: 0,
          conversionProb: scoreValue,
          leadType: 'Offline',
          timeline: [
            {
              id: Date.now() + index,
              type: 'CREATION',
              title: 'Lead Ingested (CSV Import)',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
              body: `Uploaded via Lead Import under Source: ${leadSource}`,
              user: 'Admin',
              ip: '192.168.1.100',
              icon: 'upload_file',
              color: 'green-600'
            }
          ],
          application: {
            appliedProgram: 'Starter Solo Plan',
            submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            companyName: 'N/A',
            companySize: 'Unknown',
            annualRevenue: 'N/A',
            useCase: `CSV Lead Import`,
            notes: `Lead assigned to counselor ${assignedTo}`
          },
          queries: []
        }
      })

      const updatedLeads = [...newLeads, ...leadsList]
      localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads))
      
      // Dispatch custom storage update event to alert any mounted lead tables
      window.dispatchEvent(new CustomEvent('lms-leads-updated'))

      setImporting(false)
      triggerToast(`Successfully imported ${parsedData.length} leads!`)
      
      // Reset Import Tab Form
      setFile(null)
      setParsedData([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 1500)
  }

  // --- EXPORT HANDLERS ---
  const handleExportSubmit = (e) => {
    e.preventDefault()
    if (filteredLeads.length === 0) {
      triggerToast("Warning: No leads found matching the selected export filter options.")
      return
    }
    setExporting(true)

    setTimeout(() => {
      let fileContent = ''
      let fileType = 'text/plain'
      let fileName = 'lms_leads_export'

      if (exportFormat === 'CSV') {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Assigned To', 'Source', 'Score', 'Location', 'Campaign']
        const rows = filteredLeads.map(l => [
          l.id,
          `"${l.name.replace(/"/g, '""')}"`,
          l.email,
          l.phone,
          l.status,
          `"${l.assignedTo.replace(/"/g, '""')}"`,
          `"${l.source.replace(/"/g, '""')}"`,
          l.score,
          `"${l.location.replace(/"/g, '""')}"`,
          `"${l.campaign.replace(/"/g, '""')}"`
        ])
        fileContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        fileType = 'text/csv;charset=utf-8;'
        fileName += '.csv'
      } else {
        // JSON Export
        fileContent = JSON.stringify(filteredLeads, null, 2)
        fileType = 'application/json;charset=utf-8;'
        fileName += '.json'
      }

      const blob = new Blob([fileContent], { type: fileType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setExporting(false)
      triggerToast(`Export successful! Downloaded ${filteredLeads.length} matching leads.`)
    }, 1000)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full relative h-full flex flex-col font-sans select-none p-6 bg-white text-left">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-800"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
            <span className="text-[12px] font-semibold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation Menu */}
      <div className="flex border-b border-slate-100 gap-6 mb-5 select-none">
        <button
          onClick={() => setActiveSettingsTab('session')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSettingsTab === 'session' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">event_note</span>
          Session Creation
        </button>
        <button
          onClick={() => setActiveSettingsTab('import')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSettingsTab === 'import' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">publish</span>
          Import Leads
        </button>
        <button
          onClick={() => setActiveSettingsTab('export')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSettingsTab === 'export' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">download</span>
          Export Leads
        </button>
        <button
          onClick={() => setActiveSettingsTab('bulk')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSettingsTab === 'bulk' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">chat</span>
          Bulk Messaging
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: SESSION CREATION */}
        {activeSettingsTab === 'session' && (
          <motion.form
            key="session-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            onSubmit={handleCreateSessionSubmit}
            className="max-w-[650px] space-y-3"
          >
            {/* ROW 1: Current Session (Read-Only) */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Current Session
              </div>
              <div className="col-span-8">
                <input
                  type="text"
                  readOnly
                  value={currentSessionDate}
                  className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-medium outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* ROW 2: Do you want to create a new session? */}
            <div className="grid grid-cols-12 gap-3 py-1 items-start">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px] pt-0.5">
                Do you want to create a new session?
              </div>
              <div className="col-span-8 space-y-1">
                <div className="flex items-center gap-4 mt-0.5">
                  <label className="flex items-center gap-1.5 text-[#2d3748] text-[12px] font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="createNewSession"
                      checked={sessionOption === 'yes'}
                      onChange={() => setSessionOption('yes')}
                      className="w-3.5 h-3.5 text-primary border-slate-350 focus:ring-0 cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1.5 text-[#2d3748] text-[12px] font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="createNewSession"
                      checked={sessionOption === 'inline_two'}
                      onChange={() => setSessionOption('inline_two')}
                      className="w-3.5 h-3.5 text-primary border-slate-350 focus:ring-0 cursor-pointer"
                    />
                    Inline Two
                  </label>
                </div>
                
                <p className="text-[10px] text-[#718096] leading-normal max-w-[500px] font-medium pt-0.5">
                  Please use this option very carefully as this is going to create a new session and you won't be able to view the current session's data.
                </p>
              </div>
            </div>

            {/* Verification Inputs */}
            {sessionOption !== '' && (
              <div className="space-y-3">
                {/* ROW 3: New Session From (editable/changeable) */}
                <div className="grid grid-cols-12 gap-3 py-1 items-center">
                  <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                    New Session From
                  </div>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={newSessionDate}
                      onChange={(e) => setNewSessionDate(e.target.value)}
                      placeholder="MM/DD/YYYY - MM/DD/YYYY"
                      className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* ROW 4: Send OTP */}
                <div className="grid grid-cols-12 gap-3 py-1 items-center">
                  <div className="col-span-4" />
                  <div className="col-span-8">
                    <div className="flex rounded overflow-hidden">
                      <input
                        type="tel"
                        disabled={otpVerified}
                        value={sessionPhone}
                        onChange={(e) => setSessionPhone(e.target.value)}
                        placeholder="8456822XXX"
                        className="flex-1 h-8 px-3 bg-white text-slate-800 text-[12px] font-semibold outline-none border border-r-0 border-slate-200 focus:border-sky-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpVerified || !sessionPhone}
                        className="h-8 px-4 bg-[#3182ce] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[11.5px] font-bold flex items-center justify-center transition-all cursor-pointer whitespace-nowrap"
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>
                </div>

                {/* ROW 5: Verify OTP */}
                <div className="grid grid-cols-12 gap-3 py-1 items-center">
                  <div className="col-span-4" />
                  <div className="col-span-8">
                    <div className="flex rounded overflow-hidden">
                      <input
                        type="text"
                        disabled={otpVerified || !otpSent}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter OTP"
                        className="flex-1 h-8 px-3 bg-white text-slate-800 text-[12px] font-semibold outline-none border border-r-0 border-slate-200 focus:border-sky-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpVerified || !otpSent || !otpCode}
                        className="h-8 px-4 bg-[#3182ce] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[11.5px] font-bold flex items-center justify-center transition-all cursor-pointer whitespace-nowrap"
                      >
                        Verify OTP
                      </button>
                    </div>
                    {otpError && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">error</span>
                        {otpError}
                      </p>
                    )}
                    {otpVerified && (
                      <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        Mobile Verified! Ready to create session.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Create Action Button */}
            <div className="grid grid-cols-12 gap-3 pt-2">
              <div className="col-span-4" />
              <div className="col-span-8">
                <button
                  type="submit"
                  disabled={creatingSession || !otpVerified}
                  className="h-8 px-6 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[12px] font-bold rounded-full shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {creatingSession ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Session...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* TAB 2: IMPORT LEADS */}
        {activeSettingsTab === 'import' && (
          <motion.form
            key="import-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            onSubmit={handleImportLeadsSubmit}
            className="max-w-[650px] space-y-3"
          >
            {/* Counselor Assignment */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Assign Leads To
              </div>
              <div className="col-span-8">
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                >
                  {COUNSELORS.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Source Tag Selection */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Lead Source
              </div>
              <div className="col-span-8">
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                >
                  {SOURCES.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CSV File Upload dropzone */}
            <div className="grid grid-cols-12 gap-3 py-1 items-start">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px] pt-0.5">
                Upload CSV File
              </div>
              <div className="col-span-8 space-y-1.5">
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full min-h-[75px] border border-dashed rounded flex flex-col items-center justify-center p-3 transition-all cursor-pointer bg-[#f7fafc] ${
                    dragActive ? 'border-sky-500 bg-sky-50/20' : 'border-slate-355 hover:border-sky-500'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".csv"
                  />
                  {!file ? (
                    <div className="text-center space-y-0.5">
                      <span className="material-symbols-outlined text-[20px] text-slate-400">upload_file</span>
                      <p className="text-[11px] font-bold text-slate-700">Click or Drag CSV leads file here</p>
                      <p className="text-[9.5px] text-slate-400">Requires name, email, phone columns</p>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between p-1 bg-white border border-slate-200 rounded shadow-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="w-5.5 h-5.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center border-none bg-transparent cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  )}
                </div>
                {parseError && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    {parseError}
                  </p>
                )}
                
                {/* CSV Template Helpers */}
                <div className="flex justify-between items-center bg-[#f7fafc] border border-slate-100 p-2 rounded text-[10px] text-[#4a5568] font-semibold">
                  <span>CSV structure: name, email, phone</span>
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="text-sky-600 hover:underline flex items-center gap-0.5 border-none bg-transparent cursor-pointer font-bold text-[10px]"
                  >
                    <span className="material-symbols-outlined text-[13px]">download</span>
                    Download Sample Template
                  </button>
                </div>
              </div>
            </div>

            {/* Ingest preview count & data preview */}
            {parsedData.length > 0 && (
              <div className="grid grid-cols-12 gap-3 py-1 items-start">
                <div className="col-span-4 text-[#1a202c] font-semibold text-[12px] pt-1">
                  Preview Leads Data
                </div>
                <div className="col-span-8 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-green-50 text-green-700 text-[10.5px] font-bold border border-green-200">
                    Successfully parsed {parsedData.length} records.
                  </span>
                  
                  <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm max-w-full">
                    <div className="bg-[#edf2f7] px-2.5 py-1.5 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Parsed CSV Preview (First 5 Rows)</span>
                    </div>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-[#edf2f7] border-b border-slate-200 text-slate-500 font-semibold uppercase">
                            <th className="py-1.5 px-2 font-bold">Name</th>
                            <th className="py-1.5 px-2 font-bold">Email</th>
                            <th className="py-1.5 px-2 font-bold">Phone</th>
                            <th className="py-1.5 px-2 font-bold">Location</th>
                            <th className="py-1.5 px-2 font-bold">Campaign</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {parsedData.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 text-slate-700 font-medium">
                              <td className="py-1.5 px-2 truncate max-w-[100px]" title={row.name}>{row.name || 'N/A'}</td>
                              <td className="py-1.5 px-2 truncate max-w-[120px]" title={isMasked ? maskEmail(row.email) : row.email}>{isMasked ? maskEmail(row.email) : (row.email || 'N/A')}</td>
                              <td className="py-1.5 px-2 truncate max-w-[100px]" title={isMasked ? maskPhone(row.phone) : row.phone}>{isMasked ? maskPhone(row.phone) : (row.phone || 'N/A')}</td>
                              <td className="py-1.5 px-2 truncate max-w-[80px]" title={row.location}>{row.location || 'N/A'}</td>
                              <td className="py-1.5 px-2 truncate max-w-[80px]" title={row.campaign}>{row.campaign || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action button */}
            <div className="grid grid-cols-12 gap-3 pt-2">
              <div className="col-span-4" />
              <div className="col-span-8">
                <button
                  type="submit"
                  disabled={importing || !file || parsedData.length === 0}
                  className="h-8 px-6 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[12px] font-bold rounded-full shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {importing ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Importing Leads...
                    </>
                  ) : (
                    "Import"
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* TAB 3: EXPORT LEADS */}
        {activeSettingsTab === 'export' && (
          <motion.form
            key="export-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            onSubmit={handleExportSubmit}
            className="max-w-[650px] space-y-3"
          >
            {/* Export Format */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Export Format
              </div>
              <div className="col-span-8">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                >
                  <option value="CSV">CSV Format (.csv)</option>
                  <option value="JSON">JSON File (.json)</option>
                </select>
              </div>
            </div>

            {/* Filter Counselor */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Filter by Assignee
              </div>
              <div className="col-span-8">
                <select
                  value={filterCounselor}
                  onChange={(e) => setFilterCounselor(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                >
                  <option value="All Counselors">All Counselors</option>
                  {COUNSELORS.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Source */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Filter by Source
              </div>
              <div className="col-span-8">
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                >
                  <option value="All Sources">All Sources</option>
                  {SOURCES.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Status */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Filter by Status
              </div>
              <div className="col-span-8">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>
            </div>

            {/* Export Leads Data Preview */}
            <div className="grid grid-cols-12 gap-3 py-2 items-start">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px] pt-1">
                Preview Matching Data
              </div>
              <div className="col-span-8 space-y-2">
                {filteredLeads.length > 0 ? (
                  <>
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10.5px] font-bold border border-blue-200">
                      Ready to export: {filteredLeads.length} leads match filters.
                    </span>

                    <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm max-w-full">
                      <div className="bg-[#edf2f7] px-2.5 py-1.5 border-b border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Export Preview (First 5 Rows)</span>
                      </div>
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse text-[10px]">
                          <thead>
                            <tr className="bg-[#edf2f7] border-b border-slate-200 text-slate-500 font-semibold uppercase">
                              <th className="py-1.5 px-2 font-bold">ID</th>
                              <th className="py-1.5 px-2 font-bold">Name</th>
                              <th className="py-1.5 px-2 font-bold">Email</th>
                              <th className="py-1.5 px-2 font-bold">Assignee</th>
                              <th className="py-1.5 px-2 font-bold">Source</th>
                              <th className="py-1.5 px-2 font-bold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredLeads.slice(0, 5).map((lead) => (
                              <tr key={lead.id} className="hover:bg-slate-50 text-slate-700 font-medium">
                                <td className="py-1.5 px-2 text-slate-500 font-mono">{lead.id}</td>
                                <td className="py-1.5 px-2 truncate max-w-[90px]" title={lead.name}>{lead.name}</td>
                                <td className="py-1.5 px-2 truncate max-w-[110px]" title={isMasked ? maskEmail(lead.email) : lead.email}>{isMasked ? maskEmail(lead.email) : lead.email}</td>
                                <td className="py-1.5 px-2 truncate max-w-[90px]" title={lead.assignedTo}>{lead.assignedTo}</td>
                                <td className="py-1.5 px-2 truncate max-w-[80px]" title={lead.source}>{lead.source}</td>
                                <td className="py-1.5 px-2">
                                  <span className={`px-1 rounded text-[9px] font-bold ${
                                    lead.status === 'NEW' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                    lead.status === 'CONTACTED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                    lead.status === 'QUALIFIED' ? 'bg-green-50 text-green-700 border border-green-200' :
                                    'bg-red-50 text-red-700 border border-red-200'
                                  }`}>
                                    {lead.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10.5px] font-bold border border-red-200">
                    No leads match the selected export filter options.
                  </span>
                )}
              </div>
            </div>

            {/* Action button */}
            <div className="grid grid-cols-12 gap-3 pt-2">
              <div className="col-span-4" />
              <div className="col-span-8">
                <button
                  type="submit"
                  disabled={exporting || filteredLeads.length === 0}
                  className="h-8 px-6 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[12px] font-bold rounded-full shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {exporting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    "Export"
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* TAB 4: BULK MESSAGING */}
        {activeSettingsTab === 'bulk' && (
          <motion.form
            key="bulk-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            onSubmit={handleBulkMessageSubmit}
            className="max-w-[650px] space-y-3 relative"
          >
            {/* Sending Progress Overlay */}
            {isSending && (
              <div className="absolute inset-0 bg-white/80 z-25 flex flex-col items-center justify-center space-y-3 rounded-lg backdrop-blur-xs">
                <span className="material-symbols-outlined text-[36px] text-[#2f7d9e] animate-bounce">chat</span>
                <p className="text-[12px] font-bold text-slate-800">Dispatching Bulk Messages...</p>
                <div className="w-[200px] h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-[#2f7d9e] transition-all duration-100" 
                    style={{ width: `${sendingProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold">{sendingProgress}%</span>
              </div>
            )}

            {/* Campaign Title */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Campaign Title
              </div>
              <div className="col-span-8">
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Summer Outreach 2026"
                  className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Delivery Channel */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Delivery Channel
              </div>
              <div className="col-span-8">
                <div className="flex items-center gap-4 mt-0.5">
                  <label className="flex items-center gap-1.5 text-[#2d3748] text-[12px] font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryChannel"
                      value="both"
                      checked={deliveryChannel === 'both'}
                      onChange={() => setDeliveryChannel('both')}
                      className="w-3.5 h-3.5 text-primary border-slate-350 focus:ring-0 cursor-pointer"
                    />
                    Both (Email & SMS)
                  </label>
                  <label className="flex items-center gap-1.5 text-[#2d3748] text-[12px] font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryChannel"
                      value="email"
                      checked={deliveryChannel === 'email'}
                      onChange={() => setDeliveryChannel('email')}
                      className="w-3.5 h-3.5 text-primary border-slate-350 focus:ring-0 cursor-pointer"
                    />
                    Email Only
                  </label>
                  <label className="flex items-center gap-1.5 text-[#2d3748] text-[12px] font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryChannel"
                      value="sms"
                      checked={deliveryChannel === 'sms'}
                      onChange={() => setDeliveryChannel('sms')}
                      className="w-3.5 h-3.5 text-primary border-slate-350 focus:ring-0 cursor-pointer"
                    />
                    SMS Only
                  </label>
                </div>
              </div>
            </div>

            {/* Email Subject (Conditional) */}
            {(deliveryChannel === 'email' || deliveryChannel === 'both') && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-12 gap-3 py-1 items-center overflow-hidden"
              >
                <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                  Email Subject
                </div>
                <div className="col-span-8">
                  <input
                    type="text"
                    value={campaignSubject}
                    onChange={(e) => setCampaignSubject(e.target.value)}
                    placeholder="Enter email subject header"
                    className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                  />
                </div>
              </motion.div>
            )}

            {/* Message Body */}
            <div className="grid grid-cols-12 gap-3 py-1 items-start">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px] pt-1">
                Message Body
              </div>
              <div className="col-span-8">
                <textarea
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  placeholder="Write your campaign message contents here... Use {name} for personalization."
                  rows={4}
                  className="w-full p-2.5 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 resize-none font-sans placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Target Mode */}
            <div className="grid grid-cols-12 gap-3 py-1 items-center">
              <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                Target Recipients
              </div>
              <div className="col-span-8">
                <div className="flex items-center gap-4 mt-0.5">
                  <label className="flex items-center gap-1.5 text-[#2d3748] text-[12px] font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="targetMode"
                      value="database"
                      checked={targetMode === 'database'}
                      onChange={() => setTargetMode('database')}
                      className="w-3.5 h-3.5 text-primary border-slate-350 focus:ring-0 cursor-pointer"
                    />
                    Lead Database Range
                  </label>
                  <label className="flex items-center gap-1.5 text-[#2d3748] text-[12px] font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="targetMode"
                      value="manual"
                      checked={targetMode === 'manual'}
                      onChange={() => setTargetMode('manual')}
                      className="w-3.5 h-3.5 text-primary border-slate-350 focus:ring-0 cursor-pointer"
                    />
                    Manual Input List
                  </label>
                </div>
              </div>
            </div>

            {/* Database Recipient Mode */}
            {targetMode === 'database' && (
              <div className="space-y-3 border-t border-slate-100 pt-3">
                {/* Score Range Selector */}
                <div className="grid grid-cols-12 gap-3 py-1 items-center">
                  <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                    Lead Score Range
                  </div>
                  <div className="col-span-8 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={minScore}
                      onChange={(e) => setMinScore(e.target.value)}
                      placeholder="Min Score"
                      className="w-[80px] h-8 px-2 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 font-mono text-center placeholder:text-slate-400"
                    />
                    <span className="text-[12px] text-slate-400 font-bold">to</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={maxScore}
                      onChange={(e) => setMaxScore(e.target.value)}
                      placeholder="Max Score"
                      className="w-[80px] h-8 px-2 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 font-mono text-center placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Counselor Filter */}
                <div className="grid grid-cols-12 gap-3 py-1 items-center">
                  <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                    Assigned Counselor
                  </div>
                  <div className="col-span-8">
                    <select
                      value={targetCounselor}
                      onChange={(e) => setTargetCounselor(e.target.value)}
                      className="w-full h-8 px-3 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                    >
                      <option value="All Counselors">All Counselors</option>
                      {COUNSELORS.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Database Leads Preview */}
                <div className="grid grid-cols-12 gap-3 py-1 items-start">
                  <div className="col-span-4 text-[#1a202c] font-semibold text-[12px] pt-1">
                    Matching Targets
                  </div>
                  <div className="col-span-8 space-y-2">
                    {bulkTargetedLeads.length > 0 ? (
                      <>
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10.5px] font-bold border border-blue-200">
                          Ready to target: {bulkTargetedLeads.length} leads matched.
                        </span>
                        
                        <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm max-w-full">
                          <div className="bg-[#edf2f7] px-2.5 py-1.5 border-b border-slate-200 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Target Preview (First 5 Rows)</span>
                          </div>
                          <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse text-[10px]">
                              <thead>
                                <tr className="bg-[#edf2f7] border-b border-slate-200 text-slate-500 font-semibold uppercase">
                                  <th className="py-1.5 px-2 font-bold">ID</th>
                                  <th className="py-1.5 px-2 font-bold">Name</th>
                                  <th className="py-1.5 px-2 font-bold">Email</th>
                                  <th className="py-1.5 px-2 font-bold">Phone</th>
                                  <th className="py-1.5 px-2 font-bold">Score</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {bulkTargetedLeads.slice(0, 5).map((lead) => (
                                  <tr key={lead.id} className="hover:bg-slate-50 text-slate-700 font-medium">
                                    <td className="py-1.5 px-2 text-slate-500 font-mono">{lead.id}</td>
                                    <td className="py-1.5 px-2 truncate max-w-[100px]" title={lead.name}>{lead.name}</td>
                                    <td className="py-1.5 px-2 truncate max-w-[110px]" title={isMasked ? maskEmail(lead.email) : lead.email}>{isMasked ? maskEmail(lead.email) : lead.email}</td>
                                    <td className="py-1.5 px-2 truncate max-w-[100px]" title={isMasked ? maskPhone(lead.phone) : lead.phone}>{isMasked ? maskPhone(lead.phone) : lead.phone}</td>
                                    <td className="py-1.5 px-2 font-bold text-sky-600 font-mono">{lead.score}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10.5px] font-bold border border-red-200">
                        No leads matched the selected filter criteria.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Manual Recipient Mode */}
            {targetMode === 'manual' && (
              <div className="space-y-3 border-t border-slate-100 pt-3">
                {/* Manual List Input */}
                <div className="grid grid-cols-12 gap-3 py-1 items-start">
                  <div className="col-span-4 text-[#1a202c] font-semibold text-[12px] pt-1">
                    Recipients Input List
                  </div>
                  <div className="col-span-8 space-y-1.5">
                    <textarea
                      value={manualRecipients}
                      onChange={(e) => setManualRecipients(e.target.value)}
                      placeholder="Paste target emails and numbers (separated by commas, spaces, or lines)&#10;e.g. support@domain.com, +15550199, client@email.org"
                      rows={3}
                      className="w-full p-2.5 rounded border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 resize-none font-mono placeholder:text-slate-400"
                    />
                    <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                      The parser extracts valid email formats and 7-20 digit phone numbers automatically.
                    </p>
                  </div>
                </div>

                {/* Parsing Results Preview */}
                <div className="grid grid-cols-12 gap-3 py-1 items-center">
                  <div className="col-span-4 text-[#1a202c] font-semibold text-[12px]">
                    Parsing Status
                  </div>
                  <div className="col-span-8 flex flex-wrap gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${
                      parsedManualRecipients.emails.length > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {parsedManualRecipients.emails.length} Valid Emails
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${
                      parsedManualRecipients.phones.length > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {parsedManualRecipients.phones.length} Valid Phone Numbers
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action button */}
            <div className="grid grid-cols-12 gap-3 pt-4 border-t border-slate-100">
              <div className="col-span-4" />
              <div className="col-span-8">
                <button
                  type="submit"
                  disabled={
                    isSending ||
                    !campaignTitle.trim() ||
                    !campaignMessage.trim() ||
                    ((deliveryChannel === 'email' || deliveryChannel === 'both') && !campaignSubject.trim()) ||
                    (targetMode === 'database' && bulkTargetedLeads.length === 0) ||
                    (targetMode === 'manual' && parsedManualRecipients.total === 0)
                  }
                  className="h-8 px-6 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[12px] font-bold rounded-full shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  Send Bulk Campaign
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
