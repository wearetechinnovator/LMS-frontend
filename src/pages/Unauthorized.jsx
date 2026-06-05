import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
  const navigate = useNavigate()
  const role = localStorage.getItem('userRole') || ''

  const handleGoHome = () => {
    if (role === 'admin') {
      navigate('/admin/dashboard')
    } else if (role === 'counselor') {
      navigate('/counselor/overview')
    } else if (role === 'vendor') {
      navigate('/vendor/portal')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="grid place-items-center w-full min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center border border-slate-100">
        <span className="material-symbols-outlined text-[64px] text-red-500 mb-4">gpp_bad</span>
        <h1 className="text-[20px] font-bold mb-2">403 - Unauthorized Access</h1>
        <p className="text-[12px] text-slate-500 mb-6 font-medium leading-relaxed">
          You do not have permission to view this resource. If you believe this is in error, please contact your systems administrator.
        </p>
        <button
          onClick={handleGoHome}
          className="h-9 px-6 bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold rounded-lg shadow-sm transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}
