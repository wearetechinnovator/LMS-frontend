import React, { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LeadDetailsDrawer from '../../../components/LeadDetailsDrawer'
import './leads.css'

export default function AllLeadsPage() {
  const location = useLocation()
  const [selectedLeads, setSelectedLeads] = useState([])
  const [activeLeadDetails, setActiveLeadDetails] = useState(null)
  const [hoveredLeadId, setHoveredLeadId] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
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

  // Detect when cursor stops moving for 2 seconds to show tooltip
  useEffect(() => {
    if (!hoveredLeadId) {
      setShowTooltip(false)
      return
    }

    // Hide tooltip while cursor is active/moving
    setShowTooltip(false)

    // Trigger show only after cursor remains still for 2 seconds (2000ms)
    const showTimer = setTimeout(() => {
      setShowTooltip(true)
    }, 2000)

    return () => clearTimeout(showTimer)
  }, [hoveredLeadId, tooltipPos])

  // Limit tooltip visibility to 3 seconds (3000ms) once shown
  useEffect(() => {
    if (showTooltip) {
      const hideTimer = setTimeout(() => {
        setShowTooltip(false)
      }, 3000)
      return () => clearTimeout(hideTimer)
    }
  }, [showTooltip])

  // Sorting, Searching and Filtering state
  // Sorting, Searching and Filtering state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRangeFilter, setDateRangeFilter] = useState('all')
  const [leadOwnerFilter, setLeadOwnerFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [verificationFilter, setVerificationFilter] = useState('all')
  const [queryFilter, setQueryFilter] = useState('all')
  const [detailsActiveTab, setDetailsActiveTab] = useState('overview')

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
    phone: true,
    score: true,
    status: true,
    assignedTo: true,
    source: true,
    query: true,
    verified: true,
    lastContacted: true,
    nextFollowUp: true,
    age: true,
    priority: true,
    tags: false,
    activityCount: false,
    conversionProb: false,
    location: false,
    campaign: false
  })
  const [showColumnDropdown, setShowColumnDropdown] = useState(false)

  // Double horizontal scrollbar state & refs
  const tableContainerRef = React.useRef(null)
  const topScrollbarRef = React.useRef(null)
  const [tableScrollWidth, setTableScrollWidth] = React.useState(0)

  const handleTopScroll = () => {
    if (topScrollbarRef.current && tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = topScrollbarRef.current.scrollLeft
    }
  }

  const handleTableScroll = () => {
    if (topScrollbarRef.current && tableContainerRef.current) {
      topScrollbarRef.current.scrollLeft = tableContainerRef.current.scrollLeft
    }
  }

  React.useEffect(() => {
    const updateWidth = () => {
      if (tableContainerRef.current) {
        setTableScrollWidth(tableContainerRef.current.scrollWidth)
      }
    }

    updateWidth()

    let resizeObserver = null
    if (tableContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateWidth()
      })
      resizeObserver.observe(tableContainerRef.current)
      const tableEl = tableContainerRef.current.querySelector('table')
      if (tableEl) {
        resizeObserver.observe(tableEl)
      }
    }

    window.addEventListener('resize', updateWidth)
    const timeoutId = setTimeout(updateWidth, 300)

    return () => {
      window.removeEventListener('resize', updateWidth)
      clearTimeout(timeoutId)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [visibleColumns])

  // -- NEW STATE HOOKS FOR LEAD ACTIONS POPUPS --
  const [activeDropdownLeadId, setActiveDropdownLeadId] = useState(null)
  const [showQueriesModal, setShowQueriesModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [activeModalLead, setActiveModalLead] = useState(null)
  const [queriesAnswerText, setQueriesAnswerText] = useState('')
  const [showReassignSubId, setShowReassignSubId] = useState(null)

  // -- NEW STATE HOOKS FOR GLOBAL ACTIONS DROPDOWN & MODALS --
  const [showGlobalActionsDropdown, setShowGlobalActionsDropdown] = useState(false)
  const [showDownloadFormats, setShowDownloadFormats] = useState(false)
  const [showQuickLeadModal, setShowQuickLeadModal] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [showGlobalStageModal, setShowGlobalStageModal] = useState(false)
  const [quickLeadForm, setQuickLeadForm] = useState({ name: '', email: '', phone: '', assignedTo: 'Sarah Jenkins', leadType: 'Online', source: 'Website Organic', query: '' })
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
    campaign: 'Referral_Promo',
    query: 'BCA'
  })

  const handlePropSelection = (field, value) => {
    setMergeSelectedProps(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Synchronize mergeSelectedProps when activeLeadDetails changes
  useEffect(() => {
    if (activeLeadDetails) {
      setMergeSelectedProps({
        name: activeLeadDetails.name || '',
        email: activeLeadDetails.email || '',
        phone: activeLeadDetails.phone || '',
        status: activeLeadDetails.status || '',
        assignedTo: activeLeadDetails.assignedTo || '',
        source: activeLeadDetails.source || '',
        score: activeLeadDetails.score || 50,
        location: activeLeadDetails.location || '',
        campaign: activeLeadDetails.campaign || '',
        query: activeLeadDetails.query || ''
      })
    }
  }, [activeLeadDetails])

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
  const [leads, setLeads] = useState(() => {
    const localData = localStorage.getItem('lms_leads_database')
    if (localData) {
      try {
        return JSON.parse(localData)
      } catch (e) {
        console.error("Error parsing leads database from localStorage:", e)
      }
    }
    const initial = [
      { id: 'LS-1021', name: 'Eleanor Penthilgon', email: 'eleanor.p@enterprise.com', phone: '+1 (555) 617-2834', status: 'NEW', assignedTo: 'Sarah Jenkins', source: 'Website Organic', score: 92, location: 'Austin, TX', campaign: 'Q3_Tech_Promo', tier: 'Primary', verified: true, formName: 'B.Tech Admissions Form', createdToday: true, query: 'B.Tech' },
      { id: 'LS-1020', name: 'Jackson Reed', email: 'j.reed88@gmail.com', phone: '+1 (555) 837-1126', status: 'CONTACTED', assignedTo: 'Marcus Chan', source: 'Paid Search', score: 74, location: 'Houston, TX', campaign: 'Q3_Tech_Promo', tier: 'Secondary', verified: true, formName: 'MBA Scholarship Form', createdToday: false, followUpToday: true, query: 'MBA' },
      { id: 'LS-1019', name: 'Amina Patel', email: 'apatel.design@studio.co', phone: '+44 7890 90877', status: 'QUALIFIED', assignedTo: 'Sarah Jenkins', source: 'Referral', score: 95, location: 'London, UK', campaign: 'Referral_Promo', tier: 'Primary', verified: true, formName: 'B.Tech Admissions Form', createdToday: true, query: 'BCA' },
      { id: 'LS-1018', name: "Liam O'Connor", email: 'liam.o@solarix.ie', phone: '+353 1 234 5678', status: 'NEW', assignedTo: 'Unassigned', source: 'Direct Mail', score: 40, location: 'Dublin, IE', campaign: 'Q1_Direct_Mail', tier: 'Tertiary', verified: false, formName: 'General Inquiry Form', createdToday: false, query: 'Cardiology' },
      { id: 'LS-1017', name: 'Sophia Wong', email: 's.wong@fintech.com', phone: '+852 9123 4567', status: 'CONTACTED', assignedTo: 'Marcus Chan', source: 'Webinar', score: 81, location: 'Hong Kong, HK', campaign: 'Q3_Fintech_Webinar', tier: 'Primary', verified: false, formName: 'MBA Scholarship Form', createdToday: true, followUpToday: true, query: 'MCA' },
      { id: 'LS-1016', name: 'David Miller', email: 'dmiller@realtech.io', phone: '+1 (555) 908-1212', status: 'LOST', assignedTo: 'Sarah Jenkins', source: 'Cold Outreach', score: 15, location: 'Boston, MA', campaign: 'Cold_Outreach_Q2', tier: 'Tertiary', verified: true, formName: 'General Inquiry Form', createdToday: false, query: 'Heart' },
      { id: 'LS-1015', name: 'Amina Patel (Duplicate)', email: 'apatel.design@studio.co', phone: '+44 7890 99999', status: 'NEW', assignedTo: 'Marcus Chan', source: 'Cold Outreach', score: 62, location: 'Manchester, UK', campaign: 'Cold_Outreach_Q2', tier: 'Secondary', verified: false, formName: 'B.Tech Admissions Form', createdToday: true, query: 'BCA' }
    ].map(lead => {
      // Define realistic default CRM fields
      const defaultCRMFields = {
        lastContacted: lead.status === 'NEW' ? 'None' : (lead.id === 'LS-1020' ? 'May 30, 2026' : (lead.id === 'LS-1019' ? 'May 31, 2026' : 'May 28, 2026')),
        nextFollowUp: lead.status === 'LOST' ? 'None' : (lead.id === 'LS-1020' ? 'Jun 03, 2026' : (lead.id === 'LS-1017' ? 'Jun 03, 2026' : 'Jun 10, 2026')),
        age: lead.createdToday ? '1 day' : (lead.id === 'LS-1016' ? '24 days' : '12 days'),
        priority: lead.score >= 80 ? 'High' : lead.score >= 50 ? 'Medium' : 'Low',
        tags: lead.tier === 'Primary' ? ['Enterprise', 'Hot'] : (lead.id === 'LS-1015' ? ['Duplicate', 'B.Tech'] : ['Inquiry']),
        activityCount: lead.id === 'LS-1016' ? 4 : 9,
        conversionProb: lead.score,
        leadType: ['Direct Mail', 'Cold Outreach', 'Bulk Offline CSV'].includes(lead.source) ? 'Offline' : 'Online'
      }
      // Dynamically inject custom initial timelines into database records
      return { ...lead, ...defaultCRMFields, timeline: [], application: getInitialApplication(lead), queries: getInitialQueries(lead) }
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
    })
    localStorage.setItem('lms_leads_database', JSON.stringify(initial))
    return initial
  })

  // Synchronize leads array state to localStorage when changes occur
  useEffect(() => {
    localStorage.setItem('lms_leads_database', JSON.stringify(leads))
  }, [leads])

  // Listen for storage or custom update events to synchronize lead changes instantly
  useEffect(() => {
    const handleLeadsUpdated = () => {
      const localData = localStorage.getItem('lms_leads_database')
      if (localData) {
        try {
          setLeads(JSON.parse(localData))
        } catch (e) {
          console.error("Error parsing updated leads database:", e)
        }
      }
    }
    window.addEventListener('lms-leads-updated', handleLeadsUpdated)
    window.addEventListener('storage', handleLeadsUpdated)
    return () => {
      window.removeEventListener('lms-leads-updated', handleLeadsUpdated)
      window.removeEventListener('storage', handleLeadsUpdated)
    }
  }, [])

  // Form filter state and dynamic counts
  const [selectedFormFilter, setSelectedFormFilter] = useState('ALL')

  const formsData = useMemo(() => {
    const counts = {}
    leads.forEach(lead => {
      const name = lead.formName || 'General Inquiry Form'
      counts[name] = (counts[name] || 0) + 1
    })

    return [
      { name: 'ALL', displayName: 'All Leads', count: leads.length },
      ...Object.keys(counts).map(name => ({
        name,
        displayName: name,
        count: counts[name]
      }))
    ]
  }, [leads])

  const uniqueQueries = useMemo(() => {
    const queries = new Set()
    leads.forEach(lead => {
      if (lead.query) {
        queries.add(lead.query)
      }
    })
    return Array.from(queries)
  }, [leads])

  const formFilteredLeads = useMemo(() => {
    return leads.filter(l => selectedFormFilter === 'ALL' || l.formName === selectedFormFilter)
  }, [leads, selectedFormFilter])

  // Sync form list data with Navbar dropdown
  React.useEffect(() => {
    const payload = {
      formsList: formsData,
      activeForm: selectedFormFilter
    }
    window.dispatchEvent(new CustomEvent('lms-forms-data-updated', { detail: payload }))
  }, [formsData, selectedFormFilter])

  // Listen to filter selection from Navbar
  React.useEffect(() => {
    const handleFilterChange = (e) => {
      if (e.detail) {
        setSelectedFormFilter(e.detail)
      }
    }
    window.addEventListener('lms-form-filter-changed', handleFilterChange)
    return () => window.removeEventListener('lms-form-filter-changed', handleFilterChange)
  }, [])

  React.useEffect(() => {
    if (location.state && location.state.activeLeadId) {
      const targetLead = leads.find(l => l.id === location.state.activeLeadId)
      if (targetLead) {
        setActiveLeadDetails(targetLead)
      }
    }
  }, [location.state, leads])

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-50/80 text-blue-700 border-blue-200/50'
      case 'CONTACTED':
        return 'bg-orange-50/80 text-orange-700 border-orange-200/50'
      case 'QUALIFIED':
        return 'bg-emerald-50/80 text-emerald-700 border-emerald-200/50'
      case 'LOST':
        return 'bg-rose-50/80 text-rose-700 border-rose-200/50'
      default:
        return 'bg-amber-50/80 text-amber-700 border-amber-200/50'
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
    let sortableItems = [...formFilteredLeads]
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
  }, [formFilteredLeads, sortConfig])

  const filteredAndSortedLeads = useMemo(() => {
    return sortedLeads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.query && lead.query.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = filterStatus === 'all' || lead.status === filterStatus

      // Date Range Filter
      let matchesDateRange = true
      if (dateRangeFilter === 'today') {
        matchesDateRange = lead.createdToday === true || lead.age === '1 day'
      } else if (dateRangeFilter === '7days') {
        const ageNum = parseInt(lead.age) || 1
        matchesDateRange = lead.createdToday === true || ageNum <= 7
      } else if (dateRangeFilter === '30days') {
        const ageNum = parseInt(lead.age) || 1
        matchesDateRange = ageNum <= 30
      }

      // Lead Owner Filter
      const matchesOwner = leadOwnerFilter === 'all' || lead.assignedTo === leadOwnerFilter

      // Source Filter
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter

      // Verification Filter
      const matchesVerification = verificationFilter === 'all' ||
        (verificationFilter === 'verified' ? lead.verified === true : lead.verified === false)

      // Query Filter
      const matchesQuery = queryFilter === 'all' || lead.query === queryFilter

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
      } else if (activeBlockFilter === 'online') {
        matchesBlock = !['Direct Mail', 'Cold Outreach', 'Bulk Offline CSV'].includes(lead.source) && lead.leadType !== 'Offline'
      } else if (activeBlockFilter === 'offline') {
        matchesBlock = ['Direct Mail', 'Cold Outreach', 'Bulk Offline CSV'].includes(lead.source) || lead.leadType === 'Offline'
      } else if (activeBlockFilter === 'not_assigned') {
        matchesBlock = lead.assignedTo === 'Unassigned'
      }

      return matchesSearch && matchesStatus && matchesDateRange && matchesOwner && matchesSource && matchesVerification && matchesQuery && matchesSavedTab && matchesBlock
    })
  }, [sortedLeads, searchQuery, filterStatus, dateRangeFilter, leadOwnerFilter, sourceFilter, verificationFilter, queryFilter, activeSavedTab, activeBlockFilter])

  // Counts for Today and Total Leads stats display
  const todayLeadsCount = useMemo(() => {
    return formFilteredLeads.filter(l => l.createdToday).length
  }, [formFilteredLeads])

  const todayFollowUpCount = useMemo(() => {
    return formFilteredLeads.filter(l => l.followUpToday).length
  }, [formFilteredLeads])

  const todayPendingCount = useMemo(() => {
    return formFilteredLeads.filter(l => l.createdToday && l.status === 'NEW').length
  }, [formFilteredLeads])

  const totalLeadsCount = formFilteredLeads.length

  const totalFollowUpCount = useMemo(() => {
    return formFilteredLeads.filter(l => l.status === 'CONTACTED').length
  }, [formFilteredLeads])

  const totalPendingCount = useMemo(() => {
    return formFilteredLeads.filter(l => l.status === 'NEW').length
  }, [formFilteredLeads])

  const segmentStats = useMemo(() => {
    const total = formFilteredLeads.length;

    // We compute the percentage out of total leads, or use realistic percentages
    const allCount = formFilteredLeads.length;
    const primaryCount = formFilteredLeads.filter(l => l.tier === 'Primary').length;
    const secondaryCount = formFilteredLeads.filter(l => l.tier === 'Secondary').length;
    const tertiaryCount = formFilteredLeads.filter(l => l.tier === 'Tertiary').length;
    const verifiedCount = formFilteredLeads.filter(l => l.verified).length;
    const unverifiedCount = formFilteredLeads.filter(l => !l.verified).length;
    const isOffline = (l) => l.leadType === 'Offline' || ['Direct Mail', 'Cold Outreach', 'Bulk Offline CSV'].includes(l.source);
    const offlineCount = formFilteredLeads.filter(isOffline).length;
    const onlineCount = formFilteredLeads.filter(l => !isOffline(l)).length;
    const unassignedCount = formFilteredLeads.filter(l => l.assignedTo === 'Unassigned').length;

    const getRealPercent = (count) => total > 0 ? Math.round((count / total) * 100) : 0;

    return {
      all: { count: allCount, pct: 100 },
      primary: { count: primaryCount, pct: getRealPercent(primaryCount) },
      secondary: { count: secondaryCount, pct: getRealPercent(secondaryCount) },
      tertiary: { count: tertiaryCount, pct: getRealPercent(tertiaryCount) },
      verified: { count: verifiedCount, pct: getRealPercent(verifiedCount) },
      unverified: { count: unverifiedCount, pct: getRealPercent(unverifiedCount) },
      online: { count: onlineCount, pct: getRealPercent(onlineCount) },
      offline: { count: offlineCount, pct: getRealPercent(offlineCount) },
      not_assigned: { count: unassignedCount, pct: getRealPercent(unassignedCount) }
    };
  }, [formFilteredLeads])

  const filteredTimeline = useMemo(() => {
    if (!activeLeadDetails || !activeLeadDetails.timeline) return []
    return activeLeadDetails.timeline.filter(event => {
      // Filter by chip category
      if (timelineFilter !== 'ALL') {
        if (timelineFilter === 'CALLS' && event.type !== 'CALL') return false
        if (timelineFilter === 'EMAILS' && event.type !== 'EMAIL') return false
        if (timelineFilter === 'MEETINGS' && event.type !== 'MEETING') return false
        if (timelineFilter === 'TASKS' && event.type !== 'TASK') return false
        if (timelineFilter === 'NOTES' && event.type !== 'COMMENT') return false
        if (timelineFilter === 'STATUS_CHANGES' && !['STATUS_CHANGE', 'STATUS_CHANGE_FLOW'].includes(event.type)) return false
        if (timelineFilter === 'SYSTEM' && !['SYSTEM', 'CREATION', 'ASSIGNMENT', 'SCORE_CHANGE', 'TAG'].includes(event.type)) return false
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

  const handleTogglePinEvent = (eventId) => {
    if (!activeLeadDetails || !activeLeadDetails.timeline) return
    const updatedTimeline = activeLeadDetails.timeline.map(event => {
      if (event.id === eventId) {
        return { ...event, pinned: !event.pinned }
      }
      return event
    })
    // Sort so pinned are at the top
    const sortedTimeline = [
      ...updatedTimeline.filter(e => e.pinned),
      ...updatedTimeline.filter(e => !e.pinned)
    ]
    setLeads(leads.map(lead => {
      if (lead.id === activeLeadDetails.id) {
        const updated = { ...lead, timeline: sortedTimeline }
        setActiveLeadDetails(updated)
        return updated
      }
      return lead
    }))
    triggerToast(`Activity pin toggled!`)
  }

  const handleQuickLog = (actionTitle, actionBody) => {
    if (!activeLeadDetails) return
    const newEvent = {
      id: Date.now(),
      type: actionTitle.includes('Task') ? 'TASK' : actionTitle.includes('Meeting') ? 'MEETING' : 'COMMENT',
      title: actionTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
      body: actionBody,
      user: 'Sarah Jenkins',
      ip: '192.168.1.105',
      icon: actionTitle.includes('Call') ? 'call' : actionTitle.includes('Email') ? 'mail' : actionTitle.includes('WhatsApp') ? 'chat' : actionTitle.includes('Meeting') ? 'calendar_today' : 'task_alt',
      color: 'blue-600'
    }
    const updatedTimeline = [newEvent, ...activeLeadDetails.timeline]
    const sortedTimeline = [
      ...updatedTimeline.filter(e => e.pinned),
      ...updatedTimeline.filter(e => !e.pinned)
    ]
    setLeads(leads.map(lead => {
      if (lead.id === activeLeadDetails.id) {
        const updated = { ...lead, timeline: sortedTimeline }
        setActiveLeadDetails(updated)
        return updated
      }
      return lead
    }))
    triggerToast(`${actionTitle} logged!`)
  }

  const handleQuickLogDirect = (leadId, actionTitle, actionBody) => {
    const targetLead = leads.find(l => l.id === leadId)
    if (!targetLead) return
    const newEvent = {
      id: Date.now(),
      type: actionTitle.includes('Task') ? 'TASK' : actionTitle.includes('Meeting') ? 'MEETING' : 'COMMENT',
      title: actionTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
      body: actionBody,
      user: 'Sarah Jenkins',
      ip: '192.168.1.105',
      icon: actionTitle.includes('Call') ? 'call' : actionTitle.includes('Email') ? 'mail' : actionTitle.includes('WhatsApp') ? 'chat' : actionTitle.includes('Meeting') ? 'calendar_today' : 'task_alt',
      color: 'blue-600'
    }
    const updatedTimeline = [newEvent, ...(targetLead.timeline || [])]
    const sortedTimeline = [
      ...updatedTimeline.filter(e => e.pinned),
      ...updatedTimeline.filter(e => !e.pinned)
    ]
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const updated = { ...lead, timeline: sortedTimeline }
        if (activeLeadDetails && activeLeadDetails.id === leadId) {
          setActiveLeadDetails(updated)
        }
        return updated
      }
      return lead
    }))
    triggerToast(`${actionTitle} logged!`)
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
      source: formData.source || 'Quick Add Form',
      score: 50,
      location: 'N/A',
      campaign: 'Direct_Ingest',
      tier: 'Secondary',
      verified: false,
      createdToday: true,
      lastContacted: 'None',
      nextFollowUp: 'Jun 10, 2026',
      age: '1 day',
      priority: 'Medium',
      tags: ['Quick Add'],
      activityCount: 1,
      conversionProb: 50,
      leadType: formData.leadType || 'Online',
      query: formData.query || 'BCA',
      timeline: [
        {
          id: Date.now(),
          type: 'CREATION',
          title: `Lead Created (${formData.leadType || 'Online'} Add)`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
          body: `Added manually by counselor as ${formData.leadType || 'Online'} lead with source ${formData.source || 'Quick Add Form'}. Initialized with Starter Score 50.`,
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
        useCase: `Manually added via Quick Add console as ${formData.leadType || 'Online'} lead.`,
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
          createdToday: true,
          lastContacted: 'None',
          nextFollowUp: 'Jun 12, 2026',
          age: '1 day',
          priority: 'High',
          tags: ['CSV Import', 'Primary'],
          activityCount: 1,
          conversionProb: 85,
          leadType: 'Offline',
          query: 'Cardiology',
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
          createdToday: true,
          lastContacted: 'None',
          nextFollowUp: 'Jun 15, 2026',
          age: '1 day',
          priority: 'Low',
          tags: ['CSV Import', 'Secondary'],
          activityCount: 1,
          conversionProb: 65,
          leadType: 'Offline',
          query: 'MCA',
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

  const handleDownloadLeads = (format = 'CSV') => {
    setDownloadingLeadsState(true);
    setTimeout(() => {
      setDownloadingLeadsState(false);
      triggerToast(`Generated leads ${format} download link successfully!`);
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
      campaign: activeLeadDetails.campaign,
      query: activeLeadDetails.query
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
    <div className="p-4">
      <div className="leads-page-scope leads-wrapper">
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

        {!(activeLeadDetails && role === 'admin') && (
          <div className="w-full">
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

            {/* 6-Card Sparkline KPI Grid */}
            <div className="leads-kpi-grid mb-4">
              {[
                {
                  label: 'Total Leads',
                  value: formFilteredLeads.length,
                  trend: '+12% vs last month',
                  trendUp: true,
                  color: 'indigo',
                  sparkline: (
                    <svg className="w-full h-8 text-emerald-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M0 25 Q15 15, 30 20 T60 10 T90 5 T100 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  icon: 'groups'
                },
                {
                  label: 'New Leads',
                  value: formFilteredLeads.filter(l => l.status === 'NEW').length,
                  trend: '+8% vs last week',
                  trendUp: true,
                  color: 'blue',
                  sparkline: (
                    <svg className="w-full h-8 text-emerald-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M0 20 L20 18 L40 25 L60 15 L80 8 L100 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  icon: 'fiber_new'
                },
                {
                  label: 'Follow-Ups Today',
                  value: formFilteredLeads.filter(l => l.followUpToday).length,
                  trend: '-5% vs yesterday',
                  trendUp: false,
                  color: 'orange',
                  sparkline: (
                    <svg className="w-full h-8 text-rose-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M0 5 L20 12 L40 8 L60 18 L80 22 L100 25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  icon: 'calendar_today'
                },
                {
                  label: 'Qualified Leads',
                  value: formFilteredLeads.filter(l => l.status === 'QUALIFIED').length,
                  trend: '+15% vs last week',
                  trendUp: true,
                  color: 'green',
                  sparkline: (
                    <svg className="w-full h-8 text-emerald-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M0 28 L20 25 L40 18 L60 14 L80 8 L100 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  icon: 'verified'
                },
                {
                  label: 'Pending Leads',
                  value: formFilteredLeads.filter(l => ['NEW', 'CONTACTED'].includes(l.status)).length,
                  trend: '-2% vs yesterday',
                  trendUp: false,
                  color: 'amber',
                  sparkline: (
                    <svg className="w-full h-8 text-rose-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M0 8 L20 12 L40 10 L60 15 L80 14 L100 18" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  icon: 'pending'
                },
                {
                  label: 'Conversion Rate',
                  value: `${formFilteredLeads.length > 0 ? Math.round((formFilteredLeads.filter(l => l.status === 'QUALIFIED').length / formFilteredLeads.length) * 100) : 0}%`,
                  trend: '+3% vs last month',
                  trendUp: true,
                  color: 'teal',
                  sparkline: (
                    <svg className="w-full h-8 text-emerald-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M0 24 L20 20 L40 22 L60 12 L80 8 L100 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  icon: 'leaderboard'
                }
              ].map((card, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 select-none text-left relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-slate-650 transition-colors">
                      {card.label}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-slate-450 select-none">
                      {card.icon}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                      {card.value}
                    </span>
                    <span className={`text-[10px] font-bold flex items-center gap-0.5 ${card.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {card.trendUp ? '↑' : '↓'} {card.trend}
                    </span>
                  </div>

                  <div className="w-full mt-2 pt-2 border-t border-slate-100 flex items-end">
                    <div className="w-2/3 h-8 flex items-end">
                      {card.sparkline}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lead Segment Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-6 select-none text-left">
              {[
                { key: 'all', label: 'All Leads', color: 'indigo', icon: 'groups' },
                { key: 'primary', label: 'Primary Leads', color: 'amber', icon: 'star' },
                { key: 'secondary', label: 'Secondary Leads', color: 'sky', icon: 'star_half' },
                { key: 'tertiary', label: 'Tertiary Leads', color: 'purple', icon: 'star_outline' },
                { key: 'verified', label: 'Verified Leads', color: 'emerald', icon: 'verified' },
                { key: 'unverified', label: 'Unverified Leads', color: 'rose', icon: 'cancel' },
                { key: 'online', label: 'Online Leads', color: 'teal', icon: 'language' },
                { key: 'offline', label: 'Offline Leads', color: 'pink', icon: 'store' },
                { key: 'not_assigned', label: 'Not Assigned', color: 'orange', icon: 'person_off' }
              ].map(segment => {
                const isActive = activeBlockFilter === segment.key;
                const stats = segmentStats[segment.key] || { count: 0, pct: 0 };

                // Tailored colors for the active state
                const activeColorClasses = {
                  indigo: 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20',
                  amber: 'border-amber-600 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20',
                  sky: 'border-sky-600 bg-sky-50/70 text-sky-900 ring-2 ring-sky-500/20',
                  purple: 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-500/20',
                  emerald: 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20',
                  rose: 'border-rose-600 bg-rose-50/70 text-rose-900 ring-2 ring-rose-500/20',
                  orange: 'border-orange-600 bg-orange-50/70 text-orange-900 ring-2 ring-orange-500/20',
                  teal: 'border-teal-600 bg-teal-50/70 text-teal-900 ring-2 ring-teal-500/20',
                  pink: 'border-pink-600 bg-pink-50/70 text-pink-900 ring-2 ring-pink-500/20'
                }[segment.color];

                return (
                  <button
                    key={segment.key}
                    onClick={() => setActiveBlockFilter(segment.key)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11.5px] font-bold transition-all shadow-xs cursor-pointer ${isActive
                      ? activeColorClasses
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <span className={`material-symbols-outlined text-[15px] ${isActive ? 'text-current' : 'text-slate-400'}`}>
                      {segment.icon}
                    </span>
                    <span>{segment.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-current/10 font-extrabold' : 'bg-slate-100 text-slate-500'}`}>
                      {stats.count} ({stats.pct}%)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Consolidated Filters Toolbar */}
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[200px]">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <span className="material-symbols-outlined text-[15px] text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 select-none">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, owner..."
                    className="w-full h-8 pl-8 pr-2.5 border border-slate-250 bg-white rounded-lg text-[11px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                  />
                </div>

                {/* Date Range Selector */}
                <div className="relative">
                  <select
                    value={dateRangeFilter}
                    onChange={(e) => setDateRangeFilter(e.target.value)}
                    className="h-8 px-2 border border-slate-250 bg-white rounded-lg text-[11px] font-bold text-slate-750 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <option value="all">Date Range: All Time</option>
                    <option value="today">Created: Today</option>
                    <option value="7days">Created: Last 7 Days</option>
                    <option value="30days">Created: Last 30 Days</option>
                  </select>
                </div>

                {/* Lead Owner Selector */}
                <div className="relative">
                  <select
                    value={leadOwnerFilter}
                    onChange={(e) => setLeadOwnerFilter(e.target.value)}
                    className="h-8 px-2 border border-slate-250 bg-white rounded-lg text-[11px] font-bold text-slate-750 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <option value="all">Owner: All</option>
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="Marcus Chan">Marcus Chan</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                {/* Source Selector */}
                <div className="relative">
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="h-8 px-2 border border-slate-250 bg-white rounded-lg text-[11px] font-bold text-slate-755 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <option value="all">Source: All</option>
                    <option value="Website Organic">Website Organic</option>
                    <option value="Paid Search">Paid Search</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct Mail">Direct Mail</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Quick Add Form">Quick Add Form</option>
                    <option value="Bulk Offline CSV">Bulk Offline CSV</option>
                  </select>
                </div>

                {/* Status Selector */}
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-8 px-2 border border-slate-250 bg-white rounded-lg text-[11px] font-bold text-slate-750 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <option value="all">Status: All Active</option>
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="LOST">LOST</option>
                  </select>
                </div>

                {/* Verification Selector */}
                <div className="relative">
                  <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="h-8 px-2 border border-slate-250 bg-white rounded-lg text-[11px] font-bold text-slate-750 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <option value="all">Verification: All</option>
                    <option value="verified">Verified Only</option>
                    <option value="unverified">Unverified Only</option>
                  </select>
                </div>

                {/* Query Selector */}
                <div className="relative">
                  <select
                    value={queryFilter}
                    onChange={(e) => setQueryFilter(e.target.value)}
                    className="h-8 px-2 border border-slate-250 bg-white rounded-lg text-[11px] font-bold text-slate-750 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <option value="all">Query: All</option>
                    {uniqueQueries.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                {/* Column Customizer Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                    className="flex items-center gap-1 px-2 h-8 border border-slate-250 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-705 rounded-lg cursor-pointer select-none transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px] text-slate-400">table_chart</span>
                    Columns
                  </button>
                  <AnimatePresence>
                    {showColumnDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowColumnDropdown(false)} />
                        <motion.div
                          className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 z-20 text-left font-sans animate-fade-in"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 select-none">Toggle Columns</div>
                          <div className="space-y-1.5 text-[11.5px] font-semibold text-slate-700">
                            {Object.keys(visibleColumns).map((col) => (
                              <label key={col} className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg cursor-pointer capitalize">
                                <input
                                  type="checkbox"
                                  checked={visibleColumns[col]}
                                  onChange={() => setVisibleColumns({
                                    ...visibleColumns,
                                    [col]: !visibleColumns[col]
                                  })}
                                  className="w-4 h-4 cursor-pointer accent-primary rounded border-slate-350 text-primary"
                                />
                                {col === 'assignedTo' ? 'Assigned' : col === 'email' ? 'Email' : col}
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Clear All Option */}
                {(searchQuery !== '' || filterStatus !== 'all' || dateRangeFilter !== 'all' || leadOwnerFilter !== 'all' || sourceFilter !== 'all' || verificationFilter !== 'all' || queryFilter !== 'all' || activeSavedTab !== 'all' || activeBlockFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setFilterStatus('all')
                      setDateRangeFilter('all')
                      setLeadOwnerFilter('all')
                      setSourceFilter('all')
                      setVerificationFilter('all')
                      setQueryFilter('all')
                      setActiveSavedTab('all')
                      setActiveBlockFilter('all')
                      setSortConfig({ key: 'name', direction: 'asc' })
                    }}
                    className="text-primary hover:text-primary-dark transition-colors text-[11.5px] font-bold cursor-pointer underline underline-offset-2 decoration-dotted ml-2"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowGlobalActionsDropdown(!showGlobalActionsDropdown)}
                  className="flex items-center gap-1 px-2.5 h-8 bg-primary hover:bg-primary/95 text-[11px] font-bold text-white rounded-lg shadow-sm cursor-pointer select-none transition-all duration-150"
                >
                  Actions
                  <span className="material-symbols-outlined text-[15px] text-white leading-none">expand_more</span>
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
                            setQuickLeadForm({ name: '', email: '', phone: '', assignedTo: 'Sarah Jenkins', leadType: 'Online', source: 'Website Organic', query: '' });
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
                        {/* Download Leads with Format Submenu on Hover */}
                        <div
                          className="relative"
                          onMouseEnter={() => setShowDownloadFormats(true)}
                          onMouseLeave={() => setShowDownloadFormats(false)}
                        >
                          <button
                            className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">download</span>
                              Download Leads
                            </div>
                            <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_left</span>
                          </button>

                          <AnimatePresence>
                            {showDownloadFormats && (
                              <motion.div
                                className="absolute right-full top-0 w-36 bg-white border border-outline-variant rounded-xl shadow-xl p-1 z-50 text-left font-sans"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.15 }}
                              >
                                <button
                                  onClick={() => {
                                    handleDownloadLeads('CSV');
                                    setShowGlobalActionsDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                                >
                                  <span className="material-symbols-outlined text-[14px] text-green-600">table_view</span>
                                  CSV Format
                                </button>
                                <button
                                  onClick={() => {
                                    handleDownloadLeads('Excel (XLSX)');
                                    setShowGlobalActionsDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                                >
                                  <span className="material-symbols-outlined text-[14px] text-emerald-600">grid_on</span>
                                  Excel (XLSX)
                                </button>
                                <button
                                  onClick={() => {
                                    handleDownloadLeads('PDF');
                                    setShowGlobalActionsDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                                >
                                  <span className="material-symbols-outlined text-[14px] text-red-600">picture_as_pdf</span>
                                  PDF Document
                                </button>
                                <button
                                  onClick={() => {
                                    handleDownloadLeads('JSON');
                                    setShowGlobalActionsDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-blue-700 rounded-lg transition-colors cursor-pointer text-left"
                                >
                                  <span className="material-symbols-outlined text-[14px] text-amber-600">code</span>
                                  JSON Data
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
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

            {/* Desktop Table View */}
            <div className="hidden md:block">
              {tableScrollWidth > (tableContainerRef.current?.clientWidth || 0) && (
                <div
                  ref={topScrollbarRef}
                  onScroll={handleTopScroll}
                  className="w-full overflow-x-auto overflow-y-hidden h-2 mb-1.5 top-scrollbar"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  <div style={{ width: `${tableScrollWidth}px`, height: '1px' }} />
                </div>
              )}

              <motion.div
                ref={tableContainerRef}
                onScroll={handleTableScroll}
                className="w-full max-h-[600px] overflow-y-auto overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm relative z-0"
              >
                <table className="w-full relative border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 select-none sticky top-0 z-10">
                      <th className="px-3 py-3 text-left w-10 bg-slate-50">
                        <input
                          type="checkbox"
                          checked={selectedLeads.length === filteredAndSortedLeads.length && filteredAndSortedLeads.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 cursor-pointer accent-primary rounded border-slate-350"
                        />
                      </th>
                      <th className="px-3 py-3 text-center text-body-md font-body-md text-on-surface text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50">Action</th>
                      {visibleColumns.name && (
                        <th
                          onClick={() => requestSort('name')}
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Name & Email
                            {renderSortIndicator('name')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.phone && (
                        <th
                          onClick={() => requestSort('phone')}
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Phone
                            {renderSortIndicator('phone')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.score && (
                        <th
                          onClick={() => requestSort('score')}
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Lead Score
                            {renderSortIndicator('score')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.status && (
                        <th
                          onClick={() => requestSort('status')}
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
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
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
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
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Source
                            {renderSortIndicator('source')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.query && (
                        <th
                          onClick={() => requestSort('query')}
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Query
                            {renderSortIndicator('query')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.verified && (
                        <th
                          onClick={() => requestSort('verified')}
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-105 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Verification
                            {renderSortIndicator('verified')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.lastContacted && (
                        <th
                          onClick={() => requestSort('lastContacted')}
                          className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-105 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Last Contacted
                            {renderSortIndicator('lastContacted')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.nextFollowUp && (
                        <th
                          onClick={() => requestSort('nextFollowUp')}
                          className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-105 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Next Follow-Up
                            {renderSortIndicator('nextFollowUp')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.age && (
                        <th
                          onClick={() => requestSort('age')}
                          className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-105 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Age
                            {renderSortIndicator('age')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.priority && (
                        <th
                          onClick={() => requestSort('priority')}
                          className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-105 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Priority
                            {renderSortIndicator('priority')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.tags && (
                        <th
                          onClick={() => requestSort('tags')}
                          className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-105 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Tags
                            {renderSortIndicator('tags')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.activityCount && (
                        <th
                          onClick={() => requestSort('activityCount')}
                          className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-105 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Act. Count
                            {renderSortIndicator('activityCount')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.conversionProb && (
                        <th
                          onClick={() => requestSort('conversionProb')}
                          className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-105 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Conv. %
                            {renderSortIndicator('conversionProb')}
                          </div>
                        </th>
                      )}
                      {visibleColumns.location && (
                        <th
                          onClick={() => requestSort('location')}
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11.5px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
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
                          className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11.5px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
                        >
                          <div className="flex items-center">
                            Campaign
                            {renderSortIndicator('campaign')}
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedLeads.map((lead, index) => (
                      <motion.tr
                        key={lead.id}
                        className={`border-b border-slate-200 hover:bg-slate-50/70 transition-colors ${role === 'admin' ? 'cursor-pointer' : ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.04 }}
                        onClick={() => {
                          if (role === 'admin') {
                            setActiveLeadDetails(lead)
                            setHoveredLeadId(null)
                          }
                        }}
                        onMouseEnter={() => setHoveredLeadId(lead.id)}
                        onMouseLeave={() => setHoveredLeadId(null)}
                        onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                      >
                        <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => toggleSelectLead(lead.id)}
                            className="w-4 h-4 cursor-pointer accent-primary rounded border-slate-300"
                          />
                        </td>
                        <td className="px-3 py-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center min-h-[28px]">
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
                                    x: rect.left,
                                    y: flipUp ? rect.top : rect.bottom
                                  });
                                  setActiveDropdownLeadId(lead.id);
                                }
                                setShowReassignSubId(null);
                              }}
                              className={`p-1 rounded transition-all cursor-pointer ${activeDropdownLeadId === lead.id ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-500'
                                }`}
                            >
                              <span className="material-symbols-outlined text-[18px] font-semibold leading-none align-middle">more_vert</span>
                            </button>
                          </div>

                          <AnimatePresence>
                            {activeDropdownLeadId === lead.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-30 cursor-default"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdownLeadId(null);
                                    setShowReassignSubId(null);
                                  }}
                                />

                                {(() => {
                                  const showUpwards = dropdownFlipUp;
                                  return (
                                    <motion.div
                                      style={{
                                        position: 'fixed',
                                        left: `${dropdownPos.x}px`,
                                        ...(showUpwards
                                          ? { bottom: `${window.innerHeight - dropdownPos.y}px`, top: 'auto' }
                                          : { top: `${dropdownPos.y + 4}px`, bottom: 'auto' }
                                        )
                                      }}
                                      className="w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-[9999] text-left font-sans"
                                      initial={{ opacity: 0, scale: 0.95, y: showUpwards ? 5 : -5 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: showUpwards ? 5 : -5 }}
                                      transition={{ duration: 0.15 }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {role === 'admin' && (
                                        <button
                                          onClick={() => {
                                            navigate(`/admin/leads/${lead.id}`);
                                            setActiveDropdownLeadId(null);
                                          }}
                                          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left"
                                        >
                                          <span className="material-symbols-outlined text-[16px] text-amber-500 font-medium">edit</span>
                                          View/Edit Details
                                        </button>
                                      )}

                                      <button
                                        onClick={() => {
                                          handleQuickLogDirect(lead.id, 'Phone Call Summary', 'Initiated quick outbound call.');
                                          triggerToast('Voice call simulator initialized!');
                                          setActiveDropdownLeadId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">call</span>
                                        Call Lead
                                      </button>

                                      <button
                                        onClick={() => {
                                          setActiveLeadDetails(lead);
                                          setShowEmailModal(true);
                                          setActiveDropdownLeadId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-emerald-500 font-medium">mail</span>
                                        Send Email
                                      </button>

                                      <div className="h-px bg-slate-100 my-1" />

                                      <div className="relative">
                                        <button
                                          onClick={() => {
                                            setShowReassignSubId(showReassignSubId === lead.id ? null : lead.id);
                                          }}
                                          className={`w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold rounded-lg transition-colors cursor-pointer text-left ${showReassignSubId === lead.id ? 'bg-blue-50/80 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                                        >
                                          <div className="flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-[16px] text-indigo-500 font-medium">supervisor_account</span>
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
                                                        : 'text-slate-650 hover:bg-white hover:text-blue-600'
                                                        }`}
                                                    >
                                                      <div className="flex items-center gap-1.5">
                                                        <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-bold text-slate-600 shrink-0">
                                                          {counselor === 'Unassigned' ? '—' : counselor.split(' ').map(p => p[0]).join('')}
                                                        </div>
                                                        <span className='text-[12px]'>{counselor}</span>
                                                      </div>
                                                      <div className="flex items-center gap-1.5">
                                                        {counselor !== 'Unassigned' && (
                                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isCurrentlyAssigned ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {count}
                                                          </span>
                                                        )}
                                                        {isCurrentlyAssigned && (
                                                          <span className="material-symbols-outlined text-[12px] text-blue-600 font-bold">check</span>
                                                        )}
                                                      </div>
                                                    </button>

                                                    {counselor !== 'Unassigned' && (
                                                      <div className="absolute right-full top-0 mr-2 z-[9999] hidden group-hover:block pointer-events-none">
                                                        <div className="w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-left font-sans">
                                                          <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-slate-100">
                                                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 shrink-0">
                                                              {counselor.split(' ').map(p => p[0]).join('')}
                                                            </div>
                                                            <div>
                                                              <p className="text-[11px] font-bold text-slate-800 leading-tight">{counselor}</p>
                                                              <p className="text-[9px] text-slate-400 font-medium">{count} active lead{count !== 1 ? 's' : ''}</p>
                                                            </div>
                                                          </div>

                                                          {counselorLeads.length > 0 ? (
                                                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                                              {counselorLeads.map(l => {
                                                                const statusColors = {
                                                                  NEW: 'bg-blue-50 text-blue-700',
                                                                  CONTACTED: 'bg-orange-50 text-orange-700',
                                                                  QUALIFIED: 'bg-green-50 text-green-700',
                                                                  LOST: 'bg-red-50 text-red-705'
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

                                      <button
                                        onClick={() => {
                                          setActiveLeadDetails(lead);
                                          setDetailsActiveTab('timeline');
                                          setActiveDropdownLeadId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left border-t border-slate-100"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-purple-500 font-medium">history</span>
                                        View Activity
                                      </button>

                                      <button
                                        onClick={() => {
                                          setActiveLeadDetails(lead);
                                          setDetailsActiveTab('overview');
                                          setActiveDropdownLeadId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left border-t border-slate-100"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-teal-500 font-medium">assignment</span>
                                        View Application
                                      </button>
                                    </motion.div>
                                  );
                                })()}
                              </>
                            )}
                          </AnimatePresence>
                        </td>
                        {visibleColumns.name && (
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-extrabold shrink-0 select-none">
                                {getInitials(lead.name)}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[12px] font-extrabold text-slate-800 hover:underline truncate">
                                  {lead.name}
                                </span>
                                <span className="text-[10px] text-slate-450 truncate">
                                  {isMasked ? maskEmail(lead.email) : lead.email}
                                </span>
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.phone && (
                          <td className="px-3 py-4 text-[12px] text-slate-600 font-semibold font-sans">{isMasked ? maskPhone(lead.phone) : (lead.phone || '--')}</td>
                        )}
                        {visibleColumns.score && (
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-2 w-28">
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full ${lead.score >= 76 ? 'bg-emerald-500' : lead.score >= 41 ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                                  style={{ width: `${lead.score}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-extrabold text-slate-700 font-mono">
                                {lead.score}
                              </span>
                            </div>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="px-3 py-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold tracking-wide border ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                        )}
                        {visibleColumns.assignedTo && (
                          <td className="px-3 py-4 text-slate-700 text-[12px] font-semibold">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] text-primary font-bold">
                                {lead.assignedTo === 'Unassigned' ? '—' : lead.assignedTo.charAt(0)}
                              </div>
                              <span>{lead.assignedTo}</span>
                            </div>
                          </td>
                        )}
                        {visibleColumns.source && (
                          <td className="px-3 py-4 text-slate-600 text-[11.5px] font-semibold">{lead.source}</td>
                        )}
                        {visibleColumns.query && (
                          <td className="px-3 py-4 text-slate-600 text-[11.5px] font-semibold">{lead.query || '--'}</td>
                        )}
                        {visibleColumns.verified && (
                          <td className="px-3 py-4">
                            {lead.verified ? (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold bg-green-50 text-green-700 border border-green-200/50 select-none">
                                <span className="material-symbols-outlined text-[10px] font-bold text-green-600">check_circle</span>
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/50 select-none">
                                <span className="material-symbols-outlined text-[10px] font-bold text-rose-600">cancel</span>
                                Unverified
                              </span>
                            )}
                          </td>
                        )}
                        {visibleColumns.lastContacted && (
                          <td className="px-3 py-4 text-[12px] text-slate-600 font-semibold">{lead.lastContacted}</td>
                        )}
                        {visibleColumns.nextFollowUp && (
                          <td className="px-3 py-4 text-[12px] text-slate-600 font-semibold">{lead.nextFollowUp}</td>
                        )}
                        {visibleColumns.age && (
                          <td className="px-3 py-4 text-[12px] text-slate-600 font-semibold font-mono">{lead.age}</td>
                        )}
                        {visibleColumns.priority && (
                          <td className="px-3 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border ${lead.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              lead.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>
                              {lead.priority}
                            </span>
                          </td>
                        )}
                        {visibleColumns.tags && (
                          <td className="px-3 py-4">
                            <div className="flex flex-wrap gap-1">
                              {lead.tags && lead.tags.map((tag, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold border border-slate-200">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                        )}
                        {visibleColumns.activityCount && (
                          <td className="px-3 py-4 text-[12px] text-slate-600 font-mono text-center font-bold">
                            {lead.activityCount || lead.timeline?.length || 0}
                          </td>
                        )}
                        {visibleColumns.conversionProb && (
                          <td className="px-3 py-4 text-[12px] text-slate-600 font-mono text-center font-bold">
                            {lead.conversionProb}%
                          </td>
                        )}
                        {visibleColumns.location && (
                          <td className="px-3 py-4 text-slate-600 text-[11.5px] font-semibold">{lead.location || '--'}</td>
                        )}
                        {visibleColumns.campaign && (
                          <td className="px-3 py-4 text-slate-600 text-[11.5px] font-semibold">{lead.campaign || '--'}</td>
                        )}
                        <td className="px-3 py-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center min-h-[28px]">
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
                              className={`p-1 rounded transition-all cursor-pointer ${activeDropdownLeadId === lead.id ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-500'
                                }`}
                            >
                              <span className="material-symbols-outlined text-[18px] font-semibold leading-none align-middle">more_vert</span>
                            </button>
                          </div>

                          <AnimatePresence>
                            {activeDropdownLeadId === lead.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-30 cursor-default"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdownLeadId(null);
                                    setShowReassignSubId(null);
                                  }}
                                />

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
                                      className="w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-[9999] text-left font-sans"
                                      initial={{ opacity: 0, scale: 0.95, y: showUpwards ? 5 : -5 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: showUpwards ? 5 : -5 }}
                                      transition={{ duration: 0.15 }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {role === 'admin' && (
                                        <button
                                          onClick={() => {
                                            setActiveLeadDetails(lead);
                                            setActiveDropdownLeadId(null);
                                          }}
                                          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left"
                                        >
                                          <span className="material-symbols-outlined text-[16px] text-amber-500 font-medium">edit</span>
                                          View/Edit Details
                                        </button>
                                      )}

                                      <button
                                        onClick={() => {
                                          handleQuickLogDirect(lead.id, 'Phone Call Summary', 'Initiated quick outbound call.');
                                          triggerToast('Voice call simulator initialized!');
                                          setActiveDropdownLeadId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-blue-500 font-medium">call</span>
                                        Call Lead
                                      </button>

                                      <button
                                        onClick={() => {
                                          setActiveLeadDetails(lead);
                                          setShowEmailModal(true);
                                          setActiveDropdownLeadId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-emerald-500 font-medium">mail</span>
                                        Send Email
                                      </button>

                                      <div className="h-px bg-slate-100 my-1" />

                                      <div className="relative">
                                        <button
                                          onClick={() => {
                                            setShowReassignSubId(showReassignSubId === lead.id ? null : lead.id);
                                          }}
                                          className={`w-full flex items-center justify-between px-3 py-2 text-[12px] font-semibold rounded-lg transition-colors cursor-pointer text-left ${showReassignSubId === lead.id ? 'bg-blue-50/80 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                                        >
                                          <div className="flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-[16px] text-indigo-500 font-medium">supervisor_account</span>
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
                                                        : 'text-slate-650 hover:bg-white hover:text-blue-600'
                                                        }`}
                                                    >
                                                      <div className="flex items-center gap-1.5">
                                                        <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-bold text-slate-600 shrink-0">
                                                          {counselor === 'Unassigned' ? '—' : counselor.split(' ').map(p => p[0]).join('')}
                                                        </div>
                                                        <span className='text-[12px]'>{counselor}</span>
                                                      </div>
                                                      <div className="flex items-center gap-1.5">
                                                        {counselor !== 'Unassigned' && (
                                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isCurrentlyAssigned ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {count}
                                                          </span>
                                                        )}
                                                        {isCurrentlyAssigned && (
                                                          <span className="material-symbols-outlined text-[12px] text-blue-600 font-bold">check</span>
                                                        )}
                                                      </div>
                                                    </button>

                                                    {counselor !== 'Unassigned' && (
                                                      <div className="absolute right-full top-0 mr-2 z-[9999] hidden group-hover:block pointer-events-none">
                                                        <div className="w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-left font-sans">
                                                          <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-slate-100">
                                                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 shrink-0">
                                                              {counselor.split(' ').map(p => p[0]).join('')}
                                                            </div>
                                                            <div>
                                                              <p className="text-[11px] font-bold text-slate-800 leading-tight">{counselor}</p>
                                                              <p className="text-[9px] text-slate-400 font-medium">{count} active lead{count !== 1 ? 's' : ''}</p>
                                                            </div>
                                                          </div>

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

                                      <button
                                        onClick={() => {
                                          setActiveLeadDetails(lead);
                                          setDetailsActiveTab('timeline');
                                          setActiveDropdownLeadId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left border-t border-slate-100"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-purple-500 font-medium">history</span>
                                        View Activity
                                      </button>

                                      <button
                                        onClick={() => {
                                          setActiveLeadDetails(lead);
                                          setDetailsActiveTab('overview');
                                          setActiveDropdownLeadId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left border-t border-slate-100"
                                      >
                                        <span className="material-symbols-outlined text-[16px] text-teal-500 font-medium">assignment</span>
                                        View Application
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
            </div>

            {/* Mobile Card Stack View */}
            <div className="block md:hidden space-y-4">
              {filteredAndSortedLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => {
                    if (role === 'admin') {
                      setActiveLeadDetails(lead)
                    }
                  }}
                  className={`bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-2xs hover:border-primary/40 transition-all text-left ${role === 'admin' ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-extrabold shrink-0">
                        {getInitials(lead.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12.5px] font-extrabold text-slate-800 truncate">
                          {lead.name}
                        </span>
                        <span className="text-[10px] text-slate-450 truncate">
                          {isMasked ? maskEmail(lead.email) : lead.email}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[11px] border-t border-slate-100 pt-3 text-slate-600 font-medium">
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Phone</span>
                      <span className="font-semibold text-slate-700">{isMasked ? maskPhone(lead.phone) : (lead.phone || '--')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Score</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-12 bg-slate-100 rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-1 rounded-full ${lead.score >= 76 ? 'bg-emerald-500' : lead.score >= 41 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 font-mono">{lead.score}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Assigned Counselor</span>
                      <span className="font-semibold text-slate-700">{lead.assignedTo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Lead Source</span>
                      <span className="font-semibold text-slate-700">{lead.source}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Query</span>
                      <span className="font-semibold text-slate-700">{lead.query || '--'}</span>
                    </div>
                  </div>

                  {/* Mobile Row Hover Actions equivalent */}
                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        handleQuickLogDirect(lead.id, 'Phone Call Summary', 'Initiated quick outbound call.');
                        triggerToast('Voice call simulator initialized!');
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-150 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[12px]">call</span>
                      Call
                    </button>
                    <button
                      onClick={() => {
                        setActiveLeadDetails(lead);
                        setShowEmailModal(true);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-150 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[12px]">mail</span>
                      Email
                    </button>
                    {role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveLeadDetails(lead);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-650 border border-amber-150 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">edit</span>
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredAndSortedLeads.length === 0 && (
                <div className="py-12 text-center bg-white border border-slate-200 rounded-xl">
                  <span className="material-symbols-outlined text-[32px] text-slate-450 block mb-2">folder_off</span>
                  <p className="text-[12px] font-bold text-slate-800">No Leads Found</p>
                </div>
              )}
            </div>

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
                      className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-[11px] outline-none !text-white cursor-pointer hover:bg-slate-700 transition-colors"
                      style={{ color: 'white' }}
                    >
                      <option value="" disabled style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Update...</option>
                      <option value="NEW" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>NEW</option>
                      <option value="CONTACTED" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>CONTACTED</option>
                      <option value="QUALIFIED" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>QUALIFIED</option>
                      <option value="LOST" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>LOST</option>
                    </select>
                  </div>

                  {/* Mass Reassign Option */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assign:</span>
                    <select
                      onChange={(e) => handleBulkAssignUpdate(e.target.value)}
                      defaultValue=""
                      className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-[11px] outline-none !text-white cursor-pointer hover:bg-slate-700 transition-colors"
                      style={{ color: 'white' }}
                    >
                      <option value="" disabled style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Assign to...</option>
                      <option value="Sarah Jenkins" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Sarah Jenkins</option>
                      <option value="Marcus Chan" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Marcus Chan</option>
                      <option value="Unassigned" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Unassigned</option>
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
          </div>
        )}

        {activeLeadDetails && role === 'admin' && (
          <LeadDetailsDrawer
            activeLeadDetails={activeLeadDetails}
            setActiveLeadDetails={setActiveLeadDetails}
            triggerToast={triggerToast}
            playingRecording={playingRecording}
            setPlayingRecording={setPlayingRecording}
            audioPlaying={audioPlaying}
            setAudioPlaying={setAudioPlaying}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            playbackProgress={playbackProgress}
            setPlaybackProgress={setPlaybackProgress}
            mergeSelectedProps={mergeSelectedProps}
            handlePropSelection={handlePropSelection}
            handleMergeProfiles={handleMergeProfiles}
            handleLeadStatusChange={handleLeadStatusChange}
            handleLeadCounselorChange={handleLeadCounselorChange}
            handleLeadScoreChange={handleLeadScoreChange}
            editingScore={editingScore}
            setEditingScore={setEditingScore}
            newComment={newComment}
            setNewComment={setNewComment}
            interactionType={interactionType}
            setInteractionType={setInteractionType}
            handleLogInteraction={handleLogInteraction}
            handleTogglePinEvent={handleTogglePinEvent}
            handleSendQueryResponse={handleSendQueryResponse}
            timelineFilter={timelineFilter}
            setTimelineFilter={setTimelineFilter}
            timelineSearchQuery={timelineSearchQuery}
            setTimelineSearchQuery={setTimelineSearchQuery}
            filteredTimeline={filteredTimeline}
            detailsActiveTab={detailsActiveTab}
            setDetailsActiveTab={setDetailsActiveTab}
            getInitials={getInitials}
            getStatusColor={getStatusColor}
            getDuplicateRecord={getDuplicateRecord}
            setShowEmailModal={setShowEmailModal}
          />
        )}

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
                    <p className="text-[11px] text-slate-550 mt-0.5">Submitted application data for vetting.</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowApplicationModal(false);
                      setActiveModalLead(null);
                    }}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-655 cursor-pointer flex items-center justify-center transition-colors select-none"
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
                      <p className="text-[11px] text-slate-505 mt-0.5">{isMasked ? maskEmail(activeModalLead.email) : activeModalLead.email} • {isMasked ? maskPhone(activeModalLead.phone) : (activeModalLead.phone || '--')}</p>
                    </div>
                  </div>

                  {activeModalLead.application ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-[12.5px] text-slate-600 font-semibold">
                        <div>
                          <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Applied Program</span>
                          <span className="text-slate-855 font-bold">{activeModalLead.application.appliedProgram}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Submission Date</span>
                          <span className="text-slate-855 font-bold">{activeModalLead.application.submissionDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Company Name</span>
                          <span className="text-slate-855 font-bold">{activeModalLead.application.companyName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Company Size</span>
                          <span className="text-slate-855 font-bold">{activeModalLead.application.companySize}</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-[12.5px] font-semibold pt-2.5 border-t border-slate-100">
                        <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Annual Revenue</span>
                        <span className="text-slate-855 font-bold">{activeModalLead.application.annualRevenue}</span>
                      </div>
                      <div className="space-y-1 text-[12.5px] font-semibold pt-2.5 border-t border-slate-100">
                        <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Target Objectives</span>
                        <p className="text-[12px] text-slate-600 font-medium leading-relaxed font-sans">{activeModalLead.application.useCase}</p>
                      </div>
                      <div className="space-y-1 text-[12.5px] font-semibold pt-2.5 border-t border-slate-100">
                        <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider">Vetting Notes</span>
                        <p className="text-[12px] text-slate-550 italic font-medium leading-relaxed font-sans">{activeModalLead.application.notes}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center select-none">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-2">
                        <span className="material-symbols-outlined text-[24px]">folder_off</span>
                      </div>
                      <p className="text-[12px] font-bold text-slate-650">No application profile attached.</p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end select-none">
                  <button
                    onClick={() => {
                      setShowApplicationModal(false);
                      setActiveModalLead(null);
                    }}
                    className="px-4 py-1.5 bg-slate-850 hover:bg-slate-900 text-white rounded-lg text-[11.5px] font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Close Panel
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
                    <p className="text-[11px] text-slate-505 mt-0.5">Manage customer questions and ticket resolutions.</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowQueriesModal(false);
                      setActiveModalLead(null);
                      setQueriesAnswerText('');
                    }}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-655 cursor-pointer flex items-center justify-center transition-colors select-none"
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
                      <p className="text-[11px] text-slate-505 mt-0.5">{isMasked ? maskEmail(activeModalLead.email) : activeModalLead.email}</p>
                    </div>
                  </div>

                  {activeModalLead.queries && activeModalLead.queries.length > 0 ? (
                    <div className="space-y-4">
                      {activeModalLead.queries.map((query) => (
                        <div key={query.id} className="border border-slate-150 rounded-xl overflow-hidden shadow-2xs bg-slate-50/40">
                          {/* Query Header */}
                          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 flex justify-between items-center select-none">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ticket #Q-98{query.id} • {query.date}</span>
                            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold border ${query.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                              : 'bg-amber-50 text-amber-700 border-amber-255 animate-pulse'
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
                      <p className="text-[12px] font-bold text-slate-650">No active inquiries from this lead.</p>
                      <p className="text-[11px] text-slate-405 mt-0.5">Everything is resolved and up to date!</p>
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
                    <p className="text-[11px] text-slate-505 mt-0.5">Ingest new leads dynamically from a CSV file.</p>
                  </div>
                  <button
                    onClick={() => setShowBulkUploadModal(false)}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-655 cursor-pointer flex items-center justify-center transition-colors select-none"
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
                    <p className="text-[11px] text-slate-505 mt-0.5">Quickly inject a new lead into your local CRM database.</p>
                  </div>
                  <button
                    onClick={() => setShowQuickLeadModal(false)}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-655 cursor-pointer flex items-center justify-center transition-colors select-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 text-left font-sans">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Lead Type</label>
                      <select
                        value={quickLeadForm.leadType || 'Online'}
                        onChange={(e) => {
                          const newType = e.target.value;
                          const defaultSource = newType === 'Online' ? 'Website Organic' : 'Direct Mail';
                          setQuickLeadForm({ ...quickLeadForm, leadType: newType, source: defaultSource });
                        }}
                        className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Lead Source</label>
                      <select
                        value={quickLeadForm.source || 'Website Organic'}
                        onChange={(e) => setQuickLeadForm({ ...quickLeadForm, source: e.target.value })}
                        className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        {(quickLeadForm.leadType || 'Online') === 'Online' ? (
                          <>
                            <option value="Website Organic">Website Organic</option>
                            <option value="Paid Search">Paid Search</option>
                            <option value="Referral">Referral</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Quick Add Form">Quick Add Form</option>
                          </>
                        ) : (
                          <>
                            <option value="Direct Mail">Direct Mail</option>
                            <option value="Cold Outreach">Cold Outreach</option>
                            <option value="Bulk Offline CSV">Bulk Offline CSV</option>
                            <option value="Field Event">Field Event</option>
                            <option value="Partner Referral">Partner Referral</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Lead Query (e.g. BCA, MCA, Cardiology)</label>
                    <input
                      type="text"
                      placeholder="e.g. BCA"
                      value={quickLeadForm.query}
                      onChange={(e) => setQuickLeadForm({ ...quickLeadForm, query: e.target.value })}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
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
                    <p className="text-[11px] text-slate-505 mt-0.5">Change pipeline stage for {selectedLeads.length} leads.</p>
                  </div>
                  <button
                    onClick={() => setShowGlobalStageModal(false)}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-655 cursor-pointer flex items-center justify-center transition-colors select-none"
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
                    className="px-4 py-1.5 border border-slate-250 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-bold transition-all cursor-pointer"
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

        {/* HIGH FIDELITY EMAIL DETAIL POPUP MODAL */}
        <AnimatePresence>
          {showEmailModal && activeLeadDetails && (
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
                    onClick={() => {
                      setShowEmailModal(false)
                      setActiveLeadDetails(null)
                    }}
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
                    <span className="col-span-5 font-medium">{activeLeadDetails.name} &lt;{isMasked ? maskEmail(activeLeadDetails.email) : activeLeadDetails.email}&gt;</span>

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
                    onClick={() => {
                      setShowEmailModal(false)
                      setActiveLeadDetails(null)
                    }}
                    className="px-3.5 py-1.5 bg-primary text-white rounded text-[11px] font-bold hover:bg-primary/95 transition-colors cursor-pointer select-none"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Custom Shadcn-style Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.08 }}
              style={{
                position: 'fixed',
                left: tooltipPos.x + 12,
                top: tooltipPos.y - 12,
                pointerEvents: 'none',
                zIndex: 9999,
              }}
              className="bg-slate-900/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md border border-slate-800 flex items-center select-none whitespace-nowrap leading-none tracking-wide"
            >
              See details
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
