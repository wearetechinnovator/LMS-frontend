import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function ViewTeam({ departmentId, departmentName, onBack, onManageTeam }) {
    const [activeTab, setActiveTab] = useState('overview')

    const departmentData = {
        id: departmentId,
        name: departmentName,
        description: 'Manage and oversee customer acquisition strategies.',
        icon: 'trending_up',
        color: 'bg-blue-500',
        stat: { label: 'ACTIVE MEMBERS', value: '12', change: '+2 this quarter' },
        head: { name: 'Michael Chen', role: 'Department Head', avatar: 'MC', email: 'michael.chen@company.com' },
        members: [
            { id: 1, name: 'Sarah Johnson', avatar: 'SJ', role: 'Lead', email: 'sarah@company.com', joinDate: '2023-03-22', status: 'Active' },
            { id: 2, name: 'Alex Turner', avatar: 'AT', role: 'Manager', email: 'alex@company.com', joinDate: '2023-05-10', status: 'Active' },
            { id: 3, name: 'Emma Davis', avatar: 'ED', role: 'Specialist', email: 'emma@company.com', joinDate: '2024-01-08', status: 'Active' },
            { id: 4, name: 'James Wilson', avatar: 'JW', role: 'Analyst', email: 'james@company.com', joinDate: '2024-02-15', status: 'Active' }
        ]
    }

    const stats = [
        { label: 'Total Members', value: departmentData.stat.value, change: departmentData.stat.change },
        { label: 'Active Now', value: '11', change: '+1' },
        { label: 'Avg Tenure', value: '1.2y', change: 'years' },
        { label: 'Tasks Completed', value: '324', change: '+45 this month' }
    ]

    return (
        <div className="w-full h-full flex flex-col bg-linear-to-br from-background via-background to-surface-container-lowest p-2 space-y-2 overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack}
                        className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant"
                    >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-headline-lg font-headline-lg text-on-background text-[16px]">{departmentName}</h1>
                        <p className="text-body-md text-on-surface-variant text-[8px]">Team Overview & Details</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={onManageTeam}
                        className="px-2 py-1 bg-primary hover:bg-primary/90 text-on-primary rounded text-[9px] font-bold transition-colors flex items-center gap-0.5"
                    >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Manage Team
                    </button>
                    <button className="p-1.5 hover:bg-surface-container rounded transition-colors text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">more_vert</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-surface-container-lowest border border-outline-variant rounded p-2 shadow-sm"
                    >
                        <p className="text-label-caps text-label-caps text-on-surface-variant text-[6px] mb-0.5">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-headline-md text-headline-md text-on-background text-[14px] font-bold">{stat.value}</h3>
                            <span className="text-[7px] font-semibold text-on-surface-variant">{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-outline-variant">
                {['overview', 'members', 'activity'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2 py-1 text-[9px] font-semibold transition-colors border-b-2 ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-on-surface-variant hover:text-on-surface'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto space-y-2">
                {activeTab === 'overview' && (
                    <>
                        {/* Department Head */}
                        <div className="bg-surface-container-lowest border border-outline-variant rounded p-2 shadow-sm">
                            <p className="text-label-caps text-label-caps text-on-surface-variant text-[6px] mb-1 font-bold">DEPARTMENT HEAD</p>
                            <div className="bg-surface-container rounded p-2 flex items-start gap-2">
                                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[12px] font-bold flex-shrink-0">
                                    {departmentData.head.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-on-background text-[9px]">{departmentData.head.name}</p>
                                    <p className="text-on-surface-variant text-[8px]">{departmentData.head.role}</p>
                                    <p className="text-on-surface-variant text-[7px]">{departmentData.head.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Team Description */}
                        <div className="bg-surface-container-lowest border border-outline-variant rounded p-2 shadow-sm">
                            <p className="text-label-caps text-label-caps text-on-surface-variant text-[6px] mb-1 font-bold">ABOUT</p>
                            <p className="text-body-md text-body-md text-on-surface text-[9px] bg-surface-container rounded p-2">
                                {departmentData.description}
                            </p>
                        </div>
                    </>
                )}

                {activeTab === 'members' && (
                    <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden flex flex-col shadow-sm">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-[8px]">
                                <thead className="bg-surface-container border-b border-outline-variant sticky top-0">
                                    <tr>
                                        <th className="px-1.5 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[6px]">NAME</th>
                                        <th className="px-1.5 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[6px]">ROLE</th>
                                        <th className="px-1.5 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[6px]">EMAIL</th>
                                        <th className="px-1.5 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[6px]">JOIN DATE</th>
                                        <th className="px-1.5 py-1 text-left font-label-caps text-label-caps text-on-surface-variant text-[6px]">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {departmentData.members.map((member) => (
                                        <tr key={member.id} className="hover:bg-surface-container transition-colors">
                                            <td className="px-1.5 py-1">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-5 h-5 rounded-full bg-outline-variant/20 text-on-surface-variant flex items-center justify-center text-[7px] font-bold">
                                                        {member.avatar}
                                                    </div>
                                                    <span className="font-semibold text-on-background">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-1.5 py-1">
                                                <span className="text-on-surface-variant text-[7px]">{member.role}</span>
                                            </td>
                                            <td className="px-1.5 py-1 text-on-surface-variant text-[7px]">{member.email}</td>
                                            <td className="px-1.5 py-1 text-on-surface-variant text-[7px]">{member.joinDate}</td>
                                            <td className="px-1.5 py-1">
                                                <div className="flex items-center gap-0.5">
                                                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                                                    <span className="text-primary font-semibold text-[7px]">{member.status}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="bg-surface-container-lowest border border-outline-variant rounded p-2 shadow-sm space-y-1.5">
                        <p className="text-label-caps text-label-caps text-on-surface-variant text-[6px] font-bold">RECENT ACTIVITY</p>
                        {[
                            { user: 'Michael Chen', action: 'Added new team member', time: '2 hours ago' },
                            { user: 'Sarah Johnson', action: 'Completed project task', time: '5 hours ago' },
                            { user: 'Alex Turner', action: 'Updated department goals', time: '1 day ago' }
                        ].map((activity, idx) => (
                            <div key={idx} className="bg-surface-container rounded p-1.5 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0"></div>
                                <div>
                                    <p className="text-on-background font-semibold text-[8px]">{activity.user}</p>
                                    <p className="text-on-surface-variant text-[7px]">{activity.action}</p>
                                    <p className="text-on-surface-variant text-[7px] mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
