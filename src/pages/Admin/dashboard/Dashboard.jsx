import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DasboardStatsCard from '../../../components/Dashboard/DasboardStatsCard'
import DashboardGraphCard from '../../../components/Dashboard/DashboardGraphCard'
import DashboardRecentLeads from '../../../components/Dashboard/DashboardRecentLeads'
import ExportButton from '../../../components/ExportButton'
import DeepDiveAnalytics from '../../../components/Dashboard/DeepDiveAnalytics'
import './Dashboard.css'


export default function Dashboard() {
  const [toastMsg, setToastMsg] = useState(null)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days')
  const [leads, setLeads] = useState([])

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const dateRanges = [
    { label: 'Today', value: 'Today' },
    { label: 'Yesterday', value: 'Yesterday' },
    { label: 'Last 7 Days', value: 'Last 7 Days' },
    { label: 'Last 30 Days', value: 'Last 30 Days' },
    { label: 'Last 90 Days', value: 'Last 90 Days' },
    { label: 'This Session', value: 'This Session' }
  ]

  // Sync leads from database or localStorage on mount
  useEffect(() => {
    const fetchLeads = async () => {
      const localData = localStorage.getItem('lms_leads_database')
      if (localData) {
        try {
          const parsed = JSON.parse(localData)
          if (Array.isArray(parsed)) {
            setLeads(parsed)
          }
        } catch (e) {
          console.error("Error parsing leads database:", e)
        }
      }

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
            localStorage.setItem('lms_leads_database', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error("Failed to fetch leads from database:", err);
      }
    };
    fetchLeads();
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

  // Filter leads based on selected date range
  const filteredLeads = React.useMemo(() => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    return leads.filter(l => {
      if (!l.createdAt) return true
      const leadDate = new Date(l.createdAt)
      
      switch (selectedDateRange) {
        case 'Today': {
          return leadDate >= startOfDay
        }
        case 'Yesterday': {
          const yesterdayStart = new Date(startOfDay)
          yesterdayStart.setDate(yesterdayStart.getDate() - 1)
          return leadDate >= yesterdayStart && leadDate < startOfDay
        }
        case 'Last 7 Days': {
          const sevenDaysAgo = new Date(startOfDay)
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          return leadDate >= sevenDaysAgo
        }
        case 'Last 30 Days': {
          const thirtyDaysAgo = new Date(startOfDay)
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return leadDate >= thirtyDaysAgo
        }
        case 'Last 90 Days': {
          const ninetyDaysAgo = new Date(startOfDay)
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
          return leadDate >= ninetyDaysAgo
        }
        case 'This Session':
        default:
          return true
      }
    })
  }, [leads, selectedDateRange])

  // Compute dynamic stats based on filtered leads
  const stats = React.useMemo(() => {
    const totalLeads = filteredLeads.length

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let prevPeriodLeads = []
    
    let durationDays = 30
    if (selectedDateRange === 'Today') durationDays = 1
    else if (selectedDateRange === 'Yesterday') durationDays = 1
    else if (selectedDateRange === 'Last 7 Days') durationDays = 7
    else if (selectedDateRange === 'Last 30 Days') durationDays = 30
    else if (selectedDateRange === 'Last 90 Days') durationDays = 90

    const currentPeriodStart = new Date(startOfDay)
    currentPeriodStart.setDate(currentPeriodStart.getDate() - durationDays)
    
    const prevPeriodStart = new Date(currentPeriodStart)
    prevPeriodStart.setDate(prevPeriodStart.getDate() - durationDays)

    if (selectedDateRange === 'Yesterday') {
      const yesterdayStart = new Date(startOfDay)
      yesterdayStart.setDate(yesterdayStart.getDate() - 1)
      const dayBeforeYesterdayStart = new Date(startOfDay)
      dayBeforeYesterdayStart.setDate(dayBeforeYesterdayStart.getDate() - 2)

      prevPeriodLeads = leads.filter(l => {
        if (!l.createdAt) return false
        const d = new Date(l.createdAt)
        return d >= dayBeforeYesterdayStart && d < yesterdayStart
      })
    } else if (selectedDateRange !== 'This Session') {
      prevPeriodLeads = leads.filter(l => {
        if (!l.createdAt) return false
        const d = new Date(l.createdAt)
        return d >= prevPeriodStart && d < currentPeriodStart
      })
    }

    const prevTotal = prevPeriodLeads.length
    let totalLeadsChange = ''
    let totalLeadsTrend = 'neutral'
    if (prevTotal > 0 && selectedDateRange !== 'This Session') {
      const pct = ((totalLeads - prevTotal) / prevTotal) * 100
      totalLeadsChange = `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`
      totalLeadsTrend = pct >= 0 ? 'positive' : 'negative'
    } else if (selectedDateRange !== 'This Session') {
      totalLeadsChange = totalLeads > 0 ? `+${totalLeads}` : '0'
      totalLeadsTrend = totalLeads > 0 ? 'positive' : 'neutral'
    }

    const convertedLeads = filteredLeads.filter(l => l.status === 'WON' || l.status === 'QUALIFIED').length
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

    const prevConverted = prevPeriodLeads.filter(l => l.status === 'WON' || l.status === 'QUALIFIED').length
    const prevConversionRate = prevTotal > 0 ? (prevConverted / prevTotal) * 100 : 0

    let convChange = ''
    let convTrend = 'neutral'
    if (prevTotal > 0 && selectedDateRange !== 'This Session') {
      const diff = conversionRate - prevConversionRate
      convChange = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`
      convTrend = diff >= 0 ? 'positive' : 'negative'
    }

    const wonLeads = filteredLeads.filter(l => (l.status === 'WON' || l.status === 'QUALIFIED') && l.createdAt && l.updatedAt)
    let avgCloseTime = 0
    if (wonLeads.length > 0) {
      const totalDiffMs = wonLeads.reduce((sum, l) => {
        const diff = new Date(l.updatedAt) - new Date(l.createdAt)
        return sum + (diff > 0 ? diff : 0)
      }, 0)
      avgCloseTime = totalDiffMs / wonLeads.length / (1000 * 60 * 60 * 24)
    }

    let displayCloseTime = '4.2d'
    if (avgCloseTime > 0) {
      displayCloseTime = `${avgCloseTime.toFixed(1)}d`
    } else {
      const overallWon = leads.filter(l => (l.status === 'WON' || l.status === 'QUALIFIED') && l.createdAt && l.updatedAt)
      if (overallWon.length > 0) {
        const totalDiffMs = overallWon.reduce((sum, l) => {
          const diff = new Date(l.updatedAt) - new Date(l.createdAt)
          return sum + (diff > 0 ? diff : 0)
        }, 0)
        const overallAvg = totalDiffMs / overallWon.length / (1000 * 60 * 60 * 24)
        displayCloseTime = `${overallAvg.toFixed(1)}d`
      }
    }

    const activeCampaigns = new Set(filteredLeads.map(l => l.campaign).filter(Boolean)).size
    const prevActiveCampaigns = new Set(prevPeriodLeads.map(l => l.campaign).filter(Boolean)).size
    let campChange = ''
    let campTrend = 'neutral'
    if (prevTotal > 0 && selectedDateRange !== 'This Session') {
      const diff = activeCampaigns - prevActiveCampaigns
      campChange = `${diff >= 0 ? '+' : ''}${diff}`
      campTrend = diff >= 0 ? 'positive' : 'negative'
    }

    return [
      { label: 'TOTAL LEADS', value: totalLeads.toLocaleString(), change: totalLeadsChange, trend: totalLeadsTrend, color: 'primary' },
      { label: 'CONVERSION RATE', value: `${conversionRate.toFixed(1)}%`, change: convChange, trend: convTrend, color: 'success' },
      { label: 'AVG TIME TO CLOSE', value: displayCloseTime, change: '', trend: 'neutral', color: 'error' },
      { label: 'ACTIVE CAMPAIGNS', value: String(activeCampaigns), change: campChange, trend: campTrend, color: 'primary' }
    ]
  }, [leads, filteredLeads, selectedDateRange])

  // Compute dynamic sources based on filtered leads
  const sources = React.useMemo(() => {
    const counts = {}
    filteredLeads.forEach(l => {
      const src = l.source || 'Other'
      counts[src] = (counts[src] || 0) + 1
    })

    const total = filteredLeads.length || 1

    const sourcePalette = {
      'Google Ads': '#4285F4',
      'Facebook': '#1877F2',
      'Facebook Ads': '#1877F2',
      'Organic Search': '#34A853',
      'Website Organic': '#34A853',
      'Referral': '#FFA726',
      'Other': '#ABABAB'
    }

    const defaultColors = ['#4285F4', '#1877F2', '#34A853', '#FFA726', '#E91E63', '#9C27B0', '#00BCD4']

    let idx = 0
    const list = Object.keys(counts).map(name => {
      const count = counts[name]
      const percentage = Math.round((count / total) * 100)
      const color = sourcePalette[name] || defaultColors[idx++ % defaultColors.length]
      return { name, percentage, count, color }
    })

    if (list.length === 0) {
      return []
    }

    return list.sort((a, b) => b.count - a.count)
  }, [filteredLeads])

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const recentLeads = React.useMemo(() => {
    return [...filteredLeads]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
        return dateB - dateA
      })
      .slice(0, 5)
      .map(l => ({
        ...l,
        date: formatRelativeTime(l.createdAt)
      }))
  }, [filteredLeads])

  const getStatusClass = (status) => {
    switch (status) {
      case 'NEW': return 'status-NEW'
      case 'CONTACTED': return 'status-CONTACTED'
      case 'JNI': return 'status-JNI'
      default: return 'status-default'
    }
  }

  return (
    <div className="dashboard-wrapper dashboard-page-scope" data-tour="dashboard-overview">
      {/* Export Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="export-toast-container"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            <div className="export-toast-content">
              <span className="material-symbols-outlined export-toast-icon">check_circle</span>
              <span className="export-toast-text">{toastMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="dashboard-header">
        <div className="date-filter-wrapper">
          <div
            className="date-filter"
            onClick={() => setShowDateDropdown(!showDateDropdown)}
          >
            <span>{selectedDateRange}</span>
            <span className={`material-symbols-outlined arrow-icon ${showDateDropdown ? 'rotated' : ''}`}>
              expand_more
            </span>
          </div>

          <AnimatePresence>
            {showDateDropdown && (
              <>
                <div className="dropdown-click-outside" onClick={() => setShowDateDropdown(false)} />
                <motion.div
                  className="date-dropdown-menu"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  {dateRanges.map((range) => (
                    <div
                      key={range.value}
                      className={`date-dropdown-item ${selectedDateRange === range.value ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedDateRange(range.value)
                        setShowDateDropdown(false)
                        triggerToast(`Filtered dashboard data for ${range.label}`)
                      }}
                    >
                      <span>{range.label}</span>
                      {selectedDateRange === range.value && (
                        <span className="material-symbols-outlined check-icon">check</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <ExportButton triggerToast={triggerToast} />

      </div>

      {/* Stats Grid */}
      <motion.div
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {stats.map((stat, idx) => (
          <DasboardStatsCard
            key={idx}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            idx={idx}
          />
        ))}
      </motion.div>

      {/* Graph cards */}
      <DashboardGraphCard sources={sources} leads={filteredLeads} selectedDateRange={selectedDateRange} />

      {/* Deep Dive Counselor/Daily/Channel Analytics */}
      <DeepDiveAnalytics triggerToast={triggerToast} leads={filteredLeads} />

      <DashboardRecentLeads leads={recentLeads} getStatusClass={getStatusClass} />


    </div>
  )
}