import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AllLeads() {
  const [selectedLeads, setSelectedLeads] = useState([])
  const [activeLeadDetails, setActiveLeadDetails] = useState(null)

  // Sorting, Searching and Filtering state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Live sidebar interaction states
  const [editingScore, setEditingScore] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [interactionType, setInteractionType] = useState('COMMENT')

  // Interactivity animation states
  const [exporting, setExporting] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [playingRecording, setPlayingRecording] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)

  // -- NEW STATE HOOKS FOR ADVANCED CRM FEATURES --
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    phone: true,
    score: true,
    status: true,
    assignedTo: true,
    source: true,
    tier: true,
    verified: true,
    location: false,
    campaign: false
  })
  const [showColumnDropdown, setShowColumnDropdown] = useState(false)

  // -- NEW STATE HOOKS FOR LEAD ACTIONS POPUPS --
  const [activeDropdownLeadId, setActiveDropdownLeadId] = useState(null)
  const [showQueriesModal, setShowQueriesModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [activeModalLead, setActiveModalLead] = useState(null)
  const [queriesAnswerText, setQueriesAnswerText] = useState('')
  const [showReassignSubId, setShowReassignSubId] = useState(null)

  // -- NEW STATE HOOKS FOR GLOBAL ACTIONS DROPDOWN & MODALS --
  const [showGlobalActionsDropdown, setShowGlobalActionsDropdown] = useState(false)
  const [showQuickLeadModal, setShowQuickLeadModal] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [showGlobalStageModal, setShowGlobalStageModal] = useState(false)
  const [quickLeadForm, setQuickLeadForm] = useState({ name: '', email: '', phone: '', assignedTo: 'Sarah Jenkins' })
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const [downloadingLeadsState, setDownloadingLeadsState] = useState(false)
  const [timelineFilter, setTimelineFilter] = useState('ALL')
  const [timelineSearchQuery, setTimelineSearchQuery] = useState('')
  const [activeSavedTab, setActiveSavedTab] = useState('all')
  const [activeBlockFilter, setActiveBlockFilter] = useState('all')
  const [dropdownFlipUp, setDropdownFlipUp] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 })
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState('1x')
  const [playbackProgress, setPlaybackProgress] = useState(30)
  const [mergeSelectedProps, setMergeSelectedProps] = useState({
    name: 'Amina Patel',
    email: 'apatel.design@studio.co',
    phone: '+44 7890 90877',
    status: 'QUALIFIED',
    assignedTo: 'Sarah Jenkins',
    source: 'Referral',
    score: 95,
    location: 'London, UK',
    campaign: 'Referral_Promo'
  })

  const handlePropSelection = (field, value) => {
    setMergeSelectedProps(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Active Waveform Playback Simulator
  React.useEffect(() => {
    let interval = null
    if (audioPlaying) {
      const speedFactor = playbackSpeed === '2x' ? 2 : playbackSpeed === '1.5x' ? 1.5 : 1
      interval = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setAudioPlaying(false)
            return 0
          }
          return Math.min(prev + speedFactor * 1.5, 100)
        })
      }, 300)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [audioPlaying, playbackSpeed])

  // Duplicate Lead Matcher Rule Engine
  const getDuplicateRecord = (lead) => {
    if (!lead) return null
    return leads.find(l => l.id !== lead.id && l.email === lead.email)
  }

  // Default chronological timelines database template
  const getInitialTimeline = (lead) => [
    {
      id: 1,
      type: 'STATUS_CHANGE',
      title: `Status changed to ${lead.status === 'NEW' ? 'Callback Later' : lead.status}`,
      date: 'Oct 24, 14:32:01',
      user: 'John Doe',
      ip: '192.168.1.105',
      icon: 'update',
      color: '#c2410c'
    },
    {
      id: 2,
      type: 'COMMENT',
      title: 'Comment added',
      date: 'Oct 24, 14:30:15',
      body: '"Left a voicemail. Will try again tomorrow morning."',
      user: 'John Doe',
      ip: '192.168.1.105',
      icon: 'chat',
      color: 'slate-400'
    },
    {
      id: 3,
      type: 'ASSIGNMENT',
      title: 'Counselor Assigned',
      date: 'Oct 24, 09:15:00',
      body: `Assigned to: ${lead.assignedTo}`,
      user: 'SYSTEM: Auto-Routing',
      ip: '10.0.0.42',
      icon: 'person_add',
      color: 'blue-600'
    },
    {
      id: 4,
      type: 'STATUS_CHANGE_FLOW',
      title: 'Status changed',
      date: 'Oct 24, 09:14:50',
      body: { from: 'New', to: 'Assigned' },
      user: 'Admin',
      ip: '10.0.0.42',
      icon: 'swap_horiz',
      color: 'slate-400'
    },
    {
      id: 5,
      type: 'CREATION',
      title: 'Lead Created',
      date: 'Oct 24, 08:02:11',
      body: `Via Form Submit: Landing Page`,
      user: lead.name,
      ip: '73.282.14.88',
      icon: 'add_circle',
      color: 'slate-800'
    },
    {
      id: 6,
      type: 'EMAIL',
      title: 'Email Sent',
      date: 'Oct 24, 07:45:00',
      body: 'Subject: Introduction to LeadPro CRM',
      user: 'John Doe',
      ip: '192.168.1.105',
      icon: 'mail',
      color: 'blue-600'
    },
    {
      id: 7,
      type: 'CALL',
      title: 'Phone Call',
      date: 'Oct 23, 16:15:50',
      body: 'Duration: 04:22',
      user: 'John Doe',
      ip: '192.168.1.105',
      icon: 'call',
      color: 'slate-400',
      recording: true
    },
    {
      id: 8,
      type: 'TAG',
      title: 'Tag Added',
      date: 'Oct 23, 15:00:12',
      body: 'High Value',
      user: 'Admin',
      ip: '10.0.0.42',
      icon: 'sell',
      color: 'amber-800'
    },
    {
      id: 9,
      type: 'MEETING',
      title: 'Meeting Scheduled',
      date: 'Oct 23, 11:20:00',
      body: 'Date: Oct 28, 10:00 AM',
      user: 'John Doe',
      ip: '192.168.1.105',
      icon: 'video_call',
      color: 'slate-400'
    }
  ]

  // Default Lead Application Profiles database templates
  const getInitialApplication = (lead) => {
    const apps = {
      'LS-1021': {
        appliedProgram: 'Enterprise CRM Integration Suite',
        submissionDate: 'Oct 22, 2026',
        companyName: 'Penthilgon Enterprises',
        companySize: '500+ employees',
        annualRevenue: '$25M - $50M',
        useCase: 'Consolidating lead routing and phone record logs across 3 regional branches.',
        notes: 'Requested expedited onboarding schedule due to legacy system contract expiry next month.'
      },
      'LS-1020': {
        appliedProgram: 'Professional Tier (Monthly Plan)',
        submissionDate: 'Oct 23, 2026',
        companyName: 'Reed Consulting Group',
        companySize: '15-49 employees',
        annualRevenue: '$1.5M - $3M',
        useCase: 'Outbound sales follow-ups and marketing attribution tracking.',
        notes: 'Expressed interest in setting up webhooks to feed into Slack channel.'
      },
      'LS-1019': {
        appliedProgram: 'Custom Enterprise Plan',
        submissionDate: 'Oct 24, 2026',
        companyName: 'Patel & Partners Design Studio',
        companySize: '50-100 employees',
        annualRevenue: '$8M - $12M',
        useCase: 'Client portal synchronization and advanced analytics dashboard integration.',
        notes: 'Highly focused on design aesthetics and responsive timeline views.'
      },
      'LS-1018': {
        appliedProgram: 'Starter Solo Plan',
        submissionDate: 'Oct 24, 2026',
        companyName: 'Solarix Energy IE',
        companySize: '2-9 employees',
        annualRevenue: '$200k - $500k',
        useCase: 'Tracking solar panel install sales pipelines in Dublin area.',
        notes: 'Referred by direct mail promo code Q1_Direct_Mail.'
      },
      'LS-1017': {
        appliedProgram: 'Professional CRM Bundle',
        submissionDate: 'Oct 23, 2026',
        companyName: 'Fintech HK Partners',
        companySize: '100-249 employees',
        annualRevenue: '$15M - $20M',
        useCase: 'Tracking high-net-worth investor onboarding flows and webinars.',
        notes: 'Requires dual language support (English/Cantonese) in communication drafts.'
      },
      'LS-1016': {
        appliedProgram: 'Standard Professional Tier',
        submissionDate: 'Oct 21, 2026',
        companyName: 'RealTech Solutions LLC',
        companySize: '10-24 employees',
        annualRevenue: '$1M - $2M',
        useCase: 'Replacing current Excel spreadsheet to track property investor contacts.',
        notes: 'Lost lead - contact requested to be unsubscribed from further cold outreach.'
      },
      'LS-1015': {
        appliedProgram: 'Custom Enterprise Plan',
        submissionDate: 'Oct 24, 2026',
        companyName: 'Patel Design Studio UK',
        companySize: '50-100 employees',
        annualRevenue: '$8M - $12M',
        useCase: 'Duplicate profile created via different landing page form.',
        notes: 'To be merged with LS-1019 primary profile.'
      }
    }
    return apps[lead.id] || {
      appliedProgram: 'Standard Professional Tier',
      submissionDate: 'Oct 24, 2026',
      companyName: lead.name + ' Corp',
      companySize: '10-49 employees',
      annualRevenue: '$1M - $3M',
      useCase: 'Pipeline tracking and customer engagement trail.',
      notes: 'No additional notes provided.'
    }
  }

  // Default support inquiries and customer queries
  const getInitialQueries = (lead) => {
    const queries = {
      'LS-1021': [
        { id: 1, question: 'Do you offer custom SLA agreements for enterprise packages?', date: 'Oct 23, 2026', status: 'RESOLVED', response: 'Yes, we provide 99.9% uptime custom SLAs for contract values exceeding $10k/yr.' },
        { id: 2, question: 'Is training included for all team members, or is it an add-on?', date: 'Oct 24, 2026', status: 'PENDING', response: null }
      ],
      'LS-1020': [
        { id: 1, question: 'Can we integrate custom SIP phone numbers with the audio playback recorder?', date: 'Oct 24, 2026', status: 'PENDING', response: null }
      ],
      'LS-1019': [
        { id: 1, question: 'Can we export timelines directly into CSV format for client invoicing?', date: 'Oct 24, 2026', status: 'RESOLVED', response: 'Absolutely. There is an Export button on the top-right of the Timeline panel.' }
      ],
      'LS-1018': [
        { id: 1, question: 'Do you charge a setup fee for importing from Hubspot?', date: 'Oct 24, 2026', status: 'PENDING', response: null }
      ],
      'LS-1017': [
        { id: 1, question: 'How do we request custom campaign tags for lead links?', date: 'Oct 24, 2026', status: 'RESOLVED', response: 'You can define custom parameters directly under the UTM Campaign setting tab.' }
      ],
      'LS-1016': [],
      'LS-1015': []
    }
    return queries[lead.id] || []
  }

  // Interactive local leads database array state
  const [leads, setLeads] = useState([
    { id: 'LS-1021', name: 'Eleanor Penthilgon', email: 'eleanor.p@enterprise.com', phone: '+1 (555) 617-2834', status: 'NEW', assignedTo: 'Sarah Jenkins', source: 'Website Organic', score: 92, location: 'Austin, TX', campaign: 'Q3_Tech_Promo', tier: 'Primary', verified: true },
    { id: 'LS-1020', name: 'Jackson Reed', email: 'j.reed88@gmail.com', phone: '+1 (555) 837-1126', status: 'CONTACTED', assignedTo: 'Marcus Chan', source: 'Paid Search', score: 74, location: 'Houston, TX', campaign: 'Q3_Tech_Promo', tier: 'Secondary', verified: true },
    { id: 'LS-1019', name: 'Amina Patel', email: 'apatel.design@studio.co', phone: '+44 7890 90877', status: 'QUALIFIED', assignedTo: 'Sarah Jenkins', source: 'Referral', score: 95, location: 'London, UK', campaign: 'Referral_Promo', tier: 'Primary', verified: true },
    { id: 'LS-1018', name: "Liam O'Connor", email: 'liam.o@solarix.ie', phone: '+353 1 234 5678', status: 'NEW', assignedTo: 'Unassigned', source: 'Direct Mail', score: 40, location: 'Dublin, IE', campaign: 'Q1_Direct_Mail', tier: 'Tertiary', verified: false },
    { id: 'LS-1017', name: 'Sophia Wong', email: 's.wong@fintech.com', phone: '+852 9123 4567', status: 'CONTACTED', assignedTo: 'Marcus Chan', source: 'Webinar', score: 81, location: 'Hong Kong, HK', campaign: 'Q3_Fintech_Webinar', tier: 'Primary', verified: false },
    { id: 'LS-1016', name: 'David Miller', email: 'dmiller@realtech.io', phone: '+1 (555) 908-1212', status: 'LOST', assignedTo: 'Sarah Jenkins', source: 'Cold Outreach', score: 15, location: 'Boston, MA', campaign: 'Cold_Outreach_Q2', tier: 'Tertiary', verified: true },
    { id: 'LS-1015', name: 'Amina Patel (Duplicate)', email: 'apatel.design@studio.co', phone: '+44 7890 99999', status: 'NEW', assignedTo: 'Marcus Chan', source: 'Cold Outreach', score: 62, location: 'Manchester, UK', campaign: 'Cold_Outreach_Q2', tier: 'Secondary', verified: false }
  ].map(lead => {
    // Dynamically inject custom initial timelines into database records
    return { ...lead, timeline: [], application: getInitialApplication(lead), queries: getInitialQueries(lead) }
  }).map((lead, idx) => {
    // Explicitly seed initialized logs
    const seed = [
      { id: 'LS-1021', name: 'Sarah Miller', status: 'NEW', assignedTo: 'Sarah Jenkins' },
      { id: 'LS-1020', name: 'Jackson Reed', status: 'CONTACTED', assignedTo: 'Marcus Chan' },
      { id: 'LS-1019', name: 'Amina Patel', status: 'QUALIFIED', assignedTo: 'Sarah Jenkins' },
      { id: 'LS-1018', name: "Liam O'Connor", status: 'NEW', assignedTo: 'Unassigned' },
      { id: 'LS-1017', name: 'Sophia Wong', status: 'CONTACTED', assignedTo: 'Marcus Chan' },
      { id: 'LS-1016', name: 'David Miller', status: 'LOST', assignedTo: 'Sarah Jenkins' },
      { id: 'LS-1015', name: 'Amina Patel (Duplicate)', status: 'NEW', assignedTo: 'Marcus Chan' }
    ][idx]
    return { ...lead, timeline: getInitialTimeline(seed) }
  }))

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-700'
      case 'CONTACTED':
        return 'bg-orange-100 text-orange-700'
      case 'QUALIFIED':
        return 'bg-green-100 text-green-700'
      case 'LOST':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-600 text-white border-blue-700'
      case 'CONTACTED': return 'bg-[#c2410c] text-white border-orange-700'
      case 'QUALIFIED': return 'bg-green-600 text-white border-green-700'
      case 'LOST': return 'bg-red-600 text-white border-red-700'
      default: return 'bg-slate-600 text-white border-slate-700'
    }
  }

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredAndSortedLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredAndSortedLeads.map(lead => lead.id))
    }
  }

  const toggleSelectLead = (id) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id))
    } else {
      setSelectedLeads([...selectedLeads, id])
    }
  }

  // Dynamic Initials Generator
  const getInitials = (name) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'LD'
  }

  // Export action handler with loading state
  const handleExportTimeline = () => {
    if (exporting) return
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      triggerToast('Timeline interactions exported successfully as CSV')
    }, 1200)
  }

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg(null)
    }, 3000)
  }

  // ADVANCED SORTING LOGIC
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return <span className="material-symbols-outlined text-[12px] text-slate-300 ml-1 select-none">unfold_more</span>
    }
    return sortConfig.direction === 'asc' ? (
      <span className="material-symbols-outlined text-[12px] text-primary ml-1 select-none">arrow_upward</span>
    ) : (
      <span className="material-symbols-outlined text-[12px] text-primary ml-1 select-none">arrow_downward</span>
    )
  }

  const sortedLeads = useMemo(() => {
    let sortableItems = [...leads]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        if (aValue === undefined || aValue === null) return 1
        if (bValue === undefined || bValue === null) return -1

        if (sortConfig.key === 'score') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }

        if (typeof aValue === 'boolean') {
          const aNum = aValue ? 1 : 0
          const bNum = bValue ? 1 : 0
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
        }

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        return 0
      })
    }
    return sortableItems
  }, [leads, sortConfig])

  const filteredAndSortedLeads = useMemo(() => {
    return sortedLeads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === 'all' || lead.status === filterStatus

      // Saved View tabs filtering
      let matchesSavedTab = true
      if (activeSavedTab === 'hot') {
        matchesSavedTab = lead.score >= 76
      } else if (activeSavedTab === 'unassigned') {
        matchesSavedTab = lead.assignedTo === 'Unassigned'
      } else if (activeSavedTab === 'qualified') {
        matchesSavedTab = lead.status === 'QUALIFIED'
      }

      // KPI blocks metrics filtering
      let matchesBlock = true
      if (activeBlockFilter === 'primary') {
        matchesBlock = lead.tier === 'Primary'
      } else if (activeBlockFilter === 'secondary') {
        matchesBlock = lead.tier === 'Secondary'
      } else if (activeBlockFilter === 'tertiary') {
        matchesBlock = lead.tier === 'Tertiary'
      } else if (activeBlockFilter === 'verified') {
        matchesBlock = lead.verified === true
      } else if (activeBlockFilter === 'unverified') {
        matchesBlock = lead.verified === false
      } else if (activeBlockFilter === 'not_assigned') {
        matchesBlock = lead.assignedTo === 'Unassigned'
      }

      return matchesSearch && matchesStatus && matchesSavedTab && matchesBlock
    })
  }, [sortedLeads, searchQuery, filterStatus, activeSavedTab, activeBlockFilter])

  const filteredTimeline = useMemo(() => {
    if (!activeLeadDetails || !activeLeadDetails.timeline) return []
    return activeLeadDetails.timeline.filter(event => {
      // Filter by chip category
      if (timelineFilter !== 'ALL') {
        if (timelineFilter === 'CALLS' && event.type !== 'CALL') return false
        if (timelineFilter === 'EMAILS' && event.type !== 'EMAIL') return false
        if (timelineFilter === 'COMMENTS' && event.type !== 'COMMENT') return false
        if (timelineFilter === 'SYSTEM' && !['SYSTEM', 'CREATION', 'STATUS_CHANGE', 'STATUS_CHANGE_FLOW', 'ASSIGNMENT', 'SCORE_CHANGE', 'TAG'].includes(event.type)) return false
      }

      // Filter by search keyword
      if (timelineSearchQuery.trim()) {
        const query = timelineSearchQuery.toLowerCase()
        const matchTitle = event.title?.toLowerCase().includes(query)
        const matchBody = typeof event.body === 'string' ? event.body.toLowerCase().includes(query) : false
        const matchUser = event.user?.toLowerCase().includes(query)
        return matchTitle || matchBody || matchUser
      }

      return true
    })
  }, [activeLeadDetails, timelineFilter, timelineSearchQuery])

  // BULK ACTIONS HANDLERS
  const handleBulkStatusUpdate = (newStatus) => {
    if (!newStatus) return
    setLeads(leads.map(lead => {
      if (selectedLeads.includes(lead.id)) {
        const updatedTimeline = [
          {
            id: Date.now() + Math.random(),
            type: 'STATUS_CHANGE',
            title: `Bulk Status updated to ${newStatus}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
            user: 'Admin',
            ip: '192.168.1.105',
            icon: 'swap_horiz',
            color: newStatus === 'QUALIFIED' ? 'green-600' : newStatus === 'LOST' ? 'red-600' : 'orange-600'
          },
          ...lead.timeline
        ]
        return { ...lead, status: newStatus, timeline: updatedTimeline }
      }
      return lead
    }))
    setSelectedLeads([])
    triggerToast(`Bulk status updated to ${newStatus} for ${selectedLeads.length} leads`)
  }

  const handleBulkAssignUpdate = (newCounselor) => {
    if (!newCounselor) return
    setLeads(leads.map(lead => {
      if (selectedLeads.includes(lead.id)) {
        const updatedTimeline = [
          {
            id: Date.now() + Math.random(),
            type: 'ASSIGNMENT',
            title: `Bulk Counselor Reassigned`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
            body: `Assigned to: ${newCounselor}`,
            user: 'Admin',
            ip: '192.168.1.105',
            icon: 'person_add',
            color: 'blue-600'
          },
          ...lead.timeline
        ]
        return { ...lead, assignedTo: newCounselor, timeline: updatedTimeline }
      }
      return lead
    }))
    setSelectedLeads([])
    triggerToast(`Bulk reassigned ${selectedLeads.length} leads to ${newCounselor}`)
  }

  const handleBulkDelete = () => {
    setLeads(leads.filter(lead => !selectedLeads.includes(lead.id)))
    setSelectedLeads([])
    triggerToast(`Deleted ${selectedLeads.length} leads successfully`)
  }

  // SINGLE LEAD PROPERTY EDITORS
  const handleLeadStatusChange = (leadId, newStatus) => {
    const prevStatus = activeLeadDetails.status
    const updatedTimeline = [
      {
        id: Date.now(),
        type: 'STATUS_CHANGE',
        title: `Status updated`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
        body: { from: prevStatus, to: newStatus },
        user: 'Admin',
        ip: '192.168.1.105',
        icon: 'swap_horiz',
        color: 'slate-400'
      },
      ...activeLeadDetails.timeline
    ]

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const updated = { ...lead, status: newStatus, timeline: updatedTimeline }
        setActiveLeadDetails(updated)
        return updated
      }
      return lead
    }))
    triggerToast(`Lead status updated to ${newStatus}`)
  }

  const handleLeadScoreChange = (leadId, newScore) => {
    const prevScore = activeLeadDetails.score
    const updatedTimeline = [
      {
        id: Date.now(),
        type: 'SCORE_CHANGE',
        title: `Score adjusted`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
        body: `Adjusted score from ${prevScore} to ${newScore}`,
        user: 'Admin',
        ip: '192.168.1.105',
        icon: 'grade',
        color: 'blue-600'
      },
      ...activeLeadDetails.timeline
    ]

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const updated = { ...lead, score: newScore, timeline: updatedTimeline }
        setActiveLeadDetails(updated)
        return updated
      }
      return lead
    }))
  }

  const handleLeadCounselorChange = (leadId, newCounselor) => {
    const prevCounselor = activeLeadDetails.assignedTo
    const updatedTimeline = [
      {
        id: Date.now(),
        type: 'ASSIGNMENT',
        title: `Counselor Reassigned`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
        body: `Assigned counselor changed from ${prevCounselor} to ${newCounselor}`,
        user: 'Admin',
        ip: '192.168.1.105',
        icon: 'person_add',
        color: 'blue-600'
      },
      ...activeLeadDetails.timeline
    ]

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const updated = { ...lead, assignedTo: newCounselor, timeline: updatedTimeline }
        setActiveLeadDetails(updated)
        return updated
      }
      return lead
    }))
    triggerToast(`Assigned counselor changed to ${newCounselor}`)
  }

  const handleLeadCounselorChangeDirect = (leadId, newCounselor) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const prevCounselor = lead.assignedTo;
        const updatedTimeline = [
          {
            id: Date.now(),
            type: 'ASSIGNMENT',
            title: `Counselor Reassigned`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
            body: `Assigned counselor changed from ${prevCounselor} to ${newCounselor}`,
            user: 'Admin',
            ip: '192.168.1.105',
            icon: 'person_add',
            color: 'blue-600'
          },
          ...lead.timeline
        ];
        return { ...lead, assignedTo: newCounselor, timeline: updatedTimeline };
      }
      return lead;
    }));
    triggerToast(`Assigned counselor changed to ${newCounselor}`);
  }

  const handleSendQueryResponse = (leadId, queryId, responseText) => {
    if (!responseText.trim()) return;

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const updatedQueries = lead.queries.map(q => {
          if (q.id === queryId) {
            return { ...q, status: 'RESOLVED', response: responseText };
          }
          return q;
        });

        const updatedTimeline = [
          {
            id: Date.now(),
            type: 'COMMENT',
            title: `Support query resolved`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
            body: `Replied to query "${lead.queries.find(x => x.id === queryId).question}": "${responseText}"`,
            user: 'Admin',
            ip: '192.168.1.105',
            icon: 'check_circle',
            color: 'green-600'
          },
          ...lead.timeline
        ];

        const updatedLead = { ...lead, queries: updatedQueries, timeline: updatedTimeline };

        // Sync active lead details if current is active
        if (activeLeadDetails && activeLeadDetails.id === leadId) {
          setActiveLeadDetails(updatedLead);
        }
        // Sync active modal lead so modal updates in real-time
        if (activeModalLead && activeModalLead.id === leadId) {
          setActiveModalLead(updatedLead);
        }
        return updatedLead;
      }
      return lead;
    }));

    setQueriesAnswerText('');
    triggerToast('Inquiry response sent and ticket resolved!');
  }

  const handleAddQuickLead = (formData) => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    const newLead = {
      id: `LS-${1022 + leads.length}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '--',
      status: 'NEW',
      assignedTo: formData.assignedTo || 'Unassigned',
      source: 'Quick Add Form',
      score: 50,
      location: 'N/A',
      campaign: 'Direct_Ingest',
      tier: 'Secondary',
      verified: false,
      timeline: [
        {
          id: Date.now(),
          type: 'CREATION',
          title: 'Lead Created (Quick Add)',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
          body: `Added manually by counselor. Initialized with Starter Score 50.`,
          user: 'Admin',
          ip: '192.168.1.105',
          icon: 'add_circle',
          color: 'blue-600'
        }
      ],
      application: {
        appliedProgram: 'Standard Professional Tier',
        submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        companyName: 'N/A',
        companySize: 'N/A',
        annualRevenue: 'N/A',
        useCase: 'Manually added via Quick Add console.',
        notes: 'Vetting pending.'
      },
      queries: []
    };

    setLeads([newLead, ...leads]);
    setShowQuickLeadModal(false);
    triggerToast(`Quick lead "${formData.name}" added successfully!`);
  };

  const handleBulkUploadCSV = () => {
    setUploadingBulk(true);
    setTimeout(() => {
      const mockIngested = [
        {
          id: `LS-${1022 + leads.length}`,
          name: 'Rohan Sharma',
          email: 'rohan.sharma@techsolutions.in',
          phone: '+91 98765 43210',
          status: 'NEW',
          assignedTo: 'Sarah Jenkins',
          source: 'Bulk Offline CSV',
          score: 85,
          location: 'Mumbai, IN',
          campaign: 'Offline_CSV_Q2',
          tier: 'Primary',
          verified: true,
          timeline: [
            {
              id: Date.now(),
              type: 'CREATION',
              title: 'Lead Ingested (CSV Bulk)',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
              body: 'Uploaded via Bulk Offline CSV Upload portal.',
              user: 'Admin',
              ip: '192.168.1.105',
              icon: 'upload_file',
              color: 'green-600'
            }
          ],
          application: {
            appliedProgram: 'Enterprise CRM Suite',
            submissionDate: 'May 25, 2026',
            companyName: 'Sharma Tech Solutions',
            companySize: '250-499 employees',
            annualRevenue: '$12M - $18M',
            useCase: 'Ingested via CSV file offline import.',
            notes: 'High potential priority client.'
          },
          queries: []
        },
        {
          id: `LS-${1023 + leads.length}`,
          name: 'Clara Oswald',
          email: 'clara.oswald@tardis.co.uk',
          phone: '+44 20 7946 0958',
          status: 'NEW',
          assignedTo: 'Marcus Chan',
          source: 'Bulk Offline CSV',
          score: 65,
          location: 'London, UK',
          campaign: 'Offline_CSV_Q2',
          tier: 'Secondary',
          verified: false,
          timeline: [
            {
              id: Date.now() + 1,
              type: 'CREATION',
              title: 'Lead Ingested (CSV Bulk)',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
              body: 'Uploaded via Bulk Offline CSV Upload portal.',
              user: 'Admin',
              ip: '192.168.1.105',
              icon: 'upload_file',
              color: 'green-600'
            }
          ],
          application: {
            appliedProgram: 'Starter Solo Plan',
            submissionDate: 'May 25, 2026',
            companyName: 'Oswald Ventures',
            companySize: '1-9 employees',
            annualRevenue: '$100k - $250k',
            useCase: 'Ingested via CSV file offline import.',
            notes: 'Follow up required to check credentials.'
          },
          queries: []
        }
      ];

      setLeads(prev => [...mockIngested, ...prev]);
      setUploadingBulk(false);
      setShowBulkUploadModal(false);
      triggerToast('Ingested 2 leads from CSV successfully!');
    }, 1500);
  };

  const handleDownloadLeads = () => {
    setDownloadingLeadsState(true);
    setTimeout(() => {
      setDownloadingLeadsState(false);
      triggerToast('Generated leads CSV download link successfully!');
    }, 1000);
  };

  const handleChangeLeadStageGlobal = () => {
    if (selectedLeads.length === 0) {
      triggerToast('Warning: Please select one or more leads in the table first!');
      return;
    }
    setShowGlobalStageModal(true);
  };

  const handleApplyGlobalStage = (newStatus) => {
    if (!newStatus) return;
    setLeads(leads.map(lead => {
      if (selectedLeads.includes(lead.id)) {
        const updatedTimeline = [
          {
            id: Date.now() + Math.random(),
            type: 'STATUS_CHANGE',
            title: `Bulk Status updated to ${newStatus}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
            user: 'Admin',
            ip: '192.168.1.105',
            icon: 'swap_horiz',
            color: newStatus === 'QUALIFIED' ? 'green-600' : newStatus === 'LOST' ? 'red-600' : 'orange-600'
          },
          ...lead.timeline
        ];
        return { ...lead, status: newStatus, timeline: updatedTimeline };
      }
      return lead;
    }));
    setSelectedLeads([]);
    setShowGlobalStageModal(false);
    triggerToast(`Bulk status updated to ${newStatus}`);
  };

  // DUPLICATE RECORD MERGE EXECUTOR
  const handleMergeProfiles = () => {
    const dupe = getDuplicateRecord(activeLeadDetails)
    if (!dupe) return

    // Consolidate activity timelines chronologically
    const consolidatedTimeline = [
      {
        id: Date.now(),
        type: 'SYSTEM',
        title: 'Profiles Merged & Consolidated',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
        body: `Consolidated record for ${mergeSelectedProps.name}. Timelines merged from duplicate profiles.`,
        user: 'Admin',
        ip: '192.168.1.105',
        icon: 'merge_type',
        color: 'green-600'
      },
      ...activeLeadDetails.timeline,
      ...dupe.timeline
    ]

    const consolidatedLead = {
      ...activeLeadDetails,
      ...mergeSelectedProps,
      timeline: consolidatedTimeline
    }

    setLeads(leads
      .filter(l => l.id !== dupe.id) // Remove duplicate record
      .map(l => l.id === activeLeadDetails.id ? consolidatedLead : l) // Update primary record
    )

    setActiveLeadDetails(consolidatedLead)
    setShowMergeModal(false)
    triggerToast(`Profiles successfully merged! Consolidated ${consolidatedTimeline.length} activities.`)
  }

  const triggerMergeModal = () => {
    const dupe = getDuplicateRecord(activeLeadDetails)
    if (!dupe) return
    setMergeSelectedProps({
      name: activeLeadDetails.name,
      email: activeLeadDetails.email,
      phone: activeLeadDetails.phone,
      status: activeLeadDetails.status,
      assignedTo: activeLeadDetails.assignedTo,
      source: activeLeadDetails.source,
      score: activeLeadDetails.score,
      location: activeLeadDetails.location,
      campaign: activeLeadDetails.campaign
    })
    setShowMergeModal(true)
  }

  // INTERACTIVE ACTIVITY LOGGER
  const handleLogInteraction = () => {
    if (!newComment.trim()) return

    let title = 'Interaction Logged'
    let icon = 'chat'
    let color = 'slate-400'
    let bodyText = newComment

    if (interactionType === 'COMMENT') {
      title = 'Comment added'
      icon = 'chat'
      color = 'slate-400'
      bodyText = `"${newComment}"`
    } else if (interactionType === 'TASK') {
      title = 'Task assigned'
      icon = 'assignment'
      color = 'blue-600'
    } else if (interactionType === 'CALL') {
      title = 'Phone Call Summary'
      icon = 'call'
      color = 'slate-400'
    } else if (interactionType === 'MEETING') {
      title = 'Meeting Scheduled'
      icon = 'video_call'
      color = 'slate-400'
    }

    const newEvent = {
      id: Date.now(),
      type: interactionType,
      title: title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
      body: bodyText,
      user: 'Admin',
      ip: '192.168.1.105',
      icon: icon,
      color: color
    }

    const updatedTimeline = [newEvent, ...activeLeadDetails.timeline]

    setLeads(leads.map(lead => {
      if (lead.id === activeLeadDetails.id) {
        const updated = { ...lead, timeline: updatedTimeline }
        setActiveLeadDetails(updated)
        return updated
      }
      return lead
    }))

    setNewComment('')
    triggerToast('New interaction added to activity trail!')
  }

  return (
    <div className="w-full relative h-full flex flex-col font-sans select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-800 flex items-center gap-2 text-xs font-bold font-sans"
          >
            <span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span>
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!activeLeadDetails ? (
          /* LEADS TABLE LIST VIEW */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* Saved Views Quick Tabs */}
            {/* <div className="flex border-b border-outline-variant gap-4 mb-5 select-none text-left">
              <button
                onClick={() => setActiveSavedTab('all')}
                className={`pb-2.5 font-bold text-[12px] border-b-2 transition-all flex items-center gap-1 cursor-pointer ${activeSavedTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                <span className="material-symbols-outlined text-[16px]">list</span>
                All Leads
              </button>
              <button
                onClick={() => setActiveSavedTab('hot')}
                className={`pb-2.5 font-bold text-[12px] border-b-2 transition-all flex items-center gap-1 cursor-pointer ${activeSavedTab === 'hot' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                <span className="material-symbols-outlined text-[16px] text-green-500">local_fire_department</span>
                Hot Leads (Score &ge; 76)
              </button>
              <button
                onClick={() => setActiveSavedTab('unassigned')}
                className={`pb-2.5 font-bold text-[12px] border-b-2 transition-all flex items-center gap-1 cursor-pointer ${activeSavedTab === 'unassigned' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                <span className="material-symbols-outlined text-[16px] text-red-400">person_off</span>
                Unassigned Leads
              </button>
              <button
                onClick={() => setActiveSavedTab('qualified')}
                className={`pb-2.5 font-bold text-[12px] border-b-2 transition-all flex items-center gap-1 cursor-pointer ${activeSavedTab === 'qualified' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                <span className="material-symbols-outlined text-[16px] text-blue-500">verified</span>
                Qualified Pipeline
              </button>
            </div> */}

            {/* Summary KPI Block Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              {/* Card 1: Total Leads */}
              <div
                onClick={() => setActiveBlockFilter('all')}
                className={`p-3.5 rounded-[4px] border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[55px] relative overflow-hidden select-none text-left ${activeBlockFilter === 'all'
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-1 ring-indigo-500/30'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 shadow-sm'
                  }`}
              >
                <div className="flex items-center justify-between w-full ">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${activeBlockFilter === 'all' ? 'text-indigo-600' : 'text-slate-500'}`}>
                    Total Leads
                  </span>
                  <span className="text-[18px] font-bold text-slate-800 leading-none">
                    {leads.length}
                  </span>
                  <span className={`material-symbols-outlined text-[18px] ${activeBlockFilter === 'all' ? 'text-indigo-500' : 'text-slate-400'}`}>
                    groups
                  </span>
                </div>
              </div>

              {/* Card 2: Primary Leads */}
              <div
                onClick={() => setActiveBlockFilter('primary')}
                className={`p-3.5 rounded-[4px] border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[55px] relative overflow-hidden select-none text-left ${activeBlockFilter === 'primary'
                  ? 'border-amber-500 bg-amber-50/50 shadow-md ring-1 ring-amber-500/30'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 shadow-sm'
                  }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${activeBlockFilter === 'primary' ? 'text-amber-700' : 'text-slate-500'}`}>
                    Primary Leads
                  </span>
                  <span className="text-[18px] font-bold text-slate-800 leading-none">
                    {leads.filter(l => l.tier === 'Primary').length}
                  </span>
                  <span className={`material-symbols-outlined text-[18px] ${activeBlockFilter === 'primary' ? 'text-amber-500' : 'text-slate-400'}`}>
                    star
                  </span>
                </div>
                <div className="mt-2">
                </div>
              </div>

              {/* Card 3: Secondary Leads */}
              <div
                onClick={() => setActiveBlockFilter('secondary')}
                className={`p-3.5 rounded-[4px] border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[55px] relative overflow-hidden select-none text-left ${activeBlockFilter === 'secondary'
                  ? 'border-sky-500 bg-sky-50/50 shadow-md ring-1 ring-sky-500/30'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 shadow-sm'
                  }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${activeBlockFilter === 'secondary' ? 'text-sky-700' : 'text-slate-500'}`}>
                    Secondary Leads
                  </span>
                  <span className="text-[18px] font-bold text-slate-800 leading-none">
                    {leads.filter(l => l.tier === 'Secondary').length}
                  </span>
                  <span className={`material-symbols-outlined text-[18px] ${activeBlockFilter === 'secondary' ? 'text-sky-500' : 'text-slate-400'}`}>
                    star_half
                  </span>
                </div>
              </div>

              {/* Card 4: Tertiary Leads */}
              <div
                onClick={() => setActiveBlockFilter('tertiary')}
                className={`p-3.5 rounded-[4px] border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[55px] relative overflow-hidden select-none text-left ${activeBlockFilter === 'tertiary'
                  ? 'border-purple-500 bg-purple-50/50 shadow-md ring-1 ring-purple-500/30'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 shadow-sm'
                  }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${activeBlockFilter === 'tertiary' ? 'text-purple-700' : 'text-slate-500'}`}>
                    Tertiary Leads
                  </span>
                  <span className="text-[18px] font-bold text-slate-800 leading-none">
                    {leads.filter(l => l.tier === 'Tertiary').length}
                  </span>
                  <span className={`material-symbols-outlined text-[18px] ${activeBlockFilter === 'tertiary' ? 'text-purple-500' : 'text-slate-400'}`}>
                    star_outline
                  </span>
                </div>
                <div className="mt-2">

                </div>
              </div>

              {/* Card 5: Verified Leads */}
              <div
                onClick={() => setActiveBlockFilter('verified')}
                className={`p-3.5 rounded-[4px] border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[55px] relative overflow-hidden select-none text-left ${activeBlockFilter === 'verified'
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 shadow-sm'
                  }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${activeBlockFilter === 'verified' ? 'text-emerald-700' : 'text-slate-500'}`}>
                    Verified Leads
                  </span>
                  <span className="text-[18px] font-bold text-slate-800 leading-none">
                    {leads.filter(l => l.verified).length}
                  </span>
                  <span className={`material-symbols-outlined text-[18px] ${activeBlockFilter === 'verified' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    verified
                  </span>
                </div>
                <div className="mt-2">

                </div>
              </div>

              {/* Card 6: Unverified Leads */}
              <div
                onClick={() => setActiveBlockFilter('unverified')}
                className={`p-3.5 rounded-[4px] border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[55px] relative overflow-hidden select-none text-left ${activeBlockFilter === 'unverified'
                  ? 'border-rose-500 bg-rose-50/50 shadow-md ring-1 ring-rose-500/30'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 shadow-sm'
                  }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${activeBlockFilter === 'unverified' ? 'text-rose-700' : 'text-slate-500'}`}>
                    Unverified Leads
                  </span>
                  <span className="text-[18px] font-bold text-slate-800 leading-none">
                    {leads.filter(l => !l.verified).length}
                  </span>
                  <span className={`material-symbols-outlined text-[18px] ${activeBlockFilter === 'unverified' ? 'text-rose-500' : 'text-slate-400'}`}>
                    cancel
                  </span>
                </div>
                <div className="mt-2">

                </div>
              </div>

              {/* Card 7: Not Assigned — Admin/Manager only */}
              <div
                onClick={() => setActiveBlockFilter('not_assigned')}
                className={`p-3.5 rounded-[4px] border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[55px] relative overflow-hidden select-none text-left ${activeBlockFilter === 'not_assigned'
                  ? 'border-orange-500 bg-orange-50/50 shadow-md ring-1 ring-orange-500/30'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 shadow-sm'
                  }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold tracking-wider uppercase leading-tight ${activeBlockFilter === 'not_assigned' ? 'text-orange-700' : 'text-slate-500'}`}>
                    Not Assigned
                  </span>
                  <span className="text-[18px] font-bold text-slate-800 leading-none">
                    {leads.filter(l => l.assignedTo === 'Unassigned').length}
                  </span>
                  <span className={`material-symbols-outlined text-[18px] ${activeBlockFilter === 'not_assigned' ? 'text-orange-500' : 'text-slate-400'}`}>
                    person_off
                  </span>
                </div>
                {/* Admin/Manager badge */}
                <div className="absolute bottom-1 right-1.5">
                  <span className="text-[7px] font-bold text-orange-400 tracking-widest uppercase">Admin · Mgr</span>
                </div>
              </div>
            </div>

            {/* Filters & Controls */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or owner..."
                    className="h-8 pl-9 pr-3 border border-outline-variant rounded bg-surface text-[12px] w-64 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 px-4 h-8 border border-outline-variant rounded bg-surface text-body-md font-body-md text-on-surface">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent border-none outline-none cursor-pointer text-[12px]"
                  >
                    <option value="all">Status: All Active</option>
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="LOST">LOST</option>
                  </select>
                </div>

                {/* Column Customizer Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                    className="flex items-center gap-1.5 px-3 h-8 border border-outline-variant rounded bg-surface hover:bg-slate-50 text-[12px] font-bold text-slate-700 cursor-pointer select-none"
                  >
                    <span className="material-symbols-outlined text-[16px]">table_chart</span>
                    Columns
                  </button>

                  <AnimatePresence>
                    {showColumnDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowColumnDropdown(false)} />
                        <motion.div
                          className="absolute left-0 mt-1 w-48 bg-white border border-outline-variant rounded-lg shadow-xl p-3 z-20 text-left font-sans"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                        >
                          <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Toggle Columns</h4>
                          <div className="space-y-1.5 text-[11.5px] font-semibold text-slate-750">
                            {Object.keys(visibleColumns).map((col) => (
                              <label key={col} className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded cursor-pointer capitalize">
                                <input
                                  type="checkbox"
                                  checked={visibleColumns[col]}
                                  onChange={() => setVisibleColumns({
                                    ...visibleColumns,
                                    [col]: !visibleColumns[col]
                                  })}
                                  className="w-3.5 h-3.5 cursor-pointer accent-primary"
                                />
                                {col === 'assignedTo' ? 'Assigned' : col === 'email' ? 'Work Email' : col}
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Clear All */}
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterStatus('all')
                    setActiveSavedTab('all')
                    setActiveBlockFilter('all')
                    setSortConfig({ key: 'name', direction: 'asc' })
                  }}
                  className="text-primary text-body-md font-body-md hover:text-primary/80 transition-colors text-[12px] cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Right side stats replaced by Actions dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowGlobalActionsDropdown(!showGlobalActionsDropdown)}
                  className="flex items-center gap-1.5 px-3.5 h-8 bg-primary hover:bg-primary/95 text-[12px] font-bold text-white rounded-lg shadow-sm cursor-pointer select-none transition-all duration-150"
                >
                  {/* <span className="material-symbols-outlined text-[16px] text-white">bolt</span> */}
                  Actions
                  <span className="material-symbols-outlined text-[16px] text-white leading-none">expand_more</span>
                </button>

                <AnimatePresence>
                  {showGlobalActionsDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowGlobalActionsDropdown(false)} />
                      <motion.div
                        className="absolute right-0 mt-1.5 w-52 bg-white border border-outline-variant rounded-xl shadow-xl p-1 z-40 text-left font-sans"
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                      >
                        {/* Group 1: Lead Ingestions */}
                        <div className="p-1.5 pb-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Lead Ingestions</div>
                        <button
                          onClick={() => {
                            setShowBulkUploadModal(true);
                            setShowGlobalActionsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                        >
                          <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">upload_file</span>
                          Bulk Offline Upload
                        </button>
                        <button
                          onClick={() => {
                            setShowQuickLeadModal(true);
                            setQuickLeadForm({ name: '', email: '', phone: '', assignedTo: 'Sarah Jenkins' });
                            setShowGlobalActionsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                        >
                          <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">add_circle</span>
                          Add Quick Lead
                        </button>

                        <hr className="border-slate-100 my-1" />

                        {/* Group 2: Data Operations */}
                        <div className="p-1.5 pb-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Data Operations</div>
                        <button
                          onClick={() => {
                            handleDownloadLeads();
                            setShowGlobalActionsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                        >
                          <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">download</span>
                          Download Leads
                        </button>
                        <button
                          onClick={() => {
                            if (leads.length > 0) {
                              setActiveLeadDetails(leads[0]);
                              setShowEmailModal(true);
                            }
                            setShowGlobalActionsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                        >
                          <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">chat</span>
                          Communicate
                        </button>
                        <button
                          onClick={() => {
                            handleChangeLeadStageGlobal();
                            setShowGlobalActionsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                        >
                          <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">swap_horiz</span>
                          Change Lead Stage
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Table */}
            <motion.div
              className="bg-surface rounded border border-outline-variant overflow-visible"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container select-none">
                    <th className="px-3 py-1.5 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === filteredAndSortedLeads.length && filteredAndSortedLeads.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    {/* CLICKABLE SORTING HEADERS */}
                    {visibleColumns.name && (
                      <th
                        onClick={() => requestSort('name')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[10px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Lead Name
                          {renderSortIndicator('name')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.email && (
                      <th
                        onClick={() => requestSort('email')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Work Email
                          {renderSortIndicator('email')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.phone && (
                      <th
                        onClick={() => requestSort('phone')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Phone Number
                          {renderSortIndicator('phone')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.score && (
                      <th
                        onClick={() => requestSort('score')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Score
                          {renderSortIndicator('score')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th
                        onClick={() => requestSort('status')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Status
                          {renderSortIndicator('status')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.assignedTo && (
                      <th
                        onClick={() => requestSort('assignedTo')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Assigned To
                          {renderSortIndicator('assignedTo')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.source && (
                      <th
                        onClick={() => requestSort('source')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Lead Source
                          {renderSortIndicator('source')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.tier && (
                      <th
                        onClick={() => requestSort('tier')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Lead Tier
                          {renderSortIndicator('tier')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.verified && (
                      <th
                        onClick={() => requestSort('verified')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Verification
                          {renderSortIndicator('verified')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.location && (
                      <th
                        onClick={() => requestSort('location')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Location
                          {renderSortIndicator('location')}
                        </div>
                      </th>
                    )}
                    {visibleColumns.campaign && (
                      <th
                        onClick={() => requestSort('campaign')}
                        className="px-3 py-1.5 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          Campaign
                          {renderSortIndicator('campaign')}
                        </div>
                      </th>
                    )}
                    <th className="px-3 py-1.5 text-center text-body-md font-body-md text-on-surface text-[12px] font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      className="border-b border-outline-variant hover:bg-surface-container/50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <td className="px-3 py-1.5">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleSelectLead(lead.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      {visibleColumns.name && (
                        <td
                          className="px-3 py-1.5 text-body-md font-bold text-primary hover:underline cursor-pointer text-[12px]"
                          onClick={() => {
                            setActiveLeadDetails(lead)
                          }}
                        >
                          {lead.name}
                        </td>
                      )}
                      {visibleColumns.email && <td className="px-3 py-1.5 text-body-md font-body-md text-on-surface-variant text-[12px]">{lead.email}</td>}
                      {visibleColumns.phone && <td className="px-3 py-1.5 text-body-md font-body-md text-on-surface-variant text-[12px]">{lead.phone || '--'}</td>}
                      {visibleColumns.score && <td className="px-3 py-1.5 text-body-md font-bold font-mono text-slate-700 text-[12px]">{lead.score}</td>}
                      {visibleColumns.status && (
                        <td className="px-3 py-1.5">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wide border ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                      )}
                      {visibleColumns.assignedTo && (
                        <td className="px-3 py-1.5 text-body-md font-body-md text-on-surface text-[12px]">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] text-primary font-bold">
                              {lead.assignedTo.charAt(0)}
                            </div>
                            <span>{lead.assignedTo}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.source && <td className="px-3 py-1.5 text-body-md font-body-md text-on-surface-variant text-[12px]">{lead.source}</td>}
                      {visibleColumns.tier && (
                        <td className="px-3 py-1.5">
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold border select-none ${lead.tier === 'Primary'
                            ? 'bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-500/5'
                            : lead.tier === 'Secondary'
                              ? 'bg-sky-50 text-sky-700 border-sky-200/80 ring-1 ring-sky-500/5'
                              : lead.tier === 'Tertiary'
                                ? 'bg-purple-50 text-purple-700 border-purple-200/80 ring-1 ring-purple-500/5'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                            <span className="material-symbols-outlined text-[10.5px] font-bold">
                              {lead.tier === 'Primary' ? 'star' : lead.tier === 'Secondary' ? 'star_half' : 'star_outline'}
                            </span>
                            {lead.tier}
                          </span>
                        </td>
                      )}
                      {visibleColumns.verified && (
                        <td className="px-3 py-1.5">
                          {lead.verified ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 ring-1 ring-emerald-500/5 select-none">
                              <span className="material-symbols-outlined text-[10.5px] font-bold text-emerald-600">check_circle</span>
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80 ring-1 ring-rose-500/5 select-none">
                              <span className="material-symbols-outlined text-[10.5px] font-bold text-rose-600">cancel</span>
                              Unverified
                            </span>
                          )}
                        </td>
                      )}
                      {visibleColumns.location && <td className="px-3 py-1.5 text-body-md font-body-md text-on-surface-variant text-[12px]">{lead.location || '--'}</td>}
                      {visibleColumns.campaign && <td className="px-3 py-1.5 text-body-md font-body-md text-on-surface-variant text-[12px]">{lead.campaign || '--'}</td>}
                      <td className="px-3 py-1.5 text-center relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeDropdownLeadId === lead.id) {
                              setActiveDropdownLeadId(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const spaceBelow = window.innerHeight - rect.bottom;
                              const flipUp = spaceBelow < 280;
                              setDropdownFlipUp(flipUp);
                              setDropdownPos({
                                x: rect.right,
                                y: flipUp ? rect.top : rect.bottom
                              });
                              setActiveDropdownLeadId(lead.id);
                            }
                            setShowReassignSubId(null);
                          }}
                          className={`p-1 rounded transition-all cursor-pointer ${activeDropdownLeadId === lead.id ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container text-on-surface-variant'}`}
                        >
                          <span className="material-symbols-outlined text-[18px] font-semibold leading-none align-middle">more_vert</span>
                        </button>

                        <AnimatePresence>
                          {activeDropdownLeadId === lead.id && (
                            <>
                              {/* Invisible backdrop layer to click outside */}
                              <div
                                className="fixed inset-0 z-30 cursor-default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownLeadId(null);
                                  setShowReassignSubId(null);
                                }}
                              />

                              {/* Floating action dropdown menu — fixed position to escape overflow:hidden */}
                              {(() => {
                                const showUpwards = dropdownFlipUp;
                                return (
                                  <motion.div
                                    style={{
                                      position: 'fixed',
                                      right: `${window.innerWidth - dropdownPos.x}px`,
                                      ...(showUpwards
                                        ? { bottom: `${window.innerHeight - dropdownPos.y}px`, top: 'auto' }
                                        : { top: `${dropdownPos.y + 4}px`, bottom: 'auto' }
                                      )
                                    }}
                                    className="w-48 bg-white border border-outline-variant rounded-xl shadow-xl p-1 z-[9999] text-left font-sans"
                                    initial={{ opacity: 0, scale: 0.95, y: showUpwards ? 5 : -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: showUpwards ? 5 : -5 }}
                                    transition={{ duration: 0.15 }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Option 1: Communicate */}
                                    <button
                                      onClick={() => {
                                        setActiveLeadDetails(lead);
                                        setShowEmailModal(true);
                                        setActiveDropdownLeadId(null);
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                                    >
                                      <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">chat</span>
                                      Communicate
                                    </button>

                                    {/* Option 2: View Application */}
                                    <button
                                      onClick={() => {
                                        setActiveModalLead(lead);
                                        setShowApplicationModal(true);
                                        setActiveDropdownLeadId(null);
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                                    >
                                      <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">assignment</span>
                                      View Application
                                    </button>


                                    {/* Option 3: Re-assign Lead */}
                                    <div className="relative">
                                      <button
                                        onClick={() => {
                                          setShowReassignSubId(showReassignSubId === lead.id ? null : lead.id);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold rounded-lg transition-colors cursor-pointer text-left ${showReassignSubId === lead.id ? 'bg-blue-50/80 text-blue-700' : 'text-slate-700 hover:bg-blue-50/60 hover:text-blue-700'}`}
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">supervisor_account</span>
                                          Re-assign Lead
                                        </div>
                                        <span className="material-symbols-outlined text-[14px]">
                                          {showReassignSubId === lead.id ? 'expand_less' : 'chevron_right'}
                                        </span>
                                      </button>

                                      <AnimatePresence>
                                        {showReassignSubId === lead.id && (
                                          <motion.div
                                            className="mt-1 mb-1 mx-1.5 p-1 bg-slate-50 border border-slate-100 rounded-lg space-y-0.5"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.15 }}
                                          >
                                            {['Sarah Jenkins', 'Marcus Chan', 'Unassigned'].map((counselor) => {
                                              const counselorLeads = leads.filter(l => l.assignedTo === counselor);
                                              const count = counselorLeads.length;
                                              const isCurrentlyAssigned = lead.assignedTo === counselor;

                                              // State for hover - use a local ref trick via data attributes
                                              return (
                                                <div key={counselor} className="relative group">
                                                  <button
                                                    onClick={() => {
                                                      handleLeadCounselorChangeDirect(lead.id, counselor);
                                                      setActiveDropdownLeadId(null);
                                                      setShowReassignSubId(null);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-colors cursor-pointer text-left ${isCurrentlyAssigned
                                                      ? 'bg-blue-50 text-blue-700'
                                                      : 'text-slate-600 hover:bg-white hover:text-blue-600'
                                                      }`}
                                                  >
                                                    <div className="flex items-center gap-1.5">
                                                      <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-bold text-slate-600 shrink-0">
                                                        {counselor === 'Unassigned' ? '—' : counselor.split(' ').map(p => p[0]).join('')}
                                                      </div>
                                                      <span>{counselor}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                      {counselor !== 'Unassigned' && (
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isCurrentlyAssigned ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                          }`}>
                                                          {count} lead{count !== 1 ? 's' : ''}
                                                        </span>
                                                      )}
                                                      {isCurrentlyAssigned && (
                                                        <span className="material-symbols-outlined text-[12px] text-blue-600 font-bold">check</span>
                                                      )}
                                                    </div>
                                                  </button>

                                                  {/* Hover Card — appears to the LEFT of the dropdown to avoid clipping */}
                                                  {counselor !== 'Unassigned' && (
                                                    <div className="absolute right-full top-0 mr-2 z-[9999] hidden group-hover:block pointer-events-none">
                                                      <div className="w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-left font-sans">
                                                        {/* Card Header */}
                                                        <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-slate-100">
                                                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 shrink-0">
                                                            {counselor.split(' ').map(p => p[0]).join('')}
                                                          </div>
                                                          <div>
                                                            <p className="text-[11px] font-bold text-slate-800 leading-tight">{counselor}</p>
                                                            <p className="text-[9px] text-slate-400 font-medium">{count} active lead{count !== 1 ? 's' : ''}</p>
                                                          </div>
                                                        </div>

                                                        {/* Lead List */}
                                                        {counselorLeads.length > 0 ? (
                                                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                                            {counselorLeads.map(l => {
                                                              const statusColors = {
                                                                NEW: 'bg-blue-50 text-blue-700',
                                                                CONTACTED: 'bg-orange-50 text-orange-700',
                                                                QUALIFIED: 'bg-green-50 text-green-700',
                                                                LOST: 'bg-red-50 text-red-700'
                                                              };
                                                              return (
                                                                <div key={l.id} className="flex items-center justify-between gap-2">
                                                                  <div className="flex items-center gap-1.5 min-w-0">
                                                                    <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500 shrink-0">
                                                                      {l.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                                                                    </div>
                                                                    <span className="text-[10.5px] text-slate-700 font-medium truncate">{l.name}</span>
                                                                  </div>
                                                                  <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded shrink-0 ${statusColors[l.status] || 'bg-slate-50 text-slate-600'}`}>
                                                                    {l.status}
                                                                  </span>
                                                                </div>
                                                              );
                                                            })}
                                                          </div>
                                                        ) : (
                                                          <p className="text-[10px] text-slate-400 italic text-center py-1">No leads assigned</p>
                                                        )}

                                                        {/* Score avg footer */}
                                                        {counselorLeads.length > 0 && (
                                                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                                                            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Avg. Score</span>
                                                            <span className="text-[10px] font-bold text-slate-700 font-mono">
                                                              {Math.round(counselorLeads.reduce((s, l) => s + l.score, 0) / counselorLeads.length)}
                                                            </span>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>

                                    {/* Option 4: View Queries */}
                                    <button
                                      onClick={() => {
                                        setActiveModalLead(lead);
                                        setShowQueriesModal(true);
                                        setQueriesAnswerText('');
                                        setActiveDropdownLeadId(null);
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                                    >
                                      <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">question_answer</span>
                                      View Queries
                                    </button>

                                    {/* Option 5: View Activity */}
                                    <button
                                      onClick={() => {
                                        setActiveLeadDetails(lead);
                                        setActiveDropdownLeadId(null);
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left border-t border-slate-100"
                                    >
                                      <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">history</span>
                                      View Activity
                                    </button>
                                  </motion.div>
                                );
                              })()}
                            </>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredAndSortedLeads.length === 0 && (
                    <tr>
                      <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="py-16 text-center">
                        <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                            <span className="material-symbols-outlined text-[32px]">folder_off</span>
                          </div>
                          <div>
                            <h3 className="text-[14px] font-bold text-slate-800">No Leads Found</h3>
                            <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-normal">
                              We couldn't find any lead matching your search query or active filter settings in this workspace.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSearchQuery('')
                              setFilterStatus('all')
                              setActiveSavedTab('all')
                              setActiveBlockFilter('all')
                              setSortConfig({ key: 'name', direction: 'asc' })
                            }}
                            className="h-8 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-[11.5px] rounded-lg shadow-sm cursor-pointer select-none"
                          >
                            Reset Search Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-between text-body-md font-body-md text-on-surface-variant text-[12px] select-none">
              <span>Showing 1-{filteredAndSortedLeads.length} of {leads.length} leads</span>
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select className="px-2 h-6 border border-outline-variant rounded bg-surface text-[11px] cursor-pointer">
                  <option>50</option>
                  <option>100</option>
                  <option>250</option>
                </select>
                <div className="flex items-center gap-1 ml-4">
                  <button className="p-1 hover:bg-surface-container rounded transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="p-1 hover:bg-surface-container rounded transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ANIMATED BULK ACTIONS PANEL */}
            <AnimatePresence>
              {selectedLeads.length > 0 && (
                <motion.div
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-5 border border-slate-800 font-sans"
                  initial={{ opacity: 0, y: 80, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 40, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                      {selectedLeads.length}
                    </span>
                    <span className="text-[11.5px] font-semibold text-slate-300">selected</span>
                  </div>

                  <div className="h-4 w-px bg-slate-800" />

                  {/* Mass Status Option */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                    <select
                      onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                      defaultValue=""
                      className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-[11px] outline-none text-white cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                      <option value="" disabled>Update...</option>
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </div>

                  {/* Mass Reassign Option */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assign:</span>
                    <select
                      onChange={(e) => handleBulkAssignUpdate(e.target.value)}
                      defaultValue=""
                      className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-[11px] outline-none text-white cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                      <option value="" disabled>Assign to...</option>
                      <option value="Sarah Jenkins">Sarah Jenkins</option>
                      <option value="Marcus Chan">Marcus Chan</option>
                      <option value="Unassigned">Unassigned</option>
                    </select>
                  </div>

                  <div className="h-4 w-px bg-slate-800" />

                  {/* Delete Option */}
                  <button
                    onClick={handleBulkDelete}
                    className="text-[11px] text-red-400 hover:text-red-300 hover:underline font-bold cursor-pointer transition-colors flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* HIGH FIDELITY LEAD DETAILS VIEW */
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col space-y-4"
          >
            {/* Header: Back & Details info */}
            <div className="flex justify-between items-center border-b border-outline-variant pb-3 select-none">
              <div className="flex items-center gap-3 text-left">
                <button
                  onClick={() => {
                    setActiveLeadDetails(null)
                    setPlayingRecording(false)
                    setAudioPlaying(false)
                  }}
                  className="p-1.5 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant flex items-center justify-center cursor-pointer"
                  title="Back to All Leads"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Leads</span>
                    <span className="text-[10px] text-on-surface-variant font-semibold bg-surface-container border border-outline-variant px-1 rounded">
                      {activeLeadDetails.id}
                    </span>
                  </div>
                  <h1 className="text-lg font-bold text-on-background leading-tight">{activeLeadDetails.name}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLeadStatusChange(activeLeadDetails.id, 'CONTACTED')}
                  className="px-3 h-8 border border-outline-variant rounded bg-surface hover:bg-surface-container text-body-md font-bold text-on-surface text-[12px] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">check</span>
                  Mark Contacted
                </button>
              </div>
            </div>

            {/* Split Screen Layout */}
            <div className="flex flex-col lg:flex-row bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-xs min-h-[680px]">

              {/* LEFT COLUMN: Profiler & Sidebar Editors (~28% width) */}
              <div className="w-full lg:w-[28%] border-r border-outline-variant p-6 space-y-6 bg-surface-container-lowest/15 text-left">

                {/* Avatar Block */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-primary text-base font-bold select-none">
                    {getInitials(activeLeadDetails.name)}
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-on-background leading-tight">{activeLeadDetails.name}</h2>
                    <p className="text-[11px] text-on-surface-variant">Lead ID: {activeLeadDetails.id.replace('LS-', 'L-')}</p>
                  </div>
                </div>

                {/* Duplicate Alert Banner Card */}
                {(() => {
                  const dupe = getDuplicateRecord(activeLeadDetails)
                  if (!dupe) return null
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2 text-left"
                    >
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5">warning</span>
                        <div>
                          <h4 className="text-[11px] font-bold text-amber-800 leading-tight">Duplicate Found</h4>
                          <p className="text-[10px] text-amber-700 mt-1 leading-normal">
                            1 other profile matches <strong>{activeLeadDetails.email}</strong>.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={triggerMergeModal}
                        className="w-full h-7 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs select-none"
                      >
                        <span className="material-symbols-outlined text-[13px]">merge_type</span>
                        Review & Merge
                      </button>
                    </motion.div>
                  )
                })()}

                {/* Score Bracket Circular Gauge Visualizer */}
                {(() => {
                  const score = activeLeadDetails.score || 0
                  let scoreColor = 'text-slate-400'
                  let scoreStroke = '#cbd5e1'
                  let scoreBg = 'bg-slate-50'
                  let scoreLabel = 'Cold Lead'
                  if (score >= 76) {
                    scoreColor = 'text-green-600'
                    scoreStroke = '#16a34a'
                    scoreBg = 'bg-green-50'
                    scoreLabel = 'Hot Lead'
                  } else if (score >= 41) {
                    scoreColor = 'text-amber-600'
                    scoreStroke = '#d97706'
                    scoreBg = 'bg-amber-50'
                    scoreLabel = 'Warm Lead'
                  } else {
                    scoreColor = 'text-red-500'
                    scoreStroke = '#ef4444'
                    scoreBg = 'bg-red-50'
                    scoreLabel = 'Cold Lead'
                  }
                  const radius = 26
                  const circumference = 2 * Math.PI * radius
                  const strokeDashoffset = circumference - (score / 100) * circumference

                  return (
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2 select-none">
                      <div className="relative w-20 h-20 flex items-center justify-center cursor-pointer" onClick={() => setEditingScore(true)} title="Click to edit score">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            className="stroke-slate-200 fill-none"
                            strokeWidth="5"
                          />
                          <motion.circle
                            cx="40"
                            cy="40"
                            r={radius}
                            className="fill-none"
                            stroke={scoreStroke}
                            strokeWidth="5"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            strokeLinecap="round"
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          {editingScore ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={activeLeadDetails.score}
                              onChange={(e) => handleLeadScoreChange(activeLeadDetails.id, parseInt(e.target.value) || 0)}
                              onBlur={() => setEditingScore(false)}
                              onKeyDown={(e) => e.key === 'Enter' && setEditingScore(false)}
                              autoFocus
                              className="w-12 h-6 text-sm font-extrabold text-slate-800 text-center bg-white border border-primary rounded focus:outline-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <>
                              <span className="text-base font-extrabold text-slate-800 leading-none">{score}</span>
                              <span className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5 font-bold">score</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${scoreBg} ${scoreColor}`}>
                        {scoreLabel}
                      </span>
                    </div>
                  )
                })()}

                {/* INTERACTIVE status pills editor */}
                <div className="space-y-2 select-none">
                  <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Pipeline Status</h3>
                  <div className="relative flex items-center">
                    <select
                      value={activeLeadDetails.status}
                      onChange={(e) => handleLeadStatusChange(activeLeadDetails.id, e.target.value)}
                      className={`w-full h-8 px-2.5 rounded text-[12px] font-bold cursor-pointer outline-none border transition-colors ${getStatusBadgeStyles(activeLeadDetails.status)}`}
                      title="Change Status"
                    >
                      <option value="NEW" className="bg-white text-slate-800">NEW</option>
                      <option value="CONTACTED" className="bg-white text-slate-800">CONTACTED</option>
                      <option value="QUALIFIED" className="bg-white text-slate-800">QUALIFIED</option>
                      <option value="LOST" className="bg-white text-slate-800">LOST</option>
                    </select>
                  </div>
                </div>

                <hr className="border-outline-variant" />

                {/* Dynamic Assigned Counselor selector */}
                <div className="space-y-2">
                  <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Assigned Counselor</h3>
                  <select
                    value={activeLeadDetails.assignedTo}
                    onChange={(e) => handleLeadCounselorChange(activeLeadDetails.id, e.target.value)}
                    className="w-full h-8 px-2.5 border border-outline-variant rounded bg-surface text-[12px] font-medium outline-none cursor-pointer hover:bg-slate-50 focus:border-primary transition-colors select-none"
                  >
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="Marcus Chan">Marcus Chan</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                <hr className="border-outline-variant" />

                {/* Contact Info Block */}
                <div className="space-y-3 font-sans">
                  <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Contact Info</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">mail</span>
                      <a href={`mailto:${activeLeadDetails.email}`} className="hover:underline hover:text-primary text-[12px] truncate">{activeLeadDetails.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">phone</span>
                      <a href={`tel:${activeLeadDetails.phone}`} className="hover:underline hover:text-primary text-[12px]">{activeLeadDetails.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">location_on</span>
                      <span className="text-[12px]">{activeLeadDetails.location || 'Austin, TX'}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-outline-variant" />

                {/* Metadata Block */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Metadata</h3>
                  <div className="grid grid-cols-2 gap-y-2.5 text-[12px]">
                    <span className="text-on-surface-variant">Source</span>
                    <span className="text-on-background font-medium text-right">{activeLeadDetails.source || 'Organic Search'}</span>

                    <span className="text-on-surface-variant">Campaign</span>
                    <span className="text-on-background font-medium text-right truncate">{activeLeadDetails.campaign || 'Q3_Tech_Promo'}</span>

                    <span className="text-on-surface-variant">UTM Medium</span>
                    <span className="text-on-background font-medium text-right">cpc</span>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Interactive Activities & Audit Trail (~72% width) */}
              <div className="w-full lg:w-[72%] p-6 bg-surface flex flex-col text-left">

                {/* Timeline Header Section */}
                <div className="flex justify-between items-start border-b border-outline-variant pb-4 mb-4">
                  <div>
                    <h2 className="text-[16px] font-bold text-on-background leading-tight">Activity & Audit Trail</h2>
                    <p className="text-[12px] text-on-surface-variant">Detailed history of lead interactions.</p>
                  </div>
                  <button
                    onClick={handleExportTimeline}
                    className={`px-3 py-1 text-[11px] border border-outline-variant rounded flex items-center gap-1 font-semibold transition-all hover:bg-surface-container select-none cursor-pointer bg-surface ${exporting ? 'opacity-85' : ''}`}
                  >
                    {exporting ? (
                      <>
                        <svg className="animate-spin h-3 w-3 text-on-surface" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        Export
                      </>
                    )}
                  </button>
                </div>

                {/* INTERACTIVE TIMELINE logger box */}
                <div className="bg-slate-50 border border-outline-variant rounded-xl p-4 mb-6 select-none font-sans">
                  <h3 className="text-[12.5px] font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary select-none">add_circle</span>
                    Log New Interaction
                  </h3>

                  <div className="space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Type comments, task assignments, phone notes, or scheduled meetings..."
                      rows="2"
                      className="w-full text-[12px] p-2.5 border border-outline-variant rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none font-sans"
                    />

                    <div className="flex items-center justify-between gap-4">
                      {/* Log Category Selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Type:</span>
                        <select
                          value={interactionType}
                          onChange={(e) => setInteractionType(e.target.value)}
                          className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px] outline-none text-slate-700 cursor-pointer font-semibold shadow-2xs"
                        >
                          <option value="COMMENT">Add Comment / Note</option>
                          <option value="TASK">Assign Task / Reminder</option>
                          <option value="CALL">Phone Call Summary</option>
                          <option value="MEETING">Schedule Meeting</option>
                        </select>
                      </div>

                      {/* Submit */}
                      <button
                        onClick={handleLogInteraction}
                        className="px-3.5 py-1 bg-primary text-white rounded text-[11px] font-bold hover:bg-primary/95 transition-all shadow-sm cursor-pointer select-none"
                      >
                        Add to Activity Trail
                      </button>
                    </div>
                  </div>
                </div>

                {/* TIMELINE FILTERS & SEARCH */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 select-none font-sans">
                  {/* Category Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'ALL', label: 'All Activities', icon: 'list' },
                      { key: 'CALLS', label: 'Calls', icon: 'call' },
                      { key: 'EMAILS', label: 'Emails', icon: 'mail' },
                      { key: 'COMMENTS', label: 'Comments', icon: 'chat' },
                      { key: 'SYSTEM', label: 'System Logs', icon: 'settings' }
                    ].map(chip => (
                      <button
                        key={chip.key}
                        onClick={() => setTimelineFilter(chip.key)}
                        className={`h-7 px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all border cursor-pointer ${timelineFilter === chip.key
                          ? 'bg-primary border-primary text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">{chip.icon}</span>
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Activity Search */}
                  <div className="relative w-full sm:w-48">
                    <span className="material-symbols-outlined text-[14px] text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2">
                      search
                    </span>
                    <input
                      type="text"
                      value={timelineSearchQuery}
                      onChange={(e) => setTimelineSearchQuery(e.target.value)}
                      placeholder="Search log keywords..."
                      className="w-full h-7 pl-8 pr-2.5 border border-outline-variant rounded bg-surface text-[11px] focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Timeline Body (DYNAMICALLY RENDERED FROM STATE DATABASE!) */}
                <div className="relative border-l border-outline-variant ml-4 pl-6 space-y-6 pb-6 select-text max-h-[580px] overflow-y-auto">

                  {filteredTimeline.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 italic text-[11px] font-sans">
                      No activities match the selected filter/search criteria.
                    </div>
                  ) : (
                    filteredTimeline.map((event) => {
                      const isPlayingRec = playingRecording && event.recording

                      return (
                        <div key={event.id} className="relative">

                          {/* Colored Dotted Indicators */}
                          <div
                            className={`absolute -left-[28.5px] top-1.5 w-2 h-2 rounded-full outline outline-3 ${event.color === 'blue-600' ? 'bg-blue-600 outline-blue-100' :
                              event.color === 'green-600' ? 'bg-green-600 outline-green-100' :
                                event.color === 'red-600' ? 'bg-red-600 outline-red-100' :
                                  event.color === 'amber-800' ? 'bg-amber-800 outline-amber-100' :
                                    event.color.startsWith('#') ? '' : 'bg-slate-400 outline-slate-100'
                              }`}
                            style={event.color.startsWith('#') ? { backgroundColor: event.color, outlineColor: '#ffedd5' } : {}}
                          />

                          {/* Title block & Date stamp */}
                          <div className="flex justify-between items-center mb-1 font-sans">
                            <span className="text-[12.5px] font-bold text-slate-800">{event.title}</span>
                            <span className="text-[11px] text-slate-400 font-medium font-sans">{event.date}</span>
                          </div>

                          {/* Rendering COMMENT boxes */}
                          {event.type === 'COMMENT' && event.body && (
                            <div className="my-2 p-3 bg-slate-50 border-l-4 border-slate-300 rounded-r text-[12px] italic text-slate-700 leading-relaxed font-sans max-w-2xl shadow-2xs">
                              {event.body}
                            </div>
                          )}

                          {/* Rendering counselor re-assignments */}
                          {event.type === 'ASSIGNMENT' && event.body && (
                            <div className="my-1.5 text-[12px] text-slate-600 font-sans">
                              {event.body}
                            </div>
                          )}

                          {/* Rendering status adjustments flows (from/to badges) */}
                          {event.type === 'STATUS_CHANGE_FLOW' && event.body && (
                            <div className="flex items-center gap-2 my-2 select-none font-sans">
                              <span className="text-[11px] text-slate-400 font-medium">From</span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                                {event.body.from}
                              </span>
                              <span className="material-symbols-outlined text-[13px] text-slate-400">arrow_forward</span>
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200">
                                {event.body.to}
                              </span>
                            </div>
                          )}

                          {/* Inline status modifications */}
                          {event.type === 'STATUS_CHANGE' && event.body && (
                            <div className="flex items-center gap-2 my-2 select-none font-sans">
                              <span className="text-[11px] text-slate-400 font-medium">From</span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                                {event.body.from}
                              </span>
                              <span className="material-symbols-outlined text-[13px] text-slate-400">arrow_forward</span>
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200">
                                {event.body.to}
                              </span>
                            </div>
                          )}

                          {/* Rendering lead creation channels */}
                          {event.type === 'CREATION' && event.body && (
                            <div className="my-1.5 text-[12px] text-slate-600 font-sans">
                              {event.body}
                            </div>
                          )}

                          {/* Rendering dynamic email drafts */}
                          {event.type === 'EMAIL' && (
                            <div className="my-1.5 text-[12px] text-slate-600 font-sans space-y-1">
                              <p>{event.body}</p>
                              <button
                                onClick={() => setShowEmailModal(true)}
                                className="flex items-center gap-0.5 text-primary hover:underline text-[11px] font-bold cursor-pointer select-none"
                              >
                                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                                View Email
                              </button>
                            </div>
                          )}

                          {/* Rendering phone call summaries & dynamic waveform recorder */}
                          {event.type === 'CALL' && (
                            <div className="my-2 text-[12px] text-slate-600 font-sans space-y-1">
                              <div className="flex justify-between items-center max-w-md">
                                <p>{event.body}</p>
                                {event.recording && (
                                  <button
                                    onClick={() => {
                                      setPlayingRecording(!playingRecording)
                                      if (!playingRecording) setAudioPlaying(true)
                                    }}
                                    className={`px-2.5 py-1 border border-blue-200 rounded-md flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50/50 hover:bg-blue-50 transition-colors shadow-2xs select-none cursor-pointer`}
                                  >
                                    <span className="material-symbols-outlined text-[14px]">
                                      {isPlayingRec && audioPlaying ? 'pause_circle' : 'play_circle'}
                                    </span>
                                    Listen to Recording
                                  </button>
                                )}
                              </div>

                              <AnimatePresence>
                                {isPlayingRec && (
                                  <motion.div
                                    className="mt-3 p-3 bg-linear-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-lg max-w-md shadow-2xs"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <button
                                        onClick={() => setAudioPlaying(!audioPlaying)}
                                        className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm select-none"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-white">
                                          {audioPlaying ? 'pause' : 'play_arrow'}
                                        </span>
                                      </button>

                                      <div className="flex-1 flex items-end h-6 gap-0.5 select-none overflow-hidden pb-0.5 cursor-pointer" title="Click waveform to seek">
                                        {[10, 24, 18, 30, 10, 16, 26, 38, 20, 14, 28, 8, 20, 36, 12, 18, 26, 32, 8, 14, 22, 38, 28, 16, 20, 12, 28, 20, 10, 18, 24, 30, 12, 20, 16].map((h, i, arr) => {
                                          const percent = (i / arr.length) * 100
                                          const isPlayed = percent <= playbackProgress
                                          return (
                                            <motion.div
                                              key={i}
                                              onClick={() => setPlaybackProgress(percent)}
                                              className={`flex-1 rounded-t-sm transition-colors duration-150 ${isPlayed ? 'bg-blue-600' : 'bg-blue-200 hover:bg-blue-300'
                                                }`}
                                              style={{ height: `${h}%` }}
                                              animate={audioPlaying ? {
                                                height: [
                                                  `${h}%`,
                                                  `${Math.min(h * 1.5, 100)}%`,
                                                  `${Math.max(h * 0.3, 10)}%`,
                                                  `${h}%`
                                                ]
                                              } : { height: `${h}%` }}
                                              transition={{
                                                duration: 1.1 / (playbackSpeed === '2x' ? 2 : playbackSpeed === '1.5x' ? 1.5 : 1),
                                                repeat: Infinity,
                                                delay: i * 0.025,
                                                ease: 'easeInOut'
                                              }}
                                            />
                                          )
                                        })}
                                      </div>

                                      <div className="flex items-center gap-1 border border-blue-200 rounded px-1.5 py-0.5 bg-white shadow-2xs">
                                        {['1x', '1.5x', '2x'].map((speed) => (
                                          <button
                                            key={speed}
                                            onClick={() => setPlaybackSpeed(speed)}
                                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${playbackSpeed === speed
                                              ? 'bg-blue-600 text-white'
                                              : 'text-blue-600 hover:bg-blue-50'
                                              }`}
                                          >
                                            {speed}
                                          </button>
                                        ))}
                                      </div>

                                      <span className="text-[10px] font-bold text-blue-700 font-mono whitespace-nowrap">
                                        {(() => {
                                          const elapsedSecs = Math.floor((playbackProgress / 100) * 262)
                                          const min = Math.floor(elapsedSecs / 60)
                                          const sec = elapsedSecs % 60
                                          return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
                                        })()} / 04:22
                                      </span>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}

                          {/* Rendering tags added */}
                          {event.type === 'TAG' && (
                            <div className="my-2 select-none">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                {event.body}
                              </span>
                            </div>
                          )}

                          {/* Rendering scheduled meetings links */}
                          {event.type === 'MEETING' && (
                            <div className="my-1.5 text-[12px] text-slate-600 font-sans space-y-1">
                              <p>{event.body}</p>
                              <a
                                href="https://meet.google.com/abc-defg-hij"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-0.5 text-primary hover:underline text-[11px] font-bold cursor-pointer select-none"
                              >
                                <span className="material-symbols-outlined text-[13px]">video_call</span>
                                Meeting Link
                              </a>
                            </div>
                          )}

                          {/* Dynamic Tasks / Adjustments events */}
                          {(event.type === 'TASK' || event.type === 'INTERACTION' || event.type === 'SCORE_CHANGE') && event.body && (
                            <div className="my-1.5 text-[12px] text-slate-650 font-sans font-medium flex items-start gap-1">
                              {event.type === 'TASK' && (
                                <span className="material-symbols-outlined text-[15px] text-blue-600 mt-0.5">assignment_turned_in</span>
                              )}
                              <p>{event.body}</p>
                            </div>
                          )}

                          {/* Footnote */}
                          <div className="text-[10px] text-slate-400 font-mono mt-1 select-none">
                            USER: <span className="font-bold text-slate-500">{event.user}</span> &nbsp;&nbsp; IP: <span className="text-slate-500">{event.ip}</span>
                          </div>
                        </div>
                      )
                    })
                  )}

                </div>

              </div>

            </div>

            {/* HIGH FIDELITY EMAIL DETAIL POPUP MODAL */}
            <AnimatePresence>
              {showEmailModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 select-text">
                  <motion.div
                    className="bg-surface rounded-xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* Modal Header */}
                    <div className="px-5 py-3 border-b border-outline-variant bg-surface-container flex justify-between items-center">
                      <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                        Email Details
                      </h3>
                      <button
                        onClick={() => setShowEmailModal(false)}
                        className="p-1 hover:bg-surface-container-high rounded-full text-on-surface-variant cursor-pointer flex items-center justify-center select-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-5 space-y-4 text-left text-[12px] overflow-y-auto max-h-[400px]">
                      <div className="grid grid-cols-6 gap-y-2 border-b border-outline-variant pb-3.5 text-slate-700 font-sans">
                        <span className="col-span-1 text-slate-400 font-semibold">From:</span>
                        <span className="col-span-5 font-medium">John Doe &lt;john.doe@leadpro.com&gt;</span>

                        <span className="col-span-1 text-slate-400 font-semibold">To:</span>
                        <span className="col-span-5 font-medium">{activeLeadDetails.name} &lt;{activeLeadDetails.email}&gt;</span>

                        <span className="col-span-1 text-slate-400 font-semibold">Subject:</span>
                        <span className="col-span-5 font-bold text-slate-900">Introduction to LeadPro CRM</span>
                      </div>

                      <div className="pt-2 text-slate-600 space-y-3.5 leading-relaxed font-sans text-[12px] whitespace-pre-line">
                        {`Dear ${activeLeadDetails.name.split(' ')[0]},

                        Thank you for your interest in LeadPro CRM! We are thrilled to show you how our system can help streamline your lead distribution and pipeline analytics.
                        
                        I tried reaching you by phone earlier today to learn a bit more about your current software stack and target goals for the upcoming quarter.
                        
                        Could you let me know a convenient time for a brief 10-minute discovery call? Alternatively, you can schedule a slot directly on my calendar.
                        
                        Looking forward to speaking with you!
                        
                        Best regards,
                        John Doe
                        Lead Account Executive`}
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-5 py-3 border-t border-outline-variant bg-surface-container flex justify-end">
                      <button
                        onClick={() => setShowEmailModal(false)}
                        className="px-3.5 py-1.5 bg-primary text-white rounded text-[11px] font-bold hover:bg-primary/95 transition-colors cursor-pointer select-none"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* DYNAMIC MERGE PROFILES COMPARE MODAL */}
            <AnimatePresence>
              {showMergeModal && (
                (() => {
                  const dupe = getDuplicateRecord(activeLeadDetails)
                  if (!dupe) return null
                  return (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-text font-sans">
                      <motion.div
                        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                      >
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                          <div className="text-left">
                            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[20px] text-amber-500">merge_type</span>
                              Compare & Merge Lead Profiles
                            </h3>
                            <p className="text-[11.5px] text-slate-500 mt-0.5">
                              Select which attributes to keep. Activities and timelines from both profiles will be consolidated chronologically.
                            </p>
                          </div>
                          <button
                            onClick={() => setShowMergeModal(false)}
                            className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center select-none transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                          </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 text-left">
                          {/* Alert Notice */}
                          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5 select-none">info</span>
                            <div className="text-[11px] text-amber-800 leading-normal">
                              <strong>Consolidation Warning:</strong> This operation is permanent. The duplicate profile (<span className="font-mono bg-amber-100 px-1 rounded">{dupe.id}</span>) will be removed, and the primary profile (<span className="font-mono bg-amber-100 px-1 rounded">{activeLeadDetails.id}</span>) will capture all history and the selected attributes below.
                            </div>
                          </div>

                          {/* Side-by-Side Attributes Table Grid */}
                          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50/20">
                            <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                              <div className="col-span-4 px-4 py-3 text-left">Attribute</div>
                              <div className="col-span-4 px-4 py-3 text-left flex items-center gap-1.5 border-l border-slate-200 bg-blue-50/30">
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                Primary ({activeLeadDetails.id})
                              </div>
                              <div className="col-span-4 px-4 py-3 text-left flex items-center gap-1.5 border-l border-slate-200 bg-purple-50/30">
                                <span className="w-2 h-2 rounded-full bg-purple-600" />
                                Duplicate ({dupe.id})
                              </div>
                            </div>

                            <div className="divide-y divide-slate-200">
                              {[
                                { key: 'name', label: 'Full Name', icon: 'person' },
                                { key: 'email', label: 'Work Email', icon: 'mail' },
                                { key: 'phone', label: 'Phone Number', icon: 'phone' },
                                { key: 'score', label: 'Lead Score', icon: 'grade', isScore: true },
                                { key: 'status', label: 'Pipeline Status', icon: 'swap_horiz', isStatus: true },
                                { key: 'assignedTo', label: 'Counselor Assigned', icon: 'person_add', isCounselor: true },
                                { key: 'source', label: 'Lead Source', icon: 'source' },
                                { key: 'location', label: 'Location', icon: 'location_on' },
                                { key: 'campaign', label: 'Campaign Tag', icon: 'sell' }
                              ].map(({ key, label, icon, isScore, isStatus, isCounselor }) => {
                                const valPrimary = activeLeadDetails[key]
                                const valDuplicate = dupe[key]
                                const isSelectedPrimary = mergeSelectedProps[key] === valPrimary

                                return (
                                  <div key={key} className="grid grid-cols-12 text-[12px] font-sans items-center hover:bg-slate-50/30 transition-colors">
                                    {/* Label */}
                                    <div className="col-span-4 px-4 py-3 text-slate-500 font-bold flex items-center gap-1.5 select-none">
                                      <span className="material-symbols-outlined text-[15px] text-slate-400">{icon}</span>
                                      {label}
                                    </div>

                                    {/* Primary Value Option */}
                                    <div
                                      onClick={() => handlePropSelection(key, valPrimary)}
                                      className={`col-span-4 px-4 py-3 border-l border-slate-200 cursor-pointer transition-all flex items-center gap-3 select-none min-h-[46px] ${isSelectedPrimary ? 'bg-blue-50/20 font-bold text-blue-700' : 'text-slate-600 hover:bg-slate-50/50'
                                        }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`merge_field_${key}`}
                                        checked={isSelectedPrimary}
                                        onChange={() => handlePropSelection(key, valPrimary)}
                                        className="w-4 h-4 cursor-pointer accent-blue-600 flex-shrink-0"
                                      />
                                      <div className="truncate">
                                        {isStatus ? (
                                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(valPrimary)}`}>
                                            {valPrimary}
                                          </span>
                                        ) : isScore ? (
                                          <span className="font-extrabold font-mono text-slate-750">{valPrimary}</span>
                                        ) : isCounselor ? (
                                          <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-extrabold">
                                              {valPrimary.charAt(0)}
                                            </div>
                                            <span>{valPrimary}</span>
                                          </div>
                                        ) : (
                                          <span>{valPrimary || '--'}</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Duplicate Value Option */}
                                    <div
                                      onClick={() => handlePropSelection(key, valDuplicate)}
                                      className={`col-span-4 px-4 py-3 border-l border-slate-200 cursor-pointer transition-all flex items-center gap-3 select-none min-h-[46px] ${!isSelectedPrimary ? 'bg-purple-50/20 font-bold text-purple-700' : 'text-slate-600 hover:bg-slate-50/50'
                                        }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`merge_field_${key}`}
                                        checked={!isSelectedPrimary}
                                        onChange={() => handlePropSelection(key, valDuplicate)}
                                        className="w-4 h-4 cursor-pointer accent-purple-600 flex-shrink-0"
                                      />
                                      <div className="truncate">
                                        {isStatus ? (
                                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(valDuplicate)}`}>
                                            {valDuplicate}
                                          </span>
                                        ) : isScore ? (
                                          <span className="font-extrabold font-mono text-slate-750">{valDuplicate}</span>
                                        ) : isCounselor ? (
                                          <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[9px] font-extrabold">
                                              {valDuplicate.charAt(0)}
                                            </div>
                                            <span>{valDuplicate}</span>
                                          </div>
                                        ) : (
                                          <span>{valDuplicate || '--'}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Merged Outcome Preview */}
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider select-none flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px] text-slate-400">preview</span>
                              Outcome Profile Summary
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-[12px] font-sans text-slate-700">
                              <div>
                                <span className="text-slate-400 font-medium block text-[10.5px]">Merged Name</span>
                                <span className="font-bold text-slate-800">{mergeSelectedProps.name}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block text-[10.5px]">Merged Work Email</span>
                                <span className="font-bold text-slate-800">{mergeSelectedProps.email}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block text-[10.5px]">Merged Phone Number</span>
                                <span className="font-bold text-slate-800">{mergeSelectedProps.phone || '--'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block text-[10.5px]">Consolidated Score</span>
                                <span className="font-extrabold text-slate-800 font-mono">{mergeSelectedProps.score}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block text-[10.5px]">Consolidated Status</span>
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${getStatusColor(mergeSelectedProps.status)}`}>
                                  {mergeSelectedProps.status}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block text-[10.5px]">Consolidated Counselor</span>
                                <span className="font-bold text-slate-800">{mergeSelectedProps.assignedTo}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 select-none">
                          <button
                            onClick={() => setShowMergeModal(false)}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-bold transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleMergeProfiles}
                            className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[15px] text-white">done</span>
                            Confirm & Merge Profiles
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )
                })()
              )}
            </AnimatePresence>

            {/* VIEW APPLICATION MODAL */}
            <AnimatePresence>
              {showApplicationModal && activeModalLead && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-text font-sans">
                  <motion.div
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                  >
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="text-left">
                        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-blue-600">assignment</span>
                          Lead Application Profile
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Submitted application data for vetting.</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowApplicationModal(false);
                          setActiveModalLead(null);
                        }}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors select-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4 text-left overflow-y-auto max-h-[70vh]">
                      <div className="flex items-center gap-3 bg-blue-50/40 border border-blue-100/50 rounded-xl p-3.5 select-none">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary text-sm font-bold">
                          {getInitials(activeModalLead.name)}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-slate-800 leading-tight">{activeModalLead.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{activeModalLead.email} • {activeModalLead.phone || '--'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applied Plan</span>
                          <span className="text-[12px] font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                            {activeModalLead.application?.appliedProgram}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submission Date</span>
                          <span className="text-[12px] font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                            {activeModalLead.application?.submissionDate}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Name</span>
                          <span className="text-[12.5px] font-semibold text-slate-800">{activeModalLead.application?.companyName}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Size</span>
                          <span className="text-[12.5px] font-semibold text-slate-800">{activeModalLead.application?.companySize}</span>
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-slate-100 pt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Annual Revenue</span>
                        <span className="text-[12.5px] font-semibold text-slate-800">{activeModalLead.application?.annualRevenue}</span>
                      </div>

                      <div className="space-y-1 border-t border-slate-100 pt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Use Case & Objectives</span>
                        <p className="text-[12px] text-slate-600 leading-relaxed font-sans">{activeModalLead.application?.useCase}</p>
                      </div>

                      <div className="space-y-1 border-t border-slate-100 pt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Additional Vetting Notes</span>
                        <p className="text-[12px] text-slate-600 leading-relaxed font-sans italic">{activeModalLead.application?.notes}</p>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center select-none">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Status: ACTIVE VETTING
                      </span>
                      <button
                        onClick={() => {
                          setShowApplicationModal(false);
                          setActiveModalLead(null);
                        }}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11.5px] font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Close Profile
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* VIEW QUERIES MODAL */}
            <AnimatePresence>
              {showQueriesModal && activeModalLead && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-text font-sans">
                  <motion.div
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                  >
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="text-left">
                        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-blue-600">question_answer</span>
                          Support Queries & Inquiries
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Manage customer questions and ticket resolutions.</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowQueriesModal(false);
                          setActiveModalLead(null);
                          setQueriesAnswerText('');
                        }}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors select-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4 text-left overflow-y-auto max-h-[60vh]">
                      <div className="flex items-center gap-3 bg-blue-50/40 border border-blue-100/50 rounded-xl p-3.5 select-none">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary text-sm font-bold">
                          {getInitials(activeModalLead.name)}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-slate-800 leading-tight">{activeModalLead.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{activeModalLead.email}</p>
                        </div>
                      </div>

                      {activeModalLead.queries && activeModalLead.queries.length > 0 ? (
                        <div className="space-y-4">
                          {activeModalLead.queries.map((query) => (
                            <div key={query.id} className="border border-slate-150 rounded-xl overflow-hidden shadow-2xs bg-slate-50/40">
                              {/* Query Header */}
                              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 flex justify-between items-center select-none">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Ticket #Q-98{query.id} • {query.date}</span>
                                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold border ${query.status === 'RESOLVED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                  }`}>
                                  {query.status}
                                </span>
                              </div>

                              {/* Query Body */}
                              <div className="p-4 space-y-3">
                                <div>
                                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Customer Question</span>
                                  <p className="text-[12.5px] font-semibold text-slate-850 leading-relaxed font-sans">{query.question}</p>
                                </div>

                                {query.response ? (
                                  <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-lg p-3 mt-2">
                                    <div className="flex items-center gap-1.5 mb-1.5 select-none">
                                      <span className="material-symbols-outlined text-[14px] text-emerald-600 font-bold">check_circle</span>
                                      <span className="text-[9px] font-extrabold text-emerald-750 uppercase tracking-wider">Counselor Response</span>
                                    </div>
                                    <p className="text-[12px] text-slate-700 leading-relaxed font-sans">{query.response}</p>
                                  </div>
                                ) : (
                                  <div className="pt-2 border-t border-slate-100">
                                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5 select-none">Submit Response to resolve ticket</span>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="Type reply and mark resolved..."
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleSendQueryResponse(activeModalLead.id, query.id, e.target.value);
                                          }
                                        }}
                                        className="flex-1 h-8 px-3 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      />
                                      <button
                                        onClick={(e) => {
                                          const inputElem = e.currentTarget.previousSibling;
                                          handleSendQueryResponse(activeModalLead.id, query.id, inputElem.value);
                                        }}
                                        className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer select-none"
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-10 text-center select-none">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-2">
                            <span className="material-symbols-outlined text-[24px]">sentiment_satisfied</span>
                          </div>
                          <p className="text-[12px] font-bold text-slate-600">No active inquiries from this lead.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Everything is resolved and up to date!</p>
                        </div>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end select-none">
                      <button
                        onClick={() => {
                          setShowQueriesModal(false);
                          setActiveModalLead(null);
                          setQueriesAnswerText('');
                        }}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11.5px] font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Close Panel
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* BULK UPLOAD MODAL */}
            <AnimatePresence>
              {showBulkUploadModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-text font-sans">
                  <motion.div
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                  >
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="text-left">
                        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-blue-600">upload_file</span>
                          Bulk Offline Upload
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Ingest new leads dynamically from a CSV file.</p>
                      </div>
                      <button
                        onClick={() => setShowBulkUploadModal(false)}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors select-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-5 text-left">
                      <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-8 text-center bg-slate-50/50 cursor-pointer transition-colors select-none">
                        <span className="material-symbols-outlined text-[40px] text-slate-400 block mb-2">cloud_upload</span>
                        <span className="text-[12.5px] font-bold text-slate-700 block">Drag & Drop CSV file here</span>
                        <span className="text-[11px] text-slate-400 block mt-1">or click to browse local files</span>
                      </div>

                      {uploadingBulk ? (
                        <div className="space-y-2 select-none">
                          <div className="flex justify-between items-center text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                            <span>Ingesting leads...</span>
                            <span>85%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-blue-600 rounded-full"
                              initial={{ width: '0%' }}
                              animate={{ width: '85%' }}
                              transition={{ duration: 1.2 }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-3.5 select-none text-[11.5px] text-slate-600 leading-relaxed font-sans">
                          <strong>Simulate Ingestion:</strong> Click "Process CSV Upload" to simulate loading and importing 2 sample leads offline.
                        </div>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 select-none">
                      <button
                        onClick={() => setShowBulkUploadModal(false)}
                        className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-bold transition-all cursor-pointer"
                        disabled={uploadingBulk}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBulkUploadCSV}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                        disabled={uploadingBulk}
                      >
                        {uploadingBulk ? 'Processing...' : 'Process CSV Upload'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* ADD QUICK LEAD MODAL */}
            <AnimatePresence>
              {showQuickLeadModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-text font-sans">
                  <motion.div
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                  >
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="text-left">
                        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-blue-600">person_add</span>
                          Add Quick Lead
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Quickly inject a new lead into your local CRM database.</p>
                      </div>
                      <button
                        onClick={() => setShowQuickLeadModal(false)}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors select-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4 text-left">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Lead Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. John Watson"
                          value={quickLeadForm.name}
                          onChange={(e) => setQuickLeadForm({ ...quickLeadForm, name: e.target.value })}
                          className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Work Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. watson@baker.co.uk"
                          value={quickLeadForm.email}
                          onChange={(e) => setQuickLeadForm({ ...quickLeadForm, email: e.target.value })}
                          className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +44 7890 12345"
                          value={quickLeadForm.phone}
                          onChange={(e) => setQuickLeadForm({ ...quickLeadForm, phone: e.target.value })}
                          className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Assign to Counselor</label>
                        <select
                          value={quickLeadForm.assignedTo}
                          onChange={(e) => setQuickLeadForm({ ...quickLeadForm, assignedTo: e.target.value })}
                          className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Sarah Jenkins">Sarah Jenkins</option>
                          <option value="Marcus Chan">Marcus Chan</option>
                          <option value="Unassigned">Unassigned</option>
                        </select>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 select-none">
                      <button
                        onClick={() => setShowQuickLeadModal(false)}
                        className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddQuickLead(quickLeadForm)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Add Lead
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* GLOBAL CHANGE STAGE MODAL */}
            <AnimatePresence>
              {showGlobalStageModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-text font-sans">
                  <motion.div
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                  >
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="text-left">
                        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-blue-600">swap_horiz</span>
                          Bulk Change Stage
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Change pipeline stage for {selectedLeads.length} leads.</p>
                      </div>
                      <button
                        onClick={() => setShowGlobalStageModal(false)}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors select-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4 text-left">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Select New Pipeline Status</label>
                        <select
                          defaultValue="NEW"
                          id="globalStageSelectInput"
                          className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="LOST">LOST</option>
                        </select>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 select-none">
                      <button
                        onClick={() => setShowGlobalStageModal(false)}
                        className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const val = document.getElementById('globalStageSelectInput').value;
                          handleApplyGlobalStage(val);
                        }}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Apply Stage Update
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
