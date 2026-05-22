import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const initialCampaignsList = [
  {
    id: 1,
    name: 'Google Search - Brand Keywords',
    network: 'Google Ads',
    icon: 'search',
    color: 'bg-blue-600',
    iconColor: 'text-blue-600',
    budget: 400,
    spend: 18500,
    leads: 1650,
    clicks: 19800,
    impressions: 540000,
    status: 'ACTIVE',
    startDate: '2026-04-01'
  },
  {
    id: 2,
    name: 'Facebook Retargeting Ads',
    network: 'Facebook',
    icon: 'campaign',
    color: 'bg-indigo-600',
    iconColor: 'text-indigo-600',
    budget: 250,
    spend: 12400,
    leads: 1120,
    clicks: 14500,
    impressions: 420000,
    status: 'ACTIVE',
    startDate: '2026-04-05'
  },
  {
    id: 3,
    name: 'LinkedIn B2B Enterprise Outreach',
    network: 'LinkedIn',
    icon: 'business',
    color: 'bg-sky-700',
    iconColor: 'text-sky-700',
    budget: 150,
    spend: 8200,
    leads: 320,
    clicks: 4800,
    impressions: 110000,
    status: 'ACTIVE',
    startDate: '2026-04-10'
  },
  {
    id: 4,
    name: 'Instagram Lead Gen Forms',
    network: 'Instagram',
    icon: 'photo_camera',
    color: 'bg-pink-600',
    iconColor: 'text-pink-600',
    budget: 100,
    spend: 5100,
    leads: 490,
    clicks: 5200,
    impressions: 180000,
    status: 'PAUSED',
    startDate: '2026-04-12'
  },
  {
    id: 5,
    name: 'YouTube Tech Reviews Sponsorship',
    network: 'YouTube',
    icon: 'play_circle',
    color: 'bg-red-600',
    iconColor: 'text-red-600',
    budget: 200,
    spend: 4050,
    leads: 240,
    clicks: 3100,
    impressions: 95000,
    status: 'PAUSED',
    startDate: '2026-04-15'
  },
  {
    id: 6,
    name: 'TikTok Video Spark Ads',
    network: 'TikTok',
    icon: 'music_note',
    color: 'bg-slate-900',
    iconColor: 'text-slate-900',
    budget: 120,
    spend: 0,
    leads: 0,
    clicks: 0,
    impressions: 0,
    status: 'DRAFT',
    startDate: '2026-05-01'
  }
]

export default function Campaigns() {
  const navigate = useNavigate()
  
  // Campaigns list state
  const [campaigns, setCampaigns] = useState(initialCampaignsList)
  
  // Search, filter, sorting configurations
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [sortConfig, setSortConfig] = useState({ key: 'spend', direction: 'desc' })
  const [activeChartTab, setActiveChartTab] = useState('leads')
  const [hoveredChartIndex, setHoveredChartIndex] = useState(null)
  
  // Toast & Modals
  const [toastMsg, setToastMsg] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    network: 'Google Ads',
    budget: 250,
    status: 'ACTIVE',
    startDate: new Date().toISOString().split('T')[0]
  })

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg(null)
    }, 3000)
  }

  // Active Live Recalculations (KPI Metrics)
  const stats = useMemo(() => {
    const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0)
    const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0)
    const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0)
    const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0)
    const totalBudget = campaigns.reduce((acc, c) => (c.status === 'ACTIVE' ? acc + c.budget : acc), 0)

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const convRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0
    const avgCac = totalLeads > 0 ? totalSpend / totalLeads : 0
    
    // Simulate standard revenue value per lead (e.g. $48 per LTV conversion)
    const simulatedRevenue = totalLeads * 48
    const roi = totalSpend > 0 ? ((simulatedRevenue - totalSpend) / totalSpend) * 100 : 0

    return {
      totalSpend,
      totalLeads,
      totalClicks,
      totalImpressions,
      totalBudget,
      ctr,
      convRate,
      avgCac,
      roi
    }
  }, [campaigns])

  // Chart data simulation (last 5 weeks trend)
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

  // Inline Budget Live Slider Modifier
  const handleBudgetChange = (id, newBudget) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        // Adjust dynamic spend & leads based on budget percentage modification
        const budgetFactor = newBudget / c.budget
        const initialSpend = initialCampaignsList.find(x => x.id === id).spend
        const initialLeads = initialCampaignsList.find(x => x.id === id).leads
        const initialClicks = initialCampaignsList.find(x => x.id === id).clicks
        const initialImpressions = initialCampaignsList.find(x => x.id === id).impressions

        return {
          ...c,
          budget: newBudget,
          spend: Math.round(initialSpend * budgetFactor),
          leads: Math.round(initialLeads * budgetFactor),
          clicks: Math.round(initialClicks * budgetFactor),
          impressions: Math.round(initialImpressions * budgetFactor)
        }
      }
      return c
    }))
  }

  // Row Status Play/Pause Toggle
  const handleStatusToggle = (id) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const toggledStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
        triggerToast(`Campaign "${c.name}" budget distribution is now ${toggledStatus.toLowerCase()}!`)
        return { ...c, status: toggledStatus }
      }
      return c
    }))
  }

  // Add Campaign Form Action handler
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
      icon,
      color,
      iconColor,
      budget: parseInt(newCampaign.budget) || 200,
      spend: 0,
      leads: 0,
      clicks: 0,
      impressions: 0,
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

  // Sorting Handler
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

        // Calculate Cost Per Lead (CPL) dynamically for sorting
        if (sortConfig.key === 'cpl') {
          const aCpl = a.leads > 0 ? a.spend / a.leads : 0
          const bCpl = b.leads > 0 ? b.spend / b.leads : 0
          return sortConfig.direction === 'asc' ? aCpl - bCpl : bCpl - aCpl
        }

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      })
  }, [campaigns, searchTerm, selectedNetwork, selectedStatus, sortConfig])

  return (
    <div className="w-full relative h-full flex flex-col font-sans select-none bg-slate-50/50 p-6 space-y-6 overflow-hidden">
      
      {/* Floating toast message */}
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

      {/* Page Title & Dashboard Actions */}
      <div className="flex justify-between items-center text-left select-none">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-slate-800 text-[18px] font-extrabold flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary">campaign</span>
            Digital Campaigns Attribution
          </h1>
          <p className="text-body-md text-slate-400 text-[11px] mt-0.5 font-medium">
            Monitor spend, clicks, conversion metrics, and attributions for digital channels in real-time.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 h-9 bg-primary hover:bg-primary/95 text-white rounded-lg text-[12px] font-bold shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          Create Campaign
        </button>
      </div>

      {/* Aesthetics Overview Metrics Cards Hub */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Ad Spend */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow text-left">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Ad Spend</span>
            <span className="p-1 rounded-lg bg-blue-50 text-blue-600 material-symbols-outlined text-[16px]">payments</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[16px] font-extrabold text-slate-800 leading-tight">
              ${stats.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="text-[9px] text-green-600 font-bold flex items-center gap-0.5 mt-1 select-none">
              <span className="material-symbols-outlined text-[10px] font-bold">trending_up</span>
              +14.2% vs last month
            </span>
          </div>
        </div>

        {/* Card 2: CTR & Clicks */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow text-left">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">CTR & Click Rate</span>
            <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600 material-symbols-outlined text-[16px]">ads_click</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[16px] font-extrabold text-slate-800 leading-tight">
              {stats.ctr.toFixed(2)}%
            </h3>
            <span className="text-[9px] text-slate-400 font-semibold block mt-1 select-none">
              From <span className="font-extrabold text-slate-600">{stats.totalClicks.toLocaleString()}</span> clicks
            </span>
          </div>
        </div>

        {/* Card 3: Leads Attributed */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow text-left">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Leads Ingested</span>
            <span className="p-1 rounded-lg bg-green-50 text-green-600 material-symbols-outlined text-[16px]">verified</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[16px] font-extrabold text-slate-800 leading-tight">
              {stats.totalLeads.toLocaleString()} leads
            </h3>
            <span className="text-[9px] text-green-600 font-bold flex items-center gap-0.5 mt-1 select-none">
              <span className="material-symbols-outlined text-[10px] font-bold">trending_up</span>
              {stats.convRate.toFixed(2)}% Conversion Rate
            </span>
          </div>
        </div>

        {/* Card 4: Average CAC Cost */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow text-left">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Average CAC Cost</span>
            <span className="p-1 rounded-lg bg-teal-50 text-teal-600 material-symbols-outlined text-[16px]">price_check</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[16px] font-extrabold text-slate-800 leading-tight">
              ${stats.avgCac.toFixed(2)}
            </h3>
            <span className="text-[9px] text-teal-600 font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-teal-50 mt-1.5 inline-block select-none">
              EXCELLENT / CAC HEALTHY
            </span>
          </div>
        </div>

        {/* Card 5: Estimated ROI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow text-left">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Average ROI</span>
            <span className="p-1 rounded-lg bg-purple-50 text-purple-600 material-symbols-outlined text-[16px]">auto_graph</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[16px] font-extrabold text-slate-800 leading-tight">
              {stats.roi.toFixed(0)}% ROI
            </h3>
            <span className="text-[9px] text-purple-600 font-bold flex items-center gap-0.5 mt-1 select-none">
              <span className="material-symbols-outlined text-[10px] font-bold">star</span>
              Superb campaign returns
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 30-Day SVG Graph Panel (~35%) & Search Filters Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* SVG Performance Chart Panel (8-cols width) */}
        <div className="col-span-1 lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-2xs relative overflow-hidden">
          
          <div className="flex justify-between items-center mb-4 select-none">
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-slate-800">Campaign Growth Sparkline</h3>
              <p className="text-[10.5px] text-slate-400 font-medium">30-day marketing attribution snapshot.</p>
            </div>
            
            {/* Chart toggle tabs */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
              {[
                { id: 'leads', label: 'Leads Ingested', color: 'text-green-600 border-green-200 bg-green-50/50' },
                { id: 'spend', label: 'Ad Spend', color: 'text-blue-600 border-blue-200 bg-blue-50/50' },
                { id: 'roi', label: 'ROI Growth', color: 'text-purple-600 border-purple-200 bg-purple-50/50' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChartTab(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    activeChartTab === tab.id
                      ? 'bg-white shadow-2xs border border-slate-200 text-slate-800'
                      : 'text-slate-450 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Glow Vector Sparkline Plot Chart */}
          <div className="flex-1 min-h-[140px] w-full relative flex items-end pt-3">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient-leads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradient-spend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradient-roi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Guide Lines */}
              <line x1="0" y1="20" x2="500" y2="20" className="stroke-slate-100" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="500" y2="50" className="stroke-slate-100" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" className="stroke-slate-100" strokeWidth="1" strokeDasharray="3 3" />

              {/* Shaded Area Fill */}
              <path
                d="M 0 100 L 0 85 C 100 75, 125 55, 250 48 C 375 42, 400 20, 500 12 L 500 100 Z"
                fill={
                  activeChartTab === 'leads'
                    ? 'url(#gradient-leads)'
                    : activeChartTab === 'spend'
                    ? 'url(#gradient-spend)'
                    : 'url(#gradient-roi)'
                }
                className="transition-all duration-500 ease-in-out"
              />

              {/* Top Vector Stroke Path */}
              <path
                d="M 0 85 C 100 75, 125 55, 250 48 C 375 42, 400 20, 500 12"
                fill="none"
                stroke={
                  activeChartTab === 'leads'
                    ? '#22c55e'
                    : activeChartTab === 'spend'
                    ? '#3b82f6'
                    : '#a855f7'
                }
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-500 ease-in-out"
              />

              {/* SVG Dots indicators for 5 weeks snapshot */}
              {[
                { cx: 0, cy: 85 },
                { cx: 125, cy: 73 },
                { cx: 250, cy: 48 },
                { cx: 375, cy: 30 },
                { cx: 500, cy: 12 }
              ].map((dot, idx) => (
                <g key={idx} className="cursor-pointer select-none" onMouseEnter={() => setHoveredChartIndex(idx)} onMouseLeave={() => setHoveredChartIndex(null)}>
                  <circle
                    cx={dot.cx}
                    cy={dot.cy}
                    r={hoveredChartIndex === idx ? '6' : '3.5'}
                    fill={
                      activeChartTab === 'leads'
                        ? '#22c55e'
                        : activeChartTab === 'spend'
                        ? '#3b82f6'
                        : '#a855f7'
                    }
                    className="stroke-white transition-all outline outline-1 select-none"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </svg>

            {/* Float Tooltip Tracker */}
            <AnimatePresence>
              {hoveredChartIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute p-2 bg-slate-900 text-white rounded shadow-md text-[10px] font-sans font-extrabold z-10 pointer-events-none select-none text-left"
                  style={{
                    left: `${(hoveredChartIndex / 4) * 85 + 4}%`,
                    bottom: '80px'
                  }}
                >
                  <p className="text-slate-400 select-none uppercase tracking-wider text-[8px]">
                    {chartData[hoveredChartIndex].date} Trend
                  </p>
                  <p className="mt-0.5 select-none">
                    {chartData[hoveredChartIndex].label}:{' '}
                    <span className="text-white">
                      {activeChartTab === 'spend' ? '$' : ''}
                      {chartData[hoveredChartIndex].value.toLocaleString()}
                      {activeChartTab === 'roi' ? '%' : ''}
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search, Filter & Quick-Stats Selector (4-cols width) */}
        <div className="col-span-1 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-2xs text-left select-none">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800">Dynamic Grid Filters</h3>
            
            {/* Search Input Box */}
            <div className="relative">
              <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search campaigns by name..."
                className="w-full h-8 pl-9 pr-3 border border-slate-200 rounded bg-slate-50 text-[11px] outline-none focus:bg-white focus:border-primary transition-all font-sans font-medium"
              />
            </div>

            {/* Network Ingest Inlets Selection */}
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

            {/* Campaign Pipeline Status Selector */}
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
            onClick={() => {
              setSearchTerm('')
              setSelectedNetwork('ALL')
              setSelectedStatus('ALL')
              setSortConfig({ key: 'spend', direction: 'desc' })
            }}
            className="w-full h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer mt-4 select-none"
          >
            Reset Ingest Filters
          </button>
        </div>
      </div>

      {/* Campaigns Data Table Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs text-left">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11.5px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th className="px-5 py-3 text-left w-16">Active</th>
                <th
                  onClick={() => requestSort('name')}
                  className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center">
                    Campaign Details
                    {renderSortIndicator('name')}
                  </div>
                </th>
                <th
                  onClick={() => requestSort('budget')}
                  className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none w-48"
                >
                  <div className="flex items-center">
                    Daily Budget Limit
                    {renderSortIndicator('budget')}
                  </div>
                </th>
                <th
                  onClick={() => requestSort('spend')}
                  className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center">
                    Ad Spend
                    {renderSortIndicator('spend')}
                  </div>
                </th>
                <th
                  onClick={() => requestSort('leads')}
                  className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center">
                    Leads Ingested
                    {renderSortIndicator('leads')}
                  </div>
                </th>
                <th
                  onClick={() => requestSort('cpl')}
                  className="px-5 py-3 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center">
                    Avg CPL
                    {renderSortIndicator('cpl')}
                  </div>
                </th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-center">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              <AnimatePresence>
                {filteredAndSortedCampaigns.map((c) => {
                  const cpl = c.leads > 0 ? c.spend / c.leads : 0
                  
                  return (
                    <motion.tr
                      key={c.id}
                      className="text-[12.5px] hover:bg-slate-50/40 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Play/Pause Toggle Selector Switch */}
                      <td className="px-5 py-3 select-none">
                        <button
                          onClick={() => handleStatusToggle(c.id)}
                          className={`w-8 h-4 rounded-full relative transition-all duration-300 ${
                            c.status === 'ACTIVE' ? 'bg-primary' : 'bg-slate-200'
                          } cursor-pointer`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.25 shadow-xs transition-transform duration-300 ${
                              c.status === 'ACTIVE' ? 'translate-x-[15px]' : 'translate-x-[1.5px]'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Campaign Network Icon, Name, and Start Date */}
                      <td className="px-5 py-3 font-sans">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${c.color} text-white flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                            <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                          </div>
                          <div className="overflow-hidden">
                            <span className="font-bold text-slate-800 truncate block hover:underline cursor-pointer">
                              {c.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5 tracking-wider uppercase">
                              {c.network} • Started {c.startDate}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Interactive budget adjustment slider */}
                      <td className="px-5 py-3 select-none">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="font-extrabold text-slate-850 font-mono">${c.budget}/day</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            step="25"
                            value={c.budget}
                            onChange={(e) => handleBudgetChange(c.id, parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                      </td>

                      {/* Spend */}
                      <td className="px-5 py-3 font-mono font-bold text-slate-700">
                        ${c.spend.toLocaleString()}
                      </td>

                      {/* Leads Count */}
                      <td className="px-5 py-3 font-mono font-extrabold text-slate-800">
                        {c.leads.toLocaleString()}
                      </td>

                      {/* Dynamic Cost Per Lead (CPL) */}
                      <td className="px-5 py-3 font-mono font-bold text-slate-700">
                        ${cpl.toFixed(2)}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-3 select-none">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                            c.status === 'ACTIVE'
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : c.status === 'PAUSED'
                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-slate-100 border-slate-200 text-slate-500'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* Row Action Settings */}
                      <td className="px-5 py-3 text-center select-none">
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex items-center justify-center mx-auto">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
              
              {filteredAndSortedCampaigns.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-16 text-center select-none bg-slate-50/20">
                    <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-450 shadow-inner">
                        <span className="material-symbols-outlined text-[32px]">folder_off</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800">No Active Ad Campaigns</h3>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-normal">
                          No digital campaigns currently match your active search terms or attribution filters.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedNetwork('ALL')
                          setSelectedStatus('ALL')
                        }}
                        className="h-8 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer select-none"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW AD CAMPAIGN INTERACTIVE SLIDER MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <>
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 select-none"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-text"
            >
              <form
                onSubmit={handleAddCampaign}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center select-none">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">add_circle</span>
                    Create Ad Campaign
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="p-5 space-y-4 text-left">
                  
                  {/* Campaign Name */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Campaign Title *</label>
                    <input
                      type="text"
                      required
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      placeholder="e.g. Q3 Google Search - Brand Keywords"
                      className="w-full h-8 px-2.5 border border-slate-200 rounded bg-slate-50 text-[11.5px] outline-none focus:bg-white focus:border-primary font-sans font-medium"
                    />
                  </div>

                  {/* Ad Ingestion Network Outlet */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Ad Network Outlet *</label>
                    <select
                      value={newCampaign.network}
                      onChange={(e) => setNewCampaign({ ...newCampaign, network: e.target.value })}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded bg-slate-50 text-[11.5px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <option value="Google Ads">Google Ads (Search)</option>
                      <option value="Facebook">Facebook (Retargeting)</option>
                      <option value="LinkedIn">LinkedIn (Enterprise)</option>
                      <option value="Instagram">Instagram (Lead Gen Form)</option>
                      <option value="YouTube">YouTube (Ad Sponsor)</option>
                      <option value="TikTok">TikTok (Spark Video)</option>
                    </select>
                  </div>

                  {/* Budget Slider selector */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Daily Budget Limit *</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="50"
                        max="1000"
                        step="25"
                        value={newCampaign.budget}
                        onChange={(e) => setNewCampaign({ ...newCampaign, budget: parseInt(e.target.value) })}
                        className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="font-extrabold text-[12px] text-slate-750 font-mono w-16 text-right">${newCampaign.budget}/day</span>
                    </div>
                  </div>

                  {/* Distribution Initial status */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Initial Status</label>
                    <select
                      value={newCampaign.status}
                      onChange={(e) => setNewCampaign({ ...newCampaign, status: e.target.value })}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded bg-slate-50 text-[11.5px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PAUSED">PAUSED</option>
                      <option value="DRAFT">DRAFT</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider select-none">Launch Date</label>
                    <input
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded bg-slate-50 text-[11.5px] outline-none focus:bg-white focus:border-primary font-sans font-medium"
                    />
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5 select-none">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-250 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-[12px] font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Publish Campaign
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
