import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCustomStatuses, saveCustomStatuses, getLeadJourney, saveLeadJourney, parseColorToRgb, getStatusStyle, getCustomJourneys, saveCustomJourneys } from '../../../helpers/statusHelper'

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

  // -- TAB 5: Custom Statuses States --
  const [statusesList, setStatusesList] = useState(() => getCustomStatuses())
  const [newStatusValue, setNewStatusValue] = useState('')
  const [newStatusLabel, setNewStatusLabel] = useState('')
  const [newStatusColor, setNewStatusColor] = useState('#3b82f6')
  const [colorHex, setColorHex] = useState('#3b82f6')
  const [colorRgb, setColorRgb] = useState('rgb(59, 130, 246)')
  const [colorRgba, setColorRgba] = useState('rgba(59, 130, 246, 1)')
  const [newStatusDesc, setNewStatusDesc] = useState('')
  const [editingStatusValue, setEditingStatusValue] = useState(null)
  
  // Warning modals states for custom statuses
  const [showStatusEditWarning, setShowStatusEditWarning] = useState(false)
  const [showStatusDeleteWarning, setShowStatusDeleteWarning] = useState(false)
  const [statusToDelete, setStatusToDelete] = useState(null)

  // -- TAB 6: Lead Journey States --
  const [journeysList, setJourneysList] = useState(() => getCustomJourneys())
  const [activeJourneyId, setActiveJourneyId] = useState(() => {
    const list = getCustomJourneys()
    const def = list.find(j => j.isDefault) || list[0]
    return def ? def.id : 'default'
  })
  const [newJourneyName, setNewJourneyName] = useState('')

  const activeJourney = useMemo(() => {
    return journeysList.find(j => j.id === activeJourneyId) || journeysList[0]
  }, [journeysList, activeJourneyId])

  const journeySteps = activeJourney ? activeJourney.steps : []

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

  // Sync statuses from database when mounted
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token || token === 'mock-jwt-token') return;

        const response = await fetch('http://localhost:5001/api/v1/lead-status/get-lead-status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map(item => ({
              id: item.lead_status_id,
              value: item.lead_status_name,
              label: item.lead_status_name,
              color: item.color || '#3b82f6',
              description: item.description || 'Custom lead status',
              isSystem: ['NEW', 'ASSIGNED', 'CONTACTED', 'QUALIFIED', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'].includes(item.lead_status_name)
            }));
            setStatusesList(mapped);
            saveCustomStatuses(mapped);
          }
        }
      } catch (err) {
        console.error("Error fetching lead statuses from database:", err);
      }
    };
    fetchStatuses();
  }, []);

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

  // --- CUSTOM STATUSES & JOURNEY HANDLERS ---
  const rgbObjToHex = (r, g, b) => {
    const toHex = (val) => {
      const str = val.toString(16);
      return str.length === 1 ? '0' + str : str;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  };

  const handleColorValueChange = (newColorString) => {
    const rgb = parseColorToRgb(newColorString);
    const hex = rgbObjToHex(rgb.r, rgb.g, rgb.b);
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const rgbaStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;

    setNewStatusColor(hex);
    setColorHex(hex);
    setColorRgb(rgbStr);
    setColorRgba(rgbaStr);
  };

  const onHexChange = (e) => {
    const val = e.target.value;
    setColorHex(val);
    if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(val)) {
      const rgb = parseColorToRgb(val);
      const hex = rgbObjToHex(rgb.r, rgb.g, rgb.b);
      setNewStatusColor(hex);
      setColorRgb(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      setColorRgba(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`);
    }
  };

  const onRgbChange = (e) => {
    const val = e.target.value;
    setColorRgb(val);
    const match = val.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (match) {
      const rgb = parseColorToRgb(val);
      const hex = rgbObjToHex(rgb.r, rgb.g, rgb.b);
      setNewStatusColor(hex);
      setColorHex(hex);
      setColorRgba(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
    }
  };

  const onRgbaChange = (e) => {
    const val = e.target.value;
    setColorRgba(val);
    const match = val.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i);
    if (match) {
      const rgb = parseColorToRgb(val);
      const hex = rgbObjToHex(rgb.r, rgb.g, rgb.b);
      setNewStatusColor(hex);
      setColorHex(hex);
      setColorRgb(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    }
  };

  const handleAddStatus = async (e) => {
    e.preventDefault()
    const rawVal = newStatusValue.trim().toUpperCase()
    if (!rawVal) {
      triggerToast("Error: Status Key is required.")
      return
    }
    if (!/^[A-Z0-9_]+$/.test(rawVal)) {
      triggerToast("Error: Status Key must be uppercase alphanumeric and underscores only.")
      return
    }
    if (statusesList.some(s => s.value === rawVal)) {
      triggerToast("Error: Status Key already exists.")
      return
    }
    if (!newStatusLabel.trim()) {
      triggerToast("Error: Display Label is required.")
      return
    }

    const newStatus = {
      value: rawVal,
      label: newStatusLabel.trim(),
      color: newStatusColor,
      isSystem: false,
      description: newStatusDesc.trim() || 'Custom lead status'
    }

    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch('http://localhost:5001/api/v1/lead-status/create-lead-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status_name: newStatus.value,
            color: newStatus.color,
            description: newStatus.description
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create status in database');
        }
        const savedStatus = await response.json();
        newStatus.id = savedStatus.lead_status_id;
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    } else {
      newStatus.id = `mock-${Date.now()}`;
    }

    const updated = [...statusesList, newStatus]
    setStatusesList(updated)
    saveCustomStatuses(updated)
    triggerToast(`Status '${newStatus.label}' created successfully!`)

    // Reset fields
    setNewStatusValue('')
    setNewStatusLabel('')
    setNewStatusColor('#3b82f6')
    setColorHex('#3b82f6')
    setColorRgb('rgb(59, 130, 246)')
    setColorRgba('rgba(59, 130, 246, 1)')
    setNewStatusDesc('')
  }

  const handleStartDeleteStatus = (statusValue) => {
    setStatusToDelete(statusValue)
    setShowStatusDeleteWarning(true)
  }

  const handleConfirmDeleteStatus = async () => {
    const target = statusesList.find(s => s.value === statusToDelete)
    if (!target) return

    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token' && target.id && !String(target.id).startsWith('mock')) {
      try {
        const response = await fetch(`http://localhost:5001/api/v1/lead-status/delete-lead-status/${target.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete status from database');
        }
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

    const updated = statusesList.filter(s => s.value !== statusToDelete)
    setStatusesList(updated)
    saveCustomStatuses(updated)

    const updatedJourneysList = journeysList.map(j => ({
      ...j,
      steps: j.steps.filter(s => s !== statusToDelete)
    }))
    setJourneysList(updatedJourneysList)
    saveCustomJourneys(updatedJourneysList)

    setShowStatusDeleteWarning(false)
    setStatusToDelete(null)
    triggerToast(`Status '${target.label}' deleted.`)
  }

  const handleStartEditStatus = (status) => {
    setEditingStatusValue(status.value)
    setNewStatusValue(status.value)
    setNewStatusLabel(status.label)
    handleColorValueChange(status.color)
    setNewStatusDesc(status.description || '')
  }

  const handleCancelEditStatus = () => {
    setEditingStatusValue(null)
    setNewStatusValue('')
    setNewStatusLabel('')
    setNewStatusColor('#3b82f6')
    setColorHex('#3b82f6')
    setColorRgb('rgb(59, 130, 246)')
    setColorRgba('rgba(59, 130, 246, 1)')
    setNewStatusDesc('')
  }

  const handleShowEditWarning = (e) => {
    if (e) e.preventDefault();
    if (!newStatusLabel.trim()) {
      triggerToast("Error: Display Label is required.");
      return;
    }
    setShowStatusEditWarning(true);
  }

  const handleUpdateStatus = async () => {
    const target = statusesList.find(s => s.value === editingStatusValue);
    if (!target) return;

    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token' && target.id && !String(target.id).startsWith('mock')) {
      try {
        const response = await fetch(`http://localhost:5001/api/v1/lead-status/edit-lead-status/${target.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status_name: target.value,
            color: newStatusColor,
            description: newStatusDesc.trim() || 'Custom lead status'
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update status in database');
        }
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

    const updated = statusesList.map(s => {
      if (s.value === editingStatusValue) {
        return {
          ...s,
          label: newStatusLabel.trim(),
          color: newStatusColor,
          description: newStatusDesc.trim() || 'Custom lead status'
        }
      }
      return s
    })

    setStatusesList(updated)
    saveCustomStatuses(updated)
    triggerToast(`Status '${newStatusLabel.trim()}' updated successfully!`)

    setShowStatusEditWarning(false)
    handleCancelEditStatus()
  }

  const handleAddJourney = (e) => {
    e.preventDefault()
    const name = newJourneyName.trim()
    if (!name) {
      triggerToast("Error: Journey name is required.")
      return
    }
    const id = 'journey_' + Date.now()
    const newJourney = {
      id,
      name,
      steps: ['NEW'],
      isDefault: false
    }
    const updated = [...journeysList, newJourney]
    setJourneysList(updated)
    saveCustomJourneys(updated)
    setActiveJourneyId(id)
    setNewJourneyName('')
    triggerToast(`Journey '${name}' created!`)
  }

  const handleDeleteJourney = (journeyId) => {
    const target = journeysList.find(j => j.id === journeyId)
    if (!target) return
    if (target.isDefault) {
      triggerToast("Error: Cannot delete the default journey.")
      return
    }
    const updated = journeysList.filter(j => j.id !== journeyId)
    setJourneysList(updated)
    saveCustomJourneys(updated)

    if (activeJourneyId === journeyId) {
      const def = updated.find(j => j.isDefault) || updated[0]
      setActiveJourneyId(def ? def.id : 'default')
    }
    triggerToast(`Journey '${target.name}' deleted.`)
  }

  const handleSetDefaultJourney = (journeyId) => {
    const updated = journeysList.map(j => ({
      ...j,
      isDefault: j.id === journeyId
    }))
    setJourneysList(updated)
    saveCustomJourneys(updated)
    triggerToast("Default journey updated.")
  }

  const handleToggleJourneyStep = (statusValue) => {
    let updatedSteps
    if (journeySteps.includes(statusValue)) {
      updatedSteps = journeySteps.filter(v => v !== statusValue)
    } else {
      updatedSteps = [...journeySteps, statusValue]
    }
    const updatedJourneysList = journeysList.map(j => {
      if (j.id === activeJourneyId) {
        return { ...j, steps: updatedSteps }
      }
      return j
    })
    setJourneysList(updatedJourneysList)
    saveCustomJourneys(updatedJourneysList)
    triggerToast("Lead journey configuration updated.")
  }

  const handleMoveJourneyStep = (index, direction) => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === journeySteps.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updatedSteps = [...journeySteps]
    const temp = updatedSteps[index]
    updatedSteps[index] = updatedSteps[newIndex]
    updatedSteps[newIndex] = temp

    const updatedJourneysList = journeysList.map(j => {
      if (j.id === activeJourneyId) {
        return { ...j, steps: updatedSteps }
      }
      return j
    })
    setJourneysList(updatedJourneysList)
    saveCustomJourneys(updatedJourneysList)
    triggerToast("Lead journey step order updated.")
  }

  const handleClearJourney = () => {
    const updatedJourneysList = journeysList.map(j => {
      if (j.id === activeJourneyId) {
        return { ...j, steps: [] }
      }
      return j
    })
    setJourneysList(updatedJourneysList)
    saveCustomJourneys(updatedJourneysList)
    triggerToast("Lead journey cleared.")
  }

  const handleResetJourney = () => {
    const defaultJourney = ['NEW', 'ASSIGNED', 'CONTACTED', 'QUALIFIED', 'DEMO', 'PROPOSAL', 'NEGOTIATION', 'WON']
    const updatedJourneysList = journeysList.map(j => {
      if (j.id === activeJourneyId) {
        return { ...j, steps: defaultJourney }
      }
      return j
    })
    setJourneysList(updatedJourneysList)
    saveCustomJourneys(updatedJourneysList)
    triggerToast("Lead journey reset to defaults.")
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
      <div className="flex border-b border-[#c3c6d7] gap-6 mb-5 select-none">
        <button
          onClick={() => setActiveSettingsTab('session')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeSettingsTab === 'session' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
        >
          <span className="material-symbols-outlined text-[17px]">event_note</span>
          Session Creation
        </button>
        <button
          onClick={() => setActiveSettingsTab('import')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeSettingsTab === 'import' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
        >
          <span className="material-symbols-outlined text-[17px]">publish</span>
          Import Leads
        </button>
        <button
          onClick={() => setActiveSettingsTab('export')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeSettingsTab === 'export' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
        >
          <span className="material-symbols-outlined text-[17px]">download</span>
          Export Leads
        </button>
        <button
          onClick={() => setActiveSettingsTab('bulk')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeSettingsTab === 'bulk' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
        >
          <span className="material-symbols-outlined text-[17px]">chat</span>
          Bulk Messaging
        </button>
        <button
          onClick={() => setActiveSettingsTab('statuses')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeSettingsTab === 'statuses' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
        >
          <span className="material-symbols-outlined text-[17px]">category</span>
          Custom Statuses
        </button>
        <button
          onClick={() => setActiveSettingsTab('journey')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeSettingsTab === 'journey' ? 'border-[#2f7d9e] text-[#2f7d9e]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
        >
          <span className="material-symbols-outlined text-[17px]">route</span>
          Lead Journey
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
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left"
          >
            {/* Left Column: Session Configuration */}
            <div className="lg:col-span-6 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="pb-2.5">
                <h3 className="text-sm font-bold text-slate-800">Session Configuration</h3>
                <p className="text-[11px] text-slate-400">Configure parameters for active lead sessions.</p>
              </div>

              {/* Current Session */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Current Session</label>
                <input
                  type="text"
                  readOnly
                  value={currentSessionDate}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-[12px] font-medium outline-none"
                />
              </div>

              {/* Create new session prompt */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#1a202c] uppercase tracking-wider block">
                  Do you want to create a new session?
                </label>
                <div className="flex items-center gap-4 py-0.5">
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
                <p className="text-[10px] text-[#718096] leading-normal font-medium">
                  Please use this option very carefully as this is going to create a new session and you won't be able to view the current session's data.
                </p>
              </div>

              {/* New Session date range */}
              {sessionOption !== '' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1a202c] uppercase tracking-wider block">New Session From</label>
                  <input
                    type="text"
                    value={newSessionDate}
                    onChange={(e) => setNewSessionDate(e.target.value)}
                    placeholder="MM/DD/YYYY - MM/DD/YYYY"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                  />
                </div>
              )}
            </div>

            {/* Right Column: Security Verification & Actions */}
            <div className="lg:col-span-6 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="pb-2.5">
                <h3 className="text-sm font-bold text-slate-800">Security Verification</h3>
                <p className="text-[11px] text-slate-400">Verify phone authentication to authorize session generation.</p>
              </div>

              {sessionOption !== '' && (
                <div className="space-y-4">
                  {/* Send OTP */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Verification Phone</label>
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 focus-within:border-sky-500 transition-colors">
                      <input
                        type="tel"
                        disabled={otpVerified}
                        value={sessionPhone}
                        onChange={(e) => setSessionPhone(e.target.value)}
                        placeholder="8456822XXX"
                        className="flex-1 h-9 px-3 bg-white text-slate-850 text-[12px] font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed font-mono border-0 placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpVerified || !sessionPhone}
                        className="h-9 px-4 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[11.5px] font-bold flex items-center justify-center transition-all cursor-pointer whitespace-nowrap border-0"
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>

                  {/* Verify OTP */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Security OTP Code</label>
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 focus-within:border-sky-500 transition-colors">
                      <input
                        type="text"
                        disabled={otpVerified || !otpSent}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter OTP"
                        className="flex-1 h-9 px-3 bg-white text-slate-850 text-[12px] font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed font-mono border-0 placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpVerified || !otpSent || !otpCode}
                        className="h-9 px-4 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[11.5px] font-bold flex items-center justify-center transition-all cursor-pointer whitespace-nowrap border-0"
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
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#c3c6d7] flex justify-end">
                <button
                  type="submit"
                  disabled={creatingSession || !otpVerified}
                  className="h-9 px-6 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[12px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0"
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
                    "Create Session"
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
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left"
          >
            {/* Left Column: Import Parameters & File Upload */}
            <div className="lg:col-span-5 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="pb-2.5">
                <h3 className="text-sm font-bold text-slate-800">Import Configuration</h3>
                <p className="text-[11px] text-slate-400">Specify assignment parameters and upload leads file.</p>
              </div>

              {/* Counselor Assignment */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Assign Leads To</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500"
                >
                  {COUNSELORS.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Source Tag Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Lead Source</label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500"
                >
                  {SOURCES.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              {/* CSV File Upload dropzone */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Upload CSV File</label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full min-h-[90px] border border-dashed rounded-lg flex flex-col items-center justify-center p-3 transition-all cursor-pointer bg-[#f7fafc] ${dragActive ? 'border-sky-500 bg-sky-50/20' : 'border-slate-300 hover:border-sky-500'}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".csv"
                  />
                  {!file ? (
                    <div className="text-center space-y-1">
                      <span className="material-symbols-outlined text-[24px] text-slate-400">upload_file</span>
                      <p className="text-[11px] font-bold text-slate-700">Click or Drag CSV leads file here</p>
                      <p className="text-[9.5px] text-slate-400">Requires name, email, phone columns</p>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between p-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-[150px]">{file.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="w-5 h-5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center border-none bg-transparent cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  )}
                </div>
                {parseError && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    {parseError}
                  </p>
                )}
              </div>

              {/* Action button */}
              <div className="pt-3 border-t border-[#c3c6d7] flex justify-end">
                <button
                  type="submit"
                  disabled={importing || !file || parsedData.length === 0}
                  className="h-9 px-6 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[12px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0"
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
                    "Import Leads"
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Template Helpers & CSV Preview */}
            <div className="lg:col-span-7 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="border-b border-[#c3c6d7] pb-2.5 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">CSV Structure & Preview</h3>
                  <p className="text-[11px] text-slate-400">Required columns: name, email, phone</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="text-sky-600 hover:text-sky-700 flex items-center gap-0.5 border-none bg-transparent cursor-pointer font-bold text-[11px]"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  Sample CSV Template
                </button>
              </div>

              {parsedData.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-450 italic text-[11.5px] bg-[#fcfcfd]">
                  No data parsed yet. Select and upload a valid .csv file in the configuration panel.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-green-50 text-green-700 text-[10.5px] font-bold border border-green-200">
                      Parsed {parsedData.length} records successfully.
                    </span>
                  </div>

                  <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm">
                    <div className="bg-[#edf2f7] px-2.5 py-1.5 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Parsed CSV Preview (First 5 Rows)</span>
                    </div>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-[10.5px]">
                        <thead>
                          <tr className="bg-[#edf2f7] border-b border-slate-200 text-slate-500 font-semibold uppercase">
                            <th className="py-2 px-2.5 font-bold">Name</th>
                            <th className="py-2 px-2.5 font-bold">Email</th>
                            <th className="py-2 px-2.5 font-bold">Phone</th>
                            <th className="py-2 px-2.5 font-bold">Location</th>
                            <th className="py-2 px-2.5 font-bold">Campaign</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#c3c6d7] bg-white">
                          {parsedData.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 text-slate-700 font-medium">
                              <td className="py-2 px-2.5 truncate max-w-[100px]" title={row.name}>{row.name || 'N/A'}</td>
                              <td className="py-2 px-2.5 truncate max-w-[120px]" title={isMasked ? maskEmail(row.email) : row.email}>{isMasked ? maskEmail(row.email) : (row.email || 'N/A')}</td>
                              <td className="py-2 px-2.5 truncate max-w-[100px]" title={isMasked ? maskPhone(row.phone) : row.phone}>{isMasked ? maskPhone(row.phone) : (row.phone || 'N/A')}</td>
                              <td className="py-2 px-2.5 truncate max-w-[80px]" title={row.location}>{row.location || 'N/A'}</td>
                              <td className="py-2 px-2.5 truncate max-w-[80px]" title={row.campaign}>{row.campaign || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
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
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left"
          >
            {/* Left Column: Export Configuration */}
            <div className="lg:col-span-5 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="border-b border-[#c3c6d7] pb-2.5">
                <h3 className="text-sm font-bold text-slate-800">Export Configuration</h3>
                <p className="text-[11px] text-slate-400">Configure formatting and parameters for export.</p>
              </div>

              {/* Export Format */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Export Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500"
                >
                  <option value="CSV">CSV Format (.csv)</option>
                  <option value="JSON">JSON File (.json)</option>
                </select>
              </div>

              {/* Filter Counselor */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Filter by Assignee</label>
                <select
                  value={filterCounselor}
                  onChange={(e) => setFilterCounselor(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500"
                >
                  <option value="All Counselors">All Counselors</option>
                  {COUNSELORS.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Filter Source */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Filter by Source</label>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500"
                >
                  <option value="All Sources">All Sources</option>
                  {SOURCES.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              {/* Filter Status */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 text-[12px] font-semibold outline-none focus:border-sky-500"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>

              {/* Action button */}
              <div className="pt-3 border-t border-[#c3c6d7] flex justify-end">
                <button
                  type="submit"
                  disabled={exporting || filteredLeads.length === 0}
                  className="h-9 px-6 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[12px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0"
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
                    "Export Leads"
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Live Data Preview */}
            <div className="lg:col-span-7 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="border-b border-[#c3c6d7] pb-2.5">
                <h3 className="text-sm font-bold text-slate-800">Export Leads Live Preview</h3>
                <p className="text-[11px] text-slate-400">Preview leads matching active configuration filter selections.</p>
              </div>

              {filteredLeads.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-lg p-8 text-center text-red-500 italic text-[11.5px] bg-[#fffbfb] border-red-100">
                  No leads found matching the selected export filter options.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-750 text-[10.5px] font-bold border border-blue-200">
                      Ready to export: {filteredLeads.length} leads match filters.
                    </span>
                  </div>

                  <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm">
                    <div className="bg-[#edf2f7] px-2.5 py-1.5 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Export Preview (First 5 Rows)</span>
                    </div>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-[10.5px]">
                        <thead>
                          <tr className="bg-[#edf2f7] border-b border-slate-200 text-slate-500 font-semibold uppercase">
                            <th className="py-2 px-2.5 font-bold">ID</th>
                            <th className="py-2 px-2.5 font-bold">Name</th>
                            <th className="py-2 px-2.5 font-bold">Email</th>
                            <th className="py-2 px-2.5 font-bold">Assignee</th>
                            <th className="py-2 px-2.5 font-bold">Source</th>
                            <th className="py-2 px-2.5 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#c3c6d7] bg-white">
                          {filteredLeads.slice(0, 5).map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50 text-slate-700 font-medium">
                              <td className="py-2 px-2.5 text-slate-500 font-mono">{lead.id}</td>
                              <td className="py-2 px-2.5 truncate max-w-[90px]" title={lead.name}>{lead.name}</td>
                              <td className="py-2 px-2.5 truncate max-w-[110px]" title={isMasked ? maskEmail(lead.email) : lead.email}>{isMasked ? maskEmail(lead.email) : lead.email}</td>
                              <td className="py-2 px-2.5 truncate max-w-[95px]" title={lead.assignedTo}>{lead.assignedTo}</td>
                              <td className="py-2 px-2.5 truncate max-w-[85px]" title={lead.source}>{lead.source}</td>
                              <td className="py-2 px-2.5">
                                <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold border ${lead.status === 'NEW' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                                  lead.status === 'CONTACTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    lead.status === 'QUALIFIED' ? 'bg-green-50 text-green-700 border-green-200' :
                                      'bg-red-50 text-red-700 border-red-200'
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
                </div>
              )}
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
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left relative"
          >
            {/* Sending Progress Overlay */}
            {isSending && (
              <div className="absolute inset-0 bg-white/80 z-25 flex flex-col items-center justify-center space-y-3 rounded-xl backdrop-blur-xs">
                <span className="material-symbols-outlined text-[36px] text-[#2f7d9e] animate-bounce">chat</span>
                <p className="text-[12px] font-bold text-slate-800">Dispatching Bulk Messages...</p>
                <div className="w-[200px] h-2 bg-[#c3c6d7] rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-[#2f7d9e] transition-all duration-100"
                    style={{ width: `${sendingProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold">{sendingProgress}%</span>
              </div>
            )}

            {/* Left Column: Campaign Details */}
            <div className="lg:col-span-6 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="border-b border-[#c3c6d7] pb-2.5">
                <h3 className="text-sm font-bold text-slate-800">Campaign Content</h3>
                <p className="text-[11px] text-slate-400">Design your promotional or outreach message content.</p>
              </div>

              {/* Campaign Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Campaign Title</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Summer Outreach 2026"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                />
              </div>

              {/* Delivery Channel */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Delivery Channel</label>
                <div className="flex flex-wrap items-center gap-4 py-0.5">
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

              {/* Email Subject (Conditional) */}
              {(deliveryChannel === 'email' || deliveryChannel === 'both') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Subject</label>
                  <input
                    type="text"
                    value={campaignSubject}
                    onChange={(e) => setCampaignSubject(e.target.value)}
                    placeholder="Enter email subject header"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                  />
                </motion.div>
              )}

              {/* Message Body */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Message Body</label>
                <textarea
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  placeholder="Write your campaign message contents here... Use {name} for personalization."
                  rows={5}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500 resize-none font-sans placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Right Column: Audience Target Selection */}
            <div className="lg:col-span-6 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="border-b border-[#c3c6d7] pb-2.5">
                <h3 className="text-sm font-bold text-slate-800">Target Audience</h3>
                <p className="text-[11px] text-slate-400">Select target filters or enter a manual list.</p>
              </div>

              {/* Target Mode */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Target Recipients Mode</label>
                <div className="flex items-center gap-4 py-0.5">
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

              {/* Database Recipient Mode */}
              {targetMode === 'database' && (
                <div className="space-y-3.5 border-t border-[#c3c6d7] pt-3.5">
                  {/* Score Range Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Lead Score Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={minScore}
                        onChange={(e) => setMinScore(e.target.value)}
                        placeholder="Min Score"
                        className="w-[90px] h-9 px-2 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500 font-mono text-center placeholder:text-slate-400"
                      />
                      <span className="text-[12px] text-slate-400 font-bold">to</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        placeholder="Max Score"
                        className="w-[90px] h-9 px-2 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500 font-mono text-center placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Counselor Filter */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Counselor</label>
                    <select
                      value={targetCounselor}
                      onChange={(e) => setTargetCounselor(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500"
                    >
                      <option value="All Counselors">All Counselors</option>
                      {COUNSELORS.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Database Leads Preview */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Matching Targets</label>
                    {bulkTargetedLeads.length > 0 ? (
                      <div className="space-y-2">
                        <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-750 text-[10.5px] font-bold border border-blue-200">
                          Ready to target: {bulkTargetedLeads.length} leads matched.
                        </span>

                        <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm">
                          <div className="bg-[#edf2f7] px-2.5 py-1.5 border-b border-slate-200">
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Target Preview (First 5 Rows)</span>
                          </div>
                          <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse text-[10.5px]">
                              <thead>
                                <tr className="bg-[#edf2f7] border-b border-slate-200 text-slate-500 font-semibold uppercase">
                                  <th className="py-2 px-2.5 font-bold">ID</th>
                                  <th className="py-2 px-2.5 font-bold">Name</th>
                                  <th className="py-2 px-2.5 font-bold">Email</th>
                                  <th className="py-2 px-2.5 font-bold">Score</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#c3c6d7] bg-white">
                                {bulkTargetedLeads.slice(0, 5).map((lead) => (
                                  <tr key={lead.id} className="hover:bg-slate-50 text-slate-700 font-medium">
                                    <td className="py-2 px-2.5 text-slate-500 font-mono">{lead.id}</td>
                                    <td className="py-2 px-2.5 truncate max-w-[100px]" title={lead.name}>{lead.name}</td>
                                    <td className="py-2 px-2.5 truncate max-w-[120px]" title={isMasked ? maskEmail(lead.email) : lead.email}>{isMasked ? maskEmail(lead.email) : lead.email}</td>
                                    <td className="py-2 px-2.5 font-bold text-sky-600 font-mono">{lead.score}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded bg-red-50 text-red-750 text-[10.5px] font-bold border border-red-200">
                        No leads matched the selected filter criteria.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Manual Recipient Mode */}
              {targetMode === 'manual' && (
                <div className="space-y-3.5 border-t border-[#c3c6d7] pt-3.5">
                  {/* Manual List Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Recipients Input List</label>
                    <textarea
                      value={manualRecipients}
                      onChange={(e) => setManualRecipients(e.target.value)}
                      placeholder="Paste target emails and numbers (separated by commas, spaces, or lines)&#10;e.g. support@domain.com, +15550199, client@email.org"
                      rows={4}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500 resize-none font-mono placeholder:text-slate-400"
                    />
                    <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                      The parser extracts valid email formats and 7-20 digit phone numbers automatically.
                    </p>
                  </div>

                  {/* Parsing Results Preview */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Parsing Status</label>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10.5px] font-bold border ${parsedManualRecipients.emails.length > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        {parsedManualRecipients.emails.length} Valid Emails
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-[10.5px] font-bold border ${parsedManualRecipients.phones.length > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        {parsedManualRecipients.phones.length} Valid Phone Numbers
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action button */}
              <div className="pt-3 border-t border-[#c3c6d7] flex justify-end">
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
                  className="h-9 px-6 bg-[#2f7d9e] hover:bg-[#206587] disabled:bg-[#a0aec0] text-white text-[12px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  Send Bulk Campaign
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* TAB 5: CUSTOM STATUSES */}
        {activeSettingsTab === 'statuses' && (
          <motion.div
            key="statuses-tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
            {/* Left Column: Form to create / edit */}
            <form onSubmit={editingStatusValue ? handleShowEditWarning : handleAddStatus} className="lg:col-span-4 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="border-b border-[#c3c6d7] pb-2.5">
                <h3 className="text-sm font-bold text-slate-800">
                  {editingStatusValue ? `Edit Status` : 'Create Status'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {editingStatusValue ? `Modify details for key: ${editingStatusValue}` : 'Add a new pipeline stage for your CRM workflow.'}
                </p>
              </div>

              {/* Status Key */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Status Key (Unique ID)</label>
                <input
                  type="text"
                  disabled={editingStatusValue !== null}
                  value={newStatusValue}
                  onChange={(e) => setNewStatusValue(e.target.value)}
                  placeholder="e.g. CALL_BACK, DEMO_DONE"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                />
                {!editingStatusValue && (
                  <span className="text-[9.5px] text-slate-400 block">Capital letters, numbers, and underscores only.</span>
                )}
              </div>

              {/* Display Label */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Display Label</label>
                <input
                  type="text"
                  value={newStatusLabel}
                  onChange={(e) => setNewStatusLabel(e.target.value)}
                  placeholder="e.g. Call Back Later, Demo Done"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500 placeholder:text-slate-400"
                />
              </div>

              {/* Color Tag Selection */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Badge Color Theme</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 cursor-pointer hover:border-slate-350 transition-colors shadow-2xs">
                    <input
                      type="color"
                      value={newStatusColor}
                      onChange={(e) => handleColorValueChange(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-[2]"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 w-10">HEX</span>
                      <input
                        type="text"
                        value={colorHex}
                        onChange={onHexChange}
                        placeholder="#3b82f6"
                        className="flex-1 h-7 px-2 rounded border border-slate-200 bg-white text-slate-850 text-[11px] font-mono outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 w-10">RGB</span>
                      <input
                        type="text"
                        value={colorRgb}
                        onChange={onRgbChange}
                        placeholder="rgb(59, 130, 246)"
                        className="flex-1 h-7 px-2 rounded border border-slate-200 bg-white text-slate-850 text-[11px] font-mono outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 w-10">RGBA</span>
                      <input
                        type="text"
                        value={colorRgba}
                        onChange={onRgbaChange}
                        placeholder="rgba(59, 130, 246, 1)"
                        className="flex-1 h-7 px-2 rounded border border-slate-200 bg-white text-slate-850 text-[11px] font-mono outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Description</label>
                <textarea
                  value={newStatusDesc}
                  onChange={(e) => setNewStatusDesc(e.target.value)}
                  placeholder="Describe when this status is used..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-850 text-[12px] font-semibold outline-none focus:border-sky-500 resize-none font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#c3c6d7]">
                <button
                  type="submit"
                  className="flex-grow h-9 px-5 bg-[#2f7d9e] hover:bg-[#206587] text-white text-[12px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {editingStatusValue ? 'save' : 'add'}
                  </span>
                  {editingStatusValue ? 'Update Status' : 'Create Status'}
                </button>
                {editingStatusValue && (
                  <button
                    type="button"
                    onClick={handleCancelEditStatus}
                    className="h-9 px-4 bg-[#c3c6d7] hover:bg-slate-200 text-slate-700 text-[12px] font-bold rounded-lg transition-all cursor-pointer border border-slate-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Right Column: List of existing */}
            <div className="lg:col-span-8 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="border-b border-[#c3c6d7] pb-2.5">
                <h3 className="text-sm font-bold text-slate-800">Active CRM Statuses</h3>
                <p className="text-[11px] text-slate-400">Manage all default and custom-defined statuses in the pipeline.</p>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse text-[10.5px]">
                    <thead>
                      <tr className="bg-[#edf2f7] border-b border-slate-200 text-slate-500 font-semibold uppercase">
                        <th className="py-2 px-3 font-bold">Badge Preview</th>
                        <th className="py-2 px-3 font-bold">Status Key</th>
                        <th className="py-2 px-3 font-bold">Description</th>
                        <th className="py-2 px-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c3c6d7] bg-white">
                      {statusesList.map((status) => {
                        return (
                          <tr key={status.value} className="hover:bg-slate-50 text-slate-700 font-medium">
                            <td className="py-2.5 px-3">
                              <span
                                className="px-2 py-0.5 rounded text-[9.5px] font-bold border"
                                style={getStatusStyle(status.value, statusesList)}
                              >
                                {status.label}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[10.5px] text-slate-655">{status.value}</td>
                            <td className="py-2.5 px-3 text-slate-500 max-w-[250px] truncate" title={status.description}>
                              {status.description}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center gap-1 justify-end select-none">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditStatus(status)}
                                  className="w-6 h-6 rounded-full hover:bg-[#c3c6d7] text-slate-450 hover:text-slate-750 flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors"
                                  title="Edit status"
                                >
                                  <span className="material-symbols-outlined text-[15.5px]">edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStartDeleteStatus(status.value)}
                                  className="w-6 h-6 rounded-full hover:bg-rose-50 text-slate-450 hover:text-red-500 flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors"
                                  title="Delete status"
                                >
                                  <span className="material-symbols-outlined text-[15px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: LEAD JOURNEY SEQUENCE */}
        {activeSettingsTab === 'journey' && (
          <motion.div
            key="journey-tab"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="w-full text-left space-y-6"
          >
            {/* Journeys List Panel */}
            <div className="bg-white border border-[#c3c6d7] rounded-xl p-5 space-y-4 shadow-2xs">
              <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#c3c6d7] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Active Sales Pipelines</h3>
                  <p className="text-[11px] text-slate-400">Configure multiple customer journeys and set a default pipeline.</p>
                </div>
                {/* Create Pipeline Form */}
                <form onSubmit={handleAddJourney} className="flex gap-1.5 items-center">
                  <input
                    type="text"
                    value={newJourneyName}
                    onChange={(e) => setNewJourneyName(e.target.value)}
                    placeholder="e.g. MBA Admissions, Sales Pipeline"
                    className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-850 text-[11px] font-semibold outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="h-8.5 px-3.5 bg-[#2f7d9e] hover:bg-[#206587] text-white text-[11px] font-bold rounded-lg flex items-center gap-0.5 shadow-2xs transition-colors cursor-pointer border-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    Create Pipeline
                  </button>
                </form>
              </div>

              {/* Journey Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {journeysList.map(j => {
                  const isActive = j.id === activeJourneyId
                  return (
                    <div
                      key={j.id}
                      onClick={() => setActiveJourneyId(j.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left relative flex flex-col justify-between min-h-[90px] ${isActive
                        ? 'border-sky-500 bg-sky-50/10 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-350'
                        }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[12px] font-bold truncate max-w-[100px] ${isActive ? 'text-sky-700' : 'text-slate-700'}`} title={j.name}>
                            {j.name}
                          </span>
                          {j.isDefault && (
                            <span className="text-[7.5px] bg-sky-100 text-sky-750 px-1 py-0.2 rounded font-extrabold uppercase border border-sky-200">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-medium">
                          {j.steps.length} {j.steps.length === 1 ? 'step' : 'steps'} configured
                        </p>
                      </div>

                      {/* Journey Actions */}
                      <div className="flex gap-2.5 justify-end mt-2.5 border-t border-[#c3c6d7] pt-1.5 select-none" onClick={(e) => e.stopPropagation()}>
                        {!j.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultJourney(j.id)}
                            className="text-[9.5px] font-extrabold text-sky-600 hover:text-sky-700 hover:underline border-none bg-transparent cursor-pointer"
                          >
                            Set Default
                          </button>
                        )}
                        {!j.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleDeleteJourney(j.id)}
                            className="text-[9.5px] font-extrabold text-red-500 hover:text-red-650 hover:underline border-none bg-transparent cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stepper configurations grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: All active statuses selection */}
              <div className="lg:col-span-4 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
                <div className="border-b border-[#c3c6d7] pb-2.5 flex justify-between items-center gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Statuses Picker</h3>
                    <p className="text-[10px] text-slate-400">Choose pipeline steps for: <span className="font-bold text-slate-700">{activeJourney?.name}</span></p>
                  </div>
                </div>

                <p className="text-[9.5px] text-slate-500 leading-relaxed font-medium">
                  Check the statuses below to include them in the active customer lifecycle flow.
                </p>

                <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                  {statusesList.map(status => {
                    const isChecked = journeySteps.includes(status.value)
                    return (
                      <label key={status.value} className="flex items-center gap-2.5 p-2 bg-white hover:bg-slate-50 border border-[#c3c6d7] rounded-lg cursor-pointer transition-colors shadow-2xs select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleJourneyStep(status.value)}
                          className="w-3.5 h-3.5 cursor-pointer accent-primary rounded border-slate-350 text-primary"
                        />
                        <div className="flex flex-col text-[10.5px]">
                          <span className="font-bold text-slate-700 leading-tight">{status.label}</span>
                          <span className="text-[9.5px] text-slate-400 truncate max-w-[180px]">{status.description}</span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Ordered stepper sequence */}
              <div className="lg:col-span-8 bg-white border border-[#c3c6d7] rounded-xl p-5 shadow-2xs space-y-4">
                <div className="border-b border-[#c3c6d7] pb-2.5 flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Stepper Progression Order</h3>
                    <p className="text-[10px] text-slate-400">Arrange progression sequence (left to right / top to bottom).</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleClearJourney}
                      className="h-7 px-2 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[13px]">clear_all</span>
                      Clear Steps
                    </button>
                    <button
                      type="button"
                      onClick={handleResetJourney}
                      className="h-7 px-2 bg-slate-50 hover:bg-[#c3c6d7] text-slate-655 border border-slate-200 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[13px]">restart_alt</span>
                      Reset Defaults
                    </button>
                  </div>
                </div>

                <p className="text-[9.5px] text-slate-500 font-medium">
                  Sort the order of statuses representing steps 1 to N of the customer pipeline.
                </p>

                {journeySteps.length === 0 ? (
                  <div className="border border-dashed border-slate-250 rounded-lg p-10 text-center text-slate-450 italic text-[11px] bg-slate-50">
                    No statuses enabled in stepper yet. Enable statuses using the picker panel on the left.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {journeySteps.map((stepVal, idx) => {
                      const status = statusesList.find(s => s.value === stepVal)
                      if (!status) return null

                      return (
                        <div
                          key={stepVal}
                          className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg shadow-2xs hover:shadow-xs transition-shadow text-[11px]"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-md bg-[#c3c6d7] flex items-center justify-center font-bold text-slate-500 font-mono text-[9.5px]">
                              {idx + 1}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded text-[9.5px] font-bold border"
                              style={getStatusStyle(stepVal, statusesList)}
                            >
                              {status.label}
                            </span>
                            <span className="font-mono text-[9.5px] text-slate-400">({status.value})</span>
                          </div>

                          <div className="flex items-center gap-0.5 select-none">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveJourneyStep(idx, 'up')}
                              className="w-6 h-6 rounded-full hover:bg-[#c3c6d7] disabled:opacity-30 disabled:hover:bg-transparent text-slate-500 flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors"
                              title="Move step up"
                            >
                              <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
                            </button>
                            <button
                              type="button"
                              disabled={idx === journeySteps.length - 1}
                              onClick={() => handleMoveJourneyStep(idx, 'down')}
                              className="w-6 h-6 rounded-full hover:bg-[#c3c6d7] disabled:opacity-30 disabled:hover:bg-transparent text-slate-500 flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors"
                              title="Move step down"
                            >
                              <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Status Warning Modal Overlay */}
      <AnimatePresence>
        {showStatusEditWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusEditWarning(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden relative z-10 flex flex-col text-left font-sans"
            >
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50 to-white">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-500 text-[18px]">warning</span>
                    Update CRM Status
                  </h3>
                  <p className="text-[9.5px] text-slate-500 mt-0.5">Warning: Status modification affects pipeline analytics.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStatusEditWarning(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-[11px] text-slate-655 leading-relaxed">
                  Are you sure you want to update the status <span className="font-bold text-slate-800">"{editingStatusValue}"</span>? 
                  Renaming badges or updating color mappings may impact active leads and steps mapped to sales journeys.
                </p>
                <div className="border-t border-slate-100 pt-3.5 flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowStatusEditWarning(false)}
                    className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    className="px-4 py-1.5 bg-[#2f7d9e] hover:bg-[#206587] text-white rounded text-[11px] font-bold shadow-xs transition-all cursor-pointer border-0"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Status Warning Modal Overlay */}
      <AnimatePresence>
        {showStatusDeleteWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusDeleteWarning(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden relative z-10 flex flex-col text-left font-sans"
            >
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-red-50 to-white">
                <div>
                  <h3 className="text-[13px] font-bold text-red-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-red-650 text-[18px]">gpp_maybe</span>
                    Delete CRM Status
                  </h3>
                  <p className="text-[9.5px] text-red-500 mt-0.5">Warning: Deletion is permanent and destructive.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStatusDeleteWarning(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-[11px] text-slate-655 leading-relaxed">
                  Are you sure you want to permanently delete the status <span className="font-bold text-slate-800">"{statusToDelete}"</span>? 
                  This will remove the stage from all pipeline journeys, and leads currently on this stage will be unmapped.
                </p>
                <div className="border-t border-slate-100 pt-3.5 flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowStatusDeleteWarning(false)}
                    className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeleteStatus}
                    className="px-4 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded text-[11px] font-bold shadow-xs transition-all cursor-pointer border-0"
                  >
                    Yes, Delete Status
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
