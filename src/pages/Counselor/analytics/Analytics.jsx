import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './analytics.css'

export default function Analytics() {
  // Global View Type: 'graph' | 'report'
  const [globalView, setGlobalView] = useState('graph')

  // Tooltip details
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [hoveredSection, setHoveredSection] = useState(null) // 'stage' | 'intake' | 'demographics' | 'source'
  const [hoveredPos, setHoveredPos] = useState({ x: 0, y: 0 })

  // ----------------------------------------------------
  // DATASETS DEFINITIONS
  // ----------------------------------------------------

  // 1. Lead Stage Dataset
  const stageData = [
    { stage: 'NEW', count: 68, percentage: 27.2, color: '#3b82f6', class: 'new' },
    { stage: 'CONTACTED', count: 98, percentage: 39.2, color: '#f97316', class: 'contacted' },
    { stage: 'QUALIFIED', count: 59, percentage: 23.6, color: '#10b981', class: 'qualified' },
    { stage: 'LOST', count: 25, percentage: 10.0, color: '#ef4444', class: 'lost' }
  ]

  // 2. Daily & Yearly Intake Dataset
  const [intakeTimeline, setIntakeTimeline] = useState('daily') // 'daily' | 'yearly'
  const dailyIntakeData = [
    { label: 'May 28', count: 24, conversion: 25.0 },
    { label: 'May 29', count: 32, conversion: 28.1 },
    { label: 'May 30', count: 41, conversion: 34.1 },
    { label: 'May 31', count: 38, conversion: 31.5 },
    { label: 'Jun 01', count: 48, conversion: 40.2 },
    { label: 'Jun 02', count: 52, conversion: 44.3 },
    { label: 'Jun 03', count: 45, conversion: 38.9 }
  ]
  const yearlyIntakeData = [
    { label: '2022', count: 450, conversion: 22.4 },
    { label: '2023', count: 780, conversion: 26.8 },
    { label: '2024', count: 1120, conversion: 32.1 },
    { label: '2025', count: 1540, conversion: 37.5 },
    { label: '2026', count: 1890, conversion: 41.2 }
  ]
  const activeIntakeData = useMemo(() => {
    return intakeTimeline === 'daily' ? dailyIntakeData : yearlyIntakeData
  }, [intakeTimeline])

  // 3. Demographic Dataset (State, Union, International)
  const [demographicType, setDemographicType] = useState('state') // 'state' | 'union' | 'international'
  const stateData = [
    { region: 'California', count: 72, conversion: 38.5 },
    { region: 'Texas', count: 58, conversion: 32.1 },
    { region: 'New York', count: 46, conversion: 29.5 },
    { region: 'Karnataka', count: 39, conversion: 41.0 },
    { region: 'Maharashtra', count: 35, conversion: 35.8 }
  ]
  const unionData = [
    { region: 'Delhi NCR', count: 62, conversion: 39.2 },
    { region: 'Chandigarh', count: 18, conversion: 27.5 },
    { region: 'Puducherry', count: 12, conversion: 22.0 }
  ]
  const internationalData = [
    { region: 'United Kingdom', count: 85, conversion: 42.1 },
    { region: 'United States', count: 98, conversion: 46.5 },
    { region: 'Ireland', count: 42, conversion: 33.3 },
    { region: 'Hong Kong', count: 35, conversion: 38.0 },
    { region: 'Germany', count: 28, conversion: 28.5 }
  ]
  const activeDemographicData = useMemo(() => {
    if (demographicType === 'state') return stateData
    if (demographicType === 'union') return unionData
    return internationalData
  }, [demographicType])

  // 4. Source Wise Dataset
  const sourceData = [
    { source: 'Website Organic', count: 112, conversion: 35.5, avgScore: 82 },
    { source: 'Paid Search', count: 95, conversion: 28.0, avgScore: 74 },
    { source: 'Referral', count: 64, conversion: 48.2, avgScore: 89 },
    { source: 'Webinar', count: 48, conversion: 31.4, avgScore: 68 },
    { source: 'Cold Outreach', count: 38, conversion: 12.5, avgScore: 42 },
    { source: 'Direct Mail', count: 22, conversion: 18.0, avgScore: 50 }
  ]

  // ----------------------------------------------------
  // REPORT VIEW STATES (SEARCH & SORT)
  // ----------------------------------------------------

  // Search states for each card
  const [searchStage, setSearchStage] = useState('')
  const [searchIntake, setSearchIntake] = useState('')
  const [searchDemo, setSearchDemo] = useState('')
  const [searchSource, setSearchSource] = useState('')

  // Sort states
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'desc' })

  const handleSort = (key) => {
    let direction = 'desc'
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'
    }
    setSortConfig({ key, direction })
  }

  // Filtered and Sorted Stage Report
  const filteredStageReport = useMemo(() => {
    let data = [...stageData]
    if (searchStage) {
      data = data.filter(d => d.stage.toLowerCase().includes(searchStage.toLowerCase()))
    }
    if (sortConfig.key) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]
        if (sortConfig.direction === 'asc') {
          return valA > valB ? 1 : -1
        }
        return valA < valB ? 1 : -1
      })
    }
    return data
  }, [searchStage, sortConfig])

  // Filtered and Sorted Intake Report
  const filteredIntakeReport = useMemo(() => {
    let data = [...activeIntakeData]
    if (searchIntake) {
      data = data.filter(d => d.label.toLowerCase().includes(searchIntake.toLowerCase()))
    }
    if (sortConfig.key) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]
        if (sortConfig.direction === 'asc') {
          return valA > valB ? 1 : -1
        }
        return valA < valB ? 1 : -1
      })
    }
    return data
  }, [searchIntake, activeIntakeData, sortConfig])

  // Filtered and Sorted Demographic Report
  const filteredDemoReport = useMemo(() => {
    let data = [...activeDemographicData]
    if (searchDemo) {
      data = data.filter(d => d.region.toLowerCase().includes(searchDemo.toLowerCase()))
    }
    if (sortConfig.key) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]
        if (sortConfig.direction === 'asc') {
          return valA > valB ? 1 : -1
        }
        return valA < valB ? 1 : -1
      })
    }
    return data
  }, [searchDemo, activeDemographicData, sortConfig])

  // Filtered and Sorted Source Report
  const filteredSourceReport = useMemo(() => {
    let data = [...sourceData]
    if (searchSource) {
      data = data.filter(d => d.source.toLowerCase().includes(searchSource.toLowerCase()))
    }
    if (sortConfig.key) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]
        if (sortConfig.direction === 'asc') {
          return valA > valB ? 1 : -1
        }
        return valA < valB ? 1 : -1
      })
    }
    return data
  }, [searchSource, sortConfig])

  // ----------------------------------------------------
  // EXPORT CSV HANDLER
  // ----------------------------------------------------
  const handleExportCSV = (title, headers, rows) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ----------------------------------------------------
  // RENDER GRAPH MATH HELPERS
  // ----------------------------------------------------
  const maxStageCount = Math.max(...stageData.map(d => d.count))
  const maxIntakeCount = Math.max(...activeIntakeData.map(d => d.count))
  const maxDemoCount = Math.max(...activeDemographicData.map(d => d.count))
  const maxSourceCount = Math.max(...sourceData.map(d => d.count))

  return (
    <div className="analytics-container">
      {/* Top Banner and Navigation */}
      <div className="analytics-header">
        <div className="analytics-title-group">
          <h1>CRM Analytics Panel</h1>
          <p>Real-time visual monitoring and export reports for pipeline distribution, channel source leads, and demographic segment tracking.</p>
        </div>

        {/* Graph vs Report Toggler */}
        <div className="analytics-actions">
          <button
            onClick={() => setGlobalView('graph')}
            className={`toggle-view-btn ${globalView === 'graph' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined">insights</span>
            Visual Graphs
          </button>
          <button
            onClick={() => setGlobalView('report')}
            className={`toggle-view-btn ${globalView === 'report' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined">table_chart</span>
            Tabular Reports
          </button>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="analytics-grid">

        {/* 1. LEAD STAGE ANALYTICS */}
        <div className="analytics-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <h2>Lead Stage Analysis</h2>
              <p>Total volume breakdown across pipeline status stages</p>
            </div>
          </div>

          {globalView === 'graph' ? (
            /* Lead Stage Graph View */
            <div className="chart-wrapper stage-chart">
              {stageData.map((item, idx) => {
                const heightPercent = maxStageCount > 0 ? (item.count / maxStageCount) * 80 + 10 : 10
                const isHovered = hoveredIndex === idx && hoveredSection === 'stage'

                return (
                  <div
                    key={item.stage}
                    className="stage-bar-container"
                    onMouseEnter={(e) => {
                      setHoveredIndex(idx)
                      setHoveredSection('stage')
                      const rect = e.currentTarget.getBoundingClientRect()
                      const parentRect = e.currentTarget.closest('.chart-wrapper').getBoundingClientRect()
                      setHoveredPos({
                        x: rect.left - parentRect.left + rect.width / 2,
                        y: rect.top - parentRect.top - 10
                      })
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null)
                      setHoveredSection(null)
                    }}
                  >
                    {/* Count on top of the bar */}
                    <span className="stage-bar-value">{item.count}</span>
                    {/* Vertical Bar */}
                    <motion.div
                      className={`stage-bar ${item.class}`}
                      style={{
                        opacity: hoveredSection === 'stage' && hoveredIndex !== idx ? 0.4 : 1
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ type: 'spring', stiffness: 90, damping: 14, delay: idx * 0.05 }}
                    />
                    <span className="stage-bar-label">{item.stage}</span>
                  </div>
                )
              })}

              {/* Tooltip Overlay */}
              <AnimatePresence>
                {hoveredSection === 'stage' && hoveredIndex !== null && (
                  <motion.div
                    className="chart-tooltip-box"
                    style={{ left: hoveredPos.x, top: hoveredPos.y, transform: 'translate(-50%, -100%)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="tooltip-title">{stageData[hoveredIndex].stage} Stage</span>
                    <div className="tooltip-stat">
                      <span>Leads Count:</span>
                      <span className="tooltip-val">{stageData[hoveredIndex].count}</span>
                    </div>
                    <div className="tooltip-stat">
                      <span>Distribution:</span>
                      <span className="tooltip-val">{stageData[hoveredIndex].percentage}%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Lead Stage Report View */
            <div className="report-view-wrapper">
              <div className="report-toolbar">
                <div className="report-search">
                  <span className="material-symbols-outlined report-search-icon">search</span>
                  <input
                    type="text"
                    placeholder="Search stage..."
                    value={searchStage}
                    onChange={(e) => setSearchStage(e.target.value)}
                  />
                </div>
                <button
                  className="export-btn"
                  onClick={() => handleExportCSV(
                    'Lead Stage',
                    ['Stage', 'Leads Count', 'Distribution (%)'],
                    stageData.map(s => [s.stage, s.count, s.percentage])
                  )}
                >
                  <span className="material-symbols-outlined">download</span>
                  Export
                </button>
              </div>

              <div className="report-table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('stage')}>Stage</th>
                      <th onClick={() => handleSort('count')}>Leads Count</th>
                      <th onClick={() => handleSort('percentage')}>Distribution Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStageReport.map((row) => (
                      <tr key={row.stage}>
                        <td>
                          <span className={`status-badge ${row.class}`}>{row.stage}</span>
                        </td>
                        <td className="col-mono col-primary">{row.count}</td>
                        <td className="col-mono col-muted">{row.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 2. DAILY & YEARLY INTAKE ANALYTICS */}
        <div className="analytics-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <h2>Lead Registration Intake</h2>
              <p>Volume flow metrics mapped chronologically</p>
            </div>

            <div className="card-local-toggle">
              <button
                className={`card-local-toggle-btn ${intakeTimeline === 'daily' ? 'active' : ''}`}
                onClick={() => setIntakeTimeline('daily')}
              >
                Daily
              </button>
              <button
                className={`card-local-toggle-btn ${intakeTimeline === 'yearly' ? 'active' : ''}`}
                onClick={() => setIntakeTimeline('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>

          {globalView === 'graph' ? (
            /* Intake Graph View (Custom SVG Line Chart) */
            <div className="chart-wrapper intake-chart">
              <svg className="intake-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="intakeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeDasharray="4 4" />

                {/* Draw Area Path */}
                {(() => {
                  const points = activeIntakeData.map((item, idx) => {
                    const x = (idx / (activeIntakeData.length - 1)) * 460 + 20
                    const y = 170 - (item.count / maxIntakeCount) * 120
                    return { x, y }
                  })

                  const areaD = `
                    M ${points[0].x} 170
                    L ${points.map(p => `${p.x} ${p.y}`).join(' L ')}
                    L ${points[points.length - 1].x} 170
                    Z
                  `

                  const lineD = `
                    M ${points[0].x} ${points[0].y}
                    L ${points.slice(1).map(p => `${p.x} ${p.y}`).join(' L ')}
                  `

                  return (
                    <>
                      {/* Fill area */}
                      <path d={areaD} fill="url(#intakeAreaGrad)" />
                      {/* Stroke line */}
                      <path d={lineD} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />

                      {/* Interactive Nodes */}
                      {points.map((p, idx) => (
                        <g key={idx}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            fill="#ffffff"
                            stroke="#8b5cf6"
                            strokeWidth="2"
                            className="intake-node"
                            onMouseEnter={(e) => {
                              setHoveredIndex(idx)
                              setHoveredSection('intake')
                              const rect = e.currentTarget.getBoundingClientRect()
                              const parentRect = e.currentTarget.closest('.chart-wrapper').getBoundingClientRect()
                              setHoveredPos({
                                x: rect.left - parentRect.left + rect.width / 2,
                                y: rect.top - parentRect.top - 8
                              })
                            }}
                            onMouseLeave={() => {
                              setHoveredIndex(null)
                              setHoveredSection(null)
                            }}
                          />
                          <text
                            x={p.x}
                            y={p.y - 10}
                            textAnchor="middle"
                            className="intake-node-value"
                          >
                            {activeIntakeData[idx].count}
                          </text>
                        </g>
                      ))}
                    </>
                  )
                })()}
              </svg>

              {/* Labels below SVG */}
              <div className="intake-labels-container">
                {activeIntakeData.map((item, idx) => (
                  <span key={idx} className="intake-label">{item.label}</span>
                ))}
              </div>

              {/* Tooltip Overlay */}
              <AnimatePresence>
                {hoveredSection === 'intake' && hoveredIndex !== null && (
                  <motion.div
                    className="chart-tooltip-box"
                    style={{ left: hoveredPos.x, top: hoveredPos.y, transform: 'translate(-50%, -100%)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="tooltip-title">{activeIntakeData[hoveredIndex].label}</span>
                    <div className="tooltip-stat">
                      <span>Lead Intake:</span>
                      <span className="tooltip-val">{activeIntakeData[hoveredIndex].count}</span>
                    </div>
                    <div className="tooltip-stat">
                      <span>Conversion:</span>
                      <span className="tooltip-val">{activeIntakeData[hoveredIndex].conversion}%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Intake Report View */
            <div className="report-view-wrapper">
              <div className="report-toolbar">
                <div className="report-search">
                  <span className="material-symbols-outlined report-search-icon">search</span>
                  <input
                    type="text"
                    placeholder="Search interval..."
                    value={searchIntake}
                    onChange={(e) => setSearchIntake(e.target.value)}
                  />
                </div>
                <button
                  className="export-btn"
                  onClick={() => handleExportCSV(
                    `${intakeTimeline} Intake`,
                    ['Timeframe', 'Leads Created', 'Conversion Rate (%)'],
                    activeIntakeData.map(i => [i.label, i.count, i.conversion])
                  )}
                >
                  <span className="material-symbols-outlined">download</span>
                  Export
                </button>
              </div>

              <div className="report-table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('label')}>Timeframe</th>
                      <th onClick={() => handleSort('count')}>Leads Created</th>
                      <th onClick={() => handleSort('conversion')}>Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIntakeReport.map((row, idx) => (
                      <tr key={idx}>
                        <td className="col-primary">{row.label}</td>
                        <td className="col-mono">{row.count} leads</td>
                        <td className="col-mono col-success">{row.conversion}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 3. DEMOGRAPHIC ANALYTICS */}
        <div className="analytics-card mt-6">
          <div className="card-header-row">
            <div className="card-title-group">
              <h2>Demographics Tracking</h2>
              <p>Lead distribution mapping across territories and regions</p>
            </div>

            <div className="card-local-toggle">
              <button
                className={`card-local-toggle-btn ${demographicType === 'state' ? 'active' : ''}`}
                onClick={() => setDemographicType('state')}
              >
                States
              </button>
              <button
                className={`card-local-toggle-btn ${demographicType === 'union' ? 'active' : ''}`}
                onClick={() => setDemographicType('union')}
              >
                Union
              </button>
              <button
                className={`card-local-toggle-btn ${demographicType === 'international' ? 'active' : ''}`}
                onClick={() => setDemographicType('international')}
              >
                Int'l
              </button>
            </div>
          </div>

          {globalView === 'graph' ? (
            /* Demographics Graph View (Donut/Pie Chart) */
            <div className="chart-wrapper demographics-chart">
              <svg className="demographics-svg" viewBox="0 0 100 100">
                {(() => {
                  const total = activeDemographicData.reduce((acc, d) => acc + d.count, 0)
                  let startAngle = 0
                  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#6366f1']

                  return activeDemographicData.map((item, idx) => {
                    const percentage = (item.count / total) * 100
                    const angle = (item.count / total) * 360
                    const endAngle = startAngle + angle

                    // Convert to polar coords for SVG arc drawing
                    const x1 = 50 + 35 * Math.cos((startAngle - 90) * (Math.PI / 180))
                    const y1 = 50 + 35 * Math.sin((startAngle - 90) * (Math.PI / 180))
                    const x2 = 50 + 35 * Math.cos((endAngle - 90) * (Math.PI / 180))
                    const y2 = 50 + 35 * Math.sin((endAngle - 90) * (Math.PI / 180))

                    const largeArcFlag = angle > 180 ? 1 : 0
                    const d = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                    startAngle = endAngle

                    return (
                      <path
                        key={idx}
                        d={d}
                        fill={colors[idx % colors.length]}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer transition-all duration-200 opacity-90 hover:opacity-100"
                        onMouseEnter={(e) => {
                          setHoveredIndex(idx)
                          setHoveredSection('demographics')
                          const rect = e.currentTarget.getBoundingClientRect()
                          const parentRect = e.currentTarget.closest('.chart-wrapper').getBoundingClientRect()
                          setHoveredPos({
                            x: rect.left - parentRect.left + rect.width / 2,
                            y: rect.top - parentRect.top - 10
                          })
                        }}
                        onMouseLeave={() => {
                          setHoveredIndex(null)
                          setHoveredSection(null)
                        }}
                      />
                    )
                  })
                })()}
                {/* Inner white circle for donut effect */}
                <circle cx="50" cy="50" r="18" fill="#ffffff" />
              </svg>

              {/* Floating Legend */}
              <div className="demographics-legend">
                {(() => {
                  const total = activeDemographicData.reduce((acc, d) => acc + d.count, 0)
                  return activeDemographicData.map((item, idx) => {
                    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#6366f1']
                    const percent = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0
                    return (
                      <div key={idx} className="demographics-legend-item">
                        <div className="legend-dot" style={{ backgroundColor: colors[idx % colors.length] }} />
                        <span className="legend-name">{item.region}</span>
                        <span className="legend-count">({item.count} | {percent}%)</span>
                      </div>
                    )
                  })
                })()}
              </div>

              {/* Tooltip Overlay */}
              <AnimatePresence>
                {hoveredSection === 'demographics' && hoveredIndex !== null && (
                  <motion.div
                    className="chart-tooltip-box"
                    style={{ left: hoveredPos.x, top: hoveredPos.y, transform: 'translate(-50%, -100%)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="tooltip-title">{activeDemographicData[hoveredIndex].region}</span>
                    <div className="tooltip-stat">
                      <span>Leads Count:</span>
                      <span className="tooltip-val">{activeDemographicData[hoveredIndex].count}</span>
                    </div>
                    <div className="tooltip-stat">
                      <span>Conversion:</span>
                      <span className="tooltip-val">{activeDemographicData[hoveredIndex].conversion}%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Demographics Report View */
            <div className="report-view-wrapper">
              <div className="report-toolbar">
                <div className="report-search">
                  <span className="material-symbols-outlined report-search-icon">search</span>
                  <input
                    type="text"
                    placeholder="Search region..."
                    value={searchDemo}
                    onChange={(e) => setSearchDemo(e.target.value)}
                  />
                </div>
                <button
                  className="export-btn"
                  onClick={() => handleExportCSV(
                    `${demographicType} Demographic`,
                    ['Region', 'Leads Count', 'Conversion Rate (%)'],
                    activeDemographicData.map(d => [d.region, d.count, d.conversion])
                  )}
                >
                  <span className="material-symbols-outlined">download</span>
                  Export
                </button>
              </div>

              <div className="report-table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('region')}>Region</th>
                      <th onClick={() => handleSort('count')}>Leads Count</th>
                      <th onClick={() => handleSort('conversion')}>Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDemoReport.map((row, idx) => (
                      <tr key={idx}>
                        <td className="col-primary">{row.region}</td>
                        <td className="col-mono">{row.count} leads</td>
                        <td className="col-mono col-success">{row.conversion}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 4. SOURCE WISE ANALYTICS */}
        <div className="analytics-card mt-6">
          <div className="card-header-row">
            <div className="card-title-group">
              <h2>Source Channel Report</h2>
              <p>Lead conversion efficiency broken down by acquisition source</p>
            </div>
          </div>

          {globalView === 'graph' ? (
            /* Source Graph View (Horizontal Bar Chart) */
            <div className="chart-wrapper source-chart">
              {sourceData.map((item, idx) => {
                const widthPercent = maxSourceCount > 0 ? (item.count / maxSourceCount) * 75 + 10 : 10
                return (
                  <div
                    key={item.source}
                    className="source-row-item"
                    onMouseEnter={(e) => {
                      setHoveredIndex(idx)
                      setHoveredSection('source')
                      const rect = e.currentTarget.getBoundingClientRect()
                      const parentRect = e.currentTarget.closest('.chart-wrapper').getBoundingClientRect()
                      setHoveredPos({
                        x: rect.left - parentRect.left + (rect.width * widthPercent) / 100 + 40,
                        y: rect.top - parentRect.top + rect.height / 2
                      })
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null)
                      setHoveredSection(null)
                    }}
                  >
                    {/* Label */}
                    <span className="source-row-label">
                      {item.source}
                    </span>

                    {/* Horizontal Bar */}
                    <div className="source-row-track">
                      <motion.div
                        className="source-row-bar"
                        style={{
                          opacity: hoveredSection === 'source' && hoveredIndex !== idx ? 0.45 : 1
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ type: 'spring', stiffness: 95, damping: 15, delay: idx * 0.04 }}
                      />
                    </div>

                    <span className="source-row-value">
                      {item.count} leads ({item.conversion}%)
                    </span>
                  </div>
                )
              })}

              {/* Tooltip Overlay */}
              <AnimatePresence>
                {hoveredSection === 'source' && hoveredIndex !== null && (
                  <motion.div
                    className="chart-tooltip-box"
                    style={{ left: hoveredPos.x, top: hoveredPos.y, transform: 'translate(10px, -50%)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="tooltip-title">{sourceData[hoveredIndex].source}</span>
                    <div className="tooltip-stat">
                      <span>Leads:</span>
                      <span className="tooltip-val">{sourceData[hoveredIndex].count}</span>
                    </div>
                    <div className="tooltip-stat">
                      <span>Conversion:</span>
                      <span className="tooltip-val">{sourceData[hoveredIndex].conversion}%</span>
                    </div>
                    <div className="tooltip-stat">
                      <span>Avg Score:</span>
                      <span className="tooltip-val">{sourceData[hoveredIndex].avgScore} pt</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Source Report View */
            <div className="report-view-wrapper">
              <div className="report-toolbar">
                <div className="report-search">
                  <span className="material-symbols-outlined report-search-icon">search</span>
                  <input
                    type="text"
                    placeholder="Search source..."
                    value={searchSource}
                    onChange={(e) => setSearchSource(e.target.value)}
                  />
                </div>
                <button
                  className="export-btn"
                  onClick={() => handleExportCSV(
                    'Lead Source',
                    ['Source Channel', 'Leads Count', 'Conversion Rate (%)', 'Avg Lead Score'],
                    sourceData.map(s => [s.source, s.count, s.conversion, s.avgScore])
                  )}
                >
                  <span className="material-symbols-outlined">download</span>
                  Export
                </button>
              </div>

              <div className="report-table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('source')}>Source Channel</th>
                      <th onClick={() => handleSort('count')}>Leads Count</th>
                      <th onClick={() => handleSort('conversion')}>Conversion Rate</th>
                      <th onClick={() => handleSort('avgScore')}>Avg Lead Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSourceReport.map((row, idx) => (
                      <tr key={idx}>
                        <td className="col-primary">{row.source}</td>
                        <td className="col-mono">{row.count}</td>
                        <td className="col-mono col-success">{row.conversion}%</td>
                        <td className="col-mono col-muted">{row.avgScore} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
