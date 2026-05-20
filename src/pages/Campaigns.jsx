import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Campaigns({ onNavigateToViewTeam }) {
    const [selectedDept, setSelectedDept] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const departments = [
        {
            id: 1,
            name: 'Sales & Revenue',
            description: 'Manage and oversee customer acquisition strategies.',
            icon: 'trending_up',
            color: 'bg-blue-500',
            stat: { label: 'ACTIVE MEMBERS', value: '12', change: '+2 this quarter' },
            head: { name: 'Michael Chen', role: 'Department Head', avatar: 'MC' },
            members: [
                { name: 'Sarah Johnson', avatar: 'SJ', role: 'Lead' },
                { name: 'Alex Turner', avatar: 'AT', role: 'Manager' }
            ],
            actionText: 'View Team',
            manageable: true
        },
        {
            id: 2,
            name: 'Marketing',
            description: 'Brand positioning, demand generation, and content strategy.',
            icon: 'campaign',
            color: 'bg-orange-500',
            stat: { label: 'ACTIVE MEMBERS', value: '8', change: '+1 this quarter' },
            head: { name: 'Emma Davis', role: 'Department Head', avatar: 'ED' },
            members: [
                { name: 'James Wilson', avatar: 'JW', role: 'Manager' },
                { name: 'Lisa Anderson', avatar: 'LA', role: 'Specialist' }
            ],
            actionText: 'View Team',
            manageable: true
        },
        {
            id: 3,
            name: 'Customer Success',
            description: 'Customer support, satisfaction, and retention management.',
            icon: 'group',
            color: 'bg-green-500',
            stat: { label: 'ACTIVE MEMBERS', value: '15', change: '+3 this quarter' },
            head: { name: 'Patricia Brown', role: 'Department Head', avatar: 'PB' },
            members: [
                { name: 'David Martinez', avatar: 'DM', role: 'Manager' },
                { name: 'Sophie Lee', avatar: 'SL', role: 'Support Lead' }
            ],
            actionText: 'View Team',
            manageable: true
        },
        {
            id: 4,
            name: 'Engineering',
            description: 'Software development, infrastructure, and technical project.',
            icon: 'engineering',
            color: 'bg-purple-500',
            stat: { label: 'ACTIVE MEMBERS', value: '20', change: '+0 this quarter' },
            head: { name: 'Robert Garcia', role: 'Department Head', avatar: 'RG' },
            members: [
                { name: 'Nathan White', avatar: 'NW', role: 'Tech Lead' },
                { name: 'Clara Zhang', avatar: 'CZ', role: 'Senior Dev' }
            ],
            actionText: 'View Team',
            manageable: true
        }
    ]

    const recentChanges = [
        { department: 'Sales & Revenue', action: 'Modified Head by Team', modifier: 'Admin user', time: '2025-04-28 10:30:02', status: 'Approved' },
        { department: 'Marketing', action: 'Added 3 new members', modifier: 'HR Admin', time: '2025-04-28 03:25:30', status: 'Approved' }
    ]

    const filteredDepts = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="w-full h-full flex flex-col bg-linear-to-br from-background via-background to-surface-container-lowest p-2 space-y-2 overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-headline-lg font-headline-lg text-on-background text-[16px]">Department Management</h1>
                    <p className="text-body-md text-on-surface-variant text-[8px] mt-0.5">Oversee all departments, team hierarchy, and team permissions.</p>
                </div>
                <button className="px-2 py-1 bg-primary hover:bg-primary/90 text-on-primary rounded text-[9px] font-bold shadow-sm transition-colors flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">add</span>
                    Add Department
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">search</span>
                <input
                    type="text"
                    placeholder="Search departments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-7 pl-8 pr-2 border border-outline-variant rounded bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[9px]"
                />
            </div>

            {/* Departments Grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-3 gap-2">
                    {filteredDepts.map((dept) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface-container-lowest border border-outline-variant rounded p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedDept(selectedDept?.id === dept.id ? null : dept)}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-1.5">
                                <div className={`${dept.color} text-white p-1 rounded text-[12px]`}>
                                    <span className="material-symbols-outlined">{dept.icon}</span>
                                </div>
                                <button className="p-0.5 hover:bg-surface-container rounded transition-colors text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[12px]">more_vert</span>
                                </button>
                            </div>

                            {/* Title & Description */}
                            <h3 className="font-headline-md text-headline-md text-on-background text-[11px] font-bold mb-0.5">{dept.name}</h3>
                            <p className="text-body-md text-body-md text-on-surface-variant text-[8px] mb-1.5">{dept.description}</p>

                            {/* Stats */}
                            <div className="bg-surface-container rounded p-1.5 mb-1.5">
                                <p className="text-label-caps text-label-caps text-on-surface-variant text-[6px] mb-0.5">{dept.stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <h4 className="text-headline-md text-headline-md text-on-background text-[12px] font-bold">{dept.stat.value}</h4>
                                    <p className="text-[7px] text-on-surface-variant">{dept.stat.change}</p>
                                </div>
                            </div>

                            {/* Department Head */}
                            <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-outline-variant">
                                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[8px] font-bold">
                                    {dept.head.avatar}
                                </div>
                                <div>
                                    <p className="text-body-md text-body-md text-on-background text-[8px] font-semibold">{dept.head.name}</p>
                                    <p className="text-label-caps text-label-caps text-on-surface-variant text-[6px]">{dept.head.role}</p>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="mb-1.5">
                                <p className="text-label-caps text-label-caps text-on-surface-variant text-[6px] mb-0.5">Team Members</p>
                                <div className="flex items-center gap-0.5">
                                    {dept.members.map((member, idx) => (
                                        <div key={idx} className="w-5 h-5 rounded-full bg-outline-variant/20 border border-outline-variant flex items-center justify-center text-[7px] font-bold text-on-surface-variant" title={member.name}>
                                            {member.avatar}
                                        </div>
                                    ))}
                                    <span className="text-[7px] text-on-surface-variant ml-0.5">+{dept.stat.value - dept.members.length - 1}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1">
                                <button
                                    onClick={() => onNavigateToViewTeam(dept)}
                                    className="flex-1 px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded text-[8px] font-semibold hover:bg-primary/20 transition-colors">
                                    {dept.actionText}
                                </button>
                                <button
                                    onClick={() => onNavigateToViewTeam(dept, true)}
                                    className="flex-1 px-1.5 py-0.5 bg-surface-container text-on-surface border border-outline-variant rounded text-[8px] font-semibold hover:bg-surface-container-low transition-colors">
                                    Manage Team
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Changes */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-3 shadow-sm">
                <h3 className="font-headline-md text-headline-md text-on-background text-[12px] font-bold mb-2">Recent Changes</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-[10px]">
                        <thead className="bg-surface-container border-b border-outline-variant">
                            <tr>
                                <th className="px-2 py-1.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">DEPARTMENT</th>
                                <th className="px-2 py-1.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">ACTION</th>
                                <th className="px-2 py-1.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">MODIFIED BY</th>
                                <th className="px-2 py-1.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">TIME</th>
                                <th className="px-2 py-1.5 text-left font-label-caps text-label-caps text-on-surface-variant text-[8px]">AUDIT LOG</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {recentChanges.map((change, idx) => (
                                <tr key={idx} className="hover:bg-surface-container transition-colors">
                                    <td className="px-2 py-1.5 text-on-background font-semibold">{change.department}</td>
                                    <td className="px-2 py-1.5 text-on-surface">{change.action}</td>
                                    <td className="px-2 py-1.5 text-on-surface">{change.modifier}</td>
                                    <td className="px-2 py-1.5 text-on-surface-variant">{change.time}</td>
                                    <td className="px-2 py-1.5">
                                        <button className="text-primary hover:text-primary/80 font-semibold text-[9px] transition-colors">
                                            {change.status}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-2 flex justify-end">
                    <button className="text-primary hover:text-primary/80 text-[9px] font-semibold transition-colors">
                        View more →
                    </button>
                </div>
            </div>

        </div>
    )
}
