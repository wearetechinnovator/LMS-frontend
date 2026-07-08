import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnalyticsSkeleton } from '../../../components/Skeletons'
import './analysis.css'

export default function Analytics({ activeTabProp = 'stage' }) {
  // Tabs State
  const activeTab = activeTabProp

  // Tooltip details
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [hoveredSection, setHoveredSection] = useState(null) // 'stage' | 'intake' | 'demographics' | 'source' | 'vendor'
  const [hoveredPos, setHoveredPos] = useState({ x: 0, y: 0 })

  const [leads, setLeads] = useState([])
  const [dbUsers, setDbUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now()
      setLoading(true)
      const token = localStorage.getItem('authToken')
      if (!token || token === 'mock-jwt-token') {
        setLoading(false)
        return
      }
      try {
        const headers = { 'Authorization': `Bearer ${token}` }
        const [leadsRes, usersRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BASE_URL}/lead/get-lead`, { headers }),
          fetch(`${import.meta.env.VITE_BASE_URL}/user/get-users`, { headers })
        ])
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json()
          if (Array.isArray(leadsData)) {
            setLeads(leadsData)
          }
        }
        if (usersRes.ok) {
          const usersData = await usersRes.json()
          if (Array.isArray(usersData)) {
            setDbUsers(usersData)
          }
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err)
      } finally {
        const elapsed = Date.now() - startTime
        const delay = Math.max(0, 500 - elapsed)
        setTimeout(() => {
          setLoading(false)
        }, delay)
      }
    }
    fetchData()
  }, [])

  // ----------------------------------------------------
  // DATASETS DEFINITIONS
  // ----------------------------------------------------

  // 1. Lead Stage Dataset
  const stageData = useMemo(() => {
    const counts = {}
    leads.forEach(l => {
      const st = l.status || 'NEW'
      counts[st] = (counts[st] || 0) + 1
    })
    const total = leads.length || 1
    const statusColors = {
      NEW: '#3b82f6',
      ASSIGNED: '#6366f1',
      CONTACTED: '#f97316',
      QUALIFIED: '#10b981',
      DEMO: '#8b5cf6',
      PROPOSAL: '#06b6d4',
      NEGOTIATION: '#ec4899',
      WON: '#10b981',
      LOST: '#ef4444'
    }
    const statusClasses = {
      NEW: 'new',
      ASSIGNED: 'new',
      CONTACTED: 'contacted',
      QUALIFIED: 'qualified',
      DEMO: 'qualified',
      PROPOSAL: 'qualified',
      NEGOTIATION: 'qualified',
      WON: 'qualified',
      LOST: 'lost'
    }
    const list = Object.keys(counts).map(status => ({
      stage: status,
      count: counts[status],
      percentage: parseFloat(((counts[status] / total) * 100).toFixed(1)),
      color: statusColors[status] || '#64748b',
      class: statusClasses[status] || 'new'
    }))
    return list.length > 0 ? list : [
      { stage: 'NEW', count: 0, percentage: 0, color: '#3b82f6', class: 'new' }
    ]
  }, [leads])

  // 2. Daily & Yearly Intake Dataset
  const [intakeTimeline, setIntakeTimeline] = useState('daily') // 'daily' | 'yearly'
  const dailyIntakeData = useMemo(() => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      const dayLeads = leads.filter(l => {
        if (!l.createdAt) return false
        const leadDate = new Date(l.createdAt)
        return leadDate.toDateString() === d.toDateString()
      })
      const converted = dayLeads.filter(l => ['QUALIFIED', 'WON', 'DEMO', 'PROPOSAL', 'NEGOTIATION'].includes(l.status)).length
      const convRate = dayLeads.length > 0 ? parseFloat(((converted / dayLeads.length) * 100).toFixed(1)) : 0
      result.push({
        label,
        count: dayLeads.length,
        conversion: convRate
      })
    }
    return result
  }, [leads])

  const yearlyIntakeData = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const result = []
    for (let i = 4; i >= 0; i--) {
      const year = String(currentYear - i)
      const yearLeads = leads.filter(l => {
        if (!l.createdAt) return false
        const leadDate = new Date(l.createdAt)
        return String(leadDate.getFullYear()) === year
      })
      const converted = yearLeads.filter(l => ['QUALIFIED', 'WON', 'DEMO', 'PROPOSAL', 'NEGOTIATION'].includes(l.status)).length
      const convRate = yearLeads.length > 0 ? parseFloat(((converted / yearLeads.length) * 100).toFixed(1)) : 0
      result.push({
        label: year,
        count: yearLeads.length,
        conversion: convRate
      })
    }
    return result
  }, [leads])

  const activeIntakeData = useMemo(() => {
    return intakeTimeline === 'daily' ? dailyIntakeData : yearlyIntakeData
  }, [intakeTimeline, dailyIntakeData, yearlyIntakeData])

  // 3. Demographic Dataset (State, Union, International)
  const [demographicType, setDemographicType] = useState('state') // 'state' | 'union' | 'international'
  const demographicTypeData = useMemo(() => {
    const unionList = ['Delhi', 'Delhi NCR', 'Chandigarh', 'Puducherry', 'Daman', 'Diu', 'Lakshadweep', 'Andaman']
    const internationalList = ['United Kingdom', 'UK', 'United States', 'US', 'USA', 'Germany', 'Ireland', 'Hong Kong', 'Canada', 'London', 'California', 'Texas', 'New York']

    const stateCounts = {}
    const unionCounts = {}
    const internationalCounts = {}

    leads.forEach(l => {
      const loc = l.location || 'Unknown'
      const isUnion = unionList.some(u => loc.toLowerCase().includes(u.toLowerCase()))
      const isInt = internationalList.some(i => loc.toLowerCase().includes(i.toLowerCase()))

      if (isInt) {
        internationalCounts[loc] = (internationalCounts[loc] || 0) + 1
      } else if (isUnion) {
        unionCounts[loc] = (unionCounts[loc] || 0) + 1
      } else {
        stateCounts[loc] = (stateCounts[loc] || 0) + 1
      }
    })

    const mapCounts = (counts) => {
      return Object.keys(counts).map(region => {
        const regionLeads = leads.filter(l => l.location === region)
        const converted = regionLeads.filter(l => ['QUALIFIED', 'WON', 'DEMO', 'PROPOSAL', 'NEGOTIATION'].includes(l.status)).length
        const convRate = regionLeads.length > 0 ? parseFloat(((converted / regionLeads.length) * 100).toFixed(1)) : 0
        return {
          region,
          count: counts[region],
          conversion: convRate
        }
      })
    }

    const states = mapCounts(stateCounts)
    const unions = mapCounts(unionCounts)
    const ints = mapCounts(internationalCounts)

    return {
      state: states.length > 0 ? states : [{ region: 'Kolkata', count: 0, conversion: 0 }],
      union: unions.length > 0 ? unions : [{ region: 'Delhi', count: 0, conversion: 0 }],
      international: ints.length > 0 ? ints : [{ region: 'International', count: 0, conversion: 0 }]
    }
  }, [leads])

  const activeDemographicData = useMemo(() => {
    return demographicTypeData[demographicType] || []
  }, [demographicType, demographicTypeData])

  // 4. Source Wise Dataset
  const sourceData = useMemo(() => {
    const counts = {}
    leads.forEach(l => {
      const src = l.source || 'Unknown Source'
      if (!counts[src]) {
        counts[src] = { count: 0, totalScore: 0, converted: 0 }
      }
      counts[src].count += 1
      counts[src].totalScore += (l.score ?? 50)
      if (['QUALIFIED', 'WON', 'DEMO', 'PROPOSAL', 'NEGOTIATION'].includes(l.status)) {
        counts[src].converted += 1
      }
    })

    const list = Object.keys(counts).map(src => ({
      source: src,
      count: counts[src].count,
      conversion: parseFloat(((counts[src].converted / counts[src].count) * 100).toFixed(1)),
      avgScore: Math.round(counts[src].totalScore / counts[src].count)
    }))

    return list.length > 0 ? list : [
      { source: 'Quick Add Form', count: 0, conversion: 0, avgScore: 50 }
    ]
  }, [leads])

  // 5. Vendor & Counselor Dataset
  const [vendorCounselorMode, setVendorCounselorMode] = useState('vendor') // 'vendor' | 'counselor'
  const vendorData = useMemo(() => {
    const counts = {}
    leads.forEach(l => {
      const camp = l.campaign || 'Direct_Ingest'
      if (!counts[camp]) {
        counts[camp] = { leads: 0, converted: 0, qualitySum: 0 }
      }
      counts[camp].leads += 1
      counts[camp].qualitySum += (l.score ?? 50)
      if (['QUALIFIED', 'WON', 'DEMO', 'PROPOSAL', 'NEGOTIATION'].includes(l.status)) {
        counts[camp].converted += 1
      }
    })

    const list = Object.keys(counts).map(camp => ({
      vendor: camp,
      leads: counts[camp].leads,
      conversion: parseFloat(((counts[camp].converted / counts[camp].leads) * 100).toFixed(1)),
      qualityScore: parseFloat(((counts[camp].qualitySum / counts[camp].leads) / 10).toFixed(1))
    }))

    return list.length > 0 ? list : [
      { vendor: 'Direct_Ingest', leads: 0, conversion: 0, qualityScore: 5.0 }
    ]
  }, [leads])

  const counselorData = useMemo(() => {
    const counts = {}
    dbUsers.forEach(u => {
      if (u.name && u.status === 'Active') {
        counts[u.name] = { assigned: 0, contacted: 0, converted: 0 }
      }
    })

    leads.forEach(l => {
      const counselor = l.assignedTo || 'Unassigned'
      if (counselor !== 'Unassigned') {
        if (!counts[counselor]) {
          counts[counselor] = { assigned: 0, contacted: 0, converted: 0 }
        }
        counts[counselor].assigned += 1
        if (l.status !== 'NEW') {
          counts[counselor].contacted += 1
        }
        if (['QUALIFIED', 'WON', 'DEMO', 'PROPOSAL', 'NEGOTIATION'].includes(l.status)) {
          counts[counselor].converted += 1
        }
      }
    })

    const list = Object.keys(counts).map(name => {
      const c = counts[name]
      return {
        counselor: name,
        assigned: c.assigned,
        contacted: c.contacted,
        converted: c.converted,
        conversion: c.assigned > 0 ? parseFloat(((c.converted / c.assigned) * 100).toFixed(1)) : 0
      }
    })

    return list.length > 0 ? list : [
      { counselor: 'No Counselors', assigned: 0, contacted: 0, converted: 0, conversion: 0 }
    ]
  }, [leads, dbUsers])

  // ----------------------------------------------------
  // REPORT VIEW STATES (SEARCH & SORT)
  // ----------------------------------------------------
  const [searchStage, setSearchStage] = useState('')
  const [searchIntake, setSearchIntake] = useState('')
  const [searchDemo, setSearchDemo] = useState('')
  const [searchSource, setSearchSource] = useState('')
  const [searchVendor, setSearchVendor] = useState('')
  const [searchCounselor, setSearchCounselor] = useState('')

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

  // Filtered and Sorted Vendor Report
  const filteredVendorReport = useMemo(() => {
    let data = [...vendorData]
    if (searchVendor) {
      data = data.filter(d => d.vendor.toLowerCase().includes(searchVendor.toLowerCase()))
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
  }, [searchVendor, sortConfig])

  // Filtered and Sorted Counselor Report
  const filteredCounselorReport = useMemo(() => {
    let data = [...counselorData]
    if (searchCounselor) {
      data = data.filter(d => d.counselor.toLowerCase().includes(searchCounselor.toLowerCase()))
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
  }, [searchCounselor, sortConfig])

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

  // Max value calculators for graph rendering
  const maxStageCount = Math.max(...stageData.map(d => d.count))
  const maxIntakeCount = Math.max(...activeIntakeData.map(d => d.count))
  const maxDemoCount = Math.max(...activeDemographicData.map(d => d.count))
  const maxSourceCount = Math.max(...sourceData.map(d => d.count))
  const maxVendorLeads = Math.max(...vendorData.map(d => d.leads))
  const maxCounselorAssigned = Math.max(...counselorData.map(c => c.assigned))

  if (loading) {
    return <AnalyticsSkeleton />
  }

  return (
    <div className="analytics-container">
      {/* Top Banner and Navigation */}
      <div className="analytics-header">
        <div className="analytics-title-group">
          <h1>CRM Analytics Panel</h1>
          <p>Real-time visual monitoring and export reports for pipeline distribution, channel source leads, and demographic segment tracking.</p>
        </div>
      </div>



      {/* Dynamic Tab Contents */}
      <div className="analytics-tab-body">

        {/* 1. LEAD STAGE WISE TAB */}
        {activeTab === 'stage' && (
          <div className="tab-content-layout">
            {/* Visual graph */}
            <div className="analytics-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <h2>Lead Stage Analysis</h2>
                  <p>Total volume breakdown across pipeline status stages</p>
                </div>
              </div>
              <div className="chart-wrapper stage-chart">
                {stageData.map((item, idx) => {
                  const heightPx = maxStageCount > 0 ? (item.count / maxStageCount) * 120 + 20 : 20
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
                      <span className="stage-bar-value">{item.count}</span>
                      <div
                        className={`stage-bar ${item.class}`}
                        style={{
                          height: `${heightPx}px`,
                          opacity: hoveredSection === 'stage' && hoveredIndex !== idx ? 0.4 : 1,
                          transition: 'height 0.3s ease, opacity 0.2s ease'
                        }}
                      />
                      <span className="stage-bar-label">{item.stage}</span>
                    </div>
                  )
                })}

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
            </div>

            {/* Tabular report (Generate report) */}
            <div className="analytics-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <h2>Lead Stage Report</h2>
                  <p>Pipelines data table with metrics search & CSV export</p>
                </div>
              </div>
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
                    Generate Report
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
            </div>
          </div>
        )}

        {/* 2. LEAD REGISTRATION WISE TAB */}
        {activeTab === 'registration' && (
          <div className="tab-content-layout">
            {/* Visual graph */}
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

              <div className="chart-wrapper intake-chart">
                <svg className="intake-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="intakeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeDasharray="4 4" />

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
                        <path d={areaD} fill="url(#intakeAreaGrad)" />
                        <path d={lineD} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />

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

                <div className="intake-labels-container">
                  {activeIntakeData.map((item, idx) => (
                    <span key={idx} className="intake-label">{item.label}</span>
                  ))}
                </div>

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
            </div>

            {/* Tabular report (Generate report) */}
            <div className="analytics-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <h2>Registration Report</h2>
                  <p>Intake breakdown table with search filters & CSV export</p>
                </div>
              </div>
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
                      `${intakeTimeline} Registration`,
                      ['Timeframe', 'Leads Created', 'Conversion Rate (%)'],
                      activeIntakeData.map(i => [i.label, i.count, i.conversion])
                    )}
                  >
                    <span className="material-symbols-outlined">download</span>
                    Generate Report
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
            </div>
          </div>
        )}

        {/* 3. DEMOGRAPHICS WISE TAB */}
        {activeTab === 'demographics' && (
          <div className="tab-content-layout">
            {/* Visual graph */}
            <div className="analytics-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <h2>Demographics Tracking</h2>

                </div>

                <div className="card-local-toggle">
                  <button
                    className={`card-local-toggle-btn ${demographicType === 'state' ? 'active' : ''}`}
                    onClick={() => setDemographicType('state')}
                  >
                    States
                  </button>
                  {/* <button
                    className={`card-local-toggle-btn ${demographicType === 'union' ? 'active' : ''}`}
                    onClick={() => setDemographicType('union')}
                  >
                    Union
                  </button> */}
                  <button
                    className={`card-local-toggle-btn ${demographicType === 'international' ? 'active' : ''}`}
                    onClick={() => setDemographicType('international')}
                  >
                    International
                  </button>
                </div>
              </div>

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
                  <circle cx="50" cy="50" r="18" fill="#ffffff" />
                </svg>

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
            </div>

            {/* Tabular report (Generate report) */}
            <div className="analytics-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <h2>Demographics Report</h2>
                  <p>Region mapping details table with search & CSV export</p>
                </div>
              </div>
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
                    Generate Report
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
            </div>
          </div>
        )}

        {/* 4. SOURCE CHANNEL REPORT TAB */}
        {activeTab === 'source' && (
          <div className="tab-content-layout">
            {/* Visual graph */}
            <div className="analytics-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <h2>Source Channel Breakdown</h2>
                  <p>Lead acquisition distribution across search and referral channels</p>
                </div>
              </div>

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
                      <span className="source-row-label">{item.source}</span>
                      <div className="source-row-track">
                        <div
                          className="source-row-bar"
                          style={{
                            opacity: hoveredSection === 'source' && hoveredIndex !== idx ? 0.45 : 1,
                            width: `${widthPercent}%`,
                            transition: 'width 0.3s ease, opacity 0.2s ease'
                          }}
                        />
                      </div>
                      <span className="source-row-value">{item.count} leads ({item.conversion}%)</span>
                    </div>
                  )
                })}

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
            </div>

            {/* Tabular report (Generate report) */}
            <div className="analytics-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <h2>Source Channel Report</h2>
                  <p>Acquisition analytics table with sorting and CSV generation</p>
                </div>
              </div>
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
                    Generate Report
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
            </div>
          </div>
        )}

        {/* 5. VENDOR & COUNSELOR SPECIFIC TAB */}
        {activeTab === 'vendor_counselor' && (
          <div className="tab-content-layout">
            {/* Visual graph */}
            <div className="analytics-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <h2>{vendorCounselorMode === 'vendor' ? 'Vendor Performance Analysis' : 'Counselor Assignment Efficiency'}</h2>
                  <p>
                    {vendorCounselorMode === 'vendor'
                      ? 'Lead generation breakdown and relative distribution by external vendor'
                      : 'Lead resolution mapping: Converted vs Assigned leads ratio per counselor'}
                  </p>
                </div>

                <div className="card-local-toggle">
                  <button
                    className={`card-local-toggle-btn ${vendorCounselorMode === 'vendor' ? 'active' : ''}`}
                    onClick={() => setVendorCounselorMode('vendor')}
                  >
                    Vendor
                  </button>
                  <button
                    className={`card-local-toggle-btn ${vendorCounselorMode === 'counselor' ? 'active' : ''}`}
                    onClick={() => setVendorCounselorMode('counselor')}
                  >
                    Counselor
                  </button>
                </div>
              </div>

              {vendorCounselorMode === 'vendor' ? (
                /* Vendor Chart view (horizontal bar layout) */
                <div className="chart-wrapper source-chart">
                  {vendorData.map((item, idx) => {
                    const widthPercent = maxVendorLeads > 0 ? (item.leads / maxVendorLeads) * 75 + 10 : 10
                    return (
                      <div
                        key={item.vendor}
                        className="source-row-item"
                        onMouseEnter={(e) => {
                          setHoveredIndex(idx)
                          setHoveredSection('vendor')
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
                        <span className="source-row-label" style={{ width: '130px' }}>{item.vendor}</span>
                        <div className="source-row-track">
                          <div
                            className="source-row-bar"
                            style={{
                              background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                              width: `${widthPercent}%`,
                              opacity: hoveredSection === 'vendor' && hoveredIndex !== idx ? 0.45 : 1,
                              transition: 'width 0.3s ease, opacity 0.2s ease'
                            }}
                          />
                        </div>
                        <span className="source-row-value" style={{ left: '142px' }}>{item.leads} leads ({item.conversion}%)</span>
                      </div>
                    )
                  })}

                  <AnimatePresence>
                    {hoveredSection === 'vendor' && hoveredIndex !== null && (
                      <motion.div
                        className="chart-tooltip-box"
                        style={{ left: hoveredPos.x, top: hoveredPos.y, transform: 'translate(10px, -50%)' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        <span className="tooltip-title">{vendorData[hoveredIndex].vendor}</span>
                        <div className="tooltip-stat">
                          <span>Total Leads:</span>
                          <span className="tooltip-val">{vendorData[hoveredIndex].leads}</span>
                        </div>
                        <div className="tooltip-stat">
                          <span>Conversion:</span>
                          <span className="tooltip-val">{vendorData[hoveredIndex].conversion}%</span>
                        </div>
                        <div className="tooltip-stat">
                          <span>Quality Score:</span>
                          <span className="tooltip-val">{vendorData[hoveredIndex].qualityScore} / 10</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Counselor Custom Visual Stack Chart */
                <div className="chart-wrapper" style={{ padding: '10px 0' }}>
                  <div className="counselor-perf-container">
                    {counselorData.map((item) => {
                      const assignedWidth = maxCounselorAssigned > 0 ? (item.assigned / maxCounselorAssigned) * 100 : 0
                      const convertedWidth = maxCounselorAssigned > 0 ? (item.converted / maxCounselorAssigned) * 100 : 0

                      return (
                        <div key={item.counselor} className="counselor-perf-row">
                          <div className="counselor-name-row">
                            <span className="counselor-name">{item.counselor}</span>
                            <span className="counselor-ratio">
                              {item.converted} converted / {item.assigned} assigned ({item.conversion}%)
                            </span>
                          </div>
                          <div className="counselor-bar-track">
                            <div
                              className="counselor-bar-assigned"
                              style={{
                                width: `${assignedWidth}%`,
                                transition: 'width 0.3s ease'
                              }}
                            />
                            <div
                              className="counselor-bar-converted"
                              style={{
                                width: `${convertedWidth}%`,
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tabular report (Generate report) */}
            <div className="analytics-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <h2>{vendorCounselorMode === 'vendor' ? 'Vendor Performance Report' : 'Counselor Conversion Report'}</h2>
                  <p>Performance tracking table with filters and CSV export</p>
                </div>
              </div>
              <div className="report-view-wrapper">
                {vendorCounselorMode === 'vendor' ? (
                  /* Vendor Tabular Report View */
                  <>
                    <div className="report-toolbar">
                      <div className="report-search">
                        <span className="material-symbols-outlined report-search-icon">search</span>
                        <input
                          type="text"
                          placeholder="Search vendor..."
                          value={searchVendor}
                          onChange={(e) => setSearchVendor(e.target.value)}
                        />
                      </div>
                      <button
                        className="export-btn"
                        onClick={() => handleExportCSV(
                          'Vendor Performance',
                          ['Vendor Name', 'Leads Generated', 'Conversion Rate (%)', 'Lead Quality Score (10)'],
                          vendorData.map(v => [v.vendor, v.leads, v.conversion, v.qualityScore])
                        )}
                      >
                        <span className="material-symbols-outlined">download</span>
                        Generate Report
                      </button>
                    </div>

                    <div className="report-table-wrapper">
                      <table className="analytics-table">
                        <thead>
                          <tr>
                            <th onClick={() => handleSort('vendor')}>Vendor Name</th>
                            <th onClick={() => handleSort('leads')}>Leads Generated</th>
                            <th onClick={() => handleSort('conversion')}>Conversion Rate</th>
                            <th onClick={() => handleSort('qualityScore')}>Quality Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVendorReport.map((row, idx) => (
                            <tr key={idx}>
                              <td className="col-primary">{row.vendor}</td>
                              <td className="col-mono">{row.leads} leads</td>
                              <td className="col-mono col-success">{row.conversion}%</td>
                              <td className="col-mono col-muted">{row.qualityScore} / 10</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  /* Counselor Tabular Report View */
                  <>
                    <div className="report-toolbar">
                      <div className="report-search">
                        <span className="material-symbols-outlined report-search-icon">search</span>
                        <input
                          type="text"
                          placeholder="Search counselor..."
                          value={searchCounselor}
                          onChange={(e) => setSearchCounselor(e.target.value)}
                        />
                      </div>
                      <button
                        className="export-btn"
                        onClick={() => handleExportCSV(
                          'Counselor Efficiency',
                          ['Counselor Name', 'Leads Assigned', 'Leads Contacted', 'Leads Converted', 'Conversion Rate (%)'],
                          counselorData.map(c => [c.counselor, c.assigned, c.contacted, c.converted, c.conversion])
                        )}
                      >
                        <span className="material-symbols-outlined">download</span>
                        Generate Report
                      </button>
                    </div>

                    <div className="report-table-wrapper">
                      <table className="analytics-table">
                        <thead>
                          <tr>
                            <th onClick={() => handleSort('counselor')}>Counselor Name</th>
                            <th onClick={() => handleSort('assigned')}>Assigned</th>
                            <th onClick={() => handleSort('contacted')}>Contacted</th>
                            <th onClick={() => handleSort('converted')}>Converted</th>
                            <th onClick={() => handleSort('conversion')}>Conversion Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCounselorReport.map((row, idx) => (
                            <tr key={idx}>
                              <td className="col-primary">{row.counselor}</td>
                              <td className="col-mono">{row.assigned}</td>
                              <td className="col-mono col-muted">{row.contacted}</td>
                              <td className="col-mono col-primary">{row.converted}</td>
                              <td className="col-mono col-success">{row.conversion}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
