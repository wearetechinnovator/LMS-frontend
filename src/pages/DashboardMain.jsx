import React from 'react'
import { motion } from 'framer-motion'
import '../assets/custom.css'

export default function DashboardMain() {
  const stats = [
    { label: 'TOTAL LEADS', value: '2,451', change: '+18%', color: 'primary' },
    { label: 'CONVERSION RATE', value: '14.2%', change: '+1.1%', color: 'success' },
    { label: 'AVG TIME TO CLOSE', value: '4.2d', change: '-0.3d', color: 'error' },
    { label: 'ACTIVE CAMPAIGNS', value: '8', change: '+2', color: 'primary' }
  ]

  const leads = [
    { id: 1, name: 'Devan Anderson', source: 'Google Ads', status: 'NEW', assignedTo: 'Michael', date: '10 mins ago' },
    { id: 2, name: 'Chief Anaspore', source: 'Organic Search', status: 'CONTACTED', assignedTo: 'Janet', date: '1 hour ago' },
    { id: 3, name: 'Elbert Al-Jarah', source: 'Facebook', status: 'JNI', assignedTo: 'Michael', date: '5 hours ago' },
    { id: 4, name: 'Alom Morranda', source: 'Referral', status: '', assignedTo: 'Unassigned', date: '1 day ago' }
  ]

  const sources = [
    { name: 'Google Ads', percentage: 35, color: '#4285F4' },
    { name: 'Facebook', percentage: 30, color: '#1877F2' },
    { name: 'Organic', percentage: 15, color: '#34A853' },
    { name: 'Other', percentage: 20, color: '#ABABAB' }
  ]

  const getStatusClass = (status) => {
    switch (status) {
      case 'NEW': return 'status-NEW'
      case 'CONTACTED': return 'status-CONTACTED'
      case 'JNI': return 'status-JNI'
      default: return 'status-default'
    }
  }

  return (
    <div className="dashboard-wrapper dashboard-page-scope">
      <div className="dashboard-header">
        <div className="date-filter">
          <span>Last 30 Days</span>
          <span className="material-symbols-outlined">expand_more</span>
        </div>
        <button className="export-btn">
          <span className="material-symbols-outlined">download</span>
          Export
        </button>
      </div>

      <motion.div
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}>
            <p className="stat-label">{stat.label}</p>
            <div className="stat-value-wrapper">
              <h3 className="stat-value">{stat.value}</h3>
              <span className={`stat-change ${stat.change.includes('+') ? 'positive' : 'negative'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Lead Volume Over Time</h3>
          <div className="volume-chart">
            {[65, 59, 80, 81, 56, 55, 70, 60, 80, 75].map((height, idx) => (
              <motion.div key={idx} className="bar" initial={{ height: 0 }} animate={{ height: `${height * 1.5}px` }} transition={{ delay: 0.3 + idx * 0.05 }} />
            ))}
          </div>
        </div>

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
                  <motion.div className="h-full" style={{ backgroundColor: source.color }} initial={{ width: 0 }} animate={{ width: `${source.percentage}%` }} transition={{ delay: 0.4 + idx * 0.1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div className="recent-leads-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="recent-leads-header">
          <h3>Recent Leads</h3>
          <a href="#" className="text-primary">View All</a>
        </div>
        <div className="table-wrapper">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Source</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.source}</td>
                  <td>
                    {lead.status && <span className={`status-badge ${getStatusClass(lead.status)}`}>{lead.status}</span>}
                  </td>
                  <td>{lead.assignedTo}</td>
                  <td>{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}