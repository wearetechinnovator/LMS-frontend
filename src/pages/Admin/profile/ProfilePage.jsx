import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Toast from '../../../components/Toast'

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256'
]

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    department: 'Admissions',
    role: 'User',
    user_img: '',
    avatar: 'US',
    color: 'bg-primary/10 text-primary border-primary/20'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingPass, setIsSavingPass] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const triggerToast = (msg) => {
    setToastMessage(msg)
  }

  // Load user profile details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('authToken')
        if (!token) return

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          const errData = await response.json()
          triggerToast(`Error: ${errData.error || 'Failed to load profile'}`)
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        triggerToast("Failed to fetch profile from database.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarSelect = (url) => {
    setProfile(prev => ({ ...prev, user_img: url }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 2MB size limit
    const MAX_SIZE = 2 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      triggerToast('Error: Selected image size exceeds the 2MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64String = event.target.result
      setProfile(prev => ({ ...prev, user_img: base64String }))
    }
    reader.onerror = () => {
      triggerToast('Error: Failed to read image file.')
    }
    reader.readAsDataURL(file)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!profile.name.trim() || !profile.phoneNumber.trim()) {
      triggerToast('Name and phone number fields are required!')
      return
    }

    setIsSaving(true)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          user_img: profile.user_img,
          department: profile.department
        })
      })

      if (response.ok) {
        const updated = await response.json()
        setProfile(updated)
        
        // Cache reactive values
        localStorage.setItem('username', updated.name)
        localStorage.setItem('userImg', updated.user_img)
        if (updated.token) {
          localStorage.setItem('authToken', updated.token)
        }
        
        // Trigger navbar re-fetch
        window.dispatchEvent(new Event('profile-updated'))
        triggerToast('Profile updated successfully!')
      } else {
        const errData = await response.json()
        triggerToast(`Error: ${errData.error || 'Failed to update profile'}`)
      }
    } catch (err) {
      triggerToast(`Network Error: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!passwordData.currentPassword) {
      triggerToast('Please provide your current password to verify.')
      return
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      triggerToast('New password must be at least 6 characters long.')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      triggerToast('New passwords do not match.')
      return
    }

    setIsSavingPass(true)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: passwordData.newPassword
        })
      })

      if (response.ok) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        })
        triggerToast('Password changed successfully!')
      } else {
        const errData = await response.json()
        triggerToast(`Error: ${errData.error || 'Failed to change password'}`)
      }
    } catch (err) {
      triggerToast(`Network Error: ${err.message}`)
    } finally {
      setIsSavingPass(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#f8f9ff]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        <p className="text-[12px] text-slate-500 font-semibold mt-3.5">Loading your profile settings...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-[#f8f9ff] p-6 space-y-6 overflow-y-auto font-sans select-none">
      
      {/* Toast alert */}
      <Toast message={toastMessage} isVisible={!!toastMessage} onClose={() => setToastMessage('')} />

      {/* Title block */}
      <div className="border-b border-slate-200/80 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#0b1c30]">Profile Settings</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Customize your personal profile preferences, security settings, and avatar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Avatar & Overview */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col items-center space-y-4">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full border flex items-center justify-center text-[32px] font-extrabold shadow-md overflow-hidden ${profile.color}`}>
              {profile.user_img ? (
                <img src={profile.user_img} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                profile.avatar
              )}
            </div>
            
          </div>

          <button
            type="button"
            onClick={() => document.getElementById('avatar-file-input').click()}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-97"
          >
            <span className="material-symbols-outlined text-[13px]">upload</span>
            Upload from Device
          </button>
          <input
            type="file"
            id="avatar-file-input"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div className="text-center space-y-1">
            <h2 className="text-[15px] font-bold text-slate-800">{profile.name}</h2>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{profile.role}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{profile.email || 'No email set'}</p>
          </div>

          <div className="w-full border-t border-slate-100 pt-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-bold">DEPARTMENT</span>
              <span className="text-slate-700 font-semibold">{profile.department}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-bold">PHONE</span>
              <span className="text-slate-700 font-semibold">{profile.phoneNumber}</span>
            </div>
          </div>

          {/* Quick Avatar selection */}
          <div className="w-full border-t border-slate-100 pt-4 space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Quick Avatar Choice</h3>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAvatarSelect(url)}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform active:scale-90 cursor-pointer ${profile.user_img === url ? 'border-primary scale-105 shadow-md' : 'border-transparent hover:scale-102'}`}
                >
                  <img src={url} alt={`avatar-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative pt-1">
              <input
                type="text"
                name="user_img"
                placeholder="Or paste custom image URL..."
                value={profile.user_img}
                onChange={handleProfileChange}
                className="w-full h-8 px-2 border border-slate-200 rounded text-[10px] focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Customization Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information Card */}
          <form onSubmit={handleProfileSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-[11px]">
            <h2 className="text-[14px] font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">person</span>
              Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-500">FULL NAME *</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-500">EMAIL ADDRESS</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-500">PHONE NUMBER *</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleProfileChange}
                  className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-500">DEPARTMENT</label>
                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={handleProfileChange}
                  className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[15px]">save</span>
                    Save Profile Changes
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Password Settings Card */}
          <form onSubmit={handlePasswordSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-[11px]">
            <h2 className="text-[14px] font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
              Update Password
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-500">CURRENT PASSWORD *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-500">NEW PASSWORD *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Minimum 6 characters"
                  className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-bold text-slate-500">CONFIRM NEW PASSWORD *</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Re-type new password"
                  className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingPass}
                className="px-5 py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-70"
              >
                {isSavingPass ? (
                  <>
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                    Changing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[15px]">vpn_key</span>
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  )
}
