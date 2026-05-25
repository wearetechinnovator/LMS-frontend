import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../assets/teams/teammemberhovercard.css'

export default function TeamMemberHoverCard({ member, children }) {
    const [showHover, setShowHover] = useState(false)

    // Mock lead data for each team member
    const memberLeads = {
        1: [
            { id: 'L-001', name: 'Priya Sharma', leads: 12, status: 'Active' },
            { id: 'L-002', name: 'Rajesh Kumar', leads: 8, status: 'Active' }
        ],
        2: [
            { id: 'L-003', name: 'Emily Watson', leads: 15, status: 'Active' },
            { id: 'L-004', name: 'Michael Chang', leads: 5, status: 'Pending' }
        ],
        3: [
            { id: 'L-005', name: 'Unassigned', leads: 0, status: 'Unassigned' }
        ],
        4: [
            { id: 'L-006', name: 'Alex Johnson', leads: 20, status: 'Active' },
            { id: 'L-007', name: 'Sofia Rodriguez', leads: 9, status: 'Active' }
        ],
        5: [
            { id: 'L-008', name: 'Unassigned', leads: 0, status: 'Unassigned' }
        ],
        6: [
            { id: 'L-009', name: 'David Lee', leads: 18, status: 'Active' },
            { id: 'L-010', name: 'Jessica Brown', leads: 11, status: 'Active' }
        ]
    }

    const leads = memberLeads[member.id] || []
    const totalLeads = leads.reduce((sum, lead) => sum + lead.leads, 0)

    return (
        <div
            className="team-member-hover-wrapper"
            onMouseEnter={() => setShowHover(true)}
            onMouseLeave={() => setShowHover(false)}
        >
            {children}

            <AnimatePresence>
                {showHover && (
                    <motion.div
                        className="team-member-hover-card"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="hover-card-header">
                            <div className="hover-card-avatar">
                                {member.avatar}
                            </div>
                            <div className="hover-card-title">
                                <h4 className="hover-card-name">{member.name}</h4>
                                <p className="hover-card-email">{member.email}</p>
                            </div>
                            <div className={`hover-card-status ${member.status === 'Active' ? 'active' : 'inactive'}`}>
                                <span className="status-dot"></span>
                                <span className="status-text">{member.status}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="hover-card-stats">
                            <div className="stat-item">
                                <span className="stat-label">Role</span>
                                <span className={`stat-value role-badge ${member.role.toLowerCase()}`}>
                                    {member.role}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Department</span>
                                <span className="stat-value">{member.department}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Total Leads</span>
                                <span className="stat-value leads-count">{totalLeads}</span>
                            </div>
                        </div>

                        {/* Leads Section */}
                        <div className="hover-card-leads">
                            <h5 className="leads-title">
                                <span className="material-symbols-outlined">people</span>
                                Current Leads
                            </h5>
                            <div className="leads-list">
                                {leads.length > 0 ? (
                                    leads.map((lead) => (
                                        <div key={lead.id} className="lead-item">
                                            <div className="lead-info">
                                                <p className="lead-name">{lead.name}</p>
                                                <span className={`lead-badge ${lead.status.toLowerCase()}`}>
                                                    {lead.leads > 0 ? `${lead.leads} leads` : lead.status}
                                                </span>
                                            </div>
                                            {lead.leads > 0 && (
                                                <span className="lead-count">{lead.leads}</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-leads">No leads assigned</p>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="hover-card-actions">
                            <button className="action-btn view-leads">
                                <span className="material-symbols-outlined">visibility</span>
                                View All Leads
                            </button>
                            <button className="action-btn reassign">
                                <span className="material-symbols-outlined">person_add</span>
                                Re-assign
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}