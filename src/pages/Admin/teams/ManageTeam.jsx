import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function ManageTeam({ departmentId, departmentName: propName, onBack }) {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const teamId = paramId || departmentId

  const [team, setTeam] = useState(null)
  const [users, setUsers] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [toast, setToast] = useState(null)

  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [newMemberForm, setNewMemberForm] = useState({
    userId: '',
    role: 'Specialist'
  })

  const rolesFilter = ['All', 'Department Head', 'Lead', 'Manager', 'Specialist', 'Member']

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(`/admin/teams/${teamId}`)
    }
  }

  const fetchData = async () => {
    if (!teamId) return
    setLoading(true)
    const token = localStorage.getItem('authToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    try {
      // 1. Fetch team details & existing members
      const teamRes = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/team/${teamId}`, { headers })
      if (teamRes.ok) {
        const data = await teamRes.json()
        setTeam(data)
        setTeamMembers(data.members || [])
      } else {
        showToast('Failed to fetch team details', 'error')
      }

      // 2. Fetch all system users to select from when adding members
      const userRes = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/user/get-users`, { headers })
      if (userRes.ok) {
        const data = await userRes.json()
        setUsers(data)
      }
    } catch (err) {
      console.error(err)
      showToast('Connection error to server', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [teamId])

  // Helper to synchronize updates back to the database
  const saveMembershipUpdates = async (updatedMembers) => {
    const token = localStorage.getItem('authToken')
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/team/${teamId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: team.name,
          about: team.description,
          members: updatedMembers.map(m => ({ user_id: parseInt(m.id, 10), role: m.role }))
        })
      })

      if (response.ok) {
        showToast('Membership updated successfully')
        // Refetch to ensure data integrity
        const teamRes = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/v1'}/team/${teamId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
        if (teamRes.ok) {
          const data = await teamRes.json()
          setTeamMembers(data.members || [])
        }
      } else {
        const data = await response.json()
        showToast(data.error || 'Failed to update membership', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Connection error while saving updates', 'error')
    }
  }

  // Add Member Submit
  const handleAddMember = (e) => {
    e.preventDefault()
    if (!newMemberForm.userId) return

    const selectedUser = users.find(u => u.id === newMemberForm.userId)
    if (!selectedUser) return

    // Check if already in team
    if (teamMembers.some(m => m.id === selectedUser.id)) {
      showToast('User is already a member of this team', 'error')
      setShowAddMemberModal(false)
      return
    }

    const updated = [
      ...teamMembers,
      {
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phoneNumber,
        role: newMemberForm.role,
        avatar: selectedUser.avatar || selectedUser.name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2),
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      }
    ]

    setTeamMembers(updated)
    setShowAddMemberModal(false)
    setNewMemberForm({ userId: '', role: 'Specialist' })
    saveMembershipUpdates(updated)
  }

  // Remove Member
  const removeMember = (id) => {
    if (!window.confirm('Are you sure you want to remove this member from the team?')) return
    const updated = teamMembers.filter(m => m.id !== id)
    setTeamMembers(updated)
    saveMembershipUpdates(updated)
  }

  // Change Role Inline
  const handleRoleChange = (id, newRole) => {
    const updated = teamMembers.map(m => m.id === id ? { ...m, role: newRole } : m)
    setTeamMembers(updated)
    saveMembershipUpdates(updated)
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = selectedRole === 'All' || member.role === selectedRole
    return matchSearch && matchRole
  })

  // Get users who are NOT currently in the team
  const availableUsersToInvite = users.filter(user => 
    !teamMembers.some(member => member.id === user.id)
  )

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

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 p-4 space-y-4 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg z-50 transition-all ${
          toast.type === 'error' ? 'bg-red-50' : 'bg-emerald-500'
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
            title="Back to Team Overview"
          >
            <span className="material-symbols-outlined text-[18px] block">arrow_back</span>
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-800">Manage Team Members</h1>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{team.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddMemberModal(true)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-extrabold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">person_add</span>
          Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
        <div className="flex-1 relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">search</span>
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-9 pr-3 border border-slate-200 rounded-lg bg-white text-[11px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="h-8 px-3 border border-slate-200 rounded-lg bg-white text-[11px] font-bold text-slate-700 focus:outline-hidden focus:border-blue-500 w-full sm:w-auto appearance-none cursor-pointer"
        >
          {rolesFilter.map(role => (
            <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
          ))}
        </select>
      </div>

      {/* Members Table */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-2xs">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-[11px] text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold text-[9px] uppercase tracking-wider sticky top-0">
              <tr>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Join Date</th>
                <th className="px-4 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No members match search query.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold border border-slate-200">
                          {member.avatar}
                        </div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-slate-500 font-medium">{member.email}</td>
                    <td className="px-4 py-2">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="h-7 px-2 border border-slate-200 rounded-lg bg-white text-[10px] font-bold text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                      >
                        <option value="Member">Member</option>
                        <option value="Specialist">Specialist</option>
                        <option value="Manager">Manager</option>
                        <option value="Lead">Lead</option>
                        <option value="Department Head">Head</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-slate-400 font-medium">{member.joinDate}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg transition-colors cursor-pointer"
                        title="Remove Member from Team"
                      >
                        <span className="material-symbols-outlined text-[16px] block">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddMemberModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddMemberModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-sm w-full p-5 text-left">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-4">
                  <h3 className="text-base font-extrabold text-slate-800">Add Team Member</h3>
                  <button onClick={() => setShowAddMemberModal(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Select User *</label>
                    <select
                      required
                      value={newMemberForm.userId}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, userId: e.target.value })}
                      className="w-full h-9 px-3 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">-- Choose User --</option>
                      {availableUsersToInvite.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.email || u.phoneNumber})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Role *</label>
                    <select
                      value={newMemberForm.role}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                      className="w-full h-9 px-3 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Member">Member</option>
                      <option value="Specialist">Specialist</option>
                      <option value="Manager">Manager</option>
                      <option value="Lead">Lead</option>
                      <option value="Department Head">Head</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddMemberModal(false)}
                      className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newMemberForm.userId}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center shadow-xs"
                    >
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
