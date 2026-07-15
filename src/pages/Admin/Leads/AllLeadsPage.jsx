import React, { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './leads.css'
import LeadsKpiCard from '../../../components/LeadsKpiCard'
import LeadsFilterChip from '../../../components/LeadsFilterChip'
import LeadsToolbar from '../../../components/LeadsToolbar'
import { getCustomStatuses, getStatusStyle } from '../../../helpers/statusHelper'

import { LeadsSkeleton } from '../../../components/Skeletons'
import { hasPermission } from '../../../components/ProtectRoute'

export default function AllLeadsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [leads, setLeads] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedLeads, setSelectedLeads] = useState([])
  const [activeLeadDetails, setActiveLeadDetails] = useState(null)

  const [statusesList, setStatusesList] = useState(() => getCustomStatuses())

  useEffect(() => {
    const handleUpdate = () => {
      setStatusesList(getCustomStatuses())
    }
    window.addEventListener('lms-statuses-updated', handleUpdate)
    return () => window.removeEventListener('lms-statuses-updated', handleUpdate)
  }, [])
  const [hoveredLeadId, setHoveredLeadId] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const role = localStorage.getItem('userRole')
  const isMasked = role !== 'admin' && role !== 'Admin' && role !== 'System Admin'
  const shouldMaskLead = (lead) => {
    if (!lead) return false
    if (role === 'admin' || role === 'Admin' || role === 'System Admin') {
      return false
    }
    const currentUsername = localStorage.getItem('username')
    if (lead.assignedTo && currentUsername && lead.assignedTo === currentUsername) {
      return false
    }
    if (role === 'vendor' || role === 'Vendor') {
      if (lead.importedBy && currentUsername && lead.importedBy === currentUsername) {
        return false
      }
    }
    return true
  }
  const [revealedPhoneLeadIds, setRevealedPhoneLeadIds] = useState({})
  const [followUpLead, setFollowUpLead] = useState(null)
  const [followUpType, setFollowUpType] = useState('Call')
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpTime, setFollowUpTime] = useState('')
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

  const renderNextFollowUpCell = (val) => {
    if (!val || val === 'None' || val === '--') return <span className="text-slate-400 font-normal">--</span>;
    if (typeof val === 'string' && val.includes(' | ')) {
      const parts = val.split(' | ');
      const type = parts[0];
      const dateTime = parts[1];
      
      let icon = 'schedule';
      let iconColor = 'text-slate-400';
      let bgColor = 'bg-slate-50/50 border-slate-200/50 text-slate-600';
      
      if (type === 'WhatsApp') {
        icon = 'chat';
        iconColor = 'text-emerald-500';
        bgColor = 'bg-emerald-50/30 border-emerald-100 text-slate-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-300';
      } else if (type === 'Call') {
        icon = 'call';
        iconColor = 'text-blue-500';
        bgColor = 'bg-blue-50/30 border-blue-100 text-slate-700 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-300';
      } else if (type === 'Mail') {
        icon = 'mail';
        iconColor = 'text-amber-500';
        bgColor = 'bg-amber-50/30 border-amber-100 text-slate-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-300';
      } else if (type === 'Other') {
        icon = 'event';
        iconColor = 'text-purple-500';
        bgColor = 'bg-purple-50/30 border-purple-100 text-slate-700 dark:bg-purple-950/20 dark:border-purple-900/50 dark:text-purple-300';
      }
      
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${bgColor}`}>
          <span className={`material-symbols-outlined text-[13px] ${iconColor}`}>{icon}</span>
          <span>{dateTime}</span>
        </div>
      );
    }
    return <span className="text-slate-600 dark:text-slate-300">{val}</span>;
  };

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
    lastContacted: true,
    nextFollowUp: true,
    age: true,
    priority: true,
    tags: false,
    activityCount: false,
    conversionProb: false,
    location: false,
    campaign: false,
    ip: true,
    device: true
  })

  // Double horizontal scrollbar state & refs
  const tableContainerRef = React.useRef(null)
  const topScrollbarRef = React.useRef(null)
  const [tableScrollWidth, setTableScrollWidth] = React.useState(0)
  
  const isScrollingTopRef = React.useRef(false)
  const isScrollingTableRef = React.useRef(false)

  const handleTopScroll = () => {
    if (isScrollingTableRef.current) {
      isScrollingTableRef.current = false
      return
    }
    if (topScrollbarRef.current && tableContainerRef.current) {
      isScrollingTopRef.current = true
      tableContainerRef.current.scrollLeft = topScrollbarRef.current.scrollLeft
    }
  }

  const handleTableScroll = () => {
    if (isScrollingTopRef.current) {
      isScrollingTopRef.current = false
      return
    }
    if (topScrollbarRef.current && tableContainerRef.current) {
      isScrollingTableRef.current = true
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
  }, [visibleColumns, isLoading, leads])

  // -- NEW STATE HOOKS FOR LEAD ACTIONS POPUPS --
  const [activeDropdownLeadId, setActiveDropdownLeadId] = useState(null)
  const [showQueriesModal, setShowQueriesModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [activeModalLead, setActiveModalLead] = useState(null)
  const [queriesAnswerText, setQueriesAnswerText] = useState('')
  const [showReassignSubId, setShowReassignSubId] = useState(null)

  // -- NEW STATE HOOKS FOR GLOBAL ACTIONS DROPDOWN & MODALS --
  const [showQuickLeadModal, setShowQuickLeadModal] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [showGlobalStageModal, setShowGlobalStageModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('CSV')
  const [exportColumns, setExportColumns] = useState({
    id: true,
    name: true,
    email: true,
    phone: true,
    status: true,
    assignedTo: true,
    source: true,
    score: true,
    tier: true,
    age: true,
    query: true,
    lastContacted: true,
    nextFollowUp: true,
    priority: true,
    tags: true,
    activityCount: true,
    conversionProb: true,
    location: true,
    campaign: true,
    ip: true,
    device: true
  })
  const [quickLeadForm, setQuickLeadForm] = useState({ name: '', email: '', phone: '', assignedTo: '', leadType: '', source: '', query: '' })
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
    name: '',
    email: '',
    phone: '',
    status: '',
    assignedTo: '',
    source: '',
    score: 50,
    location: '',
    campaign: '',
    query: '',
    ip: '',
    device: ''
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
        query: activeLeadDetails.query || '',
        ip: activeLeadDetails.ip || '',
        device: activeLeadDetails.device || ''
      })
    }
  }, [activeLeadDetails])

  // Active Waveform Playback Simulator
  useEffect(() => {
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

  // Interactive local leads database array state
  const [dbUsers, setDbUsers] = useState([])

  // Synchronize leads array state to localStorage when changes occur
  useEffect(() => {
    localStorage.setItem('lms_leads_database', JSON.stringify(leads))
  }, [leads])

  // Sync leads from database on mount or session change
  useEffect(() => {
    const fetchLeads = async () => {
      const startTime = Date.now()
      try {
        const token = localStorage.getItem('authToken');
        if (!token || token === 'mock-jwt-token') return;
        const activeSession = localStorage.getItem('lms_active_session') || '01/15/2020 - 02/21/2020';
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/get-lead?session=${encodeURIComponent(activeSession)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setLeads(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch leads from database:", err);
      } finally {
        const elapsed = Date.now() - startTime
        const delay = Math.max(0, 500 - elapsed)
        setTimeout(() => {
          setIsLoading(false)
        }, delay)
      }
    };
    fetchLeads();
    window.addEventListener('lms-session-updated', fetchLeads);
    return () => {
      window.removeEventListener('lms-session-updated', fetchLeads);
    }
  }, []);

  // Sync users from database on mount to map active counselors
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token || token === 'mock-jwt-token') return;
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/get-users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setDbUsers(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch users in leads page:", err);
      }
    };
    fetchUsers();
  }, []);

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

  const counselorsList = useMemo(() => {
    const list = new Set()
    dbUsers.forEach(u => {
      if (u.status === 'Active' && u.name) {
        list.add(u.name)
      }
    })
    list.add('Unassigned')
    return Array.from(list)
  }, [dbUsers])

  const sourcesList = useMemo(() => {
    const list = new Set()
    leads.forEach(l => {
      if (l.source) {
        list.add(l.source)
      }
    })
    const defaultSources = ['Google Ads', 'Website Organic', 'Referral', 'Offline Event', 'Bulk Offline CSV']
    defaultSources.forEach(s => list.add(s))
    return Array.from(list)
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
  useEffect(() => {
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

  // Listen to filter requests from chatbot
  React.useEffect(() => {
    const handleBotFilter = (e) => {
      const filters = e.detail || {}
      if (filters.clear) {
        setSearchQuery('')
        setFilterStatus('all')
        setDateRangeFilter('all')
        setLeadOwnerFilter('all')
        setSourceFilter('all')
        setVerificationFilter('all')
        setQueryFilter('all')
        setActiveSavedTab('all')
        setActiveBlockFilter('all')
        setSelectedFormFilter('ALL')
      } else {
        if (filters.search !== undefined) setSearchQuery(filters.search)
        if (filters.status !== undefined) setFilterStatus(filters.status.toUpperCase())
        if (filters.query !== undefined) setQueryFilter(filters.query)
        if (filters.source !== undefined) setSourceFilter(filters.source)
        if (filters.owner !== undefined) setLeadOwnerFilter(filters.owner)
      }
    }
    window.addEventListener('lms-bot-filter', handleBotFilter)
    return () => window.removeEventListener('lms-bot-filter', handleBotFilter)
  }, [])

  React.useEffect(() => {
    if (location.state && location.state.activeLeadId) {
      navigate(`/admin/leads/${location.state.activeLeadId}`, { replace: true })
    }
  }, [location.state])

  const getStatusStyleLocal = (status) => {
    return getStatusStyle(status, statusesList)
  }

  const toggleSelectAll = () => {
    const paginatedIds = paginatedLeads.map(lead => lead.id)
    const allSelectedOnPage = paginatedIds.every(id => selectedLeads.includes(id))
    if (allSelectedOnPage) {
      setSelectedLeads(prev => prev.filter(id => !paginatedIds.includes(id)))
    } else {
      setSelectedLeads(prev => {
        const newSelection = [...prev]
        paginatedIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id)
          }
        })
        return newSelection
      })
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [
    searchQuery,
    filterStatus,
    dateRangeFilter,
    leadOwnerFilter,
    sourceFilter,
    verificationFilter,
    queryFilter,
    activeSavedTab,
    activeBlockFilter,
    selectedFormFilter
  ])

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredAndSortedLeads.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredAndSortedLeads, currentPage, rowsPerPage])

  const totalItems = filteredAndSortedLeads.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)
  const paginationStartIndex = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage
  const paginationEndIndex = Math.min(currentPage * rowsPerPage, totalItems)

  // Counts for Today and Total Leads stats display
  const todayLeadsCount = useMemo(() => {
    return formFilteredLeads.filter(l => l.createdToday).length
  }, [formFilteredLeads])

  const todayFollowUpCount = useMemo(() => {
    return formFilteredLeads.filter(l => l.status === 'FOLLOW UP' || l.status === 'FOLLOW_UP' || l.followUpToday).length
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

  const kpiTrends = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // 1. Total Leads
    const currentTotal = formFilteredLeads.filter(l => l.createdAt && (now - new Date(l.createdAt)) <= 30 * dayMs).length;
    const previousTotal = formFilteredLeads.filter(l => l.createdAt && (now - new Date(l.createdAt)) > 30 * dayMs && (now - new Date(l.createdAt)) <= 60 * dayMs).length;
    let totalChange = '0% vs last month';
    let totalUp = true;
    if (previousTotal > 0) {
      const pct = ((currentTotal - previousTotal) / previousTotal) * 100;
      totalChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}% vs last month`;
      totalUp = pct >= 0;
    } else {
      totalChange = currentTotal > 0 ? `+${currentTotal}% vs last month` : '0% vs last month';
      totalUp = true;
    }

    // 2. New Leads
    const currentNew = formFilteredLeads.filter(l => l.status === 'NEW' && l.createdAt && (now - new Date(l.createdAt)) <= 7 * dayMs).length;
    const previousNew = formFilteredLeads.filter(l => l.status === 'NEW' && l.createdAt && (now - new Date(l.createdAt)) > 7 * dayMs && (now - new Date(l.createdAt)) <= 14 * dayMs).length;
    let newChange = '0% vs last week';
    let newUp = true;
    if (previousNew > 0) {
      const pct = ((currentNew - previousNew) / previousNew) * 100;
      newChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}% vs last week`;
      newUp = pct >= 0;
    } else {
      newChange = currentNew > 0 ? `+${currentNew}% vs last week` : '0% vs last week';
      newUp = true;
    }

    // 3. Follow-Ups Today
    const currentFollowUps = formFilteredLeads.filter(l => (l.status === 'FOLLOW UP' || l.status === 'FOLLOW_UP') && l.updatedAt && (now - new Date(l.updatedAt)) <= 1 * dayMs).length;
    const previousFollowUps = formFilteredLeads.filter(l => (l.status === 'FOLLOW UP' || l.status === 'FOLLOW_UP') && l.updatedAt && (now - new Date(l.updatedAt)) > 1 * dayMs && (now - new Date(l.updatedAt)) <= 2 * dayMs).length;
    let followUpsChange = '0% vs yesterday';
    let followUpsUp = true;
    if (previousFollowUps > 0) {
      const pct = ((currentFollowUps - previousFollowUps) / previousFollowUps) * 100;
      followUpsChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}% vs yesterday`;
      followUpsUp = pct >= 0;
    } else {
      followUpsChange = currentFollowUps > 0 ? `+${currentFollowUps}% vs yesterday` : '0% vs yesterday';
      followUpsUp = true;
    }

    // 4. Qualified Leads
    const currentQualified = formFilteredLeads.filter(l => l.status === 'QUALIFIED' && l.createdAt && (now - new Date(l.createdAt)) <= 7 * dayMs).length;
    const previousQualified = formFilteredLeads.filter(l => l.status === 'QUALIFIED' && l.createdAt && (now - new Date(l.createdAt)) > 7 * dayMs && (now - new Date(l.createdAt)) <= 14 * dayMs).length;
    let qualifiedChange = '0% vs last week';
    let qualifiedUp = true;
    if (previousQualified > 0) {
      const pct = ((currentQualified - previousQualified) / previousQualified) * 100;
      qualifiedChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}% vs last week`;
      qualifiedUp = pct >= 0;
    } else {
      qualifiedChange = currentQualified > 0 ? `+${currentQualified}% vs last week` : '0% vs last week';
      qualifiedUp = true;
    }

    // 5. Pending Leads
    const currentPending = formFilteredLeads.filter(l => ['NEW', 'CONTACTED'].includes(l.status) && l.createdAt && (now - new Date(l.createdAt)) <= 1 * dayMs).length;
    const previousPending = formFilteredLeads.filter(l => ['NEW', 'CONTACTED'].includes(l.status) && l.createdAt && (now - new Date(l.createdAt)) > 1 * dayMs && (now - new Date(l.createdAt)) <= 2 * dayMs).length;
    let pendingChange = '0% vs yesterday';
    let pendingUp = true;
    if (previousPending > 0) {
      const pct = ((currentPending - previousPending) / previousPending) * 100;
      pendingChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}% vs yesterday`;
      pendingUp = pct >= 0;
    } else {
      pendingChange = currentPending > 0 ? `+${currentPending}% vs yesterday` : '0% vs yesterday';
      pendingUp = true;
    }

    // 6. Conversion Rate
    const currentTotal30 = formFilteredLeads.filter(l => l.createdAt && (now - new Date(l.createdAt)) <= 30 * dayMs).length;
    const currentQualified30 = formFilteredLeads.filter(l => l.status === 'QUALIFIED' && l.createdAt && (now - new Date(l.createdAt)) <= 30 * dayMs).length;
    const currentConv = currentTotal30 > 0 ? (currentQualified30 / currentTotal30) * 100 : 0;
    
    const prevTotal30 = formFilteredLeads.filter(l => l.createdAt && (now - new Date(l.createdAt)) > 30 * dayMs && (now - new Date(l.createdAt)) <= 60 * dayMs).length;
    const prevQualified30 = formFilteredLeads.filter(l => l.status === 'QUALIFIED' && l.createdAt && (now - new Date(l.createdAt)) > 30 * dayMs && (now - new Date(l.createdAt)) <= 60 * dayMs).length;
    const prevConv = prevTotal30 > 0 ? (prevQualified30 / prevTotal30) * 100 : 0;
    
    const convDiff = currentConv - prevConv;
    let convChange = `${convDiff >= 0 ? '+' : ''}${convDiff.toFixed(0)}% vs last month`;
    let convUp = convDiff >= 0;

    return {
      totalChange, totalUp,
      newChange, newUp,
      followUpsChange, followUpsUp,
      qualifiedChange, qualifiedUp,
      pendingChange, pendingUp,
      convChange, convUp
    };
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
  const handleBulkStatusUpdate = async (newStatus) => {
    if (!newStatus || selectedLeads.length === 0) return;
    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/bulk-status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ids: selectedLeads, status: newStatus })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to update bulk status');
        }
        const updatedLeads = leads.map(lead => {
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
        });
        setLeads(updatedLeads);
        localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads));
        window.dispatchEvent(new CustomEvent('lms-leads-updated'));
        triggerToast(`Bulk status updated to ${newStatus} for ${selectedLeads.length} leads`);
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
      }
    } else {
      const updatedLeads = leads.map(lead => {
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
      });
      setLeads(updatedLeads);
      localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads));
      window.dispatchEvent(new CustomEvent('lms-leads-updated'));
      triggerToast(`Bulk status updated to ${newStatus} for ${selectedLeads.length} leads`);
    }
    setSelectedLeads([]);
  };

  const handleBulkAssignUpdate = async (newCounselor) => {
    if (!newCounselor || selectedLeads.length === 0) return;
    if (!hasPermission('leads_assign')) {
      triggerToast("Error: You do not have permission to reassign counselors!");
      return;
    }
    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/bulk-assign`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ids: selectedLeads, assignedTo: newCounselor })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to update bulk assignment');
        }
        const updatedLeads = leads.map(lead => {
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
            ];
            return { ...lead, assignedTo: newCounselor, timeline: updatedTimeline };
          }
          return lead;
        });
        setLeads(updatedLeads);
        localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads));
        window.dispatchEvent(new CustomEvent('lms-leads-updated'));
        triggerToast(`Bulk reassigned ${selectedLeads.length} leads to ${newCounselor}`);
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
      }
    } else {
      const updatedLeads = leads.map(lead => {
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
          ];
          return { ...lead, assignedTo: newCounselor, timeline: updatedTimeline };
        }
        return lead;
      });
      setLeads(updatedLeads);
      localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads));
      window.dispatchEvent(new CustomEvent('lms-leads-updated'));
      triggerToast(`Bulk reassigned ${selectedLeads.length} leads to ${newCounselor}`);
    }
    setSelectedLeads([]);
  };

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) return;
    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/bulk-delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ids: selectedLeads })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to bulk delete leads');
        }
        const updatedLeads = leads.filter(lead => !selectedLeads.includes(lead.id));
        setLeads(updatedLeads);
        localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads));
        window.dispatchEvent(new CustomEvent('lms-leads-updated'));
        triggerToast(`Deleted ${selectedLeads.length} leads successfully`);
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
      }
    } else {
      const updatedLeads = leads.filter(lead => !selectedLeads.includes(lead.id));
      setLeads(updatedLeads);
      localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads));
      window.dispatchEvent(new CustomEvent('lms-leads-updated'));
      triggerToast(`Deleted ${selectedLeads.length} leads successfully`);
    }
    setSelectedLeads([]);
  };







  const handleQuickLogDirect = (leadId, actionTitle, actionBody) => {
    const targetLead = leads.find(l => l.id === leadId)
    if (!targetLead) return

    const newEvent = {
      id: Date.now() + Math.random(),
      type: actionTitle.includes('Call') ? 'CALL' : 'COMMENT',
      title: actionTitle,
      body: actionBody,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
      user: 'System',
      icon: actionTitle.includes('Call') ? 'call' : 'comment',
      color: actionTitle.includes('Call') ? 'blue-600' : 'slate-600'
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





  const handleLeadCounselorChangeDirect = async (leadId, newCounselor) => {
    if (!hasPermission('leads_assign')) {
      triggerToast("Error: You do not have permission to reassign counselors!");
      return;
    }

    const leadToUpdate = leads.find(l => l.id === leadId);
    if (!leadToUpdate) return;

    const prevCounselor = leadToUpdate.assignedTo;
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
      ...leadToUpdate.timeline
    ];

    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/edit-lead/${leadId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            assignedTo: newCounselor,
            timeline: updatedTimeline
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to update counselor assignment');
        }
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
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

  const handleAddQuickLead = async (formData) => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    const activeSession = localStorage.getItem('lms_active_session') || '01/15/2020 - 02/21/2020'
    const [startStr, endStr] = activeSession.split(' - ')
    const startDate = new Date(startStr)
    const endDate = new Date(endStr)
    const now = new Date()
    let leadCreationDate = startDate
    if (now >= startDate && now <= endDate) {
      leadCreationDate = now
    }

    const newLead = {
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
      query: formData.query || 'BCA',
      leadType: formData.leadType || 'Online',
      createdAt: leadCreationDate.toISOString()
    };

    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/create-lead`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newLead)
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to create lead');
        }
        const saved = await response.json();
        const updatedLeads = [saved, ...leads];
        setLeads(updatedLeads);
        localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads));
        window.dispatchEvent(new CustomEvent('lms-leads-updated'));
        triggerToast(`Lead '${saved.name}' created successfully!`);
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
      }
    } else {
      // Mock fallback duplicate logic
      let resolvedTier = "Primary";
      let matches = [];
      const cleanPhone = (newLead.phone || "").trim();
      const cleanEmail = (newLead.email || "").trim();

      const hasValidPhone = cleanPhone && cleanPhone !== "--" && cleanPhone !== "";
      const hasValidEmail = cleanEmail && cleanEmail !== "--" && cleanEmail !== "";

      if (hasValidPhone || hasValidEmail) {
        matches = leads.filter(l => {
          const dbPhone = (l.phone || "").trim();
          const dbEmail = (l.email || "").trim();

          const phoneMatch = hasValidPhone && dbPhone && dbPhone !== "--" && dbPhone !== "" && dbPhone === cleanPhone;
          const emailMatch = hasValidEmail && dbEmail && dbEmail !== "--" && dbEmail !== "" && dbEmail.toLowerCase() === cleanEmail.toLowerCase();

          return phoneMatch || emailMatch;
        });

        if (matches.length === 1) {
          resolvedTier = "Secondary";
        } else if (matches.length >= 2) {
          resolvedTier = "Tertiary";
        }
      }

      // Update existing mock matching leads in memory
      let updatedLeads = leads.map(l => {
        const dbPhone = (l.phone || "").trim();
        const dbEmail = (l.email || "").trim();

        const phoneMatch = hasValidPhone && dbPhone && dbPhone !== "--" && dbPhone !== "" && dbPhone === cleanPhone;
        const emailMatch = hasValidEmail && dbEmail && dbEmail !== "--" && dbEmail !== "" && dbEmail.toLowerCase() === cleanEmail.toLowerCase();

        if (phoneMatch || emailMatch) {
          const updatedTimeline = [
            {
              id: Date.now() + Math.random(),
              type: 'SYSTEM',
              title: `Duplicate Submission Received`,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
              body: `Another duplicate submission with matching details was received. Profile tier updated to ${resolvedTier}.`,
              user: 'System Ingest',
              ip: '192.168.1.105',
              icon: 'star_half',
              color: 'amber-600'
            },
            ...(l.timeline || [])
          ];
          return { ...l, tier: resolvedTier, timeline: updatedTimeline };
        }
        return l;
      });

      const initialTimeline = [
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
      ];

      if (resolvedTier === "Secondary") {
        initialTimeline.unshift({
          id: Date.now() + Math.random(),
          type: 'SYSTEM',
          title: `Duplicate Lead Ingested (Secondary)`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
          body: `Duplicate detected with matching phone number or email. Re-classified under Secondary Leads.`,
          user: 'System Ingest',
          ip: '192.168.1.105',
          icon: 'star_half',
          color: 'amber-600'
        });
      } else if (resolvedTier === "Tertiary") {
        initialTimeline.unshift({
          id: Date.now() + Math.random(),
          type: 'SYSTEM',
          title: `Multi-Duplicate Lead Ingested (Tertiary)`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
          body: `Duplicate detected 3+ times with matching phone number or email. Re-classified under Tertiary Leads.`,
          user: 'System Ingest',
          ip: '192.168.1.105',
          icon: 'star_outline',
          color: 'purple-600'
        });
      }

      const mockLead = {
        ...newLead,
        id: `LS-${1022 + leads.length}`,
        ip: '192.168.1.105',
        device: 'Desktop',
        tier: resolvedTier,
        timeline: initialTimeline,
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

      updatedLeads = [mockLead, ...updatedLeads];
      setLeads(updatedLeads);
      localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads));
      window.dispatchEvent(new CustomEvent('lms-leads-updated'));
      triggerToast(`Lead '${mockLead.name}' created successfully!`);
    }
    setShowQuickLeadModal(false);
  };

  const handleBulkUploadCSV = () => {
    setUploadingBulk(true);
    setTimeout(() => {


      setLeads(prev => [...mockIngested, ...prev]);
      setUploadingBulk(false);
      setShowBulkUploadModal(false);
      triggerToast('Ingested 2 leads from CSV successfully!');
    }, 1500);
  };

  const handleDownloadLeads = (format = 'CSV') => {
    setExportFormat(format);
    
    // Pre-populate export columns selection to match current visibleColumns state
    setExportColumns({
      id: true,
      name: visibleColumns.name !== false,
      email: visibleColumns.name !== false,
      phone: visibleColumns.phone !== false,
      status: visibleColumns.status !== false,
      assignedTo: visibleColumns.assignedTo !== false,
      source: visibleColumns.source !== false,
      score: visibleColumns.score !== false,
      tier: true,
      age: visibleColumns.age !== false,
      query: visibleColumns.query !== false,
      lastContacted: visibleColumns.lastContacted !== false,
      nextFollowUp: visibleColumns.nextFollowUp !== false,
      priority: visibleColumns.priority !== false,
      tags: visibleColumns.tags !== false,
      activityCount: visibleColumns.activityCount !== false,
      conversionProb: visibleColumns.conversionProb !== false,
      location: visibleColumns.location !== false,
      campaign: visibleColumns.campaign !== false,
      ip: visibleColumns.ip !== false,
      device: visibleColumns.device !== false
    });

    setShowExportModal(true);
  };

  const executeExportLeads = () => {
    const leadsToDownload = selectedLeads.length > 0
      ? leads.filter(l => selectedLeads.includes(l.id))
      : filteredAndSortedLeads;

    if (leadsToDownload.length === 0) {
      triggerToast('Warning: No leads found to export!');
      return;
    }

    const getExportableEmail = (l) => {
      const email = l.originalEmail || l.email || '';
      return shouldMaskLead(l) ? maskEmail(email) : email;
    };

    const getExportablePhone = (l) => {
      const phone = l.phone || '';
      return shouldMaskLead(l) ? maskPhone(phone) : phone;
    };

    const columnDefinitions = [
      { key: 'id', label: 'ID', getValue: (l) => l.id },
      { key: 'name', label: 'Name', getValue: (l) => l.originalName || l.name },
      { key: 'email', label: 'Email', getValue: (l) => getExportableEmail(l) },
      { key: 'phone', label: 'Phone', getValue: (l) => getExportablePhone(l) },
      { key: 'status', label: 'Status', getValue: (l) => l.status },
      { key: 'assignedTo', label: 'Assigned To', getValue: (l) => l.assignedTo || 'Unassigned' },
      { key: 'source', label: 'Source', getValue: (l) => l.source || 'Other' },
      { key: 'score', label: 'Lead Score', getValue: (l) => l.score || 0 },
      { key: 'tier', label: 'Tier', getValue: (l) => l.tier || 'Primary' },
      { key: 'age', label: 'Age/Date', getValue: (l) => l.age || 'N/A' },
      { key: 'query', label: 'Query', getValue: (l) => l.query || 'N/A' },
      { key: 'lastContacted', label: 'Last Contacted', getValue: (l) => l.lastContacted || 'None' },
      { key: 'nextFollowUp', label: 'Next Follow-Up', getValue: (l) => l.nextFollowUp || 'None' },
      { key: 'priority', label: 'Priority', getValue: (l) => l.priority || 'Medium' },
      { key: 'tags', label: 'Tags', getValue: (l) => Array.isArray(l.tags) ? l.tags.join(', ') : (l.tags || '') },
      { key: 'activityCount', label: 'Activity Count', getValue: (l) => l.activityCount || 0 },
      { key: 'conversionProb', label: 'Conversion Prob', getValue: (l) => (l.conversionProb || 0) + '%' },
      { key: 'location', label: 'Location', getValue: (l) => l.location || 'N/A' },
      { key: 'campaign', label: 'Campaign', getValue: (l) => l.campaign || 'N/A' },
      { key: 'ip', label: 'IP Address', getValue: (l) => l.ip || 'N/A' },
      { key: 'device', label: 'Device', getValue: (l) => l.device || 'Desktop' }
    ];

    const targetColumns = columnDefinitions.filter(col => exportColumns[col.key] === true);

    if (targetColumns.length === 0) {
      triggerToast('Warning: Please select at least one field to export!');
      return;
    }

    setDownloadingLeadsState(true);
    setShowExportModal(false);

    try {
      const headers = targetColumns.map(c => c.label);
      const rows = leadsToDownload.map(l => targetColumns.map(c => c.getValue(l)));

      if (exportFormat === 'CSV') {
        const csvString = [headers.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `lms_leads_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'JSON') {
        const exportData = leadsToDownload.map(l => {
          const item = {};
          targetColumns.forEach(c => {
            item[c.label] = c.getValue(l);
          });
          return item;
        });
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `lms_leads_${Date.now()}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (exportFormat.includes('Excel') || exportFormat.includes('XLSX')) {
        let tableHeaderHtml = '';
        headers.forEach(h => {
          tableHeaderHtml += '<th>' + h + '</th>';
        });
        
        let tableBodyHtml = '';
        rows.forEach(row => {
          tableBodyHtml += '<tr>';
          row.forEach(cell => {
            tableBodyHtml += '<td>' + cell + '</td>';
          });
          tableBodyHtml += '</tr>';
        });

        const htmlTable = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Leads</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
            <style>
              table { border-collapse: collapse; }
              th { background-color: #f1f5f9; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px; }
              td { border: 1px solid #cbd5e1; padding: 6px; }
            </style>
          </head>
          <body>
            <table>
              <thead>
                <tr>${tableHeaderHtml}</tr>
              </thead>
              <tbody>
                ${tableBodyHtml}
              </tbody>
            </table>
          </body>
          </html>
        `;
        const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `lms_leads_${Date.now()}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'PDF') {
        const printWindow = window.open('', '_blank');
        
        let tableHeaderHtml = '';
        headers.forEach(h => {
          tableHeaderHtml += '<th>' + h + '</th>';
        });
        
        let tableBodyHtml = '';
        rows.forEach(row => {
          tableBodyHtml += '<tr>';
          row.forEach(cell => {
            tableBodyHtml += '<td>' + cell + '</td>';
          });
          tableBodyHtml += '</tr>';
        });

        const fontSize = targetColumns.length > 12 ? '7px' : targetColumns.length > 8 ? '8.5px' : '10px';
        const padding = targetColumns.length > 12 ? '4px 5px' : '6px 8px';
        const pageSize = targetColumns.length > 8 ? 'landscape' : 'portrait';

        printWindow.document.write(
          '<html>' +
          '<head>' +
          '  <title>Leads Export - PDF</title>' +
          '  <style>' +
          '    @page { size: ' + pageSize + '; margin: 10mm; }' +
          '    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 10px; color: #1e293b; }' +
          '    h1 { font-size: 14px; font-weight: 700; margin-bottom: 2px; }' +
          '    p { font-size: 9px; color: #64748b; margin-bottom: 15px; }' +
          '    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: ' + fontSize + '; }' +
          '    th, td { border: 1px solid #cbd5e1; padding: ' + padding + '; text-align: left; word-break: break-word; }' +
          '    th { background-color: #f1f5f9; font-weight: 600; color: #475569; }' +
          '  </style>' +
          '</head>' +
          '<body>' +
          '  <h1>Lead Management System - Leads Export</h1>' +
          '  <p>Generated on ' + new Date().toLocaleString() + ' | Total Leads: ' + leadsToDownload.length + '</p>' +
          '  <table>' +
          '    <thead>' +
          '      <tr>' + tableHeaderHtml + '</tr>' +
          '    </thead>' +
          '    <tbody>' +
          tableBodyHtml +
          '    </tbody>' +
          '  </table>' +
          '</body>' +
          '</html>'
        );
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
      triggerToast(`Leads exported in ${exportFormat} format successfully!`);
    } catch (err) {
      console.error("Failed to export leads:", err);
      triggerToast('Error: Failed to generate leads export.');
    } finally {
      setDownloadingLeadsState(false);
    }
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
      query: activeLeadDetails.query,
      ip: activeLeadDetails.ip,
      device: activeLeadDetails.device
    })
    setShowMergeModal(true)
  }

  // INTERACTIVE ACTIVITY LOGGER


  if (isLoading) {
    return <LeadsSkeleton />
  }

  return (
    <div className="p-4">
      <div className="leads-page-scope">
        <div className="leads-wrapper">
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


              {/* 6-Card Sparkline KPI Grid */}
              <div className="leads-kpi-grid mb-4">
                {[
                  {
                    label: 'Total Leads',
                    value: formFilteredLeads.length,
                    trend: kpiTrends.totalChange,
                    trendUp: kpiTrends.totalUp,
                    color: 'indigo',
                    icon: 'groups'
                  },
                  {
                    label: 'New Leads',
                    value: formFilteredLeads.filter(l => l.status === 'NEW').length,
                    trend: kpiTrends.newChange,
                    trendUp: kpiTrends.newUp,
                    color: 'blue',
                    icon: 'fiber_new'
                  },
                  {
                    label: 'Follow-Ups Today',
                    value: todayFollowUpCount,
                    trend: kpiTrends.followUpsChange,
                    trendUp: kpiTrends.followUpsUp,
                    color: 'orange',
                    icon: 'calendar_today'
                  },
                  {
                    label: 'Qualified Leads',
                    value: formFilteredLeads.filter(l => l.status === 'QUALIFIED').length,
                    trend: kpiTrends.qualifiedChange,
                    trendUp: kpiTrends.qualifiedUp,
                    color: 'green',
                    icon: 'verified'
                  },
                  {
                    label: 'Pending Leads',
                    value: formFilteredLeads.filter(l => ['NEW', 'CONTACTED'].includes(l.status)).length,
                    trend: kpiTrends.pendingChange,
                    trendUp: kpiTrends.pendingUp,
                    color: 'amber',
                    icon: 'pending'
                  },
                  {
                    label: 'Conversion Rate',
                    value: `${formFilteredLeads.length > 0 ? Math.round((formFilteredLeads.filter(l => l.status === 'QUALIFIED').length / formFilteredLeads.length) * 100) : 0}%`,
                    trend: kpiTrends.convChange,
                    trendUp: kpiTrends.convUp,
                    color: 'teal',
                    icon: 'leaderboard'
                  }

                ].map((card, idx) => (
                  <LeadsKpiCard
                    key={idx}
                    label={card.label}
                    value={card.value}
                    icon={card.icon}
                    trend={card.trend}
                    trendUp={card.trendUp}
                  />
                ))}
              </div>

              {/* Lead Segment Filter Chips */}
              <div className="leads-chips-container">
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

                  return (
                    <LeadsFilterChip
                      key={segment.key}
                      label={segment.label}
                      icon={segment.icon}
                      count={stats.count}
                      pct={stats.pct}
                      color={segment.color}
                      isActive={isActive}
                      onClick={() => setActiveBlockFilter(segment.key)}
                    />
                  );
                })}
              </div>

              {/* Consolidated Filters Toolbar */}
              <LeadsToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                dateRangeFilter={dateRangeFilter}
                setDateRangeFilter={setDateRangeFilter}
                leadOwnerFilter={leadOwnerFilter}
                setLeadOwnerFilter={setLeadOwnerFilter}
                sourceFilter={sourceFilter}
                setSourceFilter={setSourceFilter}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                verificationFilter={verificationFilter}
                setVerificationFilter={setVerificationFilter}
                queryFilter={queryFilter}
                setQueryFilter={setQueryFilter}
                uniqueQueries={uniqueQueries}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                activeSavedTab={activeSavedTab}
                setActiveSavedTab={setActiveSavedTab}
                activeBlockFilter={activeBlockFilter}
                setActiveBlockFilter={setActiveBlockFilter}
                setSortConfig={setSortConfig}
                setShowBulkUploadModal={setShowBulkUploadModal}
                setShowQuickLeadModal={setShowQuickLeadModal}
                setQuickLeadForm={setQuickLeadForm}
                handleDownloadLeads={handleDownloadLeads}
                handleChangeLeadStageGlobal={handleChangeLeadStageGlobal}
                counselors={counselorsList}
                sources={sourcesList}
              />

              {/* Top Pagination Controls */}
              <div className="mb-4 flex items-center justify-between text-body-md font-body-md text-on-surface-variant text-[12px] select-none">
                <span>Showing {totalItems === 0 ? 0 : paginationStartIndex + 1}-{paginationEndIndex} of {totalItems} leads</span>
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="px-2 h-6 border border-outline-variant rounded-[3px] bg-surface text-[11px] cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-1 rounded-[3px] transition-colors ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-container cursor-pointer'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`p-1 rounded-[3px] transition-colors ${(currentPage === totalPages || totalPages === 0) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-container cursor-pointer'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="leads-table-scroll-container">
                {tableScrollWidth > (tableContainerRef.current?.clientWidth || 0) && (
                  <div
                    ref={topScrollbarRef}
                    onScroll={handleTopScroll}
                    className="double-scrollbar-top"
                  >
                    <div style={{ width: `${tableScrollWidth}px` }} className="double-scrollbar-scroll" />
                  </div>
                )}

                <motion.div
                  ref={tableContainerRef}
                  onScroll={handleTableScroll}
                  className="leads-table-container"
                >
                  <table className="leads-table">
                    <thead className="leads-thead">
                      <tr className="leads-tr">
                        <th className="px-3 py-3 text-left w-10 bg-slate-50">
                          <input
                            type="checkbox"
                            checked={paginatedLeads.length > 0 && paginatedLeads.every(lead => selectedLeads.includes(lead.id))}
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
                        {visibleColumns.ip && (
                          <th
                            onClick={() => requestSort('ip')}
                            className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11.5px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
                          >
                            <div className="flex items-center">
                              IP Address
                              {renderSortIndicator('ip')}
                            </div>
                          </th>
                        )}
                        {visibleColumns.device && (
                          <th
                            onClick={() => requestSort('device')}
                            className="px-3 py-3 text-left text-body-md font-body-md text-on-surface text-[11.5px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors select-none bg-slate-50"
                          >
                            <div className="flex items-center">
                              Device
                              {renderSortIndicator('device')}
                            </div>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLeads.map((lead, index) => (
                        <motion.tr
                          key={lead.id}
                          className={`border-b border-slate-200 hover:bg-slate-50/70 transition-colors ${hasPermission('leads_details_view') ? 'cursor-pointer' : ''}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.04 }}
                          onClick={() => {
                            if (hasPermission('leads_details_view')) {
                              navigate(`/admin/leads/${lead.id}`)
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
                                        {hasPermission('leads_details_view') && (
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
                                            triggerToast('Number will be visible for 5 seconds!');
                                            setRevealedPhoneLeadIds(prev => ({ ...prev, [lead.id]: true }));
                                            setTimeout(() => {
                                              setRevealedPhoneLeadIds(prev => {
                                                const updated = { ...prev };
                                                delete updated[lead.id];
                                                return updated;
                                              });
                                            }, 5000);
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

                                        <button
                                          onClick={() => {
                                            setFollowUpLead(lead);
                                            setFollowUpType('Call');
                                            setFollowUpDate('');
                                            setFollowUpTime('');
                                            setActiveDropdownLeadId(null);
                                          }}
                                          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-left"
                                        >
                                          <span className="material-symbols-outlined text-[16px] text-purple-500 font-medium">calendar_month</span>
                                          Follow Up
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
                                                {counselorsList.map((counselor) => {
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
                                                          <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-bold text-slate-650 shrink-0">
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
                                                                      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded shrink-0 ${statusColors[l.status] || 'bg-slate-50 text-slate-650'}`}>
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
                                <div className="flex flex-col min-w-0 text-left">
                                  <span className="text-[12px] font-extrabold text-slate-800 hover:underline truncate flex items-center gap-1.5">
                                    {lead.originalName || lead.name}
                                    {lead.verified ? (
                                      <span className="material-symbols-outlined text-[12px]! font-bold text-emerald-500 select-none" title="Verified">check_circle</span>
                                    ) : (
                                      <span className="material-symbols-outlined text-[12px]! font-bold text-rose-500 select-none" title="Unverified">cancel</span>
                                    )}
                                  </span>
                                  <span className="text-[10px] text-slate-450 truncate">
                                    {shouldMaskLead(lead) ? maskEmail(lead.originalEmail || lead.email) : (lead.originalEmail || lead.email || '--')}
                                  </span>
                                </div>
                              </div>
                            </td>
                          )}
                          {visibleColumns.phone && (
                            <td className="px-3 py-4 text-[12px] text-slate-600 font-semibold font-sans">{(shouldMaskLead(lead) && !revealedPhoneLeadIds[lead.id]) ? maskPhone(lead.phone) : (lead.phone || '--')}</td>
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
                              <span
                                className="inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold tracking-wide border"
                                style={getStatusStyleLocal(lead.status)}
                              >
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
                          {visibleColumns.lastContacted && (
                            <td className="px-3 py-4 text-[12px] text-slate-600 font-semibold">{lead.lastContacted}</td>
                          )}
                          {visibleColumns.nextFollowUp && (
                            <td className="px-3 py-4">{renderNextFollowUpCell(lead.nextFollowUp)}</td>
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
                          {visibleColumns.ip && (
                            <td className="px-3 py-4 text-slate-600 text-[11.5px] font-semibold">{lead.ip || '--'}</td>
                          )}
                          {visibleColumns.device && (
                            <td className="px-3 py-4 text-slate-600 text-[11.5px] font-semibold">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">
                                  {lead.device?.toLowerCase() === 'mobile' ? 'smartphone' :
                                    lead.device?.toLowerCase() === 'tablet' ? 'tablet_mac' : 'desktop_windows'}
                                </span>
                                {lead.device || 'Desktop'}
                              </span>
                            </td>
                          )}
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
                {paginatedLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      if (hasPermission('leads_details_view')) {
                        navigate(`/admin/leads/${lead.id}`)
                      }
                    }}
                    className={`bg-white border border-slate-200 rounded-[3px] p-4 space-y-3.5 shadow-2xs hover:border-primary/40 transition-all text-left ${hasPermission('leads_details_view') ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-extrabold shrink-0">
                          {getInitials(lead.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[12.5px] font-extrabold text-slate-800 truncate">
                            {lead.originalName || lead.name}
                          </span>
                          <span className="text-[10px] text-slate-450 truncate">
                            {shouldMaskLead(lead) ? maskEmail(lead.originalEmail || lead.email) : (lead.originalEmail || lead.email || '--')}
                          </span>
                        </div>
                      </div>
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide border"
                        style={getStatusStyleLocal(lead.status)}
                      >
                        {lead.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[11px] border-t border-slate-100 pt-3 text-slate-600 font-medium">
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Phone</span>
                        <span className="font-semibold text-slate-700">{(shouldMaskLead(lead) && !revealedPhoneLeadIds[lead.id]) ? maskPhone(lead.phone) : (lead.phone || '--')}</span>
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
                      {lead.nextFollowUp && lead.nextFollowUp !== 'None' && lead.nextFollowUp !== '--' && (
                        <div className="col-span-2 flex flex-col items-start gap-0.5 mt-1 border-t border-slate-50 pt-2 w-full">
                          <span className="text-slate-400 text-[9.5px]">Next Follow-Up</span>
                          {renderNextFollowUpCell(lead.nextFollowUp)}
                        </div>
                      )}
                    </div>

                    {/* Mobile Row Hover Actions equivalent */}
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          handleQuickLogDirect(lead.id, 'Phone Call Summary', 'Initiated quick outbound call.');
                          triggerToast('Number will be visible for 5 seconds!');
                          setRevealedPhoneLeadIds(prev => ({ ...prev, [lead.id]: true }));
                          setTimeout(() => {
                            setRevealedPhoneLeadIds(prev => {
                              const updated = { ...prev };
                              delete updated[lead.id];
                              return updated;
                            });
                          }, 5000);
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
                      {hasPermission('leads_details_view') && (
                        <button
                          onClick={() => {
                            navigate(`/admin/leads/${lead.id}`);
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-655 border border-amber-150 text-[10px] font-bold transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[12px]">edit</span>
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredAndSortedLeads.length === 0 && (
                  <div className="py-12 text-center bg-white border border-slate-200 rounded-[3px]">
                    <span className="material-symbols-outlined text-[32px] text-slate-450 block mb-2">folder_off</span>
                    <p className="text-[12px] font-bold text-slate-800">No Leads Found</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              <div className="mt-6 flex items-center justify-between text-body-md font-body-md text-on-surface-variant text-[12px] select-none">
                <span>Showing {totalItems === 0 ? 0 : paginationStartIndex + 1}-{paginationEndIndex} of {totalItems} leads</span>
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="px-2 h-6 border border-outline-variant rounded-[3px] bg-surface text-[11px] cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-1 rounded-[3px] transition-colors ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-container cursor-pointer'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`p-1 rounded-[3px] transition-colors ${(currentPage === totalPages || totalPages === 0) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-container cursor-pointer'}`}
                    >
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

                    {hasPermission('leads_edit') && (
                      <>
                        <div className="h-4 w-px bg-slate-800" />
                        {/* Mass Status Option */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                          <select
                            onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                            defaultValue=""
                            className="bg-slate-800 border border-slate-700 rounded-[3px] px-2.5 py-1 text-[11px] outline-none !text-white cursor-pointer hover:bg-slate-700 transition-colors"
                            style={{ color: 'white' }}
                          >
                            <option value="" disabled style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Update...</option>
                            {statusesList.map(status => (
                              <option key={status.value} value={status.value} style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>{status.label}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {hasPermission('leads_assign') && (
                      <>
                        <div className="h-4 w-px bg-slate-800" />
                        {/* Mass Reassign Option */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assign:</span>
                          <select
                            onChange={(e) => handleBulkAssignUpdate(e.target.value)}
                            defaultValue=""
                            className="bg-slate-800 border border-slate-700 rounded-[3px] px-2.5 py-1 text-[11px] outline-none !text-white cursor-pointer hover:bg-slate-700 transition-colors"
                            style={{ color: 'white' }}
                          >
                            <option value="" disabled style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Assign to...</option>
                            {counselorsList.map(c => (
                              <option key={c} value={c} style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {hasPermission('leads_delete') && (
                      <>
                        <div className="h-4 w-px bg-slate-800" />
                        {/* Delete Option */}
                        <button
                          onClick={handleBulkDelete}
                          className="text-[11px] text-red-400 hover:text-red-300 hover:underline font-bold cursor-pointer transition-colors flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                          Delete
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}



          {/* VIEW APPLICATION MODAL */}
          <AnimatePresence>
            {showApplicationModal && activeModalLead && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-text font-sans">
                <motion.div
                  className="bg-white rounded-[3px] border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
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
                    <div className="flex items-center gap-3 bg-blue-50/40 border border-blue-100/50 rounded-[3px] p-3.5 select-none">
                      <div className="w-10 h-10 rounded-[3px] bg-blue-100 flex items-center justify-center text-primary text-sm font-bold">
                        {getInitials(activeModalLead.name)}
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-800 leading-tight">{activeModalLead.name}</h4>
                        <p className="text-[11px] text-slate-505 mt-0.5">{shouldMaskLead(activeModalLead) ? maskEmail(activeModalLead.email) : activeModalLead.email} • {shouldMaskLead(activeModalLead) ? maskPhone(activeModalLead.phone) : (activeModalLead.phone || '--')}</p>
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
                        <p className="text-[11px] text-slate-505 mt-0.5">{shouldMaskLead(activeModalLead) ? maskEmail(activeModalLead.email) : activeModalLead.email}</p>
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

          {/* EXPORT LEADS DIALOG/MODAL */}
          <AnimatePresence>
            {showExportModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-text font-sans animate-fade-in">
                <motion.div
                  className="bg-white rounded-[3px] border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                >
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="text-left">
                      <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-blue-600">download_for_offline</span>
                        Export Leads Options
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Select the fields and the download format for export.</p>
                    </div>
                    <button
                      onClick={() => setShowExportModal(false)}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center transition-colors select-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-4 text-left">
                    {/* Select Format Card Selector */}
                    <div>
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Export Format</span>
                      <div className="grid grid-cols-4 gap-2">
                        {['CSV', 'Excel (XLSX)', 'JSON', 'PDF'].map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setExportFormat(fmt)}
                            className={`py-2 px-3 text-[11px] font-bold rounded-[3px] border transition-all cursor-pointer text-center ${
                              exportFormat === fmt
                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Columns Selector Grid */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Select Fields</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const selectAll = {};
                              Object.keys(exportColumns).forEach(k => { selectAll[k] = true; });
                              setExportColumns(selectAll);
                            }}
                            className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer bg-none border-none p-0"
                          >
                            Select All
                          </button>
                          <span className="text-slate-300 text-[10px]">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              const deselectAll = {};
                              Object.keys(exportColumns).forEach(k => { deselectAll[k] = false; });
                              setExportColumns(deselectAll);
                            }}
                            className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer bg-none border-none p-0"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-[180px] overflow-y-auto border border-slate-100 rounded-[3px] p-3 bg-slate-50/50">
                        {Object.keys(exportColumns).map((colKey) => {
                          const labelMapping = {
                            id: 'ID',
                            name: 'Name',
                            email: 'Email',
                            phone: 'Phone',
                            status: 'Status',
                            assignedTo: 'Assigned To',
                            source: 'Source',
                            score: 'Lead Score',
                            tier: 'Tier',
                            age: 'Age/Date',
                            query: 'Query',
                            lastContacted: 'Last Contacted',
                            nextFollowUp: 'Next Follow-Up',
                            priority: 'Priority',
                            tags: 'Tags',
                            activityCount: 'Activity Count',
                            conversionProb: 'Conversion Prob',
                            location: 'Location',
                            campaign: 'Campaign',
                            ip: 'IP Address',
                            device: 'Device'
                          };
                          return (
                            <label key={colKey} className="flex items-center gap-2.5 py-1 text-[11px] text-slate-700 font-semibold cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={exportColumns[colKey] === true}
                                onChange={(e) => setExportColumns({
                                  ...exportColumns,
                                  [colKey]: e.target.checked
                                })}
                                className="w-3.5 h-3.5 accent-blue-600 cursor-pointer rounded-[3px] border-slate-300"
                              />
                              {labelMapping[colKey] || colKey}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowExportModal(false)}
                      className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-[3px] text-[11.5px] font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={executeExportLeads}
                      className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[3px] text-[11.5px] font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[15px] font-bold">download</span>
                      Export File
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
                        <option value="" disabled>Select Counselor</option>
                        {counselorsList.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
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
                        {statusesList.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
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
                      <span className="col-span-5 font-medium">{activeLeadDetails.name} &lt;{shouldMaskLead(activeLeadDetails) ? maskEmail(activeLeadDetails.email) : activeLeadDetails.email}&gt;</span>

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

          {/* FOLLOW UP MODAL */}
          <AnimatePresence>
            {followUpLead && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 select-text">
                <motion.div
                  style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                  className="rounded-2xl border shadow-2xl w-full max-w-sm overflow-hidden flex flex-col font-sans"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Modal Header */}
                  <div 
                    style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    className="px-5 py-4 border-b flex justify-between items-center"
                  >
                    <h3 
                      style={{ color: '#1e293b' }}
                      className="text-[13px] font-extrabold flex items-center gap-1.5 uppercase tracking-wide"
                    >
                      <span className="material-symbols-outlined text-[16px] text-purple-500">calendar_month</span>
                      Schedule Follow-up
                    </h3>
                    <button
                      onClick={() => setFollowUpLead(null)}
                      className="p-1 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formatted = `${followUpType} | ${followUpDate} ${followUpTime}`;
                      const newEvent = {
                        id: Date.now() + Math.random(),
                        type: 'COMMENT',
                        title: `Scheduled Follow-up (${followUpType})`,
                        body: `Next follow-up planned for ${followUpDate} at ${followUpTime}`,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
                        user: 'System',
                        ip: '192.168.1.105',
                        icon: 'event',
                        color: 'purple-600'
                      };
                      const updatedTimeline = [newEvent, ...(followUpLead.timeline || [])];

                      const token = localStorage.getItem('authToken');
                      if (token && token !== 'mock-jwt-token') {
                        try {
                          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/edit-lead/${followUpLead.id}`, {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              nextFollowUp: formatted,
                              timeline: updatedTimeline
                            })
                          });
                          if (!response.ok) {
                            const errData = await response.json();
                            throw new Error(errData.error || 'Failed to schedule follow-up');
                          }
                        } catch (err) {
                          triggerToast(`Error: ${err.message}`);
                          return;
                        }
                      }

                      const updatedLeads = leads.map(l => {
                        if (l.id === followUpLead.id) {
                          return { ...l, nextFollowUp: formatted, timeline: updatedTimeline };
                        }
                        return l;
                      });
                      setLeads(updatedLeads);
                      localStorage.setItem('lms_leads_database', JSON.stringify(updatedLeads));
                      triggerToast('Follow-up scheduled successfully!');
                      setFollowUpLead(null);
                    }}
                    className="p-5 space-y-4 text-left"
                  >
                    <div>
                      <label 
                        style={{ color: '#94a3b8' }}
                        className="block text-[11px] font-extrabold uppercase tracking-wider mb-2"
                      >
                        Follow-Up Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'WhatsApp', label: 'WhatsApp', icon: 'chat', color: 'emerald-500', activeStyle: { borderColor: '#10b981', backgroundColor: '#ecfdf5', color: '#047857' } },
                          { id: 'Call', label: 'Call', icon: 'call', color: 'blue-500', activeStyle: { borderColor: '#3b82f6', backgroundColor: '#eff6ff', color: '#1d4ed8' } },
                          { id: 'Mail', label: 'Email', icon: 'mail', color: 'amber-500', activeStyle: { borderColor: '#f59e0b', backgroundColor: '#fff7ed', color: '#b45309' } },
                        ].map(opt => {
                          const isActive = followUpType === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setFollowUpType(opt.id)}
                              style={isActive ? opt.activeStyle : { backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#475569' }}
                              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer hover:bg-slate-50"
                            >
                              <span className={`material-symbols-outlined text-[16px] text-${opt.color}`}>{opt.icon}</span>
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label 
                        style={{ color: '#94a3b8' }}
                        className="block text-[11px] font-extrabold uppercase tracking-wider mb-1.5"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        style={{ backgroundColor: '#ffffff', color: '#1e293b', borderColor: '#cbd5e1' }}
                        className="w-full border rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label 
                        style={{ color: '#94a3b8' }}
                        className="block text-[11px] font-extrabold uppercase tracking-wider mb-1.5"
                      >
                        Time
                      </label>
                      <input
                        type="time"
                        value={followUpTime}
                        onChange={(e) => setFollowUpTime(e.target.value)}
                        style={{ backgroundColor: '#ffffff', color: '#1e293b', borderColor: '#cbd5e1' }}
                        className="w-full border rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setFollowUpLead(null)}
                        style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#475569' }}
                        className="px-4 py-2 border rounded-xl text-[11px] font-bold transition-all cursor-pointer hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Schedule
                      </button>
                    </div>
                  </form>
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
    </div>
  )
}
