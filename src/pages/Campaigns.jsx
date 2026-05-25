import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ExportButton from '../components/ExportButton'

// Initial Campaigns Data
const initialCampaignsList = [
  { id: 1, name: 'Google Search - Brand Keywords', network: 'Google Ads', icon: 'search', color: 'bg-blue-600', iconColor: 'text-blue-600', budget: 400, spend: 18500, leads: 1650, clicks: 19800, impressions: 540000, status: 'ACTIVE', startDate: '2026-04-01' },
  { id: 2, name: 'Facebook Retargeting Ads', network: 'Facebook', icon: 'campaign', color: 'bg-indigo-600', iconColor: 'text-indigo-600', budget: 250, spend: 12400, leads: 1120, clicks: 14500, impressions: 420000, status: 'ACTIVE', startDate: '2026-04-05' },
  { id: 3, name: 'LinkedIn B2B Enterprise Outreach', network: 'LinkedIn', icon: 'business', color: 'bg-sky-700', iconColor: 'text-sky-700', budget: 150, spend: 8200, leads: 320, clicks: 4800, impressions: 110000, status: 'ACTIVE', startDate: '2026-04-10' },
  { id: 4, name: 'Instagram Lead Gen Forms', network: 'Instagram', icon: 'photo_camera', color: 'bg-pink-600', iconColor: 'text-pink-600', budget: 100, spend: 5100, leads: 490, clicks: 5200, impressions: 180000, status: 'PAUSED', startDate: '2026-04-12' },
  { id: 5, name: 'YouTube Tech Reviews Sponsorship', network: 'YouTube', icon: 'play_circle', color: 'bg-red-600', iconColor: 'text-red-600', budget: 200, spend: 4050, leads: 240, clicks: 3100, impressions: 95000, status: 'PAUSED', startDate: '2026-04-15' },
  { id: 6, name: 'TikTok Video Spark Ads', network: 'TikTok', icon: 'music_note', color: 'bg-slate-900', iconColor: 'text-slate-900', budget: 120, spend: 0, leads: 0, clicks: 0, impressions: 0, status: 'DRAFT', startDate: '2026-05-01' }
]

// Initial Education Portals Publishers Data
const initialPublishersList = [
  { id: 'PUB-1', name: 'Google Ads Search Network', source: 'Google Ads', leads: 1650, verified: 1320, primaryVerified: 924, spend: 18500, enrollments: 88, cpl: 11.21, cpvl: 14.01 },
  { id: 'PUB-2', name: 'Meta Lead Accelerator', source: 'Facebook', leads: 1120, verified: 840, primaryVerified: 504, spend: 12400, enrollments: 46, cpl: 11.07, cpvl: 14.76 },
  { id: 'PUB-3', name: 'LinkedIn Professional Link', source: 'LinkedIn', leads: 320, verified: 280, primaryVerified: 210, spend: 8200, enrollments: 22, cpl: 25.62, cpvl: 29.28 },
  { id: 'PUB-4', name: 'Shiksha Education Inflow', source: 'Shiksha Portal', leads: 950, verified: 760, primaryVerified: 456, spend: 6100, enrollments: 18, cpl: 6.42, cpvl: 8.02 },
  { id: 'PUB-5', name: 'CollegeDunia Admission Inlet', source: 'CollegeDunia', leads: 820, verified: 574, primaryVerified: 344, spend: 5500, enrollments: 14, cpl: 6.70, cpvl: 9.58 }
]

// Simulated Auditor Logs
const mockAuditorLogs = {
  'PUB-1': [
    { time: '10:44:02', ip: '103.45.201.88', status: 'VERIFIED', type: 'SMS_OTP_OK', detail: 'Primary verified lead via Brand search form.' },
    { time: '10:42:15', ip: '72.191.14.30', status: 'VERIFIED', type: 'EMAIL_VERIFY_OK', detail: 'Ingested with active UTM source tracking.' },
    { time: '10:40:00', ip: '198.162.1.200', status: 'FAILED', type: 'SPAM_BLOCK', detail: 'Invalid phone format (DNC flag).' }
  ],
  'PUB-2': [
    { time: '10:43:00', ip: '202.9.112.5', status: 'VERIFIED', type: 'FORM_CAPTCHA_OK', detail: 'Lead category verified via meta form webhooks.' },
    { time: '10:35:12', ip: '64.233.16.8', status: 'VERIFIED', type: 'SMS_OTP_OK', detail: 'Attributed secondary priority lead.' }
  ],
  'PUB-3': [
    { time: '10:28:44', ip: '82.165.20.1', status: 'VERIFIED', type: 'SMS_OTP_OK', detail: 'B2B enterprise lead verified by owner email lookup.' }
  ],
  'PUB-4': [
    { time: '10:41:20', ip: '115.111.45.22', status: 'VERIFIED', type: 'SMS_OTP_OK', detail: 'Attributed from Shiksha higher education directory lookup.' },
    { time: '10:38:05', ip: '115.111.45.99', status: 'FAILED', type: 'DUPLICATE_BLOCK', detail: 'Lead matches active profile LS-1019.' }
  ],
  'PUB-5': [
    { time: '10:39:10', ip: '182.72.11.142', status: 'VERIFIED', type: 'EMAIL_VERIFY_OK', detail: 'Admission inquiry verified via CollegeDunia portal.' }
  ]
}

// Initial Traffic Channel Summary Mock Data (from user screenshot)
const initialChannelSummaryData = [
  { id: 1, channel: 'Direct', leadsCount: 3461, leadsVerifiedPct: 92.0, leadsMEI: 3241, appsCount: 1506, appsConversion: 43.5, appsMEI: 1500, enrollCount: 216, enrollPct: 27.0 },
  { id: 2, channel: 'Paid Ads', leadsCount: 27914, leadsVerifiedPct: 84.5, leadsMEI: 26745, appsCount: 11718, appsConversion: 41.9, appsMEI: 5302, enrollCount: 203, enrollPct: 25.3 },
  { id: 3, channel: 'Publishers', leadsCount: 3286, leadsVerifiedPct: 31.2, leadsMEI: 2010, appsCount: 211, appsConversion: 6.4, appsMEI: 26, enrollCount: 18, enrollPct: 2.2 },
  { id: 4, channel: 'Social', leadsCount: 1178, leadsVerifiedPct: 93.0, leadsMEI: 988, appsCount: 597, appsConversion: 50.7, appsMEI: 377, enrollCount: 109, enrollPct: 13.6 },
  { id: 5, channel: 'Organic', leadsCount: 1643, leadsVerifiedPct: 94.3, leadsMEI: 1423, appsCount: 745, appsConversion: 45.3, appsMEI: 641, enrollCount: 103, enrollPct: 12.8 },
  { id: 6, channel: 'Offline', leadsCount: 2339, leadsVerifiedPct: 8.1, leadsMEI: 765, appsCount: 34, appsConversion: 1.4, appsMEI: 31, enrollCount: 9, enrollPct: 1.1 },
  { id: 7, channel: 'Telephony', leadsCount: 1054, leadsVerifiedPct: 65.3, leadsMEI: 689, appsCount: 257, appsConversion: 24.3, appsMEI: 146, enrollCount: 40, enrollPct: 5.0 },
  { id: 8, channel: 'Other Campaigns', leadsCount: 7048, leadsVerifiedPct: 16.3, leadsMEI: 1569, appsCount: 1005, appsConversion: 14.2, appsMEI: 765, enrollCount: 102, enrollPct: 12.7 }
]

// Lead Disposition Pipeline Mock Data by Channel
const initialDispositionData = [
  { channel: 'Direct', newLeads: 400, contacted: 1000, interested: 555, applied: 1000, reviewed: 200, offered: 90, enrolled: 216 },
  { channel: 'Paid Ads', newLeads: 5000, contacted: 7000, interested: 4000, applied: 8000, reviewed: 2500, offered: 1211, enrolled: 203 },
  { channel: 'Publishers', newLeads: 1200, contacted: 1100, interested: 600, applied: 200, reviewed: 100, offered: 68, enrolled: 18 },
  { channel: 'Social', newLeads: 100, contacted: 200, interested: 200, applied: 400, reviewed: 119, offered: 50, enrolled: 109 },
  { channel: 'Organic', newLeads: 150, contacted: 300, interested: 300, applied: 500, reviewed: 200, offered: 90, enrolled: 103 },
  { channel: 'Offline', newLeads: 1500, contacted: 500, interested: 200, applied: 100, reviewed: 20, offered: 10, enrolled: 9 },
  { channel: 'Telephony', newLeads: 150, contacted: 400, interested: 200, applied: 200, reviewed: 40, offered: 24, enrolled: 40 },
  { channel: 'Other Campaigns', newLeads: 3000, contacted: 2000, interested: 800, applied: 800, reviewed: 200, offered: 146, enrolled: 102 }
]

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState('DASHBOARD')

  // Channel & Disposition Unit and Sub-Tab States
  const [unitToggle, setUnitToggle] = useState('PCT') // 'PCT' | 'NUM'
  const [dashSubTab, setDashSubTab] = useState('CHANNEL') // 'CHANNEL' | 'DISPOSITION' | 'BUDGETS'
  const [activeDateFilter, setActiveDateFilter] = useState('30') // '30' | '90' | 'ALL'
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)

  // Core Database States
  const [campaigns, setCampaigns] = useState(initialCampaignsList)
  const [publishers, setPublishers] = useState(initialPublishersList)
  const [channelData, setChannelData] = useState(initialChannelSummaryData)
  const [dispositionData, setDispositionData] = useState(initialDispositionData)

  // Filter States (Dashboard Tab)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [sortConfig, setSortConfig] = useState({ key: 'spend', direction: 'desc' })
  const [activeChartTab, setActiveChartTab] = useState('leads')
  const [hoveredChartIndex, setHoveredChartIndex] = useState(null)

  // Modals
  const [toastMsg, setToastMsg] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeAuditPublisher, setActiveAuditPublisher] = useState(null)

  // Interactive Slider (MEI Tab)
  const [overlapDedupePct, setOverlapDedupePct] = useState(25)

  // Interactive Inputs (Planner Tab)
  const [targetEnrollments, setTargetEnrollments] = useState(400)
  const [targetCacLimit, setTargetCacLimit] = useState(25)

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    network: 'Google Ads',
    budget: 250,
    status: 'ACTIVE',
    startDate: new Date().toISOString().split('T')[0]
  })

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Active Recalculations (Stats Cards)
  const stats = useMemo(() => {
    const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0)
    const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0)
    const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0)
    const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0)
    const totalBudget = campaigns.reduce((acc, c) => (c.status === 'ACTIVE' ? acc + c.budget : acc), 0)

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const convRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0
    const avgCac = totalLeads > 0 ? totalSpend / totalLeads : 0

    const simulatedRevenue = totalLeads * 48
    const roi = totalSpend > 0 ? ((simulatedRevenue - totalSpend) / totalSpend) * 100 : 0

    return {
      totalSpend, totalLeads, totalClicks, totalImpressions, totalBudget, ctr, convRate, avgCac, roi
    }
  }, [campaigns])

  // Sparkline Chart trend simulation
  const chartData = useMemo(() => {
    if (activeChartTab === 'leads') {
      return [
        { date: 'Week 1', label: 'Conversions', value: Math.round(stats.totalLeads * 0.1), color: '#22c55e' },
        { date: 'Week 2', label: 'Conversions', value: Math.round(stats.totalLeads * 0.25), color: '#22c55e' },
        { date: 'Week 3', label: 'Conversions', value: Math.round(stats.totalLeads * 0.45), color: '#22c55e' },
        { date: 'Week 4', label: 'Conversions', value: Math.round(stats.totalLeads * 0.7), color: '#22c55e' },
        { date: 'Week 5', label: 'Conversions', value: stats.totalLeads, color: '#22c55e' }
      ]
    } else if (activeChartTab === 'spend') {
      return [
        { date: 'Week 1', label: 'Ad Spend', value: Math.round(stats.totalSpend * 0.15), color: '#3b82f6' },
        { date: 'Week 2', label: 'Ad Spend', value: Math.round(stats.totalSpend * 0.3), color: '#3b82f6' },
        { date: 'Week 3', label: 'Ad Spend', value: Math.round(stats.totalSpend * 0.5), color: '#3b82f6' },
        { date: 'Week 4', label: 'Ad Spend', value: Math.round(stats.totalSpend * 0.75), color: '#3b82f6' },
        { date: 'Week 5', label: 'Ad Spend', value: stats.totalSpend, color: '#3b82f6' }
      ]
    } else {
      return [
        { date: 'Week 1', label: 'Avg ROI', value: Math.round(stats.roi * 0.6), color: '#a855f7' },
        { date: 'Week 2', label: 'Avg ROI', value: Math.round(stats.roi * 0.75), color: '#a855f7' },
        { date: 'Week 3', label: 'Avg ROI', value: Math.round(stats.roi * 0.85), color: '#a855f7' },
        { date: 'Week 4', label: 'Avg ROI', value: Math.round(stats.roi * 0.95), color: '#a855f7' },
        { date: 'Week 5', label: 'Avg ROI', value: Math.round(stats.roi), color: '#a855f7' }
      ]
    }
  }, [stats, activeChartTab])

  // Budget Adjuster
  const handleBudgetChange = (id, newBudget) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const budgetFactor = newBudget / c.budget
        const orig = initialCampaignsList.find(x => x.id === id)
        return {
          ...c,
          budget: newBudget,
          spend: Math.round(orig.spend * budgetFactor),
          leads: Math.round(orig.leads * budgetFactor),
          clicks: Math.round(orig.clicks * budgetFactor),
          impressions: Math.round(orig.impressions * budgetFactor)
        }
      }
      return c
    }))
  }

  // Play/Pause
  const handleStatusToggle = (id) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const toggledStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
        triggerToast(`Campaign "${c.name}" budget distribution is ${toggledStatus.toLowerCase()}!`)
        return { ...c, status: toggledStatus }
      }
      return c
    }))
  }

  // Add Campaign Action
  const handleAddCampaign = (e) => {
    e.preventDefault()
    if (!newCampaign.name.trim()) return

    let icon = 'campaign'
    let color = 'bg-blue-600'
    let iconColor = 'text-blue-600'

    if (newCampaign.network.includes('Facebook')) {
      icon = 'campaign'
      color = 'bg-indigo-600'
      iconColor = 'text-indigo-600'
    } else if (newCampaign.network.includes('LinkedIn')) {
      icon = 'business'
      color = 'bg-sky-700'
      iconColor = 'text-sky-700'
    } else if (newCampaign.network.includes('Instagram')) {
      icon = 'photo_camera'
      color = 'bg-pink-600'
      iconColor = 'text-pink-600'
    } else if (newCampaign.network.includes('YouTube')) {
      icon = 'play_circle'
      color = 'bg-red-600'
      iconColor = 'text-red-600'
    } else if (newCampaign.network.includes('TikTok')) {
      icon = 'music_note'
      color = 'bg-slate-900'
      iconColor = 'text-slate-900'
    }

    const created = {
      id: campaigns.length + 1,
      name: newCampaign.name,
      network: newCampaign.network,
      icon, color, iconColor,
      budget: parseInt(newCampaign.budget) || 200,
      spend: 0, leads: 0, clicks: 0, impressions: 0,
      status: newCampaign.status,
      startDate: newCampaign.startDate
    }

    setCampaigns([...campaigns, created])
    setShowAddModal(false)
    setNewCampaign({
      name: '',
      network: 'Google Ads',
      budget: 250,
      status: 'ACTIVE',
      startDate: new Date().toISOString().split('T')[0]
    })
    triggerToast(`Marketing Campaign "${created.name}" created successfully!`)
  }

  // Sorting
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

  // Filter & Search Logic
  const filteredAndSortedCampaigns = useMemo(() => {
    return campaigns
      .filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesNetwork = selectedNetwork === 'ALL' || c.network === selectedNetwork
        const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus
        return matchesSearch && matchesNetwork && matchesStatus
      })
      .sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        if (sortConfig.key === 'cpl') {
          const aCpl = a.leads > 0 ? a.spend / a.leads : 0
          const bCpl = b.leads > 0 ? b.spend / b.leads : 0
          return sortConfig.direction === 'asc' ? aCpl - bCpl : bCpl - aCpl
        }

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      })
  }, [campaigns, searchTerm, selectedNetwork, selectedStatus, sortConfig])

  // Dynamic Date Filter Factor Math
  const filterFactor = useMemo(() => {
    if (activeDateFilter === '7') return 0.23
    if (activeDateFilter === '90') return 2.8
    if (activeDateFilter === 'ALL') return 4.5
    return 1.0 // 30 Days default
  }, [activeDateFilter])

  // Processed summary datasets
  const processedChannelData = useMemo(() => {
    return channelData.map(row => ({
      ...row,
      leadsCount: row.leadsCount * filterFactor,
      leadsMEI: row.leadsMEI * filterFactor,
      appsCount: row.appsCount * filterFactor,
      appsMEI: row.appsMEI * filterFactor,
      enrollCount: row.enrollCount * filterFactor
    }))
  }, [channelData, filterFactor])

  const processedDispData = useMemo(() => {
    return dispositionData.map(row => ({
      ...row,
      newLeads: row.newLeads * filterFactor,
      contacted: row.contacted * filterFactor,
      interested: row.interested * filterFactor,
      applied: row.applied * filterFactor,
      reviewed: row.reviewed * filterFactor,
      offered: row.offered * filterFactor,
      enrolled: row.enrolled * filterFactor
    }))
  }, [dispositionData, filterFactor])

  // Calculated totals block
  const totals = useMemo(() => {
    const leadsCount = processedChannelData.reduce((sum, r) => sum + r.leadsCount, 0)
    const appsCount = processedChannelData.reduce((sum, r) => sum + r.appsCount, 0)
    const enrollCount = processedChannelData.reduce((sum, r) => sum + r.enrollCount, 0)

    // Hardcoded weighted totals as in mockup when default factor
    const leadsVerifiedPct = 68
    const leadsVerifiedCount = processedChannelData.reduce((sum, r) => sum + (r.leadsCount * r.leadsVerifiedPct / 100), 0)
    const appsConversion = 34
    const enrollPct = 19

    return {
      leadsCount,
      leadsVerifiedPct,
      leadsVerifiedCount,
      appsCount,
      appsConversion,
      enrollCount,
      enrollPct
    }
  }, [processedChannelData])

  const dispTotals = useMemo(() => {
    return {
      newLeads: processedDispData.reduce((sum, r) => sum + r.newLeads, 0),
      contacted: processedDispData.reduce((sum, r) => sum + r.contacted, 0),
      interested: processedDispData.reduce((sum, r) => sum + r.interested, 0),
      applied: processedDispData.reduce((sum, r) => sum + r.applied, 0),
      reviewed: processedDispData.reduce((sum, r) => sum + r.reviewed, 0),
      offered: processedDispData.reduce((sum, r) => sum + r.offered, 0),
      enrolled: processedDispData.reduce((sum, r) => sum + r.enrolled, 0)
    }
  }, [processedDispData])

  // Tab 4: Planner logic - allocates Daily Budget dynamically based on target enrollments and CAC limit
  const plannerRecommendation = useMemo(() => {
    const totalTargetCost = targetEnrollments * targetCacLimit
    if (totalTargetCost <= 0) return []

    // Calculate CPVL allocation weights (lower Cost Per Verified Lead gets higher priority)
    const activePortals = publishers.map(p => {
      const score = 1 / p.cpvl // inverse weighting
      return { ...p, score }
    })
    const totalScore = activePortals.reduce((sum, p) => sum + p.score, 0)

    return activePortals.map(p => {
      const weight = totalScore > 0 ? p.score / totalScore : 0.2
      const allocatedDailyBudget = Math.round((totalTargetCost / 30) * weight)
      const expectedVerifiedLeads = Math.round((allocatedDailyBudget * 30) / p.cpvl)
      const expectedEnrollments = Math.round(expectedVerifiedLeads * (p.enrollments / p.verified))

      return {
        ...p,
        allocatedDailyBudget,
        expectedVerifiedLeads,
        expectedEnrollments
      }
    })
  }, [publishers, targetEnrollments, targetCacLimit])

  return (
    <div className="w-full relative h-full flex flex-col font-sans select-none bg-slate-50/50 p-6 space-y-6 overflow-y-auto">

      {/* Floating toast notification */}
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

      {/* TAB CONTENTS GRID */}
      <div className="w-full">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-2">

            {/* Dynamic sub-tab switcher toolbelt */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-xl border border-slate-200 px-4 py-2 shadow-2xs select-none">
              <div className="flex flex-wrap gap-4 lg:gap-6 border-b border-slate-100 pb-1 w-full lg:w-auto text-left">
                {[
                  { id: 'CHANNEL', label: 'Channel Summary' },
                  { id: 'DISPOSITION', label: 'Lead Disposition Summary' },
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setDashSubTab(sub.id)
                      triggerToast(`Switched view to ${sub.label}!`)
                    }}
                    className={`pb-2 text-[12.5px] font-extrabold transition-all relative cursor-pointer ${dashSubTab === sub.id ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    {sub.label}
                    {dashSubTab === sub.id && (
                      <motion.div layoutId="activeSubTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 w-full lg:w-auto">
                {/* % vs # Toggle switches */}
                {(dashSubTab === 'CHANNEL' || dashSubTab === 'DISPOSITION') && (
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 shadow-2xs select-none">
                    <button
                      onClick={() => {
                        setUnitToggle('PCT')
                        triggerToast('Displaying conversion rates in percentage (%)!')
                      }}
                      className={`w-9 h-7 rounded-md text-[11px] font-black transition-all cursor-pointer flex items-center justify-center ${unitToggle === 'PCT' ? 'bg-primary text-white shadow-2xs font-black' : 'text-slate-500 hover:text-slate-750'
                        }`}
                    >
                      %
                    </button>
                    <button
                      onClick={() => {
                        setUnitToggle('NUM')
                        triggerToast('Displaying absolute lead metrics (#)!')
                      }}
                      className={`w-9 h-7 rounded-md text-[11px] font-black transition-all cursor-pointer flex items-center justify-center ${unitToggle === 'NUM' ? 'bg-primary text-white shadow-2xs font-black' : 'text-slate-500 hover:text-slate-750'
                        }`}
                    >
                      #
                    </button>
                  </div>
                )}

                {/* Simulated Download button */}
                <ExportButton triggerToast={triggerToast} />

                {/* Simulated Filter button */}
                <button
                  onClick={() => setShowFilterDrawer(true)}
                  className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer shadow-2xs bg-white"
                  title="Filter Summary"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                </button>
              </div>
            </div>

            {/* DYNAMIC DASHBOARD SUB-TAB VIEWS */}
            {dashSubTab === 'CHANNEL' && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs text-left">
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-[950px] border-collapse">
                    <thead>
                      {/* Level 1 Group Headers */}
                      <tr className="border-b border-slate-200 text-[11px] font-black text-slate-800 uppercase tracking-wider text-center select-none bg-slate-50">
                        <th className="px-4 py-3.5 bg-slate-50/80 border-r border-slate-200 text-left w-48 font-black">Traffic Channel</th>
                        <th colSpan="3" className="px-4 py-3 bg-blue-50 border-r border-slate-200 text-center font-black text-blue-950">Lead</th>
                        <th colSpan="3" className="px-4 py-3 bg-blue-50 border-r border-slate-200 text-center font-black text-blue-950">Paid Applications</th>
                        <th colSpan="2" className="px-4 py-3 bg-blue-50 text-center font-black text-rose-950">Enrollments</th>
                      </tr>
                      {/* Level 2 Sub-Headers */}
                      <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center select-none bg-slate-50/50">
                        <th className="px-4 py-2 bg-slate-50/30 border-r border-slate-200 text-left">Channel Source</th>
                        <th className="px-4 py-2 bg-slate-100/60 border-r border-slate-150 w-24">Count</th>
                        <th className="px-4 py-2 bg-slate-100/60 border-r border-slate-150 w-24">Verified</th>
                        <th className="px-4 py-2 bg-slate-100/60 border-r border-slate-200 w-24">MEI</th>
                        <th className="px-4 py-2 bg-slate-100/60 border-r border-slate-150 w-24">Count</th>
                        <th className="px-4 py-2 bg-slate-100/60 border-r border-slate-150 w-28">Conversion</th>
                        <th className="px-4 py-2 bg-slate-100/60 border-r border-slate-200 w-24">MEI</th>
                        <th className="px-4 py-2 bg-slate-100/60 border-r border-slate-150 w-24">Count</th>
                        <th className="px-4 py-2 bg-slate-100/60 w-24">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-sans text-[12.5px]">
                      {processedChannelData.map((row) => {
                        const verifiedCount = Math.round(row.leadsCount * row.leadsVerifiedPct / 100)
                        return (
                          <tr key={row.channel} className="hover:bg-blue-50/10 transition-colors">
                            <td className="px-4 py-3 font-bold text-slate-800 border-r border-slate-200 flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${row.channel === 'Direct' ? 'bg-blue-500 shadow-xs' :
                                row.channel === 'Paid Ads' ? 'bg-indigo-500 shadow-xs' :
                                  row.channel === 'Publishers' ? 'bg-amber-500 shadow-xs' :
                                    row.channel === 'Social' ? 'bg-pink-500 shadow-xs' :
                                      row.channel === 'Organic' ? 'bg-green-500 shadow-xs' :
                                        row.channel === 'Offline' ? 'bg-slate-500 shadow-xs' :
                                          row.channel === 'Telephony' ? 'bg-teal-500 shadow-xs' : 'bg-purple-500 shadow-xs'
                                }`} />
                              {row.channel}
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-slate-800 border-r border-slate-150 text-center">{Math.round(row.leadsCount).toLocaleString()}</td>
                            <td className="px-4 py-3 font-mono font-bold border-r border-slate-150 text-center text-slate-700">
                              {unitToggle === 'PCT' ? `${row.leadsVerifiedPct.toFixed(row.leadsVerifiedPct % 1 === 0 ? 0 : 1)}%` : verifiedCount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-slate-600 border-r border-slate-200 text-center">{Math.round(row.leadsMEI).toLocaleString()}</td>
                            <td className="px-4 py-3 font-mono font-bold text-slate-800 border-r border-slate-150 text-center">{Math.round(row.appsCount).toLocaleString()}</td>
                            <td className="px-4 py-3 font-mono font-bold border-r border-slate-150 text-center text-slate-700">
                              {unitToggle === 'PCT' ? `${row.appsConversion.toFixed(row.appsConversion % 1 === 0 ? 0 : 1)}%` : Math.round(row.appsCount).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-slate-600 border-r border-slate-200 text-center">{Math.round(row.appsMEI).toLocaleString()}</td>
                            <td className="px-4 py-3 font-mono font-bold text-slate-800 border-r border-slate-150 text-center">{Math.round(row.enrollCount).toLocaleString()}</td>
                            <td className="px-4 py-3 font-mono font-bold text-center text-slate-700">
                              {unitToggle === 'PCT' ? `${row.enrollPct.toFixed(row.enrollPct % 1 === 0 ? 0 : 1)}%` : Math.round(row.enrollCount).toLocaleString()}
                            </td>
                          </tr>
                        )
                      })}
                      {/* TOTAL ROW (Exactly like user's reference mockup) */}
                      <tr className="bg-slate-50/80 font-black text-slate-900 border-t border-slate-250">
                        <td className="px-4 py-3.5 border-r border-slate-200 font-black text-[13px] text-slate-850">Total</td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-center text-[13px]">{Math.round(totals.leadsCount).toLocaleString()}</td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-center text-[13px]">
                          {unitToggle === 'PCT' ? `${totals.leadsVerifiedPct}%` : Math.round(totals.leadsVerifiedCount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-200 text-center text-slate-400 font-normal">-</td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-center text-[13px]">{Math.round(totals.appsCount).toLocaleString()}</td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-center text-[13px]">
                          {unitToggle === 'PCT' ? `${totals.appsConversion}%` : Math.round(totals.appsCount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-200 text-center text-slate-400 font-normal">-</td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-center text-[13px]">{Math.round(totals.enrollCount).toLocaleString()}</td>
                        <td className="px-4 py-3.5 font-mono text-center text-[13px]">
                          {unitToggle === 'PCT' ? `${totals.enrollPct}%` : Math.round(totals.enrollCount).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {dashSubTab === 'DISPOSITION' && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs text-left">
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-[950px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-800 uppercase tracking-wider text-center select-none bg-slate-50">
                        <th className="px-4 py-3.5 border-r border-slate-200 text-left w-48 font-black">Traffic Channel</th>
                        <th className="px-4 py-3.5 border-r border-slate-150 w-24">New Leads</th>
                        <th className="px-4 py-3.5 border-r border-slate-150 w-28">Contacted / Spoke</th>
                        <th className="px-4 py-3.5 border-r border-slate-150 w-28">Interested</th>
                        <th className="px-4 py-3.5 border-r border-slate-150 w-28">Applied</th>
                        <th className="px-4 py-3.5 border-r border-slate-150 w-28">Under Review</th>
                        <th className="px-4 py-3.5 border-r border-slate-150 w-24">Offered</th>
                        <th className="px-4 py-3.5 w-24">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-sans text-[12.5px] text-center">
                      {processedDispData.map((row) => {
                        const channelLeads = processedChannelData.find(c => c.channel === row.channel)?.leadsCount || 1
                        return (
                          <tr key={row.channel} className="hover:bg-rose-50/10 transition-colors">
                            <td className="px-4 py-3 font-bold text-slate-800 border-r border-slate-200 text-left flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${row.channel === 'Direct' ? 'bg-blue-500 shadow-xs' :
                                row.channel === 'Paid Ads' ? 'bg-indigo-500 shadow-xs' :
                                  row.channel === 'Publishers' ? 'bg-amber-500 shadow-xs' :
                                    row.channel === 'Social' ? 'bg-pink-500 shadow-xs' :
                                      row.channel === 'Organic' ? 'bg-green-500 shadow-xs' :
                                        row.channel === 'Offline' ? 'bg-slate-500 shadow-xs' :
                                          row.channel === 'Telephony' ? 'bg-teal-500 shadow-xs' : 'bg-purple-500 shadow-xs'
                                }`} />
                              {row.channel}
                            </td>
                            <td className="px-4 py-3 font-mono border-r border-slate-150 text-slate-700">
                              {unitToggle === 'PCT' ? `${(row.newLeads / channelLeads * 100).toFixed(1)}%` : Math.round(row.newLeads).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono border-r border-slate-150 text-slate-700">
                              {unitToggle === 'PCT' ? `${(row.contacted / channelLeads * 100).toFixed(1)}%` : Math.round(row.contacted).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono border-r border-slate-150 text-slate-700">
                              {unitToggle === 'PCT' ? `${(row.interested / channelLeads * 100).toFixed(1)}%` : Math.round(row.interested).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono border-r border-slate-150 text-slate-700">
                              {unitToggle === 'PCT' ? `${(row.applied / channelLeads * 100).toFixed(1)}%` : Math.round(row.applied).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono border-r border-slate-150 text-slate-700">
                              {unitToggle === 'PCT' ? `${(row.reviewed / channelLeads * 100).toFixed(1)}%` : Math.round(row.reviewed).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono border-r border-slate-150 text-slate-700">
                              {unitToggle === 'PCT' ? `${(row.offered / channelLeads * 100).toFixed(1)}%` : Math.round(row.offered).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono font-extrabold text-blue-600 text-center">
                              {unitToggle === 'PCT' ? `${(row.enrolled / channelLeads * 100).toFixed(1)}%` : Math.round(row.enrolled).toLocaleString()}
                            </td>
                          </tr>
                        )
                      })}
                      {/* TOTAL ROW */}
                      <tr className="bg-slate-50/80 font-black text-slate-900 border-t border-slate-250">
                        <td className="px-4 py-3.5 border-r border-slate-200 text-left font-black text-[13px] text-slate-850">Total</td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-[13px]">
                          {unitToggle === 'PCT' ? `${(dispTotals.newLeads / totals.leadsCount * 100).toFixed(1)}%` : Math.round(dispTotals.newLeads).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-[13px]">
                          {unitToggle === 'PCT' ? `${(dispTotals.contacted / totals.leadsCount * 100).toFixed(1)}%` : Math.round(dispTotals.contacted).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-[13px]">
                          {unitToggle === 'PCT' ? `${(dispTotals.interested / totals.leadsCount * 100).toFixed(1)}%` : Math.round(dispTotals.interested).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-[13px]">
                          {unitToggle === 'PCT' ? `${(dispTotals.applied / totals.leadsCount * 100).toFixed(1)}%` : Math.round(dispTotals.applied).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-[13px]">
                          {unitToggle === 'PCT' ? `${(dispTotals.reviewed / totals.leadsCount * 100).toFixed(1)}%` : Math.round(dispTotals.reviewed).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-mono border-r border-slate-150 text-[13px]">
                          {unitToggle === 'PCT' ? `${(dispTotals.offered / totals.leadsCount * 100).toFixed(1)}%` : Math.round(dispTotals.offered).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-mono font-extrabold text-blue-600 text-[13px]">
                          {unitToggle === 'PCT' ? `${(dispTotals.enrolled / totals.leadsCount * 100).toFixed(1)}%` : Math.round(dispTotals.enrolled).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {dashSubTab === 'BUDGETS' && (
              <>
                {/* Sparkline & Filters section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
                  <div className="col-span-1 lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-2xs relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 select-none">
                      <div className="text-left">
                        <h3 className="text-sm font-extrabold text-slate-800">Campaign Growth Sparkline</h3>
                        <p className="text-[10.5px] text-slate-400 font-medium">30-day marketing attribution snapshot.</p>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                        {[
                          { id: 'leads', label: 'Leads Ingested' },
                          { id: 'spend', label: 'Ad Spend' },
                          { id: 'roi', label: 'ROI Growth' }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveChartTab(tab.id)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${activeChartTab === tab.id ? 'bg-white shadow-2xs border border-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-700'}`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 min-h-[140px] w-full relative flex items-end pt-3">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="gradient-leads" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" /></linearGradient>
                          <linearGradient id="gradient-spend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" /></linearGradient>
                          <linearGradient id="gradient-roi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" /><stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" /></linearGradient>
                        </defs>
                        <line x1="0" y1="20" x2="500" y2="20" className="stroke-slate-100" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="0" y1="50" x2="500" y2="50" className="stroke-slate-100" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="0" y1="80" x2="500" y2="80" className="stroke-slate-100" strokeWidth="1" strokeDasharray="3 3" />
                        <path
                          d="M 0 100 L 0 85 C 100 75, 125 55, 250 48 C 375 42, 400 20, 500 12 L 500 100 Z"
                          fill={activeChartTab === 'leads' ? 'url(#gradient-leads)' : activeChartTab === 'spend' ? 'url(#gradient-spend)' : 'url(#gradient-roi)'}
                          className="transition-all duration-500 ease-in-out"
                        />
                        <path
                          d="M 0 85 C 100 75, 125 55, 250 48 C 375 42, 400 20, 500 12"
                          fill="none"
                          stroke={activeChartTab === 'leads' ? '#22c55e' : activeChartTab === 'spend' ? '#3b82f6' : '#a855f7'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-in-out"
                        />
                        {[
                          { cx: 0, cy: 85 }, { cx: 125, cy: 73 }, { cx: 250, cy: 48 }, { cx: 375, cy: 30 }, { cx: 500, cy: 12 }
                        ].map((dot, idx) => (
                          <circle
                            key={idx}
                            cx={dot.cx}
                            cy={dot.cy}
                            r={hoveredChartIndex === idx ? '6' : '3.5'}
                            fill={activeChartTab === 'leads' ? '#22c55e' : activeChartTab === 'spend' ? '#3b82f6' : '#a855f7'}
                            className="stroke-white transition-all cursor-pointer"
                            strokeWidth="1.5"
                            onMouseEnter={() => setHoveredChartIndex(idx)}
                            onMouseLeave={() => setHoveredChartIndex(null)}
                          />
                        ))}
                      </svg>
                      <AnimatePresence>
                        {hoveredChartIndex !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute p-2 bg-slate-900 text-white rounded shadow-md text-[10px] font-sans font-extrabold z-10 pointer-events-none text-left"
                            style={{ left: `${(hoveredChartIndex / 4) * 85 + 4}%`, bottom: '80px' }}
                          >
                            <p className="text-slate-400 uppercase tracking-wider text-[8px]">{chartData[hoveredChartIndex].date} Trend</p>
                            <p className="mt-0.5">{chartData[hoveredChartIndex].label}: <span className="text-white">{activeChartTab === 'spend' ? '$' : ''}{chartData[hoveredChartIndex].value.toLocaleString()}{activeChartTab === 'roi' ? '%' : ''}</span></p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Filters Panel */}
                  <div className="col-span-1 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-2xs text-left select-none">
                    <div className="space-y-4">
                      <h3 className="text-sm font-extrabold text-slate-800">Dynamic Grid Filters</h3>
                      <div className="relative">
                        <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">search</span>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search campaigns by name..."
                          className="w-full h-8 pl-9 pr-3 border border-slate-200 rounded bg-slate-50 text-[11px] outline-none focus:bg-white focus:border-primary transition-all font-sans font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">Attributed Ad Network</label>
                        <select
                          value={selectedNetwork}
                          onChange={(e) => setSelectedNetwork(e.target.value)}
                          className="w-full h-8 px-2 border border-slate-200 rounded bg-slate-50 text-[11px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <option value="ALL">All Network Outlets</option>
                          <option value="Google Ads">Google Ads</option>
                          <option value="Facebook">Facebook</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Instagram">Instagram</option>
                          <option value="YouTube">YouTube</option>
                          <option value="TikTok">TikTok</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">Distribution Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full h-8 px-2 border border-slate-200 rounded bg-slate-50 text-[11px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <option value="ALL">All Status Allocations</option>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="PAUSED">PAUSED</option>
                          <option value="DRAFT">DRAFT</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSearchTerm(''); setSelectedNetwork('ALL'); setSelectedStatus('ALL'); setSortConfig({ key: 'spend', direction: 'desc' }); }}
                      className="w-full h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer mt-4 select-none"
                    >
                      Reset Ingest Filters
                    </button>
                  </div>
                </div>

                {/* Campaign Table grid wrapper */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-visible shadow-2xs text-left">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[900px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50 text-[11.5px] font-bold text-slate-500 uppercase tracking-wider select-none">
                          <th className="px-5 py-3 text-left w-16">Active</th>
                          <th onClick={() => requestSort('name')} className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none">
                            <div className="flex items-center">Campaign Details {renderSortIndicator('name')}</div>
                          </th>
                          <th onClick={() => requestSort('budget')} className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none w-48">
                            <div className="flex items-center">Daily Budget Limit {renderSortIndicator('budget')}</div>
                          </th>
                          <th onClick={() => requestSort('spend')} className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none">
                            <div className="flex items-center">Ad Spend {renderSortIndicator('spend')}</div>
                          </th>
                          <th onClick={() => requestSort('leads')} className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none">
                            <div className="flex items-center">Leads Ingested {renderSortIndicator('leads')}</div>
                          </th>
                          <th onClick={() => requestSort('cpl')} className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none">
                            <div className="flex items-center">Avg CPL {renderSortIndicator('cpl')}</div>
                          </th>
                          <th className="px-5 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        <AnimatePresence>
                          {filteredAndSortedCampaigns.map((c) => {
                            const cpl = c.leads > 0 ? c.spend / c.leads : 0
                            return (
                              <motion.tr key={c.id} className="text-[12.5px] hover:bg-slate-50/40 transition-colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <td className="px-5 py-3 select-none">
                                  <button
                                    onClick={() => handleStatusToggle(c.id)}
                                    className={`w-8 h-4 rounded-full relative transition-all duration-300 ${c.status === 'ACTIVE' ? 'bg-primary' : 'bg-slate-200'} cursor-pointer`}
                                  >
                                    <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.25 shadow-xs transition-transform duration-300 ${c.status === 'ACTIVE' ? 'translate-x-[15px]' : 'translate-x-[1.5px]'}`} />
                                  </button>
                                </td>
                                <td className="px-5 py-3 font-sans">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${c.color} text-white flex items-center justify-center flex-shrink-0 shadow-2xs`}><span className="material-symbols-outlined text-[16px]">{c.icon}</span></div>
                                    <div className="overflow-hidden">
                                      <span className="font-bold text-slate-800 truncate block hover:underline cursor-pointer">{c.name}</span>
                                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5 tracking-wider uppercase">{c.network} • Started {c.startDate}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3 select-none">
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[10.5px]"><span className="font-extrabold text-slate-850 font-mono">${c.budget}/day</span></div>
                                    <input type="range" min="50" max="1000" step="25" value={c.budget} onChange={(e) => handleBudgetChange(c.id, parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary" />
                                  </div>
                                </td>
                                <td className="px-5 py-3 font-mono font-bold text-slate-700">${c.spend.toLocaleString()}</td>
                                <td className="px-5 py-3 font-mono font-extrabold text-slate-800">{c.leads.toLocaleString()}</td>
                                <td className="px-5 py-3 font-mono font-bold text-slate-700">${cpl.toFixed(2)}</td>
                                <td className="px-5 py-3 select-none">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border ${c.status === 'ACTIVE' ? 'bg-green-50 border-green-200 text-green-700' : c.status === 'PAUSED' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>{c.status}</span>
                                </td>
                              </motion.tr>
                            )
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'PUBLISHER' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-left shadow-2xs">
              <h2 className="text-[15px] font-bold text-slate-800">Higher Education Admissions Publisher Panel</h2>
              <p className="text-[11px] text-slate-400 mt-1">Vetting and attribution audit metrics for marketing publishers based on cost per verified lead (CPVL).</p>
            </div>

            {/* Publishers table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs text-left">
              <table className="w-full min-w-[850px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                    <th className="px-5 py-3 text-left">Publisher Name</th>
                    <th className="px-5 py-3 text-left">Inflow Channel</th>
                    <th className="px-5 py-3 text-left">Raw Ingestion</th>
                    <th className="px-5 py-3 text-left">Quality Verified Leads</th>
                    <th className="px-5 py-3 text-left">Primary Verified Leads</th>
                    <th className="px-5 py-3 text-left">Total Spend</th>
                    <th className="px-5 py-3 text-left">CPVL Attributed</th>
                    <th className="px-5 py-3 text-center">Quality Verification Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-[12.5px] font-sans">
                  {publishers.map((p) => {
                    const verificationRate = p.leads > 0 ? (p.verified / p.leads) * 100 : 0
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-5 py-3">
                          <span className="font-bold text-slate-800">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5 tracking-wider uppercase">ID: {p.id}</span>
                        </td>
                        <td className="px-5 py-3 text-slate-600 font-semibold">{p.source}</td>
                        <td className="px-5 py-3 font-mono font-semibold text-slate-700">{p.leads}</td>
                        <td className="px-5 py-3">
                          <div className="space-y-1">
                            <span className="font-mono font-extrabold text-slate-800">{p.verified}</span>
                            <div className="flex items-center gap-1.5">
                              <div className="h-1 bg-slate-100 rounded-full w-20 overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${verificationRate}%` }} />
                              </div>
                              <span className="text-[9.5px] font-bold text-green-600">{verificationRate.toFixed(0)}% verified</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono font-bold text-blue-600">{p.primaryVerified}</td>
                        <td className="px-5 py-3 font-mono text-slate-600 font-semibold">${p.spend.toLocaleString()}</td>
                        <td className="px-5 py-3 font-mono font-bold text-slate-850 bg-slate-50/30 px-2 py-1 rounded inline-block mt-2 border border-slate-200/50">${p.cpvl.toFixed(2)}</td>
                        <td className="px-5 py-3 text-center select-none">
                          <button
                            onClick={() => setActiveAuditPublisher(p)}
                            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px]">verified_user</span>
                            Audit Logs
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'MEI' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-left shadow-2xs space-y-4">
              <h2 className="text-[15px] font-bold text-slate-800">Mutually Exclusive Impact (MEI) Stage Overlap</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Due to cross-portal search overlaps, applicants often visit multiple directories (e.g. Shiksha, CollegeDunia) before secured enrollments.
                Use this dashboard to evaluate the Mutually Exclusive Impact of lead networks across different stages of your admission funnel.
              </p>

              {/* Dedupe controller slider */}
              <div className="bg-slate-50 border border-slate-250 rounded-xl p-4 max-w-xl select-none text-left space-y-2">
                <div className="flex justify-between items-center text-[11.5px] font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">filter_alt</span>
                    De-duplication Overlap Reduction Level
                  </span>
                  <span className="font-mono text-primary font-extrabold text-[12px]">{overlapDedupePct}% deduplicated</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={overlapDedupePct}
                  onChange={(e) => setOverlapDedupePct(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[9.5px] text-slate-400 font-medium">Higher values represent strict rules attributing the final conversion to the primary verification publisher source.</p>
              </div>
            </div>

            {/* Funnel Overlaps grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { stage: 'Inquiry Stage', total: 4860, unique: Math.round(4860 * (1 - overlapDedupePct / 200)), color: 'bg-blue-600', text: 'text-blue-600' },
                { stage: 'Profile Verified', total: 3670, unique: Math.round(3670 * (1 - overlapDedupePct / 180)), color: 'bg-indigo-600', text: 'text-indigo-600' },
                { stage: 'Application Filled', total: 2190, unique: Math.round(2190 * (1 - overlapDedupePct / 160)), color: 'bg-teal-600', text: 'text-teal-600' },
                { stage: 'Fees Payment', total: 1150, unique: Math.round(1150 * (1 - overlapDedupePct / 140)), color: 'bg-purple-600', text: 'text-purple-600' },
                { stage: 'Enrollment secured', total: 188, unique: Math.round(188 * (1 - overlapDedupePct / 120)), color: 'bg-green-600', text: 'text-green-600' }
              ].map((item, idx) => {
                const overlap = item.total - item.unique
                const uniquePct = (item.unique / item.total) * 100
                const overlapPct = 100 - uniquePct

                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs text-left">
                    <div>
                      <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">{item.stage}</span>
                      <h4 className="text-[15px] font-extrabold text-slate-800 mt-1 leading-none">{item.total.toLocaleString()} leads</h4>
                    </div>

                    <div className="my-4 space-y-2 select-none">
                      <div className="h-6 flex rounded overflow-hidden text-[9px] font-bold text-white text-center">
                        <div className={`${item.color} flex items-center justify-center transition-all`} style={{ width: `${uniquePct}%` }} title="Unique Impact">
                          {uniquePct.toFixed(0)}% U
                        </div>
                        <div className="bg-amber-500 flex items-center justify-center transition-all" style={{ width: `${overlapPct}%` }} title="Shared Overlap">
                          {overlapPct > 0 ? `${overlapPct.toFixed(0)}% O` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] font-medium font-sans text-slate-500">
                      <div className="flex justify-between"><span>Unique Attributed:</span><strong className="text-slate-850 font-mono">{item.unique.toLocaleString()}</strong></div>
                      <div className="flex justify-between text-amber-600"><span>Shared Overlap:</span><strong className="font-mono">{overlap.toLocaleString()}</strong></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'PLANNER' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-left shadow-2xs space-y-4">
              <h2 className="text-[15px] font-bold text-slate-800">Smart Enrollment & Daily Budget Allocation Planner</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Input your student admission targets and CAC limits below. The smart system will parse the active daily publisher metrics and Cost Per Verified Lead to calculate and allocate optimal resources.
              </p>

              {/* Calculator sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl select-none">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center text-[12px] font-bold text-slate-700">
                    <span>Target Secured Enrollments</span>
                    <span className="font-mono text-primary text-[13px] font-extrabold">{targetEnrollments} students</span>
                  </div>
                  <input
                    type="range" min="50" max="2000" step="50" value={targetEnrollments}
                    onChange={(e) => setTargetEnrollments(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center text-[12px] font-bold text-slate-700">
                    <span>Target Cost Per Acquisition (CAC Limit)</span>
                    <span className="font-mono text-primary text-[13px] font-extrabold">${targetCacLimit} / student</span>
                  </div>
                  <input
                    type="range" min="10" max="100" step="5" value={targetCacLimit}
                    onChange={(e) => setTargetCacLimit(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Smart allocations outcome */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-800 text-left select-none flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-slate-400">insights</span>
                Algorithmic Recommendations
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {plannerRecommendation.map((rec) => (
                  <div key={rec.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow text-left">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{rec.source}</span>
                      <h4 className="text-[13px] font-bold text-slate-800 mt-1 leading-tight">{rec.name}</h4>
                    </div>

                    <div className="my-4 p-3 bg-blue-50/30 border border-blue-100/50 rounded-lg select-none">
                      <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Recommended Allocation</span>
                      <strong className="text-[16px] font-extrabold text-blue-700 font-mono">${rec.allocatedDailyBudget}/day</strong>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-medium font-sans text-slate-500">
                      <div className="flex justify-between"><span>Expected Quality Leads:</span><strong className="text-slate-800 font-mono">+{rec.expectedVerifiedLeads}/mo</strong></div>
                      <div className="flex justify-between"><span>Expected Enrollments:</span><strong className="text-green-600 font-mono">+{rec.expectedEnrollments}</strong></div>
                      <div className="flex justify-between"><span>Publisher CPVL:</span><strong className="text-slate-800 font-mono">${rec.cpvl.toFixed(2)}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW AD CAMPAIGN INTERACTIVE SLIDER MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 select-none" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-text"
            >
              <form onSubmit={handleAddCampaign} className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center select-none">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px] text-primary">add_circle</span>Create Ad Campaign</h3>
                  <button type="button" onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">close</span></button>
                </div>
                <div className="p-5 space-y-4 text-left">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Campaign Title *</label>
                    <input type="text" required value={newCampaign.name} onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} placeholder="e.g. Q3 Google Search - Brand Keywords" className="w-full h-8 px-2.5 border border-slate-200 rounded bg-slate-50 text-[11.5px] outline-none focus:bg-white focus:border-primary font-sans font-medium" />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Ad Network Outlet *</label>
                    <select value={newCampaign.network} onChange={(e) => setNewCampaign({ ...newCampaign, network: e.target.value })} className="w-full h-8 px-2.5 border border-slate-200 rounded bg-slate-50 text-[11.5px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                      <option value="Google Ads">Google Ads (Search)</option>
                      <option value="Facebook">Facebook (Retargeting)</option>
                      <option value="LinkedIn">LinkedIn (Enterprise)</option>
                      <option value="Instagram">Instagram (Lead Gen Form)</option>
                      <option value="YouTube">YouTube (Ad Sponsor)</option>
                      <option value="TikTok">TikTok (Spark Video)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Daily Budget Limit *</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="50" max="1000" step="25" value={newCampaign.budget} onChange={(e) => setNewCampaign({ ...newCampaign, budget: parseInt(e.target.value) })} className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary" />
                      <span className="font-extrabold text-[12px] text-slate-750 font-mono w-16 text-right">${newCampaign.budget}/day</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Initial Status</label>
                    <select value={newCampaign.status} onChange={(e) => setNewCampaign({ ...newCampaign, status: e.target.value })} className="w-full h-8 px-2.5 border border-slate-200 rounded bg-slate-50 text-[11.5px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PAUSED">PAUSED</option>
                      <option value="DRAFT">DRAFT</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Launch Date</label>
                    <input type="date" value={newCampaign.startDate} onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })} className="w-full h-8 px-2.5 border border-slate-200 rounded bg-slate-50 text-[11.5px] outline-none focus:bg-white focus:border-primary font-sans font-medium" />
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5 select-none">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-250 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-bold transition-all cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer shadow-sm">Publish Campaign</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AUDIT LOGS MODAL (PUBLISHER TAB) */}
      <AnimatePresence>
        {activeAuditPublisher && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveAuditPublisher(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 select-none" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-text"
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center select-none">
                  <div className="text-left">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">verified_user</span>
                      Attributed Verification Logs
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold block tracking-wider uppercase mt-0.5">{activeAuditPublisher.name} • CPVL: ${activeAuditPublisher.cpvl.toFixed(2)}</p>
                  </div>
                  <button type="button" onClick={() => setActiveAuditPublisher(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">close</span></button>
                </div>
                <div className="p-5 overflow-y-auto space-y-3.5 text-left flex-1">
                  {mockAuditorLogs[activeAuditPublisher.id] && mockAuditorLogs[activeAuditPublisher.id].length > 0 ? (
                    mockAuditorLogs[activeAuditPublisher.id].map((log, idx) => (
                      <div key={idx} className="border border-slate-150 p-3 rounded-xl bg-slate-50/30 flex items-start gap-3">
                        <span className={`material-symbols-outlined text-[18px] mt-0.5 ${log.status === 'VERIFIED' ? 'text-green-500' : 'text-red-500'}`}>
                          {log.status === 'VERIFIED' ? 'check_circle' : 'cancel'}
                        </span>
                        <div className="font-sans flex-1">
                          <div className="flex justify-between items-center text-[10.5px]">
                            <strong className="text-slate-800 font-bold">{log.type}</strong>
                            <span className="text-slate-400 font-mono">{log.time} • IP: {log.ip}</span>
                          </div>
                          <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">{log.detail}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center select-none">
                      <span className="material-symbols-outlined text-[30px] text-slate-400">sentiment_neutral</span>
                      <p className="text-[12px] font-bold text-slate-600 mt-1">No auditor logs recorded for this publisher.</p>
                    </div>
                  )}
                </div>
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end select-none">
                  <button onClick={() => setActiveAuditPublisher(null)} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11.5px] font-bold transition-all cursor-pointer">Dismiss Audit</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Date Filter Drawer Modal */}
      <AnimatePresence>
        {showFilterDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterDrawer(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 select-none cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl z-50 p-6 flex flex-col justify-between font-sans text-left"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px] text-rose-600">filter_alt</span>
                    Filter Data Summary
                  </h3>
                  <button
                    onClick={() => setShowFilterDrawer(false)}
                    className="p-1 hover:bg-slate-150 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider select-none">
                    Performance Date Range
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: '7', label: 'Last 7 Days', desc: 'Recent lead acquisitions' },
                      { id: '30', label: 'Last 30 Days (Default)', desc: 'Standard monthly benchmark' },
                      { id: '90', label: 'Last 90 Days', desc: 'Quarterly campaigns cycle' },
                      { id: 'ALL', label: 'Year to Date (All Time)', desc: 'All campaigns summary' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveDateFilter(item.id)
                          triggerToast(`Attributed metrics updated for ${item.label}!`)
                        }}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col ${activeDateFilter === item.id
                          ? 'border-rose-600 bg-rose-50/50 text-rose-950 font-bold ring-1 ring-rose-600/30'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                      >
                        <span className="text-[12px] font-bold block">{item.label}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 font-medium block">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer text-center"
                >
                  Apply & Close Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
