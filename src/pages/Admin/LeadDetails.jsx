import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function LeadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [leads, setLeads] = useState(() => {
    const localData = localStorage.getItem('lms_leads_database')
    if (localData) {
      try {
        return JSON.parse(localData)
      } catch (e) {
        console.error(e)
      }
    }
    return []
  })

  const activeLeadDetails = useMemo(() => {
    return leads.find(l => l.id === id)
  }, [leads, id])

  const [playingRecording, setPlayingRecording] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState('1x')
  const [playbackProgress, setPlaybackProgress] = useState(30)
  const [editingScore, setEditingScore] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [interactionType, setInteractionType] = useState('COMMENT')
  const [timelineFilter, setTimelineFilter] = useState('ALL')
  const [timelineSearchQuery, setTimelineSearchQuery] = useState('')
  const [detailsActiveTab, setDetailsActiveTab] = useState('overview')
  const [toastMsg, setToastMsg] = useState(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [mergeSelectedProps, setMergeSelectedProps] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    assignedTo: '',
    source: '',
    score: 50,
    location: '',
    campaign: ''
  })

  useEffect(() => {
    localStorage.setItem('lms_leads_database', JSON.stringify(leads))
    window.dispatchEvent(new CustomEvent('lms-leads-updated'))
  }, [leads])

  useEffect(() => {
    const handleLeadsUpdated = () => {
      const localData = localStorage.getItem('lms_leads_database')
      if (localData) {
        try {
          setLeads(JSON.parse(localData))
        } catch (e) {
          console.error(e)
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
        campaign: activeLeadDetails.campaign || ''
      })
    }
  }, [activeLeadDetails])

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

  if (!activeLeadDetails) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-800">Lead Not Found</h3>
        <button
          onClick={() => navigate('/admin/leads')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-[12px] font-bold cursor-pointer"
        >
          Back to Leads
        </button>
      </div>
    )
  }

  const dupe = leads.find(l => l.id !== activeLeadDetails.id && l.email === activeLeadDetails.email)
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

  const getDisplayValue = (key, val) => {
    if (!val) return '--'
    if (isMasked) {
      if (key === 'email') return maskEmail(val)
      if (key === 'phone') return maskPhone(val)
    }
    return val
  }

  const getInitials = (name) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'LD'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'CONTACTED':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'QUALIFIED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'LOST':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-600'
      case 'CONTACTED': return 'bg-[#c2410c]'
      case 'QUALIFIED': return 'bg-emerald-600'
      case 'LOST': return 'bg-rose-600'
      default: return 'bg-slate-600'
    }
  }

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg(null)
    }, 3000)
  }

  const handleLeadStatusChange = (leadId, newStatus) => {
    const prevStatus = activeLeadDetails.status
    const updatedTimeline = [
      {
        id: Date.now(),
        type: 'STATUS_CHANGE',
        title: `Status changed to ${newStatus === 'NEW' ? 'Callback Later' : newStatus}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
        user: 'Admin',
        ip: '192.168.1.105',
        icon: 'swap_horiz',
        color: 'slate-400'
      },
      ...activeLeadDetails.timeline
    ]
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, status: newStatus, timeline: updatedTimeline }
      }
      return lead
    }))
    triggerToast(`Lead status updated to ${newStatus}`)
  }

  const handleLeadCounselorChange = (leadId, newCounselor) => {
    const prevCounselor = activeLeadDetails.assignedTo
    const updatedTimeline = [
      {
        id: Date.now(),
        type: 'ASSIGNMENT',
        title: `Counselor Assigned`,
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
        return { ...lead, assignedTo: newCounselor, timeline: updatedTimeline }
      }
      return lead
    }))
    triggerToast(`Assigned counselor changed to ${newCounselor}`)
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
        return { ...lead, score: newScore, timeline: updatedTimeline }
      }
      return lead
    }))
  }

  const handleSendQueryResponse = (leadId, queryId, responseText) => {
    if (!responseText.trim()) return
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const updatedQueries = lead.queries.map(q => {
          if (q.id === queryId) {
            return { ...q, status: 'RESOLVED', response: responseText }
          }
          return q
        })
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
        ]
        return { ...lead, queries: updatedQueries, timeline: updatedTimeline }
      }
      return lead
    }))
    triggerToast('Inquiry response sent and ticket resolved!')
  }

  const handleMergeProfiles = () => {
    if (!dupe) return
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
      .filter(l => l.id !== dupe.id)
      .map(l => l.id === activeLeadDetails.id ? consolidatedLead : l)
    )
    setShowMergeModal(false)
    triggerToast(`Profiles successfully merged! Consolidated ${consolidatedTimeline.length} activities.`)
  }

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
        return { ...lead, timeline: updatedTimeline }
      }
      return lead
    }))
    setNewComment('')
    triggerToast('New interaction added to activity trail!')
  }

  const handleTogglePinEvent = (eventId) => {
    const updatedTimeline = activeLeadDetails.timeline.map(event => {
      if (event.id === eventId) {
        return { ...event, pinned: !event.pinned }
      }
      return event
    })
    const sortedTimeline = [
      ...updatedTimeline.filter(e => e.pinned),
      ...updatedTimeline.filter(e => !e.pinned)
    ]
    setLeads(leads.map(lead => {
      if (lead.id === activeLeadDetails.id) {
        return { ...lead, timeline: sortedTimeline }
      }
      return lead
    }))
    triggerToast(`Activity pin toggled!`)
  }

  const handlePropSelection = (field, value) => {
    setMergeSelectedProps(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const filteredTimeline = activeLeadDetails.timeline.filter(event => {
    if (timelineFilter !== 'ALL') {
      if (timelineFilter === 'CALLS' && event.type !== 'CALL') return false
      if (timelineFilter === 'EMAILS' && event.type !== 'EMAIL') return false
      if (timelineFilter === 'MEETINGS' && event.type !== 'MEETING') return false
      if (timelineFilter === 'TASKS' && event.type !== 'TASK') return false
      if (timelineFilter === 'NOTES' && event.type !== 'COMMENT') return false
      if (timelineFilter === 'STATUS_CHANGES' && !['STATUS_CHANGE', 'STATUS_CHANGE_FLOW'].includes(event.type)) return false
      if (timelineFilter === 'SYSTEM' && !['SYSTEM', 'CREATION', 'ASSIGNMENT', 'SCORE_CHANGE', 'TAG'].includes(event.type)) return false
    }
    if (timelineSearchQuery.trim()) {
      const query = timelineSearchQuery.toLowerCase()
      const matchTitle = event.title?.toLowerCase().includes(query)
      const matchBody = typeof event.body === 'string' ? event.body.toLowerCase().includes(query) : false
      const matchUser = event.user?.toLowerCase().includes(query)
      return matchTitle || matchBody || matchUser
    }
    return true
  })

  const handleCompleteNextAction = () => {
    const newEvent = {
      id: Date.now(),
      type: 'TASK',
      title: 'Next Action Completed: Send Proposal',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
      body: 'Successfully sent out proposed service package proposal via email.',
      user: 'Admin',
      ip: '192.168.1.105',
      icon: 'task_alt',
      color: 'green-600'
    }
    setLeads(leads.map(lead => {
      if (lead.id === activeLeadDetails.id) {
        return { ...lead, timeline: [newEvent, ...lead.timeline] }
      }
      return lead
    }))
    triggerToast('Next action completed and logged!')
  }

  const handleExportTimeline = () => {
    if (exporting) return
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      triggerToast('Timeline interactions exported successfully as CSV')
    }, 1200)
  }

  const stepperStages = [
    { label: 'Lead Created', statusKey: 'NEW' },
    { label: 'Assigned', statusKey: 'ASSIGNED' },
    { label: 'Contacted', statusKey: 'CONTACTED' },
    { label: 'Qualified', statusKey: 'QUALIFIED' },
    { label: 'Demo Scheduled', statusKey: 'DEMO' },
    { label: 'Proposal', statusKey: 'PROPOSAL' },
    { label: 'Negotiation', statusKey: 'NEGOTIATION' },
    { label: 'Won', statusKey: 'WON' }
  ]

  const currentStageIndex = useMemo(() => {
    const status = activeLeadDetails.status
    if (status === 'WON') return 7
    if (status === 'QUALIFIED') return 3
    if (status === 'CONTACTED') return 2
    if (status === 'ASSIGNED') return 1
    return 0
  }, [activeLeadDetails])

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col p-4 md:p-6">
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

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-10 gap-5 max-w-7xl mx-auto w-full">
        {/* Left Sidebar (20% - col-span-2) */}
        <div className="lg:col-span-2 space-y-5 flex flex-col text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
            <button
              onClick={() => navigate('/admin/leads')}
              className="p-1.5 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center cursor-pointer text-slate-500 mb-2 w-8 h-8"
              title="Back to Leads list"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>

            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Info</h4>
              <div className="space-y-3 text-[12px] font-semibold text-slate-655">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
                  {isMasked ? (
                    <span className="text-slate-500 truncate" title="Masked for Counselor/Vendor">
                      {getDisplayValue('email', activeLeadDetails.email)}
                    </span>
                  ) : (
                    <a
                      href={`mailto:${activeLeadDetails.email}`}
                      className="hover:underline hover:text-primary transition-colors truncate text-slate-700"
                    >
                      {activeLeadDetails.email}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">phone</span>
                  {isMasked ? (
                    <span className="text-slate-500" title="Masked for Counselor/Vendor">
                      {getDisplayValue('phone', activeLeadDetails.phone)}
                    </span>
                  ) : (
                    <a
                      href={`tel:${activeLeadDetails.phone}`}
                      className="hover:underline hover:text-primary transition-colors text-slate-700"
                    >
                      {activeLeadDetails.phone}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                  <span className="text-slate-700">{activeLeadDetails.location || 'London, UK'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metadata</h4>
              <div className="space-y-2.5 text-[12px] font-semibold text-slate-655">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Source</span>
                  <span className="text-slate-800 font-bold">{activeLeadDetails.source || 'Organic Search'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Campaign</span>
                  <span className="text-slate-800 font-bold truncate max-w-[100px]" title={activeLeadDetails.campaign || 'Direct_Ingest'}>
                    {activeLeadDetails.campaign || 'Direct_Ingest'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">UTM Medium</span>
                  <span className="text-slate-800 font-bold">cpc</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Operations</h4>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lead Status</label>
                <select
                  value={activeLeadDetails.status}
                  onChange={(e) => handleLeadStatusChange(activeLeadDetails.id, e.target.value)}
                  className="w-full h-8 px-2 border border-slate-205 rounded-lg bg-white text-[12px] font-semibold outline-none cursor-pointer hover:bg-slate-50 focus:border-primary transition-colors"
                >
                  <option value="NEW">NEW</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="DEMO">DEMO SCHEDULED</option>
                  <option value="PROPOSAL">PROPOSAL</option>
                  <option value="NEGOTIATION">NEGOTIATION</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Counselor</label>
                <select
                  value={activeLeadDetails.assignedTo}
                  onChange={(e) => handleLeadCounselorChange(activeLeadDetails.id, e.target.value)}
                  className="w-full h-8 px-2 border border-slate-205 rounded-lg bg-white text-[12px] font-semibold outline-none cursor-pointer hover:bg-slate-50 focus:border-primary transition-colors"
                >
                  <option value="Sarah Jenkins">Sarah Jenkins</option>
                  <option value="Marcus Chan">Marcus Chan</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>
            </div>
          </div>


        </div>

        {/* Center Panel (50% - col-span-5) */}
        <div className="lg:col-span-5 space-y-5 flex flex-col text-left">
          {/* Redesigned Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/10 to-indigo-100 text-primary flex items-center justify-center text-sm font-bold shadow-2xs border border-primary/20 shrink-0">
                  {getInitials(activeLeadDetails.name)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-extrabold text-slate-800 leading-tight">{activeLeadDetails.name}</h1>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => triggerToast('Voice call simulator initialized!')}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 hover:scale-105 active:scale-95 text-blue-600 rounded-lg border border-blue-200 flex items-center justify-center cursor-pointer transition-all w-7.5 h-7.5"
                        title="Call"
                      >
                        <span className="material-symbols-outlined text-[15px]">call</span>
                      </button>
                      <button
                        onClick={() => setShowEmailModal(true)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 hover:scale-105 active:scale-95 text-emerald-600 rounded-lg border border-emerald-200 flex items-center justify-center cursor-pointer transition-all w-7.5 h-7.5"
                        title="Email"
                      >
                        <span className="material-symbols-outlined text-[15px]">mail</span>
                      </button>
                      <button
                        onClick={() => triggerToast('WhatsApp message draft initialized!')}
                        className="p-1.5 bg-green-50 hover:bg-green-100 hover:scale-105 active:scale-95 text-green-600 rounded-lg border border-green-200 flex items-center justify-center cursor-pointer transition-all w-7.5 h-7.5"
                        title="WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                      </button>
                      <button
                        onClick={() => triggerToast('Meeting scheduler simulator initialized!')}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 hover:scale-105 active:scale-95 text-indigo-600 rounded-lg border border-indigo-200 flex items-center justify-center cursor-pointer transition-all w-7.5 h-7.5"
                        title="Schedule Meeting"
                      >
                        <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                      </button>
                      <button
                        onClick={() => triggerToast('Task creation console initialized!')}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 hover:scale-105 active:scale-95 text-slate-600 rounded-lg border border-slate-205 flex items-center justify-center cursor-pointer transition-all w-7.5 h-7.5"
                        title="Create Task"
                      >
                        <span className="material-symbols-outlined text-[15px]">task_alt</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lead ID: {activeLeadDetails.id.replace('LS-', 'L-')}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/70 border border-slate-150 p-3.5 rounded-xl text-[11px] font-bold text-slate-655 select-none">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Rating</span>
                <span className="text-rose-600 flex items-center gap-0.5 text-[11.5px] font-extrabold">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span> Hot Lead
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Lead Score</span>
                <span className="text-slate-800 text-[11.5px] font-extrabold">{activeLeadDetails.score} / 100</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Current Stage</span>
                <span className="text-slate-800 text-[11.5px] font-extrabold truncate">{activeLeadDetails.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Assigned To</span>
                <span className="text-slate-800 text-[11.5px] font-extrabold truncate">{activeLeadDetails.assignedTo}</span>
              </div>
            </div>
          </div>

          {/* Lead Journey Stepper */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Lead Journey</h3>
              <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 rounded-md font-bold select-none">
                Stage {currentStageIndex + 1} of 8
              </span>
            </div>
            
            <div className="relative pt-2 pb-1 select-none overflow-x-auto scrollbar-none flex items-stretch md:items-center justify-between gap-1.5 min-h-[50px]">
              {stepperStages.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex
                const isActive = idx === currentStageIndex
                return (
                  <React.Fragment key={stage.label}>
                    {idx > 0 && (
                      <div className={`hidden md:block h-[2.5px] flex-grow min-w-[8px] transition-colors duration-300 ${isCompleted ? 'bg-emerald-500' : isActive ? 'bg-primary' : 'bg-slate-200'}`} />
                    )}
                    <div className="flex items-center gap-1.5 shrink-0 group">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-100' :
                        isActive ? 'bg-primary border-primary text-white ring-4 ring-primary/15 scale-105' :
                        'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        {isCompleted ? (
                          <span className="material-symbols-outlined text-[12px] text-white font-extrabold">check</span>
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-extrabold whitespace-nowrap transition-colors ${
                        isCompleted ? 'text-emerald-600' :
                        isActive ? 'text-primary' : 'text-slate-400'
                      }`}>
                        {stage.label}
                      </span>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* Quick Log Console + Activity Input */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Quick Log Console</h3>
            
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5 select-none">
                {[
                  { label: 'Log Call', type: 'CALL', text: 'Spoke with lead. Call details: ' },
                  { label: 'Log Meeting', type: 'MEETING', text: 'Scheduled demonstration details: ' },
                  { label: 'Add Note', type: 'COMMENT', text: 'Internal comment: ' },
                  { label: 'Send Email', type: 'COMMENT', text: 'Draft email follow-up notes: ' },
                  { label: 'Schedule Follow-up', type: 'TASK', text: 'Follow-up scheduled: ' },
                  { label: 'Create Task', type: 'TASK', text: 'New task details: ' }
                ].map(qBtn => (
                  <button
                    key={qBtn.label}
                    onClick={() => {
                      setInteractionType(qBtn.type)
                      setNewComment(qBtn.text)
                    }}
                    className={`px-2.5 py-1 border transition-all text-[9.5px] font-bold rounded-lg cursor-pointer ${
                      interactionType === qBtn.type && newComment.startsWith(qBtn.text.slice(0, 10))
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 hover:border-primary hover:bg-primary/5 text-slate-600 hover:text-primary'
                    }`}
                  >
                    {qBtn.label}
                  </button>
                ))}
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type comments, task assignments, phone notes..."
                rows="2"
                className="w-full text-[11.5px] p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 resize-none font-sans"
              />
              <div className="flex items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Type:</span>
                  <select
                    value={interactionType}
                    onChange={(e) => setInteractionType(e.target.value)}
                    className="bg-white border border-slate-205 rounded-lg px-2.5 py-1 text-[11px] outline-none text-slate-700 cursor-pointer font-bold shadow-2xs"
                  >
                    <option value="COMMENT">Note / Comment</option>
                    <option value="TASK">Task / Reminder</option>
                    <option value="CALL">Call Summary</option>
                    <option value="MEETING">Meeting</option>
                  </select>
                </div>
                <button
                  onClick={handleLogInteraction}
                  className="px-4 py-1.5 bg-primary text-white rounded-lg text-[11px] font-bold hover:bg-primary/95 transition-all shadow-xs cursor-pointer hover:shadow-md active:scale-98"
                >
                  Add to Timeline
                </button>
              </div>
            </div>
          </div>

          {/* Activity Trail / Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-800">Activity Trail</h2>
              <div className="flex items-center gap-2 select-none">
                <button
                  onClick={handleExportTimeline}
                  className="border border-slate-205 bg-white rounded-lg px-2.5 py-1 text-[10px] font-bold flex items-center gap-1 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">download</span> Export
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2.5 pb-2 select-none">
              <div className="flex flex-wrap gap-1">
                {[
                  { key: 'ALL', label: 'All', icon: 'list' },
                  { key: 'CALLS', label: 'Calls', icon: 'call' },
                  { key: 'EMAILS', label: 'Emails', icon: 'mail' },
                  { key: 'MEETINGS', label: 'Meetings', icon: 'video_call' },
                  { key: 'TASKS', label: 'Tasks', icon: 'task_alt' }
                ].map(chip => (
                  <button
                    key={chip.key}
                    onClick={() => setTimelineFilter(chip.key)}
                    className={`h-6 px-2.5 rounded-full text-[9.5px] font-extrabold flex items-center gap-0.5 transition-all border cursor-pointer ${
                      timelineFilter === chip.key
                        ? 'bg-primary border-primary text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[10px]">{chip.icon}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
              <div className="relative w-full flex-grow">
                <span className="material-symbols-outlined text-[13px] text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2">
                  search
                </span>
                <input
                  type="text"
                  value={timelineSearchQuery}
                  onChange={(e) => setTimelineSearchQuery(e.target.value)}
                  placeholder="Search keywords..."
                  className="w-full h-7 pl-8 pr-2.5 border border-slate-205 rounded-lg bg-white text-[11px] focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-3.5 pl-6 space-y-4 pb-4">
              {filteredTimeline.length === 0 ? (
                <div className="py-8 text-center text-slate-400 italic text-xs">
                  No activities match.
                </div>
              ) : (
                filteredTimeline.map((event) => {
                  const isPlayingRec = playingRecording && event.recording
                  return (
                    <div key={event.id} className="relative">
                      <div
                        className={`absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full outline outline-3 ${
                          event.color === 'blue-600' ? 'bg-blue-600 outline-blue-50' :
                          event.color === 'green-600' ? 'bg-green-600 outline-green-50' :
                          event.color === 'red-600' ? 'bg-red-600 outline-red-50' :
                          event.color === 'amber-800' ? 'bg-amber-800 outline-amber-50' :
                          event.color.startsWith('#') ? '' : 'bg-slate-400 outline-slate-50'
                        }`}
                        style={event.color.startsWith('#') ? { backgroundColor: event.color, outlineColor: '#fff7ed' } : {}}
                      />
                      
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow text-left">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[12px] font-extrabold text-slate-800 flex items-center gap-1">
                            {event.title}
                            {event.pinned && (
                              <span className="material-symbols-outlined text-[12px] text-amber-500 font-bold" title="Pinned">push_pin</span>
                            )}
                          </span>
                          <div className="flex items-center gap-1.5 select-none">
                            <span className="text-[9.5px] text-slate-400 font-medium">{event.date}</span>
                            <button
                              onClick={() => handleTogglePinEvent(event.id)}
                              className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-655 transition-colors flex items-center justify-center cursor-pointer"
                              title={event.pinned ? 'Unpin' : 'Pin'}
                            >
                              <span className={`material-symbols-outlined text-[12px] ${event.pinned ? 'text-amber-500 fill-amber-500' : ''}`}>push_pin</span>
                            </button>
                          </div>
                        </div>

                        {event.body && typeof event.body === 'string' && (
                          <div className="text-[12px] text-slate-700 leading-relaxed font-sans mt-1">
                            {event.type === 'COMMENT' ? (
                              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[12px] italic text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                                {event.body}
                              </div>
                            ) : event.type === 'EMAIL' ? (
                              <div className="space-y-1.5">
                                <p className="font-semibold text-slate-800">{event.body}</p>
                                <button
                                  onClick={() => setShowEmailModal(true)}
                                  className="text-[11px] text-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[13px] text-primary">open_in_new</span> View Email
                                </button>
                              </div>
                            ) : event.type === 'MEETING' ? (
                              <div className="space-y-1.5">
                                <p className="font-semibold text-slate-800">{event.body}</p>
                                <a
                                  href="#"
                                  onClick={(e) => { e.preventDefault(); triggerToast('Zoom meeting initialized!'); }}
                                  className="text-[11px] text-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[13px] text-primary">link</span> Meeting Link
                                </a>
                              </div>
                            ) : (
                              <p>{event.body}</p>
                            )}
                          </div>
                        )}

                        {event.type === 'CALL' && (
                          <div className="mt-2 text-[12px] text-slate-600 font-sans flex justify-between items-center">
                            <span>Duration: 04:22</span>
                            <button
                              onClick={() => {
                                setPlayingRecording(!playingRecording)
                                if (!playingRecording) setAudioPlaying(true)
                              }}
                              className="px-2.5 py-1 border border-slate-200 rounded bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-700 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <span className="material-symbols-outlined text-[13px]">play_circle</span>
                              {playingRecording ? 'Close Player' : 'Listen to Recording'}
                            </button>
                          </div>
                        )}

                        {isPlayingRec && (
                          <motion.div
                            className="mt-3 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-lg shadow-2xs"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <button
                                onClick={() => setAudioPlaying(!audioPlaying)}
                                className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                              >
                                <span className="material-symbols-outlined text-[16px] text-white">
                                  {audioPlaying ? 'pause' : 'play_arrow'}
                                </span>
                              </button>
                              <div className="flex-1 flex items-end h-5 gap-0.5 overflow-hidden">
                                {[10, 24, 18, 30, 10, 16, 26, 38, 20, 14, 28, 8, 20, 36, 12, 18, 26, 32, 8, 14, 22].map((h, i, arr) => {
                                  const percent = (i / arr.length) * 100
                                  const isPlayed = percent <= playbackProgress
                                  return (
                                    <div
                                      key={i}
                                      className={`flex-grow rounded-t-xs ${isPlayed ? 'bg-blue-600' : 'bg-blue-200'}`}
                                      style={{ height: `${h}%` }}
                                    />
                                  )
                                })}
                              </div>
                              <span className="text-[10px] font-bold text-blue-700 font-mono">01:18 / 04:22</span>
                            </div>
                          </motion.div>
                        )}

                        {event.type === 'TAG' && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {event.body && (
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                {event.body}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-3 border-t border-slate-100 pt-2 font-mono flex gap-4 select-none">
                          <span>USER: {event.user}</span>
                          <span>IP: {event.ip}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Action Hub - 30% - col-span-3) */}
        <div className="lg:col-span-3 space-y-5 flex flex-col text-left">
          <div className="sticky top-5 space-y-5 max-h-[calc(100vh-3rem)] overflow-y-auto pr-1 scrollbar-none">
            {/* Sticky Next Action */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-3.5 border-l-4 border-l-indigo-600 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center select-none">
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">Next Action</span>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-extrabold uppercase rounded-full border border-rose-100 animate-pulse">Due Today</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800">Send Proposal</h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium select-none">
                  <span className="material-symbols-outlined text-[13px] text-slate-400">schedule</span>
                  4:00 PM
                </div>
              </div>
              <div className="text-[11px] text-slate-600 font-medium select-none flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-205 text-indigo-700 flex items-center justify-center text-[8.5px] font-extrabold">SJ</div>
                <span>Sarah Jenkins</span>
              </div>
              <div className="flex items-center gap-2 pt-2.5 select-none">
                <button
                  onClick={handleCompleteNextAction}
                  className="flex-grow py-1.5 bg-emerald-600 hover:bg-emerald-705 text-white rounded-lg text-[10.5px] font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98 cursor-pointer text-center"
                >
                  Complete
                </button>
                <button
                  onClick={() => triggerToast('Next action rescheduled!')}
                  className="flex-grow py-1.5 border border-slate-205 hover:bg-slate-50 text-slate-700 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer text-center"
                >
                  Reschedule
                </button>
              </div>
            </div>

            {/* Upcoming Activities */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-3.5 hover:shadow-md transition-all duration-300">
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Upcoming Activities</h3>
              <div className="space-y-3 text-[11.5px]">
                <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2.5">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-800 block">Demo Meeting</span>
                    <span className="text-[10px] text-slate-450 font-bold block select-none">Tomorrow 10:00 AM</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-extrabold uppercase select-none shrink-0 border border-blue-100">Meeting</span>
                </div>
                <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2.5">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-800 block">Follow-up Call</span>
                    <span className="text-[10px] text-slate-450 font-bold block select-none">Friday 3:00 PM</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded text-[9px] font-extrabold uppercase select-none shrink-0 border border-orange-100">Call</span>
                </div>
                <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2.5">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-800 block">Proposal Review</span>
                    <span className="text-[10px] text-slate-450 font-bold block select-none">Monday 11:00 AM</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[9px] font-extrabold uppercase select-none shrink-0 border border-purple-100">Review</span>
                </div>
                <div className="flex justify-between items-start gap-2 p-2 bg-rose-50/50 rounded-lg border border-rose-100">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-rose-800 block">Send Welcome Kit</span>
                    <span className="text-[10px] text-rose-505 font-bold block select-none">Overdue: Yesterday</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[8px] font-extrabold uppercase select-none shrink-0 border border-rose-200">Warning</span>
                </div>
              </div>
            </div>

            {/* Lead Health */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-3 hover:shadow-md transition-all duration-300">
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Lead Health</h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[
                  { label: 'Last Response', val: '2h Ago', isUp: true },
                  { label: 'Email Opens', val: '7 Opens', isUp: true },
                  { label: 'Link Clicks', val: '4 Clicks', isUp: true },
                  { label: 'Website Visits', val: '12 Visits', isUp: true },
                  { label: 'Meetings', val: '2 Attended', isUp: true },
                  { label: 'Response Rate', val: '90%', isUp: true }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-50/70 border border-slate-100 rounded-xl p-2.5 flex flex-col justify-between select-none">
                    <span className="text-[8.5px] text-slate-400 uppercase font-bold tracking-wider mb-1">{stat.label}</span>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-800 truncate">{stat.val}</span>
                      <span className={`text-[10px] font-extrabold shrink-0 ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {stat.isUp ? '↑' : '↓'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Insights */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-3.5 text-left hover:shadow-md transition-all duration-300">
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Conversion Insights</h3>
              <div className="flex items-center gap-3 select-none">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" strokeDasharray="82, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-[11px] font-extrabold text-slate-800">82%</span>
                </div>
                <div>
                  <span className="text-[12px] font-extrabold text-slate-800 block leading-tight">High Conversion Probability</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Updated minutes ago</span>
                </div>
              </div>
              <div className="space-y-1.5 text-[11px] font-semibold text-slate-655 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600 font-extrabold">check</span>
                  Responds Quickly
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600 font-extrabold">check</span>
                  Attended Meeting
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600 font-extrabold">check</span>
                  Opened Proposal
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 pt-1">
                  <span className="material-symbols-outlined text-[13px] text-amber-600 font-extrabold">warning</span>
                  Pricing Not Shared Yet
                </div>
              </div>
            </div>

            {/* Lead Score Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-3.5 text-left select-none hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Lead Score</h3>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[8px] font-extrabold uppercase rounded border border-rose-100">🔥 Hot Lead</span>
              </div>
              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="text-2xl font-extrabold text-slate-855 tracking-tight">{activeLeadDetails.score}</span>
                <span className="text-[11px] text-slate-400 font-bold">/ 100</span>
              </div>
              <div className="space-y-1.5 text-[11px] font-medium text-slate-655 pt-2.5 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Email Opens</span>
                  <span className="text-emerald-600 font-bold">+20</span>
                </div>
                <div className="flex justify-between">
                  <span>Meeting Attended</span>
                  <span className="text-emerald-600 font-bold">+25</span>
                </div>
                <div className="flex justify-between">
                  <span>Website Activity</span>
                  <span className="text-emerald-600 font-bold">+15</span>
                </div>
                <div className="flex justify-between">
                  <span>Positive Call Outcome</span>
                  <span className="text-emerald-600 font-bold">+35</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4 select-text">
            <motion.div
              className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="px-5 py-3 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                  Email Details
                </h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-505 cursor-pointer flex items-center justify-center select-none"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="p-5 space-y-4 text-left text-[12px] overflow-y-auto max-h-[400px]">
                <div className="grid grid-cols-6 gap-y-2 border-b border-slate-150 pb-3.5 text-slate-700 font-sans">
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

              <div className="px-5 py-3 border-t border-slate-150 bg-slate-50 flex justify-end">
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

      <AnimatePresence>
        {showMergeModal && dupe && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4 select-text">
            <motion.div
              className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col font-sans"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="px-5 py-3 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">merge_type</span>
                  Consolidate & Merge Duplicate Profiles
                </h3>
                <button
                  onClick={() => setShowMergeModal(false)}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-505 cursor-pointer flex items-center justify-center select-none"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="p-6 space-y-4 text-left overflow-y-auto max-h-[500px]">
                <div className="grid grid-cols-12 bg-slate-50 border border-slate-250 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider p-2.5 rounded-lg select-none">
                  <div className="col-span-4">Attribute</div>
                  <div className="col-span-4 border-l border-slate-200 pl-2 bg-blue-50/20">Primary</div>
                  <div className="col-span-4 border-l border-slate-200 pl-2 bg-purple-50/20">Duplicate</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {[
                    { key: 'name', label: 'Full Name', icon: 'person' },
                    { key: 'email', label: 'Work Email', icon: 'mail' },
                    { key: 'phone', label: 'Phone Number', icon: 'phone' },
                    { key: 'score', label: 'Lead Score', icon: 'grade' },
                    { key: 'status', label: 'Status', icon: 'swap_horiz' },
                    { key: 'assignedTo', label: 'Counselor', icon: 'person_add' },
                    { key: 'source', label: 'Source', icon: 'source' },
                    { key: 'location', label: 'Location', icon: 'location_on' },
                    { key: 'campaign', label: 'Campaign', icon: 'sell' }
                  ].map(({ key, label, icon }) => {
                    const valPrimary = activeLeadDetails[key]
                    const valDuplicate = dupe[key]
                    const isSelectedPrimary = mergeSelectedProps[key] === valPrimary

                    return (
                      <div key={key} className="grid grid-cols-12 text-[12px] items-center py-2 px-2.5">
                        <div className="col-span-4 text-slate-500 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-slate-400">{icon}</span>
                          {label}
                        </div>
                        <div
                          onClick={() => handlePropSelection(key, valPrimary)}
                          className={`col-span-4 border-l border-slate-200 pl-2 cursor-pointer transition-all flex items-center gap-1.5 select-none ${isSelectedPrimary ? 'font-bold text-blue-700 bg-blue-50/10' : 'text-slate-655'}`}
                        >
                          <input
                            type="radio"
                            checked={isSelectedPrimary}
                            onChange={() => handlePropSelection(key, valPrimary)}
                            className="w-3.5 h-3.5 cursor-pointer accent-blue-600"
                          />
                          <span className="truncate">{key === 'email' || key === 'phone' ? getDisplayValue(key, valPrimary) : (valPrimary || '--')}</span>
                        </div>
                        <div
                          onClick={() => handlePropSelection(key, valDuplicate)}
                          className={`col-span-4 border-l border-slate-200 pl-2 cursor-pointer transition-all flex items-center gap-1.5 select-none ${!isSelectedPrimary ? 'font-bold text-purple-700 bg-purple-50/10' : 'text-slate-655'}`}
                        >
                          <input
                            type="radio"
                            checked={!isSelectedPrimary}
                            onChange={() => handlePropSelection(key, valDuplicate)}
                            className="w-3.5 h-3.5 cursor-pointer accent-purple-600"
                          />
                          <span className="truncate">{key === 'email' || key === 'phone' ? getDisplayValue(key, valDuplicate) : (valDuplicate || '--')}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl space-y-2 text-[11px]">
                  <h4 className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1 select-none">
                    <span className="material-symbols-outlined text-[13px] text-slate-400">preview</span>
                    Outcome Profile Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-655 font-semibold">
                    <div><span className="text-slate-400 block text-[9px]">Merged Name</span><span className="text-slate-800 font-bold">{mergeSelectedProps.name}</span></div>
                    <div><span className="text-slate-400 block text-[9px]">Work Email</span><span className="text-slate-800 font-bold">{mergeSelectedProps.email}</span></div>
                    <div><span className="text-slate-400 block text-[9px]">Score / Counselor</span><span className="text-slate-800 font-bold">{mergeSelectedProps.score} • {mergeSelectedProps.assignedTo}</span></div>
                    <div><span className="text-slate-400 block text-[9px]">Status</span><span className="text-slate-800 font-bold">{mergeSelectedProps.status}</span></div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-150 bg-slate-50 flex justify-end gap-2">
                <button
                  onClick={() => setShowMergeModal(false)}
                  className="px-3.5 py-1.5 border border-slate-250 rounded text-[11px] font-bold hover:bg-slate-50 cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMergeProfiles}
                  className="px-3.5 py-1.5 bg-primary hover:bg-primary/95 text-white rounded text-[11px] font-bold transition-all cursor-pointer shadow-sm select-none"
                >
                  Confirm & Merge Profiles
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
