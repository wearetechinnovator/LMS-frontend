import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function AllLeads() {
  const [selectedLeads, setSelectedLeads] = useState([])
  const [sortBy, setSortBy] = useState('date')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock leads data
  const leadsData = [
    { id: 'LS-1021', name: 'Eleanor Penthilgon', email: 'eleanor.p@enterprise.com', phone: '+1 (555) 617-2834', status: 'NEW', assignedTo: 'Sarah Jenkins', actions: 'Website Organic', source: 'Website Organic' },
    { id: 'LS-1020', name: 'Jackson Reed', email: 'j.reed88@gmail.com', phone: '+1 (555) 837-1126', status: 'CONTACTED', assignedTo: 'Marcus Chan', actions: 'Paid Search', source: 'Paid Search' },
    { id: 'LS-1019', name: 'Amina Patel', email: 'apatel.design@studio.co', phone: '+44 7890 90877', status: 'QUALIFIED', assignedTo: 'Sarah Jenkins', actions: 'Referral', source: 'Referral' },
    { id: 'LS-1018', name: "Liam O'Connor", email: 'liam.o@solarix.ie', phone: '+353 1 234 5678', status: 'NEW', assignedTo: 'Unassigned', actions: 'Direct Mail', source: 'Direct Mail' },
    { id: 'LS-1017', name: 'Sophia Wong', email: 's.wong@fintech.com', phone: '+852 9123 4567', status: 'CONTACTED', assignedTo: 'Marcus Chan', actions: 'Webinar', source: 'Webinar' },
    { id: 'LS-1016', name: 'David Miller', email: 'dmiller@realtech.io', phone: '+1 (555) 908-1212', status: 'LOST', assignedTo: 'Sarah Jenkins', actions: 'Cold Outreach', source: 'Cold Outreach' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-700'
      case 'CONTACTED':
        return 'bg-orange-100 text-orange-700'
      case 'QUALIFIED':
        return 'bg-green-100 text-green-700'
      case 'LOST':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const toggleSelectAll = () => {
    if (selectedLeads.length === leadsData.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(leadsData.map(lead => lead.id))
    }
  }

  const toggleSelectLead = (id) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id))
    } else {
      setSelectedLeads([...selectedLeads, id])
    }
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Filters & Controls */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Source Filter */}
          <div className="flex items-center gap-2 px-4 h-8 border border-outline-variant rounded bg-surface text-body-md font-body-md text-on-surface">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            <select className="bg-transparent border-none outline-none cursor-pointer text-[12px]">
              <option>Source</option>
              <option>Website Organic</option>
              <option>Paid Search</option>
              <option>Referral</option>
              <option>Direct Mail</option>
              <option>Webinar</option>
              <option>Cold Outreach</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 px-4 h-8 border border-outline-variant rounded bg-surface text-body-md font-body-md text-on-surface">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <select className="bg-transparent border-none outline-none cursor-pointer text-[12px]">
              <option>Date: Last 90 Days</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last Year</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 px-4 h-8 border border-outline-variant rounded bg-surface text-body-md font-body-md text-on-surface">
            <select className="bg-transparent border-none outline-none cursor-pointer text-[12px]">
              <option>Status: All Active</option>
              <option>All</option>
              <option>NEW</option>
              <option>CONTACTED</option>
              <option>QUALIFIED</option>
              <option>LOST</option>
            </select>
          </div>

          {/* Clear All */}
          <button className="text-primary text-body-md font-body-md hover:text-primary/80 transition-colors text-[12px]">
            Clear All
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {selectedLeads.length > 0 && (
            <span className="text-body-md font-body-md text-on-surface-variant text-[12px]">
              {selectedLeads.length} selected
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <motion.div
        className="bg-surface rounded border border-outline-variant overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === leadsData.length && leadsData.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold">Lead Name</th>
              <th className="px-4 py-3 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold">Work Email</th>
              <th className="px-4 py-3 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold">Phone Number</th>
              <th className="px-4 py-3 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold">Assigned To</th>
              <th className="px-4 py-3 text-left text-body-md font-body-md text-on-surface text-[12px] font-semibold">Lead Source</th>
              <th className="px-4 py-3 text-center text-body-md font-body-md text-on-surface text-[12px] font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {leadsData.map((lead, index) => (
              <motion.tr
                key={lead.id}
                className="border-b border-outline-variant hover:bg-surface-container/50 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleSelectLead(lead.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3 text-body-md font-body-md text-on-background text-[12px]">{lead.name}</td>
                <td className="px-4 py-3 text-body-md font-body-md text-on-surface-variant text-[12px]">{lead.email}</td>
                <td className="px-4 py-3 text-body-md font-body-md text-on-surface-variant text-[12px]">{lead.phone}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-[11px] font-semibold ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-body-md font-body-md text-on-surface text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                      {lead.assignedTo.charAt(0)}
                    </div>
                    <span>{lead.assignedTo}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-body-md font-body-md text-on-surface-variant text-[12px]">{lead.source}</td>
                <td className="px-4 py-3 text-center">
                  <button className="p-1 hover:bg-surface-container rounded transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">more_vert</span>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between text-body-md font-body-md text-on-surface-variant text-[12px]">
        <span>Showing 1-50 of 4,209</span>
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select className="px-2 h-6 border border-outline-variant rounded bg-surface text-[11px] cursor-pointer">
            <option>50</option>
            <option>100</option>
            <option>250</option>
          </select>
          <div className="flex items-center gap-1 ml-4">
            <button className="p-1 hover:bg-surface-container rounded transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="p-1 hover:bg-surface-container rounded transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
