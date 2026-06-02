import React, { useState } from 'react'
import { motion } from 'framer-motion'
import '../../assets/dashboard/dashboardgraphcards.css'

export default function DashboardGraphCard({ sources = [] }) {
  const [activeTab, setActiveTab] = useState('volume')
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [chartStyle, setChartStyle] = useState('line') // 'line' | 'bar' | 'pie'

  const tabs = [
    { 
      id: 'volume', 
      label: 'Lead Volume', 
      icon: 'bar_chart',
      unit: ' leads',
      data: [
        { label: 'May 19', value: 65 },
        { label: 'May 20', value: 59 },
        { label: 'May 21', value: 80 },
        { label: 'May 22', value: 81 },
        { label: 'May 23', value: 56 },
        { label: 'May 24', value: 55 },
        { label: 'May 25', value: 70 },
        { label: 'May 26', value: 60 },
        { label: 'May 27', value: 80 },
        { label: 'May 28', value: 75 }
      ]
    },
    { 
      id: 'conversion', 
      label: 'Conversion Rate', 
      icon: 'trending_up',
      unit: '%',
      data: [
        { label: 'May 19', value: 11.2 },
        { label: 'May 20', value: 11.8 },
        { label: 'May 21', value: 12.5 },
        { label: 'May 22', value: 13.1 },
        { label: 'May 23', value: 12.9 },
        { label: 'May 24', value: 13.5 },
        { label: 'May 25', value: 13.8 },
        { label: 'May 26', value: 14.0 },
        { label: 'May 27', value: 14.1 },
        { label: 'May 28', value: 14.2 }
      ]
    },
    { 
      id: 'response', 
      label: 'Avg Response Time', 
      icon: 'timer',
      unit: 'h',
      data: [
        { label: 'May 19', value: 6.2 },
        { label: 'May 20', value: 5.9 },
        { label: 'May 21', value: 5.5 },
        { label: 'May 22', value: 5.1 },
        { label: 'May 23', value: 4.8 },
        { label: 'May 24', value: 4.6 },
        { label: 'May 25', value: 4.5 },
        { label: 'May 26', value: 4.3 },
        { label: 'May 27', value: 4.2 },
        { label: 'May 28', value: 4.2 }
      ]
    }
  ]

  const activeTabObj = tabs.find(t => t.id === activeTab)
  const maxVal = Math.max(...activeTabObj.data.map(d => d.value), 1)
  const themeColor = activeTab === 'volume' ? '#2563eb' : activeTab === 'conversion' ? '#10b981' : '#f59e0b'

  const getSliceColor = (tab, index) => {
    const blueShades = ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff', '#f8fafc']
    const greenShades = ['#064e3b', '#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5', '#f0fdf4']
    const amberShades = ['#78350f', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde047', '#fef08a', '#fef9c3', '#fefcbf']
    
    if (tab === 'volume') return blueShades[index % 10]
    if (tab === 'conversion') return greenShades[index % 10]
    return amberShades[index % 10]
  }

  return (
    <div className="charts-grid">
      {/* Dynamic Switched Chart */}
      <div className="chart-card">
        <div className="chart-header-row">
          <h3 className="chart-title" style={{ marginBottom: 0 }}>
            {activeTabObj.label} Over Time
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            {/* Metric Tab Switcher */}
            <div className="chart-tabs-wrapper">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`chart-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <span className="material-symbols-outlined">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Visual Style Selector */}
            <div className="chart-tabs-wrapper ml-1">
              <button
                onClick={() => setChartStyle('line')}
                className={`chart-tab-btn ${chartStyle === 'line' ? 'active' : ''}`}
                style={{ padding: '3px 6px' }}
                title="Line Area Chart"
              >
                <span className="material-symbols-outlined">show_chart</span>
              </button>
              <button
                onClick={() => setChartStyle('bar')}
                className={`chart-tab-btn ${chartStyle === 'bar' ? 'active' : ''}`}
                style={{ padding: '3px 6px' }}
                title="Bar Chart"
              >
                <span className="material-symbols-outlined">bar_chart</span>
              </button>
              <button
                onClick={() => setChartStyle('pie')}
                className={`chart-tab-btn ${chartStyle === 'pie' ? 'active' : ''}`}
                style={{ padding: '3px 6px' }}
                title="Pie Donut Chart"
              >
                <span className="material-symbols-outlined">pie_chart</span>
              </button>
            </div>
          </div>
        </div>

        <div className="volume-chart mt-4" style={{ height: '180px', alignItems: 'center' }}>
          {chartStyle === 'pie' ? (
            <div className="flex w-full h-full items-center justify-between gap-6 px-4">
              {/* Left Donut SVG */}
              <div className="relative w-[150px] h-[150px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                  {(() => {
                    let accumulatedPercent = 0
                    const totalVal = activeTabObj.data.reduce((sum, d) => sum + d.value, 0)
                    return activeTabObj.data.map((item, idx) => {
                      const share = item.value / totalVal
                      const strokeDasharray = `${share * 251.327} 251.327`
                      const strokeDashoffset = (0.25 - accumulatedPercent) * 251.327
                      accumulatedPercent += share
                      const sliceColor = getSliceColor(activeTab, idx)
                      const isHovered = hoveredIndex === idx

                      return (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={sliceColor}
                          strokeWidth={isHovered ? 12 : 9}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="cursor-pointer transition-all duration-200"
                          style={{ 
                            filter: isHovered ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' : 'none'
                          }}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                      )
                    })
                  })()}
                </svg>
                {/* Center text of the donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none">
                  {hoveredIndex !== null ? (
                    <>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                        {activeTabObj.data[hoveredIndex].label}
                      </span>
                      <span className="text-[14px] font-extrabold text-slate-800 mt-0.5 animate-fade-in">
                        {activeTabObj.data[hoveredIndex].value}{activeTabObj.unit}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                        Total
                      </span>
                      <span className="text-[14px] font-extrabold text-slate-800 mt-0.5">
                        {activeTabObj.data.reduce((sum, d) => sum + d.value, 0).toFixed(activeTab === 'volume' ? 0 : 1)}{activeTabObj.unit}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Right Side Grid Legends */}
              <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1.5 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
                {activeTabObj.data.map((item, idx) => {
                  const sliceColor = getSliceColor(activeTab, idx)
                  const isHovered = hoveredIndex === idx
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-2 p-1 rounded-md transition-colors cursor-pointer select-none ${isHovered ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sliceColor }} />
                      <div className="flex flex-col text-left truncate leading-tight">
                        <span className="text-[8.5px] font-bold text-slate-700 truncate">{item.label}</span>
                        <span className="text-[8px] font-semibold text-slate-400">{item.value}{activeTabObj.unit}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : chartStyle === 'line' ? (
            <div className="relative h-[180px] w-full pt-4">
              <svg className="w-full h-[140px] overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* Draw Filled Area Path under the line */}
                <motion.path
                  d={`M 0 140 ${activeTabObj.data.map((item, idx) => `L ${(idx / 9) * 500} ${130 - (item.value / maxVal) * 105}`).join(' ')} L 500 140 Z`}
                  fill={activeTab === 'volume' ? 'url(#blueGradient)' : activeTab === 'conversion' ? 'url(#greenGradient)' : 'url(#amberGradient)'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Draw Curved Spline / Line path */}
                <motion.path
                  d={activeTabObj.data.map((item, idx) => `${idx === 0 ? 'M' : 'L'} ${(idx / 9) * 500} ${130 - (item.value / maxVal) * 105}`).join(' ')}
                  fill="none"
                  stroke={themeColor}
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                />

                {/* Coordinate Markers */}
                {activeTabObj.data.map((item, idx) => {
                  const x = (idx / 9) * 500
                  const y = 130 - (item.value / maxVal) * 105
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r={hoveredIndex === idx ? 6 : 4}
                      fill={themeColor}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-all duration-150"
                      style={{ filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15))' }}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  )
                })}
              </svg>

              {/* HTML Floating Tooltips Overlay (positioned relative to container) */}
              <div className="absolute inset-0 pointer-events-none">
                {activeTabObj.data.map((item, idx) => {
                  const leftPercent = (idx / 9) * 100
                  const y = 130 - (item.value / maxVal) * 105
                  const topPercent = (y / 180) * 100 // Map coordinates relative to parent container height
                  return (
                    <React.Fragment key={idx}>
                      {hoveredIndex === idx && (
                        <div 
                          className="chart-tooltip pointer-events-auto"
                          style={{
                            left: `${leftPercent}%`,
                            top: 'auto',
                            bottom: `calc(${100 - topPercent}% + 8px)`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <span className="tooltip-value">{item.value}{activeTabObj.unit}</span>
                          <span className="tooltip-label">{item.label}</span>
                        </div>
                      )}
                      {/* Floating bottom label */}
                      <span 
                        className="absolute text-slate-400 font-semibold select-none text-[8px]"
                        style={{
                          left: `${leftPercent}%`,
                          bottom: '-12px',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {item.label.split(' ')[1]}
                      </span>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Bar Chart Layout */
            activeTabObj.data.map((item, idx) => {
              const percentage = (item.value / maxVal) * 85 // Scale to max 85% to leave room for tooltips
              return (
                <div
                  key={idx}
                  className="bar-wrapper"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {hoveredIndex === idx && (
                    <div className="chart-tooltip">
                      <span className="tooltip-value">{item.value}{activeTabObj.unit}</span>
                      <span className="tooltip-label">{item.label}</span>
                    </div>
                  )}
                  <motion.div
                    className="bar"
                    style={{
                      opacity: hoveredIndex !== null && hoveredIndex !== idx ? 0.4 : 1,
                      background: activeTab === 'volume' 
                        ? 'linear-gradient(180deg, var(--color-primary, #3b82f6) 0%, rgba(59, 130, 246, 0.15) 100%)' 
                        : activeTab === 'conversion' 
                        ? 'linear-gradient(180deg, #10b981 0%, rgba(16, 185, 129, 0.15) 100%)' 
                        : 'linear-gradient(180deg, #f59e0b 0%, rgba(245, 158, 11, 0.15) 100%)',
                      borderColor: activeTab === 'volume' ? '#3b82f6' : activeTab === 'conversion' ? '#10b981' : '#f59e0b'
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ type: 'spring', stiffness: 90, damping: 14, delay: idx * 0.03 }}
                  />
                  <span 
                    className="text-slate-400 font-semibold select-none mt-2 text-center truncate"
                    style={{ fontSize: '8px', width: '100%', letterSpacing: '-0.02em' }}
                  >
                    {item.label.split(' ')[1]}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Source Breakdown Chart */}
      <div className="chart-card source-breakdown-card">
        <div className="flex justify-between items-center gap-1.5 mb-6">
          <h3 className="chart-title text-[13px] whitespace-nowrap" style={{ marginBottom: 0 }}>Source Breakdown</h3>
          <span className="text-[8px] font-extrabold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0 whitespace-nowrap">
            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
            {(() => {
              const sourceCampaigns = {
                'Google Ads': ['Google Brand Search', 'YouTube Review', 'Display Retargeting'],
                'Facebook': ['Facebook Retargeting', 'Instagram Lead Gen'],
                'Organic': ['SEO Optimization', 'Directory Referrals'],
                'Other': ['B2B Outreach']
              }
              return Object.values(sourceCampaigns).flat().length
            })()} Active Campaigns
            <span className="text-slate-350 select-none">•</span>
            2,451 Leads
          </span>
        </div>
        <div className="source-items-container">
          {(() => {
            const sourceCampaigns = {
              'Google Ads': ['Google Brand Search', 'YouTube Review', 'Display Retargeting'],
              'Facebook': ['Facebook Retargeting', 'Instagram Lead Gen'],
              'Organic': ['SEO Optimization', 'Directory Referrals'],
              'Other': ['B2B Outreach']
            }
            return sources.map((source, idx) => (
              <div key={idx} className="source-item">
                <div className="source-header">
                  <div className="source-name-wrapper">
                    <div className="source-dot" style={{ backgroundColor: source.color }}></div>
                    <span>{source.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">
                    {Math.round((source.percentage / 100) * 2451).toLocaleString()} leads ({source.percentage}%)
                  </span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: source.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${source.percentage}%` }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {sourceCampaigns[source.name]?.map((camp, cIdx) => (
                    <span key={cIdx} className="text-[8px] font-bold bg-slate-50 text-slate-500 px-1 py-0.5 rounded border border-slate-100/80">
                      {camp}
                    </span>
                  ))}
                </div>
              </div>
            ))
          })()}
        </div>
      </div>
    </div>
  )
}
