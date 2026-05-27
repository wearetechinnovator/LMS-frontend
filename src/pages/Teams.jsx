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
    const [selectedMemberForLeads, setSelectedMemberForLeads] = useState(null)
    const [assigningLeadMode, setAssigningLeadMode] = useState(false)
    const [leadSearchQuery, setLeadSearchQuery] = useState('')
    const [leadTabFilter, setLeadTabFilter] = useState('unassigned') // 'unassigned' | 'all'
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

    const [crmLeads, setCrmLeads] = useState([
        { id: 'LS-1021', name: 'Eleanor Penthilgon', score: 92, status: 'NEW', source: 'Website Organic', location: 'Austin, TX', tier: 'Primary', assignedTo: 1 },
        { id: 'LS-1019', name: 'Amina Patel', score: 95, status: 'QUALIFIED', source: 'Referral', location: 'London, UK', tier: 'Primary', assignedTo: 1 },
        { id: 'LS-1016', name: 'David Miller', score: 15, status: 'LOST', source: 'Cold Outreach', location: 'Boston, MA', tier: 'Tertiary', assignedTo: 1 },
        { id: 'LS-1020', name: 'Jackson Reed', score: 74, status: 'CONTACTED', source: 'Paid Search', location: 'Houston, TX', tier: 'Secondary', assignedTo: 2 },
        { id: 'LS-1017', name: 'Sophia Wong', score: 81, status: 'CONTACTED', source: 'Webinar', location: 'Hong Kong, HK', tier: 'Primary', assignedTo: 2 },
        { id: 'LS-1023', name: 'Robert Chen', score: 88, status: 'QUALIFIED', source: 'Website Organic', location: 'San Francisco, CA', tier: 'Primary', assignedTo: 4 },
        { id: 'LS-1024', name: 'Emma Watson', score: 68, status: 'CONTACTED', source: 'Webinar', location: 'Sydney, AU', tier: 'Secondary', assignedTo: 4 },
        { id: 'LS-1015', name: 'Amina Patel (Duplicate)', score: 62, status: 'NEW', source: 'Cold Outreach', location: 'Manchester, UK', tier: 'Secondary', assignedTo: 6 },
        { id: 'LS-1025', name: 'David Lee', score: 79, status: 'CONTACTED', source: 'Paid Search', location: 'Toronto, CA', tier: 'Primary', assignedTo: 6 },
        { id: 'LS-1018', name: "Liam O'Connor", score: 40, status: 'NEW', source: 'Direct Mail', location: 'Dublin, IE', tier: 'Tertiary', assignedTo: null },
        { id: 'LS-1026', name: 'Sarah Jenkins', score: 87, status: 'NEW', source: 'Website Organic', location: 'Seattle, WA', tier: 'Primary', assignedTo: null },
        { id: 'LS-1027', name: 'Oliver Twist', score: 55, status: 'CONTACTED', source: 'Cold Outreach', location: 'London, UK', tier: 'Secondary', assignedTo: null }
    ])

    const handleCloseDrawer = () => {
        setSelectedMemberForLeads(null)
        setAssigningLeadMode(false)
        setLeadSearchQuery('')
        setLeadTabFilter('unassigned')
    }

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

    const [activeActionMenuMemberId, setActiveActionMenuMemberId] = useState(null)
    const [showEditMemberModal, setShowEditMemberModal] = useState(false)
    const [editingMember, setEditingMember] = useState(null)
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'User',
        department: 'Strategic Ops',
        status: 'Active'
    })

    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'Sarah Jordan', email: 'sarah.jordan@company.com', role: 'Lead', department: 'Strategic Ops', lastActive: '2 mins ago', status: 'Active', avatar: 'SJ' },
        { id: 2, name: 'Miriam Chen', email: 'miriam.chen@company.com', role: 'Manager', department: 'Sales Engineering', lastActive: '1 hour ago', status: 'Active', avatar: 'MC' },
        { id: 3, name: 'Alicia Lowery', email: 'alicia.lowery@company.com', role: 'User', department: 'Account Mgmt', lastActive: 'Dec 22, 11:23', status: 'Inactive', avatar: 'AL' },
        { id: 4, name: 'Derek Moore', email: 'derek.moore@company.com', role: 'Manager', department: 'Customer Success', lastActive: '2 hrs ago', status: 'Active', avatar: 'DM' },
        { id: 5, name: 'David Varela', email: 'david.varela@company.com', role: 'User', department: 'Lead Generation', lastActive: 'Yesterday', status: 'Inactive', avatar: 'DV' },
        { id: 6, name: 'Maria Tanaka', email: 'maria.tanaka@company.com', role: 'Manager', department: 'Lead Generation', lastActive: '5 mins ago', status: 'Active', avatar: 'MT' }
    ])

    const handleStartEdit = (member) => {
        const nameParts = member.name.split(' ')
        setEditingMember(member)
        setEditFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: member.email,
            role: member.role,
            department: member.department,
            status: member.status
        })
        setShowEditMemberModal(true)
        setActiveActionMenuMemberId(null)
    }

    const handleSaveEdit = () => {
        setTeamMembers(teamMembers.map(m => {
            if (m.id === editingMember.id) {
                return {
                    ...m,
                    name: `${editFormData.firstName} ${editFormData.lastName}`,
                    email: editFormData.email,
                    role: editFormData.role,
                    department: editFormData.department,
                    status: editFormData.status,
                    avatar: ((editFormData.firstName[0] || '') + (editFormData.lastName[0] || '')).toUpperCase()
                }
            }
            return m
        }))
        triggerToast(`Updated details for ${editFormData.firstName} ${editFormData.lastName}`)
        setShowEditMemberModal(false)
        setEditingMember(null)
    }

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
                                <tr 
                                    key={member.id} 
                                    className="hover:bg-surface-container transition-colors cursor-pointer"
                                    onClick={() => setSelectedMemberForLeads(member)}
                                >
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
                                    <td className="px-3 py-2 text-center relative" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => setActiveActionMenuMemberId(activeActionMenuMemberId === member.id ? null : member.id)}
                                            className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant hover:text-on-surface cursor-pointer flex items-center justify-center mx-auto border-0 bg-transparent"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">more_vert</span>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {activeActionMenuMemberId === member.id && (
                                                <>
                                                    {/* Invisible backdrop to dismiss dropdown on click outside */}
                                                    <div 
                                                        className="fixed inset-0 z-10 cursor-default" 
                                                        onClick={() => setActiveActionMenuMemberId(null)}
                                                    />
                                                    
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                                        transition={{ duration: 0.1 }}
                                                        className="absolute right-3 top-8 w-28 bg-surface-container-lowest border border-outline-variant rounded shadow-xl py-0.5 z-20 text-left"
                                                    >
                                                        <button
                                                            onClick={() => handleStartEdit(member)}
                                                            className="w-full px-2 py-1.5 hover:bg-surface-container text-on-surface text-[8px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border-0 text-left bg-transparent"
                                                        >
                                                            <span className="material-symbols-outlined text-[10px]">edit</span>
                                                            Edit Member
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newStatus = member.status === 'Active' ? 'Inactive' : 'Active'
                                                                setTeamMembers(teamMembers.map(m => m.id === member.id ? { ...m, status: newStatus } : m))
                                                                triggerToast(`${member.name} status set to ${newStatus}`)
                                                                setActiveActionMenuMemberId(null)
                                                            }}
                                                            className="w-full px-2 py-1.5 hover:bg-surface-container text-on-surface text-[8px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border-0 text-left bg-transparent"
                                                        >
                                                            <span className="material-symbols-outlined text-[10px]">
                                                                {member.status === 'Active' ? 'toggle_off' : 'toggle_on'}
                                                            </span>
                                                            {member.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <div className="border-t border-outline-variant/55 my-0.5" />
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Are you sure you want to remove ${member.name}?`)) {
                                                                    setTeamMembers(teamMembers.filter(m => m.id !== member.id))
                                                                    triggerToast(`${member.name} removed from the team`)
                                                                    setActiveActionMenuMemberId(null)
                                                                }
                                                            }}
                                                            className="w-full px-2 py-1.5 hover:bg-red-50 text-red-600 text-[8px] font-bold flex items-center gap-1 transition-colors cursor-pointer border-0 text-left bg-transparent"
                                                        >
                                                            <span className="material-symbols-outlined text-[10px]">delete</span>
                                                            Remove
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
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
                                        if (!formData.firstName.trim()) {
                                            triggerToast('First name is required')
                                            return
                                        }
                                        const newMember = {
                                            id: Date.now(),
                                            name: `${formData.firstName} ${formData.lastName}`.trim(),
                                            email: formData.email || `${formData.firstName.toLowerCase()}@company.com`,
                                            role: formData.role,
                                            department: formData.department,
                                            lastActive: 'Just now',
                                            status: 'Active',
                                            avatar: ((formData.firstName[0] || '') + (formData.lastName[0] || '')).toUpperCase()
                                        }
                                        setTeamMembers([...teamMembers, newMember])
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
                                    className="flex-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded text-[9px] font-bold transition-colors border-0 cursor-pointer"
                                >
                                    Add Member
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Member Modal */}
            <AnimatePresence>
                {showEditMemberModal && (
                    <motion.div
                        className="fixed inset-0 bg-on-background/40 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowEditMemberModal(false)}
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
                                <h3 className="font-headline-md text-headline-md text-on-background text-[14px] font-bold">Edit Team Member</h3>
                                <button
                                    onClick={() => setShowEditMemberModal(false)}
                                    className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant flex items-center justify-center cursor-pointer border-0 bg-transparent"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-3 space-y-2.5 text-left">
                                {/* First Name */}
                                <div>
                                    <label className="text-label-caps text-label-caps text-on-surface-variant text-[7px] font-semibold mb-1 block">FIRST NAME *</label>
                                    <input
                                        type="text"
                                        value={editFormData.firstName}
                                        onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                                        placeholder="Enter first name"
                                        className="w-full h-7 px-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="text-label-caps text-label-caps text-on-surface-variant text-[7px] font-semibold mb-1 block">LAST NAME *</label>
                                    <input
                                        type="text"
                                        value={editFormData.lastName}
                                        onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                                        placeholder="Enter last name"
                                        className="w-full h-7 px-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-label-caps text-label-caps text-on-surface-variant text-[7px] font-semibold mb-1 block">EMAIL ADDRESS *</label>
                                    <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        placeholder="name@company.com"
                                        className="w-full h-7 px-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="text-on-surface-variant text-[7px] font-semibold mb-1 block tracking-wider">ROLE *</label>
                                    <div className="relative">
                                        <select
                                            value={editFormData.role}
                                            onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
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
                                            value={editFormData.department}
                                            onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
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

                                {/* Status */}
                                <div>
                                    <label className="text-on-surface-variant text-[7px] font-semibold mb-1 block tracking-wider">STATUS *</label>
                                    <div className="relative">
                                        <select
                                            value={editFormData.status}
                                            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                            className="w-full h-7 px-2 pr-6 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                                            style={{ fontSize: '11px', color: 'inherit', lineHeight: '1' }}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[13px]" style={{ color: 'inherit' }}>expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-3 border-t border-outline-variant flex gap-2">
                                <button
                                    onClick={() => setShowEditMemberModal(false)}
                                    className="flex-1 px-3 py-1.5 border border-outline-variant text-on-surface rounded text-[9px] font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded text-[9px] font-bold transition-colors border-0 cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sliding Drawer for Member's Assigned Leads */}
            <AnimatePresence>
                {selectedMemberForLeads && (() => {
                    const leads = crmLeads.filter(lead => lead.assignedTo === selectedMemberForLeads.id)
                    const totalLeadsCount = leads.length
                    
                    const performanceScore = totalLeadsCount > 0 ? Math.round(leads.reduce((acc, curr) => acc + curr.score, 0) / totalLeadsCount) : null
                    const conversionRate = totalLeadsCount > 0 ? Math.round((leads.filter(l => l.status === 'QUALIFIED').length / totalLeadsCount) * 100) : 0
                    
                    return (
                        <>
                            {/* Backdrop overlay */}
                            <motion.div
                                className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleCloseDrawer}
                            />

                            {/* Drawer Content */}
                            <motion.div
                                className="fixed right-0 top-0 h-full w-[420px] bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col overflow-hidden"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            >
                                {assigningLeadMode ? (() => {
                                    // 1. Calculate how many leads are not assigned:
                                    const unassignedLeads = crmLeads.filter(lead => lead.assignedTo === null)
                                    const totalUnassigned = unassignedLeads.length
                                    
                                    // 2. Filter crmLeads by tab filter and search query:
                                    const filteredLeadsToAssign = crmLeads.filter(lead => {
                                        const matchesSearch = lead.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
                                            lead.id.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
                                            lead.source.toLowerCase().includes(leadSearchQuery.toLowerCase())
                                            
                                        if (leadTabFilter === 'unassigned') {
                                            return matchesSearch && lead.assignedTo === null
                                        }
                                        return matchesSearch
                                    })
                                    
                                    return (
                                        <>
                                            {/* Assignment Header Area */}
                                            <div className="p-4 border-b border-outline-variant relative bg-gradient-to-br from-primary/5 via-transparent to-transparent flex items-center gap-2">
                                                <button
                                                    onClick={() => setAssigningLeadMode(false)}
                                                    className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer flex items-center justify-center"
                                                    title="Back to details"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                                </button>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-on-background text-[13px] truncate">Assign Leads</h3>
                                                    <p className="text-on-surface-variant text-[9px] truncate">Assign to {selectedMemberForLeads.name}</p>
                                                </div>
                                                <button
                                                    onClick={handleCloseDrawer}
                                                    className="ml-auto p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer flex items-center justify-center"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                                </button>
                                            </div>

                                            {/* Unassigned Leads highlight box at the top */}
                                            <div className="p-3 bg-surface-container-low/60 border-b border-outline-variant">
                                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex justify-between items-center shadow-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-primary text-[20px]">assignment_late</span>
                                                        <div className="text-left">
                                                            <h4 className="text-[11px] font-bold text-on-background">Unassigned CRM Leads</h4>
                                                            <p className="text-[9px] text-on-surface-variant mt-0.5">Leads waiting for direct counselor assignment</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-primary/20 text-primary font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-primary/10 shadow-sm animate-pulse flex-shrink-0">
                                                        {totalUnassigned} Left
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Search and Tabs */}
                                            <div className="p-3 border-b border-outline-variant space-y-2 bg-surface-container-lowest">
                                                {/* Mini Search input inside drawer */}
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">search</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search leads in CRM..."
                                                        value={leadSearchQuery}
                                                        onChange={(e) => setLeadSearchQuery(e.target.value)}
                                                        className="w-full h-8 pl-7 pr-3 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-[9px] text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                    />
                                                    {leadSearchQuery && (
                                                        <button 
                                                            onClick={() => setLeadSearchQuery('')}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface cursor-pointer flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-[12px]">clear</span>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Mini Segmented Tab Selection */}
                                                <div className="flex bg-surface-container-low p-0.5 rounded border border-outline-variant/30 text-[9px]">
                                                    <button
                                                        onClick={() => setLeadTabFilter('unassigned')}
                                                        className={`flex-1 py-1 rounded font-bold transition-all cursor-pointer ${
                                                            leadTabFilter === 'unassigned'
                                                                ? 'bg-surface-container-lowest text-primary shadow-xs'
                                                                : 'text-on-surface-variant hover:text-on-surface'
                                                        }`}
                                                    >
                                                        Unassigned ({totalUnassigned})
                                                    </button>
                                                    <button
                                                        onClick={() => setLeadTabFilter('all')}
                                                        className={`flex-1 py-1 rounded font-bold transition-all cursor-pointer ${
                                                            leadTabFilter === 'all'
                                                                ? 'bg-surface-container-lowest text-primary shadow-xs'
                                                                : 'text-on-surface-variant hover:text-on-surface'
                                                        }`}
                                                    >
                                                        All CRM Leads ({crmLeads.length})
                                                    </button>
                                                </div>
                                            </div>

                                            {/* List of Leads to Assign */}
                                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                                {filteredLeadsToAssign.length > 0 ? (
                                                    filteredLeadsToAssign.map((lead) => {
                                                        const isAssignedToThisMember = lead.assignedTo === selectedMemberForLeads.id
                                                        const currentAssignee = teamMembers.find(m => m.id === lead.assignedTo)
                                                        
                                                        const statusColorClass = lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                                            lead.status === 'CONTACTED' ? 'bg-orange-100 text-orange-700' :
                                                            lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                            lead.status === 'LOST' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'

                                                        return (
                                                            <div 
                                                                key={lead.id} 
                                                                className="bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 hover:shadow-sm transition-all hover:border-primary/30 flex items-center justify-between gap-3 relative text-left"
                                                            >
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <span className="font-semibold text-on-background text-[10px] truncate">{lead.name}</span>
                                                                        <span className={`text-[7px] font-extrabold px-1 rounded ${statusColorClass}`}>
                                                                            {lead.status}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-on-surface-variant text-[8px] mt-1 flex items-center gap-1.5 flex-wrap">
                                                                        <span className="font-mono text-primary font-bold">{lead.id}</span>
                                                                        <span>•</span>
                                                                        <span>{lead.source}</span>
                                                                        <span>•</span>
                                                                        <span>{lead.location}</span>
                                                                    </div>
                                                                    
                                                                    {/* Assignment Badge */}
                                                                    <div className="mt-1.5 flex items-center gap-1">
                                                                        {lead.assignedTo === null ? (
                                                                            <span className="text-[8px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-medium border border-outline-variant/30 flex items-center gap-0.5">
                                                                                <span className="w-1 h-1 rounded-full bg-on-surface-variant/60"></span>
                                                                                Unassigned
                                                                            </span>
                                                                        ) : isAssignedToThisMember ? (
                                                                            <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold border border-primary/20 flex items-center gap-0.5">
                                                                                <span className="material-symbols-outlined text-[8px] font-extrabold">check</span>
                                                                                Assigned to {selectedMemberForLeads.name}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-[8px] bg-secondary/15 text-on-surface-variant px-1.5 py-0.5 rounded font-medium border border-outline-variant/20 flex items-center gap-0.5">
                                                                                <span className="w-1 h-1 rounded-full bg-secondary"></span>
                                                                                Assigned to {currentAssignee?.name || 'Other'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Action button */}
                                                                <div className="flex-shrink-0">
                                                                    {isAssignedToThisMember ? (
                                                                        <button
                                                                            onClick={() => {
                                                                                // Unassign lead: set assignedTo to null
                                                                                setCrmLeads(crmLeads.map(l => l.id === lead.id ? { ...l, assignedTo: null } : l))
                                                                                triggerToast(`Unassigned ${lead.name} from ${selectedMemberForLeads.name}`)
                                                                            }}
                                                                            className="px-2 py-1 border border-red-200 text-red-700 hover:bg-red-50 text-[8px] font-bold rounded shadow-xs transition-all cursor-pointer flex items-center gap-0.5"
                                                                            title="Unassign this lead"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[9px]">person_remove</span>
                                                                            Remove
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => {
                                                                                // Assign lead: set assignedTo to selectedMemberForLeads.id
                                                                                setCrmLeads(crmLeads.map(l => l.id === lead.id ? { ...l, assignedTo: selectedMemberForLeads.id } : l))
                                                                                triggerToast(`Assigned ${lead.name} to ${selectedMemberForLeads.name}!`)
                                                                            }}
                                                                            className={`px-2 py-1 text-[8px] font-bold rounded shadow-xs transition-all cursor-pointer flex items-center gap-0.5 ${
                                                                                lead.assignedTo === null 
                                                                                    ? 'bg-primary text-on-primary hover:bg-primary/90' 
                                                                                    : 'bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface'
                                                                            }`}
                                                                        >
                                                                            <span className="material-symbols-outlined text-[9px] font-bold">person_add</span>
                                                                            {lead.assignedTo === null ? 'Assign' : 'Re-assign'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-outline-variant rounded-xl bg-surface-container-low/20">
                                                        <span className="material-symbols-outlined text-[32px] text-on-surface-variant/40 flex items-center justify-center">search_off</span>
                                                        <p className="text-[10px] font-bold text-on-background mt-2">No matching CRM leads found</p>
                                                        <p className="text-[8px] text-on-surface-variant text-center max-w-[200px] mt-0.5">Try adjusting your search filters.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Assignment Footer */}
                                            <div className="p-3 border-t border-outline-variant bg-surface-container-low flex gap-2">
                                                <button
                                                    onClick={() => setAssigningLeadMode(false)}
                                                    className="w-full px-3 py-1.5 bg-primary text-on-primary hover:bg-primary/95 text-[10px] font-bold rounded shadow-sm flex items-center justify-center gap-1 transition-all cursor-pointer border-0"
                                                >
                                                    <span className="material-symbols-outlined text-[12px]">done</span>
                                                    Finish Assignment
                                                </button>
                                            </div>
                                        </>
                                    )
                                })() : (
                                    <>
                                        {/* Header Area */}
                                        <div className="p-4 border-b border-outline-variant relative bg-gradient-to-br from-primary/5 via-transparent to-transparent text-left">
                                            <button
                                                onClick={handleCloseDrawer}
                                                className="absolute right-3 top-3 p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>

                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[16px] font-bold border border-primary/10 shadow-sm flex-shrink-0">
                                                    {selectedMemberForLeads.avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-on-background text-[15px] truncate">{selectedMemberForLeads.name}</h3>
                                                    <p className="text-on-surface-variant text-[10px] truncate mt-0.5">{selectedMemberForLeads.email}</p>
                                                </div>
                                            </div>

                                            {/* Badges */}
                                            <div className="flex flex-wrap items-center gap-2 mt-4">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                                                    selectedMemberForLeads.role === 'Lead' ? 'bg-primary/20 text-primary' :
                                                    selectedMemberForLeads.role === 'Manager' ? 'bg-warning/20 text-warning' :
                                                    'bg-outline-variant/20 text-on-surface-variant'
                                                }`}>
                                                    {selectedMemberForLeads.role}
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[9px] font-medium border border-outline-variant/30">
                                                    {selectedMemberForLeads.department}
                                                </span>
                                                <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/20 ml-auto">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${selectedMemberForLeads.status === 'Active' ? 'bg-primary animate-pulse' : 'bg-on-surface-variant'}`}></span>
                                                    <span className={`text-[9px] font-bold ${selectedMemberForLeads.status === 'Active' ? 'text-primary' : 'text-on-surface-variant'}`}>
                                                        {selectedMemberForLeads.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Stats Section */}
                                        <div className="p-4 bg-surface-container-low/60 border-b border-outline-variant grid grid-cols-3 gap-2">
                                            <div className="bg-surface-container-lowest p-2 border border-outline-variant/40 rounded flex flex-col text-left">
                                                <span className="text-on-surface-variant text-[8px] font-semibold tracking-wider uppercase">Leads</span>
                                                <span className="text-[16px] font-extrabold text-primary mt-0.5">{totalLeadsCount}</span>
                                            </div>
                                            <div className="bg-surface-container-lowest p-2 border border-outline-variant/40 rounded flex flex-col text-left">
                                                <span className="text-on-surface-variant text-[8px] font-semibold tracking-wider uppercase">Avg Score</span>
                                                <span className="text-[16px] font-extrabold text-on-background mt-0.5">
                                                    {performanceScore ? `${performanceScore}%` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="bg-surface-container-lowest p-2 border border-outline-variant/40 rounded flex flex-col text-left">
                                                <span className="text-on-surface-variant text-[8px] font-semibold tracking-wider uppercase">Conversion</span>
                                                <span className="text-[16px] font-extrabold text-primary mt-0.5">
                                                    {conversionRate}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Leads List Container */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">Assigned Leads ({totalLeadsCount})</h4>
                                                <button
                                                    onClick={() => setAssigningLeadMode(true)}
                                                    className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[9px] font-bold rounded flex items-center gap-0.5 transition-colors cursor-pointer border-0"
                                                >
                                                    <span className="material-symbols-outlined text-[11px] font-extrabold">add</span>
                                                    Assign Lead
                                                </button>
                                            </div>

                                            {totalLeadsCount > 0 ? (
                                                <div className="space-y-2.5">
                                                    {leads.map((lead) => {
                                                        const statusColorClass = lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                                            lead.status === 'CONTACTED' ? 'bg-orange-100 text-orange-700' :
                                                            lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                            lead.status === 'LOST' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                            
                                                        const scoreBarColor = lead.score >= 80 ? 'bg-green-500' :
                                                            lead.score >= 50 ? 'bg-orange-500' : 'bg-red-500'

                                                        return (
                                                            <div 
                                                                key={lead.id} 
                                                                className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 hover:shadow-md transition-all hover:border-primary/40 relative group text-left"
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div>
                                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                                            <span className="font-semibold text-on-background text-[11px] group-hover:text-primary transition-colors">{lead.name}</span>
                                                                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${statusColorClass}`}>
                                                                                {lead.status}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-on-surface-variant text-[9px] mt-1 flex items-center gap-2 flex-wrap">
                                                                            <span className="font-mono text-primary font-semibold">{lead.id}</span>
                                                                            <span>•</span>
                                                                            <span>{lead.source}</span>
                                                                            <span>•</span>
                                                                            <span>{lead.location}</span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="flex flex-col items-end gap-1.5">
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-[10px] font-extrabold text-on-background">{lead.score}</span>
                                                                            <span className="text-[8px] text-on-surface-variant">score</span>
                                                                        </div>
                                                                        <span className="text-[8px] px-1 rounded bg-surface-container font-semibold text-on-surface-variant border border-outline-variant/30">
                                                                            {lead.tier}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Score Indicator Bar */}
                                                                <div className="w-full bg-surface-container-low h-1 rounded-full mt-3 overflow-hidden">
                                                                    <div className={`h-full rounded-full ${scoreBarColor}`} style={{ width: `${lead.score}%` }}></div>
                                                                </div>

                                                                {/* Quick Actions overlay */}
                                                                <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            navigator.clipboard.writeText(lead.id)
                                                                            triggerToast(`Copied ${lead.id} to clipboard!`)
                                                                        }}
                                                                        className="p-1 bg-surface-container hover:bg-primary/10 rounded border border-outline-variant hover:border-primary/30 text-on-surface-variant hover:text-primary transition-all cursor-pointer flex items-center justify-center"
                                                                        title="Copy Lead ID"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[11px]">content_copy</span>
                                                                    </button>
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            triggerToast(`Starting email sequence to ${lead.name}`)
                                                                        }}
                                                                        className="p-1 bg-surface-container hover:bg-primary/10 rounded border border-outline-variant hover:border-primary/30 text-on-surface-variant hover:text-primary transition-all cursor-pointer flex items-center justify-center"
                                                                        title="Send Quick Email"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[11px]">mail</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-outline-variant rounded-xl bg-surface-container-low/20">
                                                    <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40 flex items-center justify-center">assignment_turned_in</span>
                                                    <p className="text-[11px] font-bold text-on-background mt-2">No leads assigned</p>
                                                    <p className="text-[9px] text-on-surface-variant text-center max-w-[200px] mt-1">This member is ready to take new client assignments.</p>
                                                    <button
                                                        onClick={() => setAssigningLeadMode(true)}
                                                        className="mt-3 px-3 py-1 bg-primary text-on-primary text-[9px] font-bold rounded shadow hover:bg-primary/95 transition-all cursor-pointer flex items-center gap-1 border-0"
                                                    >
                                                        <span className="material-symbols-outlined text-[12px]">add</span>
                                                        Assign Lead
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer Area */}
                                        <div className="p-3 border-t border-outline-variant bg-surface-container-low flex gap-2">
                                            <button
                                                onClick={handleCloseDrawer}
                                                className="flex-1 px-3 py-1.5 border border-outline-variant bg-surface-container-lowest text-on-surface rounded text-[10px] font-bold hover:bg-surface-container transition-all cursor-pointer"
                                            >
                                                Close Panel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAssigningLeadMode(true)
                                                }}
                                                className="flex-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm border-0"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">shuffle</span>
                                                Distribute Leads
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </>
                    )
                })()}
            </AnimatePresence>

        </div>
    )
}
