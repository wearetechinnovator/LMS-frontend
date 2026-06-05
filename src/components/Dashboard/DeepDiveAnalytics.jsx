import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
export default function DeepDiveAnalytics({ triggerToast = () => {} }) {
  const [activeCategory, setActiveCategory] = useState('counselor') // 'counselor' | 'daily' | 'channel'
  const [viewType, setViewType] = useState('graph') // 'graph' | 'report'
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState('leads')
  const [sortAsc, setSortAsc] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [hoveredPos, setHoveredPos] = useState({ x: 0, y: 0 })

  // Sub-metric states for each category
  const [counselorMetric, setCounselorMetric] = useState('leads') // 'leads' | 'conversion' | 'responseTime'
  const [dailyMetric, setDailyMetric] = useState('leads') // 'leads' | 'conversion'
  const [channelMetric, setChannelMetric] = useState('leads') // 'leads' | 'conversion' | 'cpl'

  // 1. Counselor Performance Dataset
  const counselorData = [
    { name: 'Sarah Jenkins', leads: 94, conversion: 18.5, responseTime: 4.2 },
    { name: 'Marcus Chan', leads: 78, conversion: 15.2, responseTime: 5.0 },
    { name: 'Janet Smith', leads: 62, conversion: 12.8, responseTime: 6.1 },
    { name: 'Michael Moore', leads: 45, conversion: 10.4, responseTime: 7.5 },
    { name: 'Unassigned', leads: 12, conversion: 0, responseTime: 12.0 }
  ]

  // 2. Daily Lead Intake Dataset
  const dailyData = [
    { date: 'May 22', leads: 42, conversion: 35.7, converted: 15 },
    { date: 'May 23', leads: 58, conversion: 37.9, converted: 22 },
    { date: 'May 24', leads: 65, conversion: 43.1, converted: 28 },
    { date: 'May 25', leads: 48, conversion: 37.5, converted: 18 },
    { date: 'May 26', leads: 55, conversion: 36.4, converted: 20 },
    { date: 'May 27', leads: 30, conversion: 26.7, converted: 8 },
    { date: 'May 28', leads: 25, conversion: 20.0, converted: 5 }
  ]

  // 3. Channel/Vendor Wise Dataset
  const channelData = [
    { name: 'Google Ads', leads: 120, conversion: 22.0, cpl: 10.0, cost: 1200 },
    { name: 'Facebook Ads', leads: 95, conversion: 18.0, cpl: 10.0, cost: 950 },
    { name: 'Referral', leads: 40, conversion: 35.0, cpl: 0, cost: 0 },
    { name: 'Organic Search', leads: 65, conversion: 25.0, cpl: 2.3, cost: 150 },
    { name: 'Cold Outreach', leads: 30, conversion: 8.0, cpl: 6.7, cost: 200 },
    { name: 'Webinar', leads: 50, conversion: 30.0, cpl: 10.0, cost: 500 }
  ]

  // Helper to handle header clicks for sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  // Get active dataset based on active category
  const activeDataset = useMemo(() => {
    let data = []
    if (activeCategory === 'counselor') {
      data = counselorData.map(item => ({
        id: item.name,
        label: item.name,
        leads: item.leads,
        conversion: item.conversion,
        responseTime: item.responseTime
      }))
    } else if (activeCategory === 'daily') {
      data = dailyData.map(item => ({
        id: item.date,
        label: item.date,
        leads: item.leads,
        conversion: item.conversion,
        converted: item.converted
      }))
    } else if (activeCategory === 'channel') {
      data = channelData.map(item => ({
        id: item.name,
        label: item.name,
        leads: item.leads,
        conversion: item.conversion,
        cpl: item.cpl,
        cost: item.cost
      }))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      data = data.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort data
    data.sort((a, b) => {
      let aVal = a[sortField] !== undefined ? a[sortField] : 0
      let bVal = b[sortField] !== undefined ? b[sortField] : 0
      return sortAsc ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    })

    return data
  }, [activeCategory, searchQuery, sortField, sortAsc])

  // Get current active metric
  const activeMetric = useMemo(() => {
    if (activeCategory === 'counselor') return counselorMetric
    if (activeCategory === 'daily') return dailyMetric
    return channelMetric
  }, [activeCategory, counselorMetric, dailyMetric, channelMetric])

  // Render sub-metric label
  const getMetricLabel = (metric) => {
    switch (metric) {
      case 'leads': return 'Leads Count'
      case 'conversion': return 'Conversion Rate'
      case 'responseTime': return 'Avg Response Time'
      case 'cpl': return 'Cost Per Lead'
      default: return 'Leads'
    }
  }

  // Render sub-metric value suffix/prefix
  const formatMetricVal = (val, metric) => {
    if (metric === 'conversion') return `${val}%`
    if (metric === 'responseTime') return `${val}h`
    if (metric === 'cpl') return `$${val}`
    return val.toLocaleString()
  }

  // Handle Export to CSV
  const handleExportCSV = () => {
    let headers = []
    let rows = []

    if (activeCategory === 'counselor') {
      headers = ['Counselor Name', 'Leads Count', 'Conversion Rate (%)', 'Avg Response Time (hrs)']
      rows = counselorData.map(c => [c.name, c.leads, c.conversion, c.responseTime])
    } else if (activeCategory === 'daily') {
      headers = ['Date', 'Leads Count', 'Conversion Rate (%)', 'Converted Leads']
      rows = dailyData.map(d => [d.date, d.leads, d.conversion, d.converted])
    } else {
      headers = ['Channel / Vendor', 'Leads Count', 'Conversion Rate (%)', 'Cost per Lead ($)', 'Total Spend ($)']
      rows = channelData.map(c => [c.name, c.leads, c.conversion, c.cpl, c.cost])
    }

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${activeCategory}_wise_analytics_report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    triggerToast(`Exported ${activeCategory}-wise report successfully!`)
  }

  // Max value of selected metric to scale SVG chart heights
  const maxMetricValue = useMemo(() => {
    const vals = activeDataset.map(d => d[activeMetric] || 0)
    return Math.max(...vals, 1)
  }, [activeDataset, activeMetric])

  return (
    <div className="deep-dive-card">
      {/* Header controls */}
      <div className="deep-dive-header">
        <div className="deep-dive-title-wrapper">
          <h3 className="deep-dive-title">Analytics Deep Dive</h3>
          <p className="deep-dive-subtitle">Analyze lead distribution and efficiency by different metrics</p>
        </div>

        <div className="deep-dive-controls">
          {/* Category Tabs */}
          <div className="deep-dive-tabs" id="analytics-category-tabs">
            <button
              onClick={() => {
                setActiveCategory('counselor')
                setSortField('leads')
                setSortAsc(false)
              }}
              className={`deep-dive-tab-btn ${activeCategory === 'counselor' ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">support_agent</span>
              Counselor
            </button>
            <button
              onClick={() => {
                setActiveCategory('daily')
                setSortField('leads')
                setSortAsc(false)
              }}
              className={`deep-dive-tab-btn ${activeCategory === 'daily' ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">calendar_today</span>
              Daily
            </button>
            <button
              onClick={() => {
                setActiveCategory('channel')
                setSortField('leads')
                setSortAsc(false)
              }}
              className={`deep-dive-tab-btn ${activeCategory === 'channel' ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">attribution</span>
              Channel/Vendor
            </button>
          </div>

          {/* Sub-Metric dropdown */}
          {activeCategory === 'counselor' && (
            <select
              value={counselorMetric}
              onChange={(e) => setCounselorMetric(e.target.value)}
              className="deep-dive-select"
            >
              <option value="leads">Total Leads</option>
              <option value="conversion">Conversion Rate</option>
              <option value="responseTime">Avg Response Time</option>
            </select>
          )}

          {activeCategory === 'daily' && (
            <select
              value={dailyMetric}
              onChange={(e) => setDailyMetric(e.target.value)}
              className="deep-dive-select"
            >
              <option value="leads">Lead Volume</option>
              <option value="conversion">Conversion Rate</option>
            </select>
          )}

          {activeCategory === 'channel' && (
            <select
              value={channelMetric}
              onChange={(e) => setChannelMetric(e.target.value)}
              className="deep-dive-select"
            >
              <option value="leads">Lead Volume</option>
              <option value="conversion">Conversion Rate</option>
              <option value="cpl">Cost Per Lead (CPL)</option>
            </select>
          )}

          {/* View Toggle */}
          <div className="view-toggle-wrapper">
            <button
              onClick={() => setViewType('graph')}
              className={`view-toggle-btn ${viewType === 'graph' ? 'active' : ''}`}
              title="Graph View"
            >
              <span className="material-symbols-outlined">insights</span>
              Graph
            </button>
            <button
              onClick={() => setViewType('report')}
              className={`view-toggle-btn ${viewType === 'report' ? 'active' : ''}`}
              title="Report Table View"
            >
              <span className="material-symbols-outlined">table_chart</span>
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="deep-dive-body min-h-[220px] flex items-center justify-center">
        {viewType === 'graph' ? (
          /* GRAPH VIEW (SVG CHARTS) */
          <div className="deep-dive-chart-container w-full h-[220px]">
            {activeDataset.length > 0 ? (
              <div className="relative w-full h-full flex items-end justify-between px-6 pt-6 pb-2">
                
                {/* Y-Axis Guideline helper (Dotted) */}
                <div className="absolute left-6 right-6 top-8 border-t border-dashed border-slate-100 pointer-events-none" />
                <div className="absolute left-6 right-6 top-28 border-t border-dashed border-slate-100 pointer-events-none" />

                {activeDataset.map((item, idx) => {
                  const val = item[activeMetric] || 0
                  // Height scale (min 8%, max 82%)
                  const heightPercent = val > 0 ? (val / maxMetricValue) * 80 + 8 : 8
                  
                  // Specific theme colors based on metric type
                  let barColor = 'linear-gradient(180deg, #4f46e5 0%, rgba(79, 70, 229, 0.2) 100%)'
                  let borderColor = '#4f46e5'
                  if (activeMetric === 'conversion') {
                    barColor = 'linear-gradient(180deg, #10b981 0%, rgba(16, 185, 129, 0.2) 100%)'
                    borderColor = '#10b981'
                  } else if (activeMetric === 'responseTime') {
                    barColor = 'linear-gradient(180deg, #f59e0b 0%, rgba(245, 158, 11, 0.2) 100%)'
                    borderColor = '#f59e0b'
                  } else if (activeMetric === 'cpl') {
                    barColor = 'linear-gradient(180deg, #06b6d4 0%, rgba(6, 182, 212, 0.2) 100%)'
                    borderColor = '#06b6d4'
                  }

                  const isHovered = hoveredIdx === idx

                  return (
                    <div
                      key={item.id}
                      className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                      onMouseEnter={(e) => {
                        setHoveredIdx(idx)
                        // Calculate coordinates relative to wrapper bounding rect
                        const rect = e.currentTarget.getBoundingClientRect()
                        const parentRect = e.currentTarget.parentNode.getBoundingClientRect()
                        setHoveredPos({
                          x: rect.left - parentRect.left + rect.width / 2,
                          y: rect.top - parentRect.top - 10
                        })
                      }}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {/* Interactive Bar */}
                      <motion.div
                        className="w-10 rounded-t-md border-t border-x transition-opacity duration-200"
                        style={{
                          background: barColor,
                          borderColor: borderColor,
                          opacity: hoveredIdx !== null && hoveredIdx !== idx ? 0.35 : 1,
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: idx * 0.04 }}
                      />

                      {/* X-axis Label */}
                      <span className="text-[8.5px] font-bold text-slate-500 mt-2 truncate w-full max-w-[70px] text-center select-none">
                        {item.label}
                      </span>
                    </div>
                  )
                })}

                {/* Floating Tooltip */}
                <AnimatePresence>
                  {hoveredIdx !== null && activeDataset[hoveredIdx] && (
                    <motion.div
                      className="deep-dive-tooltip"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.1 }}
                      style={{
                        left: hoveredPos.x,
                        top: hoveredPos.y,
                        transform: 'translate(-50%, -100%)'
                      }}
                    >
                      <span className="tooltip-title">{activeDataset[hoveredIdx].label}</span>
                      <span>
                        {getMetricLabel(activeMetric)}:{' '}
                        <span className="tooltip-value">
                          {formatMetricVal(activeDataset[hoveredIdx][activeMetric], activeMetric)}
                        </span>
                      </span>
                      {activeCategory === 'daily' && (
                        <span className="text-[8px] text-slate-400 mt-0.5">
                          Converted: {activeDataset[hoveredIdx].converted} leads
                        </span>
                      )}
                      {activeCategory === 'channel' && activeMetric !== 'cost' && (
                        <span className="text-[8px] text-slate-400 mt-0.5">
                          Spend: ${activeDataset[hoveredIdx].cost}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <span className="text-slate-400 font-semibold text-[11px] italic">No data matches your search</span>
            )}
          </div>
        ) : (
          /* REPORT TABLE VIEW */
          <div className="report-view-wrapper">
            <div className="flex justify-between items-center gap-4">
              {/* Search filter input */}
              <div className="report-search-bar">
                <span className="material-symbols-outlined report-search-icon">search</span>
                <input
                  type="text"
                  placeholder={`Search ${activeCategory}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="report-search-input"
                />
              </div>

              {/* Export CSV button */}
              <button
                onClick={handleExportCSV}
                className="report-action-btn"
              >
                <span className="material-symbols-outlined">download</span>
                Export Report
              </button>
            </div>

            {/* Table layout */}
            <div className="report-table-container">
              {activeDataset.length > 0 ? (
                <table className="report-table">
                  <thead>
                    {activeCategory === 'counselor' && (
                      <tr>
                        <th onClick={() => handleSort('label')}>Counselor Name</th>
                        <th onClick={() => handleSort('leads')}>Leads Count</th>
                        <th onClick={() => handleSort('conversion')}>Conversion Rate</th>
                        <th onClick={() => handleSort('responseTime')}>Avg Response Time</th>
                      </tr>
                    )}
                    {activeCategory === 'daily' && (
                      <tr>
                        <th onClick={() => handleSort('label')}>Date</th>
                        <th onClick={() => handleSort('leads')}>Leads Volume</th>
                        <th onClick={() => handleSort('conversion')}>Conversion Rate</th>
                        <th onClick={() => handleSort('converted')}>Converted Leads</th>
                      </tr>
                    )}
                    {activeCategory === 'channel' && (
                      <tr>
                        <th onClick={() => handleSort('label')}>Channel / Vendor</th>
                        <th onClick={() => handleSort('leads')}>Leads Count</th>
                        <th onClick={() => handleSort('conversion')}>Conversion Rate</th>
                        <th onClick={() => handleSort('cpl')}>Cost per Lead</th>
                        <th onClick={() => handleSort('cost')}>Total Spend</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {activeDataset.map((row) => (
                      <tr key={row.id}>
                        {activeCategory === 'counselor' && (
                          <>
                            <td className="font-bold text-slate-800">{row.label}</td>
                            <td>{row.leads} leads</td>
                            <td>
                              <span className="font-semibold text-emerald-600">{row.conversion}%</span>
                            </td>
                            <td>
                              <span className="font-semibold text-amber-600">{row.responseTime} hrs</span>
                            </td>
                          </>
                        )}
                        {activeCategory === 'daily' && (
                          <>
                            <td className="font-bold text-slate-800">{row.label}</td>
                            <td>{row.leads} leads</td>
                            <td>
                              <span className="font-semibold text-emerald-600">{row.conversion}%</span>
                            </td>
                            <td className="text-slate-500 font-semibold">{row.converted} leads</td>
                          </>
                        )}
                        {activeCategory === 'channel' && (
                          <>
                            <td className="font-bold text-slate-800">{row.label}</td>
                            <td>{row.leads} leads</td>
                            <td>
                              <span className="font-semibold text-emerald-600">{row.conversion}%</span>
                            </td>
                            <td>
                              <span className="cpl-badge">${row.cpl}</span>
                            </td>
                            <td className="font-semibold text-slate-700">${row.cost}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-400 font-semibold italic">
                  No data matches your search query
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
