import React from 'react'
import { motion } from 'framer-motion'
import '../../assets/dashboard/dashboardgraphcards.css'

export default function DashboardGraphCard({ sources = [], leadVolumeData = [65, 59, 80, 81, 56, 55, 70, 60, 80, 75] }) {
  return (
    <div className="charts-grid">
      {/* Lead Volume Chart */}
      <div className="chart-card">
        <h3 className="chart-title">Lead Volume Over Time</h3>
        <div className="volume-chart">
          {leadVolumeData.map((height, idx) => (
            <motion.div
              key={idx}
              className="bar"
              initial={{ height: 0 }}
              animate={{ height: `${height * 1.5}px` }}
              transition={{ delay: 0.3 + idx * 0.05 }}
            />
          ))}
        </div>
      </div>

      {/* Source Breakdown Chart */}
      <div className="chart-card">
        <h3 className="chart-title">Source Breakdown</h3>
        <div className="space-y-3">
          {sources.map((source, idx) => (
            <div key={idx} className="source-item">
              <div className="source-header">
                <div className="source-name-wrapper">
                  <div className="source-dot" style={{ backgroundColor: source.color }}></div>
                  <span>{source.name}</span>
                </div>
                <span>{source.percentage}%</span>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
