import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Teams() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState(null)

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)

  // Form states
  const [teamForm, setTeamForm] = useState({
    name: '',
    about: '',
    members: [] // Array of { user_id, role }
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch teams and active users
  const fetchData = async () => {
    setLoading(true)
    const token = localStorage.getItem('authToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    try {
      // Fetch teams
      const teamRes = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/team`, { headers })
      if (teamRes.ok) {
        const data = await teamRes.json()
        setTeams(data)
      } else {
        showToast('Failed to fetch teams from backend', 'error')
      }

      // Fetch users for invitation checklist
      const userRes = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/user/get-users`, { headers })
      if (userRes.ok) {
        const data = await userRes.json()
        setUsers(data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      showToast('Connection error to server', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Create Team Submit
  const handleCreateTeam = async (e) => {
    e.preventDefault()
    if (!teamForm.name.trim()) return

    const token = localStorage.getItem('authToken')
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/team/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: teamForm.name,
          about: teamForm.about,
          members: teamForm.members
        })
      })

      const data = await response.json()
      if (response.ok) {
        showToast('Team created successfully!')
        setShowCreateModal(false)
        setTeamForm({ name: '', about: '', members: [] })
        fetchData()
      } else {
        showToast(data.error || 'Failed to create team', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Network error while creating team', 'error')
    }
  }

  // Edit Team Open
  const openEditModal = async (team) => {
    const token = localStorage.getItem('authToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    try {
      // Get detailed team members
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/team/${team.id}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setSelectedTeam(team)
        setTeamForm({
          name: data.name,
          about: data.description,
          members: data.members.map(m => ({ user_id: parseInt(m.id, 10), role: m.role }))
        })
        setShowEditModal(true)
      } else {
        showToast('Failed to fetch team details', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Error loading team details', 'error')
    }
  }

  // Edit Team Submit
  const handleEditTeam = async (e) => {
    e.preventDefault()
    if (!teamForm.name.trim() || !selectedTeam) return

    const token = localStorage.getItem('authToken')
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/team/${selectedTeam.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: teamForm.name,
          about: teamForm.about,
          members: teamForm.members
        })
      })

      const data = await response.json()
      if (response.ok) {
        showToast('Team updated successfully!')
        setShowEditModal(false)
        setSelectedTeam(null)
        setTeamForm({ name: '', about: '', members: [] })
        fetchData()
      } else {
        showToast(data.error || 'Failed to update team', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Network error while updating team', 'error')
    }
  }

  // Delete Team
  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team? This action is permanent.')) return

    const token = localStorage.getItem('authToken')
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/team/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showToast('Team deleted successfully!')
        fetchData()
      } else {
        const data = await response.json()
        showToast(data.error || 'Failed to delete team', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Network error while deleting team', 'error')
    }
  }

  // Member Selection Helpers
  const toggleUserSelection = (userId) => {
    const exists = teamForm.members.find(m => m.user_id === userId)
    if (exists) {
      setTeamForm({
        ...teamForm,
        members: teamForm.members.filter(m => m.user_id !== userId)
      })
    } else {
      setTeamForm({
        ...teamForm,
        members: [...teamForm.members, { user_id: userId, role: 'Member' }]
      })
    }
  }

  const updateMemberRole = (userId, role) => {
    setTeamForm({
      ...teamForm,
      members: teamForm.members.map(m => m.user_id === userId ? { ...m, role } : m)
    })
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.head.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4">
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg z-50 transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            }`}>
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white border border-slate-200 rounded-2xl p-5 shadow-xs gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block mb-0.5">Organization</span>
            <h1 className="text-xl font-extrabold text-slate-800">Teams & Departments</h1>
            <p className="text-[11.5px] text-slate-400 font-medium mt-0.5">
              Manage your organization units, assign role leads, and configure distribution rules.
            </p>
          </div>
          <button
            onClick={() => {
              setTeamForm({ name: '', about: '', members: [] })
              setShowCreateModal(true)
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Create Team
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search teams by name, description, or head..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-11 pr-4 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs">
            <span className="material-symbols-outlined text-slate-300 text-[48px] block mb-2">group_off</span>
            <p className="text-slate-500 font-bold text-sm">No teams found</p>
            <p className="text-slate-400 text-xs mt-1">Try creating a new team or clearing your search term.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredTeams.map((team) => (
              <div key={team.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-sm transition-all">
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${team.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      team.color === 'indigo' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                        team.color === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                          team.color === 'rose' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                            team.color === 'teal' ? 'bg-teal-50 border-teal-200 text-teal-700' :
                              'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                      {team.name}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold border bg-green-50 border-green-200 text-green-700">
                      Active
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800 mb-1">{team.name}</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed max-w-[550px]">{team.description}</p>
                </div>

                <div className="flex items-center gap-8 lg:gap-12 min-w-[220px]">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Team Lead</span>
                    <span className="text-[12px] font-bold text-slate-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">stars</span>
                      {team.head}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Active Members</span>
                    <span className="text-[12px] font-bold text-slate-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">group</span>
                      {team.membersCount} Members
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 min-w-[280px] lg:justify-end">
                  <button
                    onClick={() => navigate(`${team.id}`)}
                    className="flex-1 lg:flex-none px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`${team.id}/manage`)}
                    className="flex-1 lg:flex-none px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap"
                  >
                    Members
                  </button>
                  <button
                    onClick={() => openEditModal(team)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-all cursor-pointer"
                    title="Edit Team Details"
                  >
                    <span className="material-symbols-outlined text-[16px] block">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl transition-all cursor-pointer"
                    title="Delete Team"
                  >
                    <span className="material-symbols-outlined text-[16px] block">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto flex flex-col p-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="text-base font-extrabold text-slate-800">Create New Team</h3>
                    <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleCreateTeam} className="space-y-4 flex-1">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Team Name *</label>
                      <input
                        type="text"
                        required
                        value={teamForm.name}
                        onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                        placeholder="e.g. BHM Counseling Dept"
                        className="w-full h-9 px-3 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">About / Description</label>
                      <textarea
                        value={teamForm.about}
                        onChange={(e) => setTeamForm({ ...teamForm, about: e.target.value })}
                        placeholder="e.g. Focuses on hotel management leads outreach and conversion rules."
                        rows={3}
                        className="w-full p-3 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Invite Members & Assign Roles</label>
                      <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                        {users.length === 0 ? (
                          <p className="text-[11px] text-slate-400 p-2">No active users to invite.</p>
                        ) : (
                          users.map((user) => {
                            const memberInfo = teamForm.members.find(m => m.user_id === parseInt(user.id, 10))
                            const isSelected = !!memberInfo
                            return (
                              <div key={user.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg">
                                <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleUserSelection(parseInt(user.id, 10))}
                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                  />
                                  <div className="text-left">
                                    <p className="text-[11.5px] font-bold text-slate-700">{user.name}</p>
                                    <p className="text-[9.5px] text-slate-400">{user.email || user.phoneNumber}</p>
                                  </div>
                                </label>

                                {isSelected && (
                                  <select
                                    value={memberInfo.role}
                                    onChange={(e) => updateMemberRole(parseInt(user.id, 10), e.target.value)}
                                    className="h-7 px-2 border border-slate-200 rounded-lg bg-white text-[10px] font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
                                  >
                                    <option value="Member">Member</option>
                                    <option value="Specialist">Specialist</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Lead">Lead</option>
                                    <option value="Department Head">Head</option>
                                  </select>
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center shadow-xs"
                      >
                        Save Team
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && selectedTeam && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEditModal(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto flex flex-col p-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="text-base font-extrabold text-slate-800">Edit Team Details</h3>
                    <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleEditTeam} className="space-y-4 flex-1">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Team Name *</label>
                      <input
                        type="text"
                        required
                        value={teamForm.name}
                        onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                        placeholder="e.g. BHM Counseling Dept"
                        className="w-full h-9 px-3 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">About / Description</label>
                      <textarea
                        value={teamForm.about}
                        onChange={(e) => setTeamForm({ ...teamForm, about: e.target.value })}
                        placeholder="e.g. Focuses on hotel management leads outreach and conversion rules."
                        rows={3}
                        className="w-full p-3 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Manage Members & Roles</label>
                      <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                        {users.map((user) => {
                          const memberInfo = teamForm.members.find(m => m.user_id === parseInt(user.id, 10))
                          const isSelected = !!memberInfo
                          return (
                            <div key={user.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg">
                              <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleUserSelection(parseInt(user.id, 10))}
                                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                />
                                <div className="text-left">
                                  <p className="text-[11.5px] font-bold text-slate-700">{user.name}</p>
                                  <p className="text-[9.5px] text-slate-400">{user.email || user.phoneNumber}</p>
                                </div>
                              </label>

                              {isSelected && (
                                <select
                                  value={memberInfo.role}
                                  onChange={(e) => updateMemberRole(parseInt(user.id, 10), e.target.value)}
                                  className="h-7 px-2 border border-slate-200 rounded-lg bg-white text-[10px] font-bold text-slate-700 focus:outline-hidden focus:border-blue-500"
                                >
                                  <option value="Member">Member</option>
                                  <option value="Specialist">Specialist</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Lead">Lead</option>
                                  <option value="Department Head">Head</option>
                                </select>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center shadow-xs"
                      >
                        Update Team
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
