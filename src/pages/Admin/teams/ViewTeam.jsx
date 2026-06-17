import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ViewTeam({ departmentId, departmentName: propName, onBack, onManageTeam }) {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const teamId = paramId || departmentId

  const [activeTab, setActiveTab] = useState('overview')
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/admin/teams')
    }
  }

  const handleManage = () => {
    if (onManageTeam) {
      onManageTeam()
    } else {
      navigate(`/admin/teams/${teamId}/manage`)
    }
  }

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!teamId) return
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/team/${teamId}`, { headers })
        if (response.ok) {
          const data = await response.json()
          setTeam(data)
        } else {
          showToast('Failed to fetch team details', 'error')
        }
      } catch (err) {
        console.error(err)
        showToast('Connection error to server', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchTeamDetails()
  }, [teamId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs">
        <span className="material-symbols-outlined text-slate-300 text-[48px] block mb-2">error</span>
        <p className="text-slate-500 font-bold text-sm">Team not found</p>
        <button onClick={handleBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
          Go Back
        </button>
      </div>
    )
  }

  const stats = [
    { label: 'Total Members', value: String(team.members?.length || 0), change: 'Active staff' },
    { label: 'Head of Team', value: team.head?.name || 'Unassigned', change: team.head?.role || 'Lead/Head' },
    { label: 'Created At', value: team.createdAt ? new Date(team.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A', change: 'Date registered' },
    { label: 'Last Updated', value: team.updatedAt ? new Date(team.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A', change: 'Modified date' }
  ]

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 p-4 space-y-4 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg z-50 transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
          }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 cursor-pointer"
            title="Back to Teams"
          >
            <span className="material-symbols-outlined text-[18px] block">arrow_back</span>
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-800">{team.name}</h1>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Team Profile & Workspace Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleManage}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-extrabold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            Manage Team
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs text-left"
          >
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex flex-col">
              <h3 className="text-sm font-extrabold text-slate-800 truncate" title={stat.value}>{stat.value}</h3>
              <span className="text-[9px] font-medium text-slate-400 mt-0.5">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        {['overview', 'members'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-[11px] font-extrabold transition-colors border-b-2 cursor-pointer ${activeTab === tab
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        {activeTab === 'overview' && (
          <div className="space-y-4 text-left">
            {/* Department Head */}
            <div className="space-y-2">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Team Head</p>
              <div className="border border-slate-100 rounded-xl p-3 flex items-center gap-3 bg-slate-50/50">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-200">
                  {team.head?.avatar || 'UN'}
                </div>
                <div>
                  <p className="font-extrabold text-[12px] text-slate-800">{team.head?.name || 'Unassigned'}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{team.head?.role || 'No Head/Lead Assigned'}</p>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">{team.head?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Team Description */}
            <div className="space-y-2">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">About Team</p>
              <p className="text-[11.5px] text-slate-500 leading-relaxed border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                {team.description || 'No description provided for this team.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(!team.members || team.members.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                        No members assigned to this team yet.
                      </td>
                    </tr>
                  ) : (
                    team.members.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[9px] font-bold border border-slate-200">
                              {member.avatar}
                            </div>
                            <span className="font-bold text-slate-700">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-extrabold border ${member.role === 'Department Head' || member.role === 'Head' ? 'bg-red-50 border-red-200 text-red-700' :
                              member.role === 'Lead' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                member.role === 'Manager' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                  'bg-slate-50 border-slate-200 text-slate-500'
                            }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-500 font-medium">{member.email}</td>
                        <td className="px-3 py-2 text-slate-500 font-medium">{member.phone}</td>
                        <td className="px-3 py-2 text-slate-400 font-medium">{member.joinDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
