import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Toast from '../../../components/Toast'
import { ProfileSkeleton } from '../../../components/Skeletons'

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256'
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [companyDetails, setCompanyDetails] = useState({
    companyName: localStorage.getItem('companyName') || '',
    industry: localStorage.getItem('companyIndustry') || '',
    companySize: localStorage.getItem('companySize') || '',
    primaryEmail: localStorage.getItem('companyEmail') || '',
    supportPhone: localStorage.getItem('companyPhone') || '',
    logoFile: localStorage.getItem('companyLogo') || ''
  })

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

  const parseErrorResponse = async (response, fallbackMsg) => {
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        return data.error || fallbackMsg
      }
      const text = await response.text()
      if (text && !text.includes('<!DOCTYPE') && text.length < 100) {
        return text
      }
      return `HTTP ${response.status}: ${response.statusText || fallbackMsg}`
    } catch (e) {
      return `HTTP ${response.status}: ${response.statusText || fallbackMsg}`
    }
  }

  const handleCompanyLogoFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const MAX_SIZE = 2 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      triggerToast('Error: Selected logo size exceeds the 2MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64String = event.target.result
      setCompanyDetails(prev => ({ ...prev, logoFile: base64String }))
    }
    reader.readAsDataURL(file)
  }

  const handleCompanySubmit = async (e) => {
    e.preventDefault()
    if (!companyDetails.companyName.trim()) {
      triggerToast('Company name is required!')
      return
    }

    localStorage.setItem('companyName', companyDetails.companyName)
    localStorage.setItem('companyIndustry', companyDetails.industry)
    localStorage.setItem('companySize', companyDetails.companySize)
    localStorage.setItem('companyEmail', companyDetails.primaryEmail)
    localStorage.setItem('companyPhone', companyDetails.supportPhone)
    localStorage.setItem('companyLogo', companyDetails.logoFile)

    const token = localStorage.getItem('authToken')
    if (token && token !== 'mock-jwt-token') {
      try {
        await fetch(`${import.meta.env.VITE_BASE_URL}/company/save-company`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            company_name: companyDetails.companyName,
            industry: companyDetails.industry,
            company_size: companyDetails.companySize,
            primary_email: companyDetails.primaryEmail,
            support_phone: companyDetails.supportPhone,
            logo_file: companyDetails.logoFile
          })
        })
      } catch (err) {
        console.error("Error saving company details:", err)
      }
    }

    window.dispatchEvent(new Event('profile-updated'))
    triggerToast('Company details updated successfully!')
  }

  // Load user profile details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const startTime = Date.now()
      setIsLoading(true)
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          const elapsed = Date.now() - startTime
          const delay = Math.max(0, 500 - elapsed)
          setTimeout(() => setIsLoading(false), delay)
          return
        }

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          const errMsg = await parseErrorResponse(response, 'Failed to load profile')
          triggerToast(`Error: ${errMsg}`)
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        triggerToast("Failed to fetch profile from database.")
      } finally {
        const elapsed = Date.now() - startTime
        const delay = Math.max(0, 500 - elapsed)
        setTimeout(() => {
          setIsLoading(false)
        }, delay)
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
        const errMsg = await parseErrorResponse(response, 'Failed to update profile')
        triggerToast(`Error: ${errMsg}`)
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
        const errMsg = await parseErrorResponse(response, 'Failed to change password')
        triggerToast(`Error: ${errMsg}`)
      }
    } catch (err) {
      triggerToast(`Network Error: ${err.message}`)
    } finally {
      setIsSavingPass(false)
    }
  }

  if (isLoading) {
    return <ProfileSkeleton />
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

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 gap-6 select-none">
        <button
          onClick={() => setActiveTab('personal')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'personal' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">person</span>
          Personal & Security
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`pb-2.5 font-bold text-[13px] border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'company' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">business</span>
          Company Details
        </button>
      </div>

      {activeTab === 'personal' && (
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
              accept=".svg,.png,.jpg,.jpeg,.gif,image/*"
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
      )}

      {activeTab === 'company' && (
        <motion.div
          key="company-tab"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-left"
        >
          {/* Left Column: Organization Logo Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col items-center space-y-4">
            <h2 className="text-[14px] font-bold text-slate-800 border-b border-slate-100 pb-2.5 w-full flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">cloud_upload</span>
              Organization Logo
            </h2>

            <div className="w-full flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-xl border border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden shadow-sm">
                {companyDetails.logoFile ? (
                  <img src={companyDetails.logoFile} alt="Company Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-slate-300" style={{ fontSize: '48px' }}>business</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => document.getElementById('company-logo-input').click()}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-97"
              >
                <span className="material-symbols-outlined text-[13px]">upload</span>
                Upload Logo
              </button>
              <input
                type="file"
                id="company-logo-input"
                accept=".svg,.png,.jpg,.jpeg,.gif,image/*"
                onChange={handleCompanyLogoFile}
                style={{ display: 'none' }}
              />

              <input
                type="text"
                placeholder="Or paste logo image URL..."
                value={companyDetails.logoFile}
                onChange={(e) => setCompanyDetails(prev => ({ ...prev, logoFile: e.target.value }))}
                className="w-full h-8 px-2.5 border border-slate-200 rounded text-[10px] focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Right Column: Company Info Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCompanySubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-[11px]">
              <h2 className="text-[14px] font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">business</span>
                Organization Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">COMPANY NAME *</label>
                  <input
                    type="text"
                    value={companyDetails.companyName}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                    className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">INDUSTRY</label>
                  <select
                    value={companyDetails.industry}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                  >
                    <option value="">Select industry...</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="General Sales">General Sales</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">COMPANY SIZE</label>
                  <select
                    value={companyDetails.companySize}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, companySize: e.target.value }))}
                    className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                  >
                    <option value="">Select size...</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201+">201+ employees</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">PRIMARY CONTACT EMAIL</label>
                  <input
                    type="email"
                    value={companyDetails.primaryEmail}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, primaryEmail: e.target.value }))}
                    placeholder="admin@company.com"
                    className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">SUPPORT/MAIN PHONE</label>
                  <input
                    type="tel"
                    value={companyDetails.supportPhone}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, supportPhone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-8 px-3 border border-slate-200 rounded bg-slate-50/30 text-slate-700 font-semibold focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-[15px]">save</span>
                  Save Company Details
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

    </div>
  )
}
