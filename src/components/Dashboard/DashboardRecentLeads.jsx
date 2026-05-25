import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import '../../assets/dashboard/dashboardrecentleads.css'

export default function DashboardRecentLeads({ leads = [], getStatusClass }) {
  const navigate = useNavigate()

  const defaultGetStatusClass = (status) => {
    switch (status) {
      case 'NEW': return 'status-NEW'
      case 'CONTACTED': return 'status-CONTACTED'
      case 'JNI': return 'status-JNI'
      default: return 'status-default'
    }
  }

  const resolveStatusClass = getStatusClass || defaultGetStatusClass

  return (
    <motion.div
      className="recent-leads-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="recent-leads-header">
        <h3>Recent Leads</h3>
        <button onClick={() => navigate('/leads')} className="text-primary cursor-pointer">View All</button>
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
                  {lead.status && (
                    <span className={`status-badge ${resolveStatusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  )}
                </td>
                <td>{lead.assignedTo}</td>
                <td>{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
