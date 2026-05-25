import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ExportButton from '../components/ExportButton'
import Toast from '../components/Toast'
import TeamStatsCard from '../components/TeamStateCard'

export default function Teams() {
    const [selectedDept, setSelectedDept] = useState('All')
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'User',
        department: 'Strategic Ops',
        sendInvite: true
    })

    const triggerToast = (message) => {
        setToastMessage(message)
        setShowToast(true)
    }

    const stats = [
        { label: 'TOTAL MEMBERS', value: '128', change: '-2.5%', positive: false },
        { label: 'ACTIVE NOW', value: '42', subtext: 'Live users' },
        { label: 'PENDING INVITES', value: '12', warning: true },
        { label: 'AVG ACTIVITY', value: '6.8h', subtext: 'Last 7 days' }
    ]

    const teamMembers = [
        { id: 1, name: 'Sarah Jordan', email: 'sarah.jordan@...', role: 'Lead', department: 'Strategic Ops', lastActive: '2 mins ago', status: 'Active', avatar: 'SJ' },
        { id: 2, name: 'Miriam Chen', email: 'miriam.chen@...', role: 'Manager', department: 'Sales Engineering', lastActive: '1 hour ago', status: 'Active', avatar: 'MC' },
        { id: 3, name: 'Alicia Lowery', email: 'alicia.lowery@...', role: 'User', department: 'Account Mgmt', lastActive: 'Dec 22, 11:23', status: 'Inactive', avatar: 'AL' },
        { id: 4, name: 'Derek Moore', email: 'derek.moore@...', role: 'Manager', department: 'Customer Success', lastActive: '2 hrs ago', status: 'Active', avatar: 'DM' },
        { id: 5, name: 'David Varela', email: 'david.varela@...', role: 'User', department: 'Lead Generation', lastActive: 'Yesterday', status: 'Inactive', avatar: 'DV' },
        { id: 6, name: 'Maria Tanaka', email: 'maria.tanaka@...', role: 'Manager', department: 'Lead Generation', lastActive: '5 mins ago', status: 'Active', avatar: 'MT' }
    ]

    const filteredMembers = teamMembers.filter(member => {
        const matchSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchDept = selectedDept === 'All' || member.department === selectedDept
        const matchStatus = selectedStatus === 'All' || member.status === selectedStatus
        return matchSearch && matchDept && matchStatus
    })

    const departments = ['All', 'Strategic Ops', 'Sales Engineering', 'Account Mgmt', 'Customer Success', 'Lead Generation']

    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-br from-background via-background to-surface-container-lowest p-4 space-y-4 overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-headline-lg font-headline-lg text-on-background text-[20px]">Team Management</h1>
                    <p className="text-body-md text-on-surface-variant text-[10px] mt-0.5">Manage team members and control user activity across departments</p>
                </div>
                <div className="flex gap-2">
                    <Toast
                        message={toastMessage}
                        isVisible={showToast}
                        onClose={() => setShowToast(false)}
                    />
                    <ExportButton triggerToast={triggerToast} />
                    <button
                        onClick={() => setShowAddMemberModal(true)}
                        className="px-3 h-[32px] py-1.5 border border-primary text-primary rounded text-[10px] bg-primary/10 hover:bg-primary/20 transition-colors font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        Add Member
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                {stats.map((stat, idx) => (
                    <TeamStatsCard
                        key={idx}
                        label={stat.label}
                        value={stat.value}
                        change={stat.change}
                        warning={stat.warning}
                        subtext={stat.subtext}
                        idx={idx}
                    />
                ))}
            </div>

            {/* Filters and Search */}
            <div className="flex gap-3 items-center">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-8 pl-9 pr-3 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
                    />
                </div>

                <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
                >
                    {departments.map(dept => (
                        <option key={dept}>{dept}</option>
                    ))}
                </select>

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-8 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[10px]"
                >
                    <option>All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-[10px]">
                        <thead className="bg-surface-container border-b border-outline-variant sticky top-0">
                            <tr>
                                <th className="px-3 py-2 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">NAME</th>
                                <th className="px-3 py-2 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">ROLE</th>
                                <th className="px-3 py-2 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">DEPARTMENT</th>
                                <th className="px-3 py-2 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">LAST ACTIVE</th>
                                <th className="px-3 py-2 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">STATUS</th>
                                <th className="px-3 py-2 text-center font-label-caps text-label-caps text-on-surface-variant text-[8px]">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-surface-container transition-colors">
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold">
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-on-background">{member.name}</p>
                                                <p className="text-on-surface-variant text-[9px]">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold ${member.role === 'Lead' ? 'bg-primary/20 text-primary' :
                                            member.role === 'Manager' ? 'bg-warning/20 text-warning' :
                                                'bg-outline-variant/20 text-on-surface-variant'
                                            }`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-on-surface">{member.department}</td>
                                    <td className="px-3 py-2 text-on-surface-variant">{member.lastActive}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-1">
                                            <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-primary' : 'bg-on-surface-variant'}`}></span>
                                            <span className={member.status === 'Active' ? 'text-primary font-semibold' : 'text-on-surface-variant'}>
                                                {member.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant hover:text-on-surface">
                                            <span className="material-symbols-outlined text-[14px]">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-3 py-2 border-t border-outline-variant flex items-center justify-between bg-surface-container">
                    <p className="text-[9px] text-on-surface-variant">Showing 1 to {Math.min(6, filteredMembers.length)} of {filteredMembers.length} members</p>
                    <div className="flex items-center gap-1">
                        <button className="p-1 rounded hover:bg-surface-container-lowest transition-colors text-on-surface-variant">
                            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                        </button>
                        <div className="flex gap-0.5">
                            {[1, 2, 3].map(page => (
                                <button
                                    key={page}
                                    className={`w-6 h-6 rounded text-[9px] font-semibold transition-colors ${page === 1
                                        ? 'bg-primary text-on-primary'
                                        : 'hover:bg-surface-container-lowest text-on-surface'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button className="p-1 rounded hover:bg-surface-container-lowest transition-colors text-on-surface-variant">
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Member Modal */}
            <AnimatePresence>
                {showAddMemberModal && (
                    <motion.div
                        className="fixed inset-0 bg-on-background/40 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddMemberModal(false)}
                    >
                        <motion.div
                            className="bg-surface-container-lowest rounded shadow-2xl max-w-md w-full"
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-3 border-b border-outline-variant flex justify-between items-center">
                                <h3 className="font-headline-md text-headline-md text-on-background text-[14px] font-bold">Add Team Member</h3>
                                <button
                                    onClick={() => setShowAddMemberModal(false)}
                                    className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-3 space-y-2.5">
                                {/* First Name */}
                                <div>
                                    <label className="text-label-caps text-label-caps text-on-surface-variant text-[7px] font-semibold mb-1 block">FIRST NAME *</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="Enter first name"
                                        className="w-full h-7 px-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="text-label-caps text-label-caps text-on-surface-variant text-[7px] font-semibold mb-1 block">LAST NAME *</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Enter last name"
                                        className="w-full h-7 px-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-label-caps text-label-caps text-on-surface-variant text-[7px] font-semibold mb-1 block">EMAIL ADDRESS *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="name@company.com"
                                        className="w-full h-7 px-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="text-on-surface-variant text-[7px] font-semibold mb-1 block tracking-wider">ROLE *</label>
                                    <div className="relative">
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full h-7 px-2 pr-6 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                                            style={{ fontSize: '11px', color: 'inherit', lineHeight: '1' }}
                                        >
                                            <option value="User">User</option>
                                            <option value="Lead">Lead</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[13px]" style={{ color: 'inherit' }}>expand_more</span>
                                    </div>
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="text-on-surface-variant text-[7px] font-semibold mb-1 block tracking-wider">DEPARTMENT *</label>
                                    <div className="relative">
                                        <select
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full h-7 px-2 pr-6 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                                            style={{ fontSize: '11px', color: 'inherit', lineHeight: '1' }}
                                        >
                                            <option value="Strategic Ops">Strategic Ops</option>
                                            <option value="Sales Engineering">Sales Engineering</option>
                                            <option value="Account Mgmt">Account Mgmt</option>
                                            <option value="Customer Success">Customer Success</option>
                                            <option value="Lead Generation">Lead Generation</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[13px]" style={{ color: 'inherit' }}>expand_more</span>
                                    </div>
                                </div>

                                {/* Send Invite Checkbox */}
                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="checkbox"
                                        id="sendInvite"
                                        checked={formData.sendInvite}
                                        onChange={(e) => setFormData({ ...formData, sendInvite: e.target.checked })}
                                        className="w-3 h-3 rounded border border-outline-variant checked:bg-primary checked:border-primary cursor-pointer"
                                    />
                                    <label htmlFor="sendInvite" className="text-[9px] text-on-surface cursor-pointer">
                                        Send invitation email
                                    </label>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-3 border-t border-outline-variant flex gap-2">
                                <button
                                    onClick={() => setShowAddMemberModal(false)}
                                    className="flex-1 px-3 py-1.5 border border-outline-variant text-on-surface rounded text-[9px] font-semibold hover:bg-surface-container transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        triggerToast(`${formData.firstName} ${formData.lastName} added to team`)
                                        setShowAddMemberModal(false)
                                        setFormData({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            role: 'User',
                                            department: 'Strategic Ops',
                                            sendInvite: true
                                        })
                                    }}
                                    className="flex-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded text-[9px] font-bold transition-colors"
                                >
                                    Add Member
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
