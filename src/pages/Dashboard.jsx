import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AllLeads from './AllLeads'
import FormBuilder from './FormBuilder'

export default function Dashboard({ username, onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mock data
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-700'
      case 'CONTACTED':
        return 'bg-orange-100 text-orange-700'
      case 'JNI':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="bg-background h-screen flex overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar username={username} onLogout={onLogout} currentPage={activeNav} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Dashboard View */}
          {activeNav === 'dashboard' && (
            <>
              {/* Date Filter & Export */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="font-body-md text-body-md">Last 30 Days</span>
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
                <button className="flex items-center gap-2 px-4 h-8 border border-outline-variant rounded text-body-md font-body-md text-on-surface hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export
                </button>
              </div>

              {/* Stats Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-surface border border-black/20 rounded p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-headline-lg text-headline-lg text-on-background">{stat.value}</h3>
                      <span className={`font-body-sm text-body-sm ${stat.change.includes('+') ? 'text-primary' : 'text-error'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts Grid */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Lead Volume Chart */}
                <div className="lg:col-span-2 bg-surface border border-outline-variant rounded p-6">
                  <h3 className="font-headline-md text-headline-md text-on-background mb-4">Lead Volume Over Time</h3>
                  <div className="h-48 flex items-end justify-between gap-2 px-2">
                    {[65, 59, 80, 81, 56, 55, 70, 60, 80, 75].map((height, idx) => (
                      <motion.div
                        key={idx}
                        className="flex-1 bg-primary/30 border border-primary rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${height * 2}px` }}
                        transition={{ delay: 0.3 + idx * 0.05, duration: 0.6 }}
                        style={{ minHeight: '2px' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Source Breakdown */}
                <div className="bg-surface border border-outline-variant rounded p-6">
                  <h3 className="font-headline-md text-headline-md text-on-background mb-4">Source Breakdown</h3>
                  <div className="space-y-3">
                    {sources.map((source, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                            <span className="font-body-md text-body-md text-on-surface">{source.name}</span>
                          </div>
                          <span className="font-body-md text-body-md text-on-surface-variant">{source.percentage}%</span>
                        </div>
                        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: source.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${source.percentage}%` }}
                            transition={{ delay: 0.4 + idx * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recent Leads */}
              <motion.div
                className="bg-surface border border-outline-variant rounded p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-background">Recent Leads</h3>
                  <a href="#" className="text-primary font-body-md text-body-md hover:text-primary/80">
                    View All
                  </a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-outline-variant">
                        <th className="text-left px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">Lead Name</th>
                        <th className="text-left px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">Source</th>
                        <th className="text-left px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">Status</th>
                        <th className="text-left px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">Assigned To</th>
                        <th className="text-left px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, idx) => (
                        <motion.tr
                          key={lead.id}
                          className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                        >
                          <td className="px-4 py-3 font-body-md text-body-md text-on-surface">{lead.name}</td>
                          <td className="px-4 py-3 font-body-md text-body-md text-on-surface">{lead.source}</td>
                          <td className="px-4 py-3">
                            {lead.status && (
                              <span className={`inline-block px-2 py-1 rounded font-body-sm text-body-sm ${getStatusColor(lead.status)}`}>
                                {lead.status}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-body-md text-body-md text-on-surface">{lead.assignedTo}</td>
                          <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{lead.date}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}

          {/* All Leads View */}
          {activeNav === 'leads' && <AllLeads />}

          {/* Form Builder View */}
          {activeNav === 'form-builder' && <FormBuilder />}

          {/* Campaigns, Teams, Add Lead - Placeholder */}
          {['campaigns', 'teams', 'add-lead'].includes(activeNav) && (
            <div className="flex items-center justify-center h-full">
              <p className="text-on-surface-variant font-body-md text-body-md">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
