import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './leads.css'
import { getCustomStatuses, getLeadJourney, getStatusStyle, getStatusBadgeStyle, getCustomJourneys } from '../../../helpers/statusHelper'
import { hasPermission } from '../../../components/ProtectRoute'

export default function LeadDetailsPage() {
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

  const [dbUsers, setDbUsers] = useState([])

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

  const [statusesList, setStatusesList] = useState(() => getCustomStatuses())
  const [journeysList, setJourneysList] = useState(() => getCustomJourneys())

  useEffect(() => {
    const handleStatusesUpdate = () => {
      setStatusesList(getCustomStatuses())
    }
    const handleJourneysUpdate = () => {
      setJourneysList(getCustomJourneys())
    }
    window.addEventListener('lms-statuses-updated', handleStatusesUpdate)
    window.addEventListener('lms-journeys-updated', handleJourneysUpdate)
    return () => {
      window.removeEventListener('lms-statuses-updated', handleStatusesUpdate)
      window.removeEventListener('lms-journeys-updated', handleJourneysUpdate)
    }
  }, [])

  const leadJourney = useMemo(() => {
    if (!activeLeadDetails) return journeysList[0];
    const assignedId = activeLeadDetails.journeyId || 'default';
    return journeysList.find(j => j.id === assignedId) || journeysList.find(j => j.isDefault) || journeysList[0];
  }, [activeLeadDetails, journeysList])

  const journeySteps = leadJourney ? leadJourney.steps : []

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
    query: ''
  })

  useEffect(() => {
    localStorage.setItem('lms_leads_database', JSON.stringify(leads))
    window.dispatchEvent(new CustomEvent('lms-leads-updated'))
  }, [leads])

  // Sync leads from database on mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token || token === 'mock-jwt-token') return;
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/get-lead`, {
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
        console.error("Failed to fetch leads in details page:", err);
      }
    };
    fetchLeads();
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
        console.error("Failed to fetch users in details page:", err);
      }
    };
    fetchUsers();
  }, []);

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
        campaign: activeLeadDetails.campaign || '',
        query: activeLeadDetails.query || ''
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

  const counselorsList = useMemo(() => {
    const list = new Set()
    dbUsers.forEach(u => {
      if (u.status === 'Active' && u.name) {
        list.add(u.name)
      }
    })
    leads.forEach(l => {
      if (l.assignedTo) {
        list.add(l.assignedTo)
      }
    })
    const defaultCounselors = ['Unassigned']
    defaultCounselors.forEach(c => list.add(c))
    return Array.from(list)
  }, [leads, dbUsers])

  const currentStageIndex = useMemo(() => {
    const status = activeLeadDetails?.status
    return journeySteps.indexOf(status)
  }, [activeLeadDetails, journeySteps])

  if (!activeLeadDetails) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="text-sm font-extrabold text-slate-800">Lead Not Found</div>
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
  const isMasked = role !== 'admin' && role !== 'Admin' && role !== 'System Admin'

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

  const getStatusColor = () => ''
  const getStatusBadgeStyles = () => ''

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg(null)
    }, 3000)
  }

  const handleLeadStatusChange = async (leadId, newStatus) => {
    if (!hasPermission('leads_edit')) {
      triggerToast("Error: You do not have permission to edit leads!");
      return;
    }
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
            status: newStatus,
            timeline: updatedTimeline
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to update lead status');
        }
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, status: newStatus, timeline: updatedTimeline }
      }
      return lead
    }))
    triggerToast(`Lead status updated to ${newStatus}`)
  }

  const handleLeadJourneyChange = async (leadId, newJourneyId) => {
    if (!hasPermission('leads_edit')) {
      triggerToast("Error: You do not have permission to edit leads!");
      return;
    }
    const prevJourney = journeysList.find(j => j.id === (activeLeadDetails.journeyId || 'default'))?.name || 'Standard CRM Pipeline'
    const nextJourney = journeysList.find(j => j.id === newJourneyId)?.name || newJourneyId
    const updatedTimeline = [
      {
        id: Date.now(),
        type: 'SYSTEM',
        title: 'Pipeline Shifted',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
        body: `Shifted lead pipeline from '${prevJourney}' to '${nextJourney}'`,
        user: 'Admin',
        ip: '192.168.1.105',
        icon: 'route',
        color: 'indigo-600'
      },
      ...activeLeadDetails.timeline
    ]

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
            journeyId: newJourneyId,
            timeline: updatedTimeline
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to shift pipeline');
        }
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, journeyId: newJourneyId, timeline: updatedTimeline }
      }
      return lead
    }))
    triggerToast("Lead pipeline shifted successfully!")
  }

  const handleLeadCounselorChange = async (leadId, newCounselor) => {
    if (!hasPermission('leads_assign')) {
      triggerToast("Error: You do not have permission to reassign counselors!");
      return;
    }
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
        return { ...lead, assignedTo: newCounselor, timeline: updatedTimeline }
      }
      return lead
    }))
    triggerToast(`Assigned counselor changed to ${newCounselor}`)
  }

  const handleLeadScoreChange = async (leadId, newScore) => {
    if (!hasPermission('leads_edit')) {
      triggerToast("Error: You do not have permission to edit leads!");
      return;
    }
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
            score: newScore,
            timeline: updatedTimeline
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to update lead score');
        }
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, score: newScore, timeline: updatedTimeline }
      }
      return lead
    }))
  }

  const handleSendQueryResponse = async (leadId, queryId, responseText) => {
    if (!hasPermission('leads_edit')) {
      triggerToast("Error: You do not have permission to edit leads!");
      return;
    }
    if (!responseText.trim()) return
    const updatedQueries = activeLeadDetails.queries.map(q => {
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
        body: `Replied to query "${activeLeadDetails.queries.find(x => x.id === queryId).question}": "${responseText}"`,
        user: 'Admin',
        ip: '192.168.1.105',
        icon: 'check_circle',
        color: 'green-600'
      },
      ...activeLeadDetails.timeline
    ]

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
            queries: updatedQueries,
            timeline: updatedTimeline
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to resolve query');
        }
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, queries: updatedQueries, timeline: updatedTimeline }
      }
      return lead
    }))
    triggerToast('Inquiry response sent and ticket resolved!')
  }

  const handleMergeProfiles = async () => {
    if (!hasPermission('leads_edit')) {
      triggerToast("Error: You do not have permission to edit leads!");
      return;
    }
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

    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const delResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/delete-lead/${dupe.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!delResponse.ok) throw new Error('Failed to delete duplicate profile');

        const updateResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/edit-lead/${activeLeadDetails.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...mergeSelectedProps,
            timeline: consolidatedTimeline
          })
        });
        if (!updateResponse.ok) throw new Error('Failed to save consolidated profile');
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

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

  const handleLogInteraction = async () => {
    if (!hasPermission('leads_edit')) {
      triggerToast("Error: You do not have permission to edit leads!");
      return;
    }
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

    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/edit-lead/${activeLeadDetails.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            timeline: updatedTimeline
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to log interaction');
        }
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

    setLeads(leads.map(lead => {
      if (lead.id === activeLeadDetails.id) {
        return { ...lead, timeline: updatedTimeline }
      }
      return lead
    }))
    setNewComment('')
    triggerToast('New interaction added to activity trail!')
  }

  const handleTogglePinEvent = async (eventId) => {
    if (!hasPermission('leads_edit')) {
      triggerToast("Error: You do not have permission to edit leads!");
      return;
    }
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

    const token = localStorage.getItem('authToken');
    if (token && token !== 'mock-jwt-token') {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/lead/edit-lead/${activeLeadDetails.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            timeline: sortedTimeline
          })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to toggle event pin');
        }
      } catch (err) {
        triggerToast(`Error: ${err.message}`);
        return;
      }
    }

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


  const handleExportTimeline = () => {
    if (exporting) return
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      triggerToast('Timeline interactions exported successfully as CSV')
    }, 1200)
  }

  const stepperStages = useMemo(() => {
    return journeySteps.map(stepVal => {
      const found = statusesList.find(s => s.value === stepVal)
      return {
        label: found ? found.label : stepVal,
        statusKey: stepVal
      }
    })
  }, [journeySteps, statusesList])

  return (
    <div className="leads-page-scope leads-details-scope min-h-screen flex flex-col p-4 md:p-6">
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
          <div className="sticky top-5 space-y-5 max-h-[calc(100vh-3rem)] overflow-y-auto pr-1 scrollbar-none">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
              <button
                onClick={() => navigate('/admin/leads')}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center cursor-pointer text-slate-500 mb-2 w-8 h-8"
                title="Back to Leads list"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Info</div>
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
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metadata</div>
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
                    <span className="text-slate-850 font-bold font-sans">cpc</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium font-sans">Query</span>
                    <span className="text-slate-800 font-bold font-sans">{activeLeadDetails.query || '--'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Operations</div>
                <div className="space-y-1.5">
                  <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block">Lead Status</div>
                  <select
                    value={activeLeadDetails.status}
                    onChange={(e) => handleLeadStatusChange(activeLeadDetails.id, e.target.value)}
                    disabled={!hasPermission('leads_edit')}
                    className="w-full h-8 px-2 border border-slate-205 rounded-lg bg-white text-[12px] font-semibold outline-none cursor-pointer hover:bg-slate-50 focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
                    value={activeLeadDetails.assignedTo || 'Unassigned'}
                    onChange={(e) => handleLeadCounselorChange(activeLeadDetails.id, e.target.value)}
                    disabled={!hasPermission('leads_assign')}
                    className="w-full h-8 px-2 border border-slate-205 rounded-lg bg-white text-[12px] font-semibold outline-none cursor-pointer hover:bg-slate-50 focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {counselorsList.map(counselor => (
                      <option key={counselor} value={counselor}>{counselor}</option>
                    ))}
                  </select>
                </div>
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
                        data-tooltip="Call"
                      >
                        <span className="material-symbols-outlined text-[15px]">call</span>
                      </button>
                      <button
                        onClick={() => setShowEmailModal(true)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 hover:scale-105 active:scale-95 text-emerald-600 rounded-lg border border-emerald-200 flex items-center justify-center cursor-pointer transition-all w-7.5 h-7.5"
                        data-tooltip="Send Email"
                      >
                        <span className="material-symbols-outlined text-[15px]">mail</span>
                      </button>
                      <button
                        onClick={() => triggerToast('WhatsApp message draft initialized!')}
                        className="p-1.5 bg-green-50 hover:bg-green-100 hover:scale-105 active:scale-95 text-green-600 rounded-lg border border-green-200 flex items-center justify-center cursor-pointer transition-all w-7.5 h-7.5"
                        data-tooltip="WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                      </button>
                      <button
                        onClick={() => triggerToast('Meeting scheduler simulator initialized!')}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 hover:scale-105 active:scale-95 text-indigo-600 rounded-lg border border-indigo-200 flex items-center justify-center cursor-pointer transition-all w-7.5 h-7.5"
                        data-tooltip="Schedule Meeting"
                      >
                        <span className="material-symbols-outlined text-[15px]">video_call</span>
                      </button>
                      <button
                        onClick={() => triggerToast('Task creation console initialized!')}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 hover:scale-105 active:scale-95 text-slate-600 rounded-lg border border-slate-205 flex items-center justify-center cursor-pointer transition-all w-7.5 h-7.5"
                        data-tooltip="Create Task"
                      >
                        <span className="material-symbols-outlined text-[15px]">task_alt</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lead ID: {activeLeadDetails.id.replace('LS-', 'L-')}</p>

                </div>
              </div>
            </div>

            {/* after lead name  */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50/70 bg-white border border-slate-200 rounded-xl shadow-xs p-3.5 text-[11px] font-bold text-slate-655 select-none items-center">
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
                <div>
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold tracking-wide border truncate"
                    style={getStatusStyle(activeLeadDetails.status, statusesList)}
                  >
                    {activeLeadDetails.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-1">Active Pipeline</span>
                <select
                  value={activeLeadDetails.journeyId || 'default'}
                  onChange={(e) => handleLeadJourneyChange(activeLeadDetails.id, e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] outline-none text-slate-700 cursor-pointer font-bold shadow-2xs w-full max-w-[145px] focus:border-sky-500"
                >
                  {journeysList.map(j => (
                    <option key={j.id} value={j.id}>{j.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Created at</span>
                  <span className="p-1 text-[10px] text-slate-400 font-semibold">3d ago</span>
                </div>
                <span className="text-slate-800 text-[11.5px] font-extrabold truncate">09/12/2026</span>

              </div>
            </div>

            {/* Lead Journey Stepper */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Lead Journey</div>
                <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 rounded-md font-bold select-none">
                  {currentStageIndex >= 0 ? `Stage ${currentStageIndex + 1} of ${stepperStages.length}` : 'Terminal / Other Stage'}
                </span>
              </div>

              <div className="leads-stepper-container relative pt-2 pb-3.5 select-none overflow-x-auto flex items-center gap-3.5 min-h-[60px]">
                {stepperStages.map((stage, idx) => {
                  const isCompleted = idx < currentStageIndex
                  const isActive = idx === currentStageIndex
                  const activeColor = getStatusBadgeStyle(stage.statusKey, statusesList).backgroundColor;
                  return (
                    <React.Fragment key={stage.label}>
                      {idx > 0 && (
                        <div
                          className="h-[2px] w-6 md:w-10 shrink-0 transition-colors duration-300"
                          style={{
                            backgroundColor: isCompleted ? '#10b981' : isActive ? activeColor : '#e2e8f0'
                          }}
                        />
                      )}
                      <div className="flex items-center gap-2 shrink-0 group">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300"
                          style={
                            isCompleted
                              ? { backgroundColor: '#10b981', borderColor: '#10b981', color: '#ffffff' }
                              : isActive
                                ? getStatusBadgeStyle(stage.statusKey, statusesList)
                                : { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#94a3b8' }
                          }
                        >
                          {isCompleted ? (
                            <span className="material-symbols-outlined text-[13px] text-white font-extrabold">check</span>
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>
                        <span
                          className="text-[11px] font-extrabold whitespace-nowrap transition-colors"
                          style={{
                            color: isCompleted ? '#059669' : isActive ? activeColor : '#64748b'
                          }}
                        >
                          {stage.label}
                        </span>
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </div>



          {/* Quick Log Console + Activity Input */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Quick Log Console</div>

            <div className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type comments, task assignments, phone notes..."
                rows="2"
                className="w-full text-[11.5px] p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 resize-none font-sans"
              />
              <div className="flex items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">Type:</span>
                  <select
                    value={interactionType}
                    onChange={(e) => setInteractionType(e.target.value)}
                    className="bg-white border border-slate-200 p-5 shadow-xs space-y-4 rounded-lg px-2.5 py-1 text-[11px] outline-none text-slate-700 cursor-pointer font-bold shadow-2xs"
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
            <div className="text-sm font-extrabold text-slate-800">Activity Trail</div>
            <div className="flex flex-col md:flex-row gap-2.5 pb-2 select-none">
              <div className="flex flex-wrap gap-1">
                {[
                  { key: 'ALL', label: 'All', icon: 'list' },
                  { key: 'EMAILS', label: 'Emails', icon: 'mail' },
                  { key: 'MEETINGS', label: 'Meetings', icon: 'video_call' },
                  { key: 'TASKS', label: 'Tasks', icon: 'task_alt' }
                ].map(chip => (
                  <button
                    key={chip.key}
                    onClick={() => setTimelineFilter(chip.key)}
                    className={`h-6 px-2.5 rounded-full text-[9.5px] font-extrabold flex items-center gap-0.5 transition-all border cursor-pointer ${timelineFilter === chip.key
                      ? 'bg-primary border-primary text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[10px]">{chip.icon}</span>
                    {chip.label}
                  </button>
                ))}
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
                        className={`absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full outline outline-3 ${event.color === 'blue-600' ? 'bg-blue-600 outline-blue-50' :
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
            {/* Lead Health */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-3 hover:shadow-md transition-all duration-300">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Lead Health</div>
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
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none">Conversion Insights</div>
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
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Lead Score</div>
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
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                  Email Details
                </div>
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
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">merge_type</span>
                  Consolidate & Merge Duplicate Profiles
                </div>
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
                    { key: 'campaign', label: 'Campaign', icon: 'sell' },
                    { key: 'query', label: 'Query', icon: 'question_mark' }
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
                  <div className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1 select-none">
                    <span className="material-symbols-outlined text-[13px] text-slate-400">preview</span>
                    Outcome Profile Summary
                  </div>
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
