import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Detailed realistic mock users data
const initialUsers = [
    {
        id: 'USR-001',
        name: 'Sarah Jenkins',
        email: 'sarah.j@techinnovator.com',
        role: 'Campaign Manager',
        department: 'Marketing',
        lastActive: 'Just now',
        status: 'Active',
        avatar: 'SJ',
        color: 'bg-primary/10 text-primary border-primary/20'
    },
    {
        id: 'USR-002',
        name: 'David K.',
        email: 'david.k@techinnovator.com',
        role: 'System Admin',
        department: 'IT & Operations',
        lastActive: '10 mins ago',
        status: 'Active',
        avatar: 'DK',
        color: 'bg-red-500/10 text-red-600 border-red-500/20'
    },
    {
        id: 'USR-003',
        name: 'Michael Chang',
        email: 'm.chang@techinnovator.com',
        role: 'Admissions Counselor',
        department: 'Admissions',
        lastActive: '2 hours ago',
        status: 'Active',
        avatar: 'MC',
        color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
        id: 'USR-004',
        name: 'Emily Watson',
        email: 'emily.w@techinnovator.com',
        role: 'Sales Executive',
        department: 'Sales',
        lastActive: 'Yesterday',
        status: 'Suspended',
        avatar: 'EW',
        color: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    },
    {
        id: 'USR-005',
        name: 'Robert Stark',
        email: 'robert.s@techinnovator.com',
        role: 'Auditor',
        department: 'Compliance',
        lastActive: '3 days ago',
        status: 'Invited',
        avatar: 'RS',
        color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    }
]

// Granular permissions template scoped for each Role type
const initialRolePermissions = {
    'System Admin': {
        dashboard: true,
        leads_view: true,
        leads_edit: true,
        leads_delete: true,
        leads_assign: true,
        forms_view: true,
        forms_create: true,
        forms_edit: true,
        forms_delete: true,
        campaigns_view: true,
        campaigns_create: true,
        campaigns_edit: true,
        campaigns_delete: true,
        auditLogs: true,
        settings: true
    },
    'Campaign Manager': {
        dashboard: true,
        leads_view: true,
        leads_edit: true,
        leads_delete: false,
        leads_assign: true,
        forms_view: true,
        forms_create: true,
        forms_edit: true,
        forms_delete: false,
        campaigns_view: true,
        campaigns_create: true,
        campaigns_edit: true,
        campaigns_delete: true,
        auditLogs: false,
        settings: false
    },
    'Admissions Counselor': {
        dashboard: true,
        leads_view: true,
        leads_edit: true,
        leads_delete: false,
        leads_assign: false,
        forms_view: true,
        forms_create: false,
        forms_edit: false,
        forms_delete: false,
        campaigns_view: true,
        campaigns_create: false,
        campaigns_edit: false,
        campaigns_delete: false,
        auditLogs: false,
        settings: false
    },
    'Sales Executive': {
        dashboard: true,
        leads_view: true,
        leads_edit: true,
        leads_delete: false,
        leads_assign: true,
        forms_view: false,
        forms_create: false,
        forms_edit: false,
        forms_delete: false,
        campaigns_view: false,
        campaigns_create: false,
        campaigns_edit: false,
        campaigns_delete: false,
        auditLogs: false,
        settings: false
    },
    'Auditor': {
        dashboard: false,
        leads_view: true,
        leads_edit: false,
        leads_delete: false,
        leads_assign: false,
        forms_view: true,
        forms_create: false,
        forms_edit: false,
        forms_delete: false,
        campaigns_view: true,
        campaigns_create: false,
        campaigns_edit: false,
        campaigns_delete: false,
        auditLogs: true,
        settings: false
    }
}

export default function RoleUserManagement() {
    const [activeTab, setActiveTab] = useState('users') // 'users' or 'roles'
    const [users, setUsers] = useState(initialUsers)
    const [rolePermissions, setRolePermissions] = useState(initialRolePermissions)
    const [customRoles, setCustomRoles] = useState(['System Admin', 'Campaign Manager', 'Admissions Counselor', 'Sales Executive', 'Auditor'])
    const [showCreateRoleModal, setShowCreateRoleModal] = useState(false)
    const [newRoleName, setNewRoleName] = useState('')
    
    // Sidebar selected role in Permissions tab
    const [selectedRole, setSelectedRole] = useState('Campaign Manager')

    // Filter and search states
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')

    // Add/Edit slide drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null) // null for create, user object for edit

    // Form inputs state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Admissions Counselor',
        department: 'Admissions',
        status: 'Active'
    })

    // Custom toast notifications
    const [toastMessage, setToastMessage] = useState('')

    const triggerToast = (msg) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(''), 3000)
    }

    // Filter users logic
    const filteredUsers = users.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchRole = roleFilter === 'All' || user.role === roleFilter
        const matchStatus = statusFilter === 'All' || user.status === statusFilter
        return matchSearch && matchRole && matchStatus
    })

    const handleOpenCreateDrawer = () => {
        setEditingUser(null)
        setFormData({
            name: '',
            email: '',
            role: 'Admissions Counselor',
            department: 'Admissions',
            status: 'Active'
        })
        setIsDrawerOpen(true)
    }

    const handleOpenEditDrawer = (user) => {
        setEditingUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            status: user.status
        })
        setIsDrawerOpen(true)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.email.trim()) {
            triggerToast('Error: Name and Email fields are required!')
            return
        }

        // Determine avatar color matching
        let colorTheme = 'bg-primary/10 text-primary border-primary/20'
        if (formData.role === 'System Admin') colorTheme = 'bg-red-500/10 text-red-600 border-red-500/20'
        else if (formData.role === 'Admissions Counselor') colorTheme = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
        else if (formData.role === 'Sales Executive') colorTheme = 'bg-primary/10 text-primary border-primary/20'
        else if (formData.role === 'Auditor') colorTheme = 'bg-amber-500/10 text-amber-600 border-amber-500/20'

        if (editingUser) {
            // Edit mode
            setUsers(prev => prev.map(u => u.id === editingUser.id ? {
                ...u,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                department: formData.department,
                status: formData.status,
                color: colorTheme
            } : u))
            triggerToast(`User account "${formData.name}" successfully updated!`)
        } else {
            // Create mode
            const newId = `USR-${Math.floor(100 + Math.random() * 900)}`
            const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            const newUser = {
                id: newId,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                department: formData.department,
                lastActive: 'Invited just now',
                status: formData.status,
                avatar: initials || 'US',
                color: colorTheme
            }
            setUsers(prev => [...prev, newUser])
            triggerToast(`Invited "${formData.name}" successfully as ${formData.role}!`)
        }

        setIsDrawerOpen(false)
    }

    const handleToggleStatus = (user) => {
        const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active'
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u))
        triggerToast(`User "${user.name}" status set to ${nextStatus}!`)
    }

    const handleDeleteUser = (userId, userName) => {
        if (window.confirm(`Are you sure you want to remove user "${userName}"?`)) {
            setUsers(prev => prev.filter(u => u.id !== userId))
            triggerToast(`User "${userName}" successfully deleted.`)
        }
    }

    const handleTogglePermission = (role, key) => {
        setRolePermissions(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [key]: !prev[role][key]
            }
        }))
    }

    const handleSavePermissions = () => {
        triggerToast(`Permissions for role "${selectedRole}" updated successfully!`)
    }

    const handleSwitchToDefault = () => {
        if (initialRolePermissions[selectedRole]) {
            setRolePermissions(prev => ({
                ...prev,
                [selectedRole]: {
                    ...initialRolePermissions[selectedRole]
                }
            }))
            triggerToast(`Restored default permissions for role "${selectedRole}"!`)
        } else {
            // For custom roles that don't have default configurations, reset to fully false (blank) permissions
            setRolePermissions(prev => ({
                ...prev,
                [selectedRole]: {
                    dashboard: false,
                    leads_view: false,
                    leads_edit: false,
                    leads_delete: false,
                    leads_assign: false,
                    forms_view: false,
                    forms_create: false,
                    forms_edit: false,
                    forms_delete: false,
                    campaigns_view: false,
                    campaigns_create: false,
                    campaigns_edit: false,
                    campaigns_delete: false,
                    auditLogs: false,
                    settings: false
                }
            }))
            triggerToast(`Reset custom role "${selectedRole}" permissions to blank!`)
        }
    }

    const handleCreateRole = () => {
        setNewRoleName('')
        setShowCreateRoleModal(true)
    }

    const handleConfirmCreateRole = (e) => {
        if (e) e.preventDefault()
        if (!newRoleName.trim()) {
            triggerToast('Error: Role name cannot be empty!')
            return
        }

        const formattedRole = newRoleName.trim()
        if (customRoles.includes(formattedRole)) {
            triggerToast(`Error: Role "${formattedRole}" already exists!`)
            return
        }

        setCustomRoles(prev => [...prev, formattedRole])
        setRolePermissions(prev => ({
            ...prev,
            [formattedRole]: {
                dashboard: false,
                leads_view: false,
                leads_edit: false,
                leads_delete: false,
                leads_assign: false,
                forms_view: false,
                forms_create: false,
                forms_edit: false,
                forms_delete: false,
                campaigns_view: false,
                campaigns_create: false,
                campaigns_edit: false,
                campaigns_delete: false,
                auditLogs: false,
                settings: false
            }
        }))
        setSelectedRole(formattedRole)
        setNewRoleName('')
        setShowCreateRoleModal(false)
        triggerToast(`Custom role "${formattedRole}" created successfully!`)
    }

    const rolesList = customRoles
    const statusTypes = ['Active', 'Suspended', 'Invited']

    return (
        <div className="w-full h-full flex flex-col bg-linear-to-br from-background via-background to-surface-container-lowest p-4 space-y-4 overflow-hidden relative font-sans select-none">
            
            {/* Premium Toast Banner */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        className="fixed top-6 right-6 bg-success text-on-success border border-success-container px-4 py-2.5 rounded-lg shadow-xl z-50 flex items-center gap-2"
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    >
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span className="text-[11px] font-semibold">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Block */}
            <div className="flex justify-between items-start border-b border-outline-variant pb-3">
                <div>
                    <h1 className="text-headline-lg font-headline-lg text-on-background text-[22px] font-bold">Roles & Users</h1>
                    <p className="text-body-md text-on-surface-variant text-[11px] mt-0.5">Define permission levels, manage user accounts, and align operational teams.</p>
                </div>

                {/* Main View Tab Selector Toggles */}
                <div className="flex bg-surface-container border border-outline-variant p-0.5 rounded-md gap-0.5 shadow-inner">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-3.5 py-1.5 rounded text-[11px] font-bold transition-all ${
                            activeTab === 'users' ? 'bg-white text-primary shadow-xs' : 'text-on-surface hover:text-on-background'
                        }`}
                    >
                        User Accounts
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`px-3.5 py-1.5 rounded text-[11px] font-bold transition-all ${
                            activeTab === 'roles' ? 'bg-white text-primary shadow-xs' : 'text-on-surface hover:text-on-background'
                        }`}
                    >
                        Roles & Permissions
                    </button>
                </div>
            </div>

            {/* ======================= TAB 1: USERS PANEL ======================= */}
            {activeTab === 'users' && (
                <div className="flex-1 flex flex-col min-h-0 space-y-3.5">
                    {/* Control / Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        
                        {/* Search and Filters grouped */}
                        <div className="flex items-center gap-2.5 flex-1 w-full max-w-2xl">
                            {/* Search bar input */}
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
                                <input
                                    type="text"
                                    placeholder="Search users by name or email address..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-8 pl-9 pr-3 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                />
                            </div>

                            {/* Role Filter dropdown */}
                            <div className="relative">
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="h-8 pl-2.5 pr-8 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                >
                                    <option value="All">All Roles</option>
                                    {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
                            </div>

                            {/* Status Filter dropdown */}
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="h-8 pl-2.5 pr-8 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                >
                                    <option value="All">All Statuses</option>
                                    {statusTypes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
                            </div>
                        </div>

                        {/* Action Add User button */}
                        <button
                            onClick={handleOpenCreateDrawer}
                            className="px-3.5 py-1.5 bg-primary hover:bg-primary/95 text-white rounded text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[15px]">person_add</span>
                            Add New User
                        </button>
                    </div>

                    {/* Table Container Wrapper */}
                    <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-xs">
                        <div className="overflow-x-auto flex-1 min-h-0">
                            <table className="w-full text-[11px]">
                                <thead className="bg-surface-container border-b border-outline-variant sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[9px] font-bold tracking-wider">USER INFO</th>
                                        <th className="px-4 py-2.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[9px] font-bold tracking-wider">ROLE</th>
                                        <th className="px-4 py-2.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[9px] font-bold tracking-wider">DEPARTMENT</th>
                                        <th className="px-4 py-2.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[9px] font-bold tracking-wider">LAST ACTIVE</th>
                                        <th className="px-4 py-2.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[9px] font-bold tracking-wider">STATUS</th>
                                        <th className="px-4 py-2.5 text-center font-label-caps text-label-caps text-on-surface-variant text-[9px] font-bold tracking-wider w-[120px]">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-surface-container/20 transition-colors">
                                                
                                                {/* User Identity cell */}
                                                <td className="px-4 py-3 align-middle">
                                                    <div className="flex items-center gap-2.5">
                                                        {/* Profile avatar bubble */}
                                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm ${user.color}`}>
                                                            {user.avatar}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-on-background text-[11px] leading-tight">{user.name}</p>
                                                            <p className="text-on-surface-variant text-[10px] mt-0.5">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Role Alignment */}
                                                <td className="px-4 py-3 align-middle text-on-surface font-medium whitespace-nowrap">
                                                    {user.role}
                                                </td>

                                                {/* Department assignment */}
                                                <td className="px-4 py-3 align-middle text-on-surface-variant whitespace-nowrap">
                                                    {user.department}
                                                </td>

                                                {/* Last Active date */}
                                                <td className="px-4 py-3 align-middle text-on-surface-variant whitespace-nowrap">
                                                    {user.lastActive}
                                                </td>

                                                {/* Premium Status tag */}
                                                <td className="px-4 py-3 align-middle whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${
                                                        user.status === 'Active' 
                                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                                            : user.status === 'Suspended'
                                                                ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </td>

                                                {/* Actions block */}
                                                <td className="px-4 py-3 align-middle text-center whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button 
                                                            onClick={() => handleOpenEditDrawer(user)}
                                                            className="p-1 hover:bg-surface-container rounded text-primary hover:text-primary transition-colors"
                                                            title="Edit Details"
                                                        >
                                                            <span className="material-symbols-outlined text-[15px]">edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleToggleStatus(user)}
                                                            className={`p-1 hover:bg-surface-container rounded transition-colors ${
                                                                user.status === 'Active' ? 'text-rose-500' : 'text-emerald-500'
                                                            }`}
                                                            title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                                                        >
                                                            <span className="material-symbols-outlined text-[15px]">
                                                                {user.status === 'Active' ? 'block' : 'check_circle'}
                                                            </span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                                            className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-on-surface-variant transition-colors"
                                                            title="Remove User"
                                                        >
                                                            <span className="material-symbols-outlined text-[15px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-on-surface-variant font-medium">
                                                No user accounts found matching current query filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Tighter responsive list footer metrics */}
                        <div className="px-4 py-2 border-t border-outline-variant flex items-center justify-between bg-surface-container/50">
                            <p className="text-[10px] text-on-surface-variant">
                                Active Accounts: <span className="font-bold text-on-background">{users.filter(u => u.status === 'Active').length}</span> | Suspended: <span className="font-bold text-on-background">{users.filter(u => u.status === 'Suspended').length}</span>
                            </p>
                            <p className="text-[10px] text-on-surface-variant">
                                Showing 1 to {filteredUsers.length} of {filteredUsers.length} records
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================= TAB 2: ROLES & PERMISSIONS PANEL ======================= */}
            {activeTab === 'roles' && (
                <div className="flex-1 flex gap-4 min-h-0">
                    
                    {/* Left Pane Sidebar: Role Type Selector */}
                    <div className="w-[200px] border border-outline-variant bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col shadow-xs shrink-0">
                        <div className="p-3 border-b border-outline-variant bg-surface-container/50 flex items-center justify-between gap-2">
                            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Role Profiles</h3>
                            <button
                                onClick={handleCreateRole}
                                className="p-1 hover:bg-slate-200/60 rounded text-primary hover:text-primary transition-colors cursor-pointer flex items-center justify-center shrink-0"
                                title="Create Custom Role"
                            >
                                <span className="material-symbols-outlined text-[15px] font-bold">add</span>
                            </button>
                        </div>
                        <div className="flex-1 p-1.5 space-y-0.5 overflow-y-auto">
                            {rolesList.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`w-full text-left px-3 py-2 rounded text-[11px] font-bold transition-all flex items-center justify-between ${
                                        selectedRole === role 
                                            ? 'bg-primary/10 text-primary shadow-xs border-l-4 border-primary pl-2' 
                                            : 'text-on-surface hover:bg-surface-container hover:text-on-background'
                                    }`}
                                >
                                    <span>{role}</span>
                                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Pane: Granular Permissions Checklist Matrix */}
                    <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-xs min-h-0">
                        
                        {/* Selected Role Header Info */}
                        <div className="p-4 border-b border-outline-variant bg-surface-container/30 flex justify-between items-center">
                            <div>
                                <h2 className="text-[14px] font-bold text-on-background flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                                    {selectedRole} Permissions Configuration
                                </h2>
                                <p className="text-[10px] text-on-surface-variant mt-0.5">
                                    Granular permission switches defining layout visualization and operations access for {selectedRole}s.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSwitchToDefault}
                                    className="px-3 py-1.5 border border-outline-variant hover:bg-slate-50 text-slate-700 rounded text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[14px]">settings_backup_restore</span>
                                    Switch to Default
                                </button>
                                <button
                                    onClick={handleSavePermissions}
                                    className="px-3.5 py-1.5 bg-primary hover:bg-primary/95 text-white rounded text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[14px]">save</span>
                                    Save Role Permissions
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Permissions checklist grid */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-[11px]">
                            
                            {/* Dashboard access panel card */}
                            <div className="border border-outline-variant rounded bg-surface-container/20 p-3 space-y-2">
                                <h3 className="font-bold text-on-background text-[11px] border-b border-outline-variant/60 pb-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] text-primary">dashboard</span>
                                    Core System Navigation
                                </h3>
                                <label className="flex items-center gap-2.5 py-1.5 cursor-pointer font-medium">
                                    <input 
                                        type="checkbox"
                                        checked={rolePermissions[selectedRole]?.dashboard || false}
                                        onChange={() => handleTogglePermission(selectedRole, 'dashboard')}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <div>
                                        <p className="text-on-background">Access Main Analytics Dashboard</p>
                                        <p className="text-[9px] text-on-surface-variant mt-0.5">Grants view access to conversion ratios, chart modules, and core visual widgets.</p>
                                    </div>
                                </label>
                            </div>

                            {/* Granular Lead Control */}
                            <div className="border border-outline-variant rounded bg-surface-container/20 p-3 space-y-2">
                                <h3 className="font-bold text-on-background text-[11px] border-b border-outline-variant/60 pb-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] text-primary">contacts</span>
                                    Lead Management Controls
                                </h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-1">
                                    
                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.leads_view || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'leads_view')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background">View Leads Database</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">Allows accessing the All Leads table index.</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.leads_edit || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'leads_edit')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background">Edit Lead Profiles</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">Enables modifying contact records, details, and activity trails.</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.leads_assign || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'leads_assign')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background">Bulk Reassign Leads</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">Allows changing assigned counselor/executive relationships.</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.leads_delete || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'leads_delete')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background text-rose-600">Delete Lead Entries</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">CRITICAL: Grants privileges to delete client profiles permanently.</p>
                                        </div>
                                    </label>

                                </div>
                            </div>

                            {/* Scoped Form Builder permissions */}
                            <div className="border border-outline-variant rounded bg-surface-container/20 p-3 space-y-2">
                                <h3 className="font-bold text-on-background text-[11px] border-b border-outline-variant/60 pb-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] text-primary">build</span>
                                    Interactive Form Builder Actions
                                </h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-1">
                                    
                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.forms_view || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'forms_view')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background">Access Form Library</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">Grants view capabilities for established capture layouts.</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.forms_create || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'forms_create')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background">Create Capture Schemes</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">Allows designing fresh custom fields systems.</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.forms_edit || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'forms_edit')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background">Edit Canvas Mappings</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">Allows restructuring active field configurations.</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.forms_delete || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'forms_delete')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background text-rose-600">Delete Capture Forms</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">Enables deleting layout schematics from the page database.</p>
                                        </div>
                                    </label>

                                </div>
                            </div>

                            {/* System Settings & Advanced Admin options */}
                            <div className="border border-outline-variant rounded bg-surface-container/20 p-3 space-y-2">
                                <h3 className="font-bold text-on-background text-[11px] border-b border-outline-variant/60 pb-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] text-primary">security</span>
                                    Compliance & IT Configurations
                                </h3>
                                <div className="grid grid-cols-2 gap-6 py-1">
                                    
                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.auditLogs || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'auditLogs')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background">View Chronological Audit Logs</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">Grants authorization to inspect IP logs, session activity, and entity modifications.</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer font-medium">
                                        <input 
                                            type="checkbox"
                                            checked={rolePermissions[selectedRole]?.settings || false}
                                            onChange={() => handleTogglePermission(selectedRole, 'settings')}
                                            className="w-4 h-4 accent-primary mt-0.5"
                                        />
                                        <div>
                                            <p className="text-on-background text-red-600">Modify Webhooks & Scoring Rules</p>
                                            <p className="text-[9px] text-on-surface-variant mt-0.5">CRITICAL: Grants rights to modify webhook tokens, score algorithms, and endpoint routers.</p>
                                        </div>
                                    </label>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* ======================= SIDE SLIDE-OUT DRAWER (ADD/EDIT USER) ======================= */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        {/* Dark backdrop overlay */}
                        <motion.div
                            onClick={() => setIsDrawerOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40"
                        />

                        {/* Right Sheet Sheet */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="fixed top-0 right-0 h-full w-[360px] bg-white border-l border-outline-variant shadow-2xl z-50 flex flex-col"
                        >
                            {/* Drawer header panel */}
                            <div className="p-4 border-b border-outline-variant bg-surface-container/30 flex items-center justify-between">
                                <h3 className="text-[13px] font-bold text-on-background flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-primary text-[18px]">
                                        {editingUser ? 'manage_accounts' : 'person_add'}
                                    </span>
                                    {editingUser ? 'Edit User Credentials' : 'Register New User'}
                                </h3>
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            {/* Form block */}
                            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between p-4 min-h-0 overflow-y-auto">
                                
                                <div className="space-y-4">
                                    {/* Input Name */}
                                    <div className="space-y-1">
                                        <label className="block text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. John Miller"
                                            className="w-full h-8 px-2.5 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                            required
                                        />
                                    </div>

                                    {/* Input Email */}
                                    <div className="space-y-1">
                                        <label className="block text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="e.g. john.m@company.com"
                                            className="w-full h-8 px-2.5 border border-outline-variant rounded font-body-md text-body-md text-on-surface bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                            required
                                        />
                                    </div>

                                    {/* Select Role */}
                                    <div className="space-y-1">
                                        <label className="block text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Operational Role</label>
                                        <div className="relative">
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full h-8 pl-2.5 pr-8 border border-outline-variant rounded bg-surface font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                            >
                                                {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
                                        </div>
                                    </div>

                                    {/* Select Department */}
                                    <div className="space-y-1">
                                        <label className="block text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Team / Department</label>
                                        <div className="relative">
                                            <select
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                className="w-full h-8 pl-2.5 pr-8 border border-outline-variant rounded bg-surface font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                            >
                                                <option value="Admissions">Admissions</option>
                                                <option value="IT & Operations">IT & Operations</option>
                                                <option value="Sales">Sales</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Compliance">Compliance</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
                                        </div>
                                    </div>

                                    {/* Select Status */}
                                    <div className="space-y-1">
                                        <label className="block text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Account Status</label>
                                        <div className="relative">
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full h-8 pl-2.5 pr-8 border border-outline-variant rounded bg-surface font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                            >
                                                {statusTypes.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Action Buttons */}
                                <div className="border-t border-outline-variant pt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="flex-1 py-1.5 border border-outline-variant text-on-surface hover:bg-surface-container rounded text-[11px] font-bold transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-1.5 bg-primary hover:bg-primary/95 text-white rounded text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                                    >
                                        {editingUser ? 'Save Updates' : 'Send Invite'}
                                    </button>
                                </div>

                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Create Custom Role Input Modal Overlay */}
            <AnimatePresence>
                {showCreateRoleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateRoleModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden relative z-10 flex flex-col"
                        >
                            {/* Header */}
                            <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50 to-white">
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-primary text-[18px]">add_moderator</span>
                                        Create Custom Role
                                    </h3>
                                    <p className="text-[9.5px] text-slate-500 mt-0.5">Define a new operational role and custom permission settings.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateRoleModal(false)}
                                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleConfirmCreateRole} className="p-5 space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Role Profile Title</label>
                                    <input
                                        type="text"
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                        placeholder="e.g. Regional Supervisor"
                                        className="w-full h-8 px-2.5 border border-slate-200 rounded text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[11px]"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="border-t border-slate-100 pt-3.5 flex justify-end gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateRoleModal(false)}
                                        className="px-4.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 text-[11px] font-bold transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4.5 py-1.5 bg-primary hover:bg-primary/95 text-white rounded text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                                    >
                                        Create Role
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}
