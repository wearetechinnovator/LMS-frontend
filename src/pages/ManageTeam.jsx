import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function ManageTeam({ departmentId, departmentName, onBack }) {
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'Michael Chen', email: 'michael.chen@...', role: 'Department Head', joinDate: '2023-01-15', status: 'Active', avatar: 'MC' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@...', role: 'Lead', joinDate: '2023-03-22', status: 'Active', avatar: 'SJ' },
        { id: 3, name: 'Alex Turner', email: 'alex.turner@...', role: 'Manager', joinDate: '2023-05-10', status: 'Active', avatar: 'AT' },
        { id: 4, name: 'Emma Davis', email: 'emma.davis@...', role: 'Specialist', joinDate: '2024-01-08', status: 'Inactive', avatar: 'ED' }
    ])

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRole, setSelectedRole] = useState('All')

    const roles = ['All', 'Department Head', 'Lead', 'Manager', 'Specialist']

    const filteredMembers = teamMembers.filter(member => {
        const matchSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchRole = selectedRole === 'All' || member.role === selectedRole
        return matchSearch && matchRole
    })

    const removeMember = (id) => {
        setTeamMembers(teamMembers.filter(m => m.id !== id))
    }

    return (
        <div className="w-full h-full flex flex-col bg-linear-to-br from-background via-background to-surface-container-lowest p-2 space-y-2 overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center border-b border-outline-variant pb-1.5">
                <div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={onBack}
                            className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant"
                            title="Back to Team Overview"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-headline-lg font-headline-lg text-on-background text-[14px]">Manage Team</h1>
                            <p className="text-body-md text-on-surface-variant text-[8px]">{departmentName}</p>
                        </div>
                    </div>
                </div>
                <button className="px-2 py-1 bg-primary hover:bg-primary/90 text-on-primary rounded text-[9px] font-bold shadow-sm transition-colors flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">add</span>
                    Add Member
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">search</span>
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-7 pl-8 pr-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]"
                    />
                </div>

                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="h-7 px-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]"
                >
                    {roles.map(role => (
                        <option key={role}>{role}</option>
                    ))}
                </select>
            </div>

            {/* Team Table */}
            <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-[9px]">
                        <thead className="bg-surface-container border-b border-outline-variant sticky top-0">
                            <tr>
                                <th className="px-2 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[7px]">NAME</th>
                                <th className="px-2 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[7px]">EMAIL</th>
                                <th className="px-2 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[7px]">ROLE</th>
                                <th className="px-2 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[7px]">JOIN DATE</th>
                                <th className="px-2 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[7px]">STATUS</th>
                                <th className="px-2 py-1 text-center font-label-caps text-label-caps text-on-surface-variant text-[7px]">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-surface-container transition-colors">
                                    <td className="px-2 py-1">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[8px] font-bold">
                                                {member.avatar}
                                            </div>
                                            <p className="font-semibold text-on-background">{member.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-2 py-1 text-on-surface-variant">{member.email}</td>
                                    <td className="px-2 py-1">
                                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold ${
                                            member.role === 'Department Head' ? 'bg-primary/20 text-primary' :
                                            member.role === 'Lead' ? 'bg-warning/20 text-warning' :
                                            member.role === 'Manager' ? 'bg-success/20 text-success' :
                                            'bg-outline-variant/20 text-on-surface-variant'
                                        }`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1 text-on-surface">{member.joinDate}</td>
                                    <td className="px-2 py-1">
                                        <div className="flex items-center gap-1">
                                            <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-primary' : 'bg-on-surface-variant'}`}></span>
                                            <span className={member.status === 'Active' ? 'text-primary font-semibold' : 'text-on-surface-variant'}>
                                                {member.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-0.5 hover:bg-surface-container rounded transition-colors text-on-surface-variant hover:text-on-surface">
                                                <span className="material-symbols-outlined text-[12px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => removeMember(member.id)}
                                                className="p-0.5 hover:bg-error-container hover:text-error text-on-surface-variant rounded transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-2 py-1 border-t border-outline-variant flex items-center justify-between bg-surface-container">
                    <p className="text-[8px] text-on-surface-variant">Showing 1 to {Math.min(4, filteredMembers.length)} of {filteredMembers.length} members</p>
                    <div className="flex items-center gap-0.5">
                        <button className="p-0.5 rounded hover:bg-surface-container-lowest transition-colors text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
                        </button>
                        <button className="w-5 h-5 rounded text-[8px] font-semibold bg-primary text-on-primary">1</button>
                        <button className="p-0.5 rounded hover:bg-surface-container-lowest transition-colors text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
