import React, { useState } from 'react'
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
    { label: 'This Year', value: 'This Year' }
  ]

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
      <DashboardGraphCard sources={sources} />

      {/* Deep Dive Counselor/Daily/Channel Analytics */}
      <DeepDiveAnalytics triggerToast={triggerToast} />

      <DashboardRecentLeads leads={leads} getStatusClass={getStatusClass} />


    </div>
  )
}