import React, { use, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserContext } from '../contextApi.jsx'
import { useEffect } from 'react'
import getUser from '../api/getUser.js'

export default function Navbar({ username, onLogout, roleName = 'Admin Account' }) {

  const name = useContext(UserContext);

  const location = useLocation()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showFormsDropdown, setShowFormsDropdown] = useState(false)
  const [formsList, setFormsList] = useState([
    { name: 'ALL', displayName: 'All Leads', count: 7 },
    { name: 'B.Tech Admissions Form', displayName: 'B.Tech Admissions Form', count: 3 },
    { name: 'MBA Scholarship Form', displayName: 'MBA Scholarship Form', count: 2 },
    { name: 'General Inquiry Form', displayName: 'General Inquiry Form', count: 2 }
  ])
  const [activeFormName, setActiveFormName] = useState('ALL')

  React.useEffect(() => {
    const handleDataUpdate = (e) => {
      if (e.detail) {
        if (e.detail.formsList) setFormsList(e.detail.formsList)
        if (e.detail.activeForm) setActiveFormName(e.detail.activeForm)
      }
    }
    window.addEventListener('lms-forms-data-updated', handleDataUpdate)
    return () => window.removeEventListener('lms-forms-data-updated', handleDataUpdate)
  }, [])

  const handleFormSelect = (formName) => {
    setActiveFormName(formName)
    window.dispatchEvent(new CustomEvent('lms-form-filter-changed', { detail: formName }))
  }

  // Page titles map
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/overview': 'Overview',
    '/leads': 'All Leads',
    '/departments': 'Campaigns',
    '/campaigns': 'Campaigns',
    '/teams': 'Teams',
    '/form-builder': 'Form Builder',
    '/form-embed': 'Form Embed',
    '/roles': 'Role Management',
    '/audit-logs': 'Audit Logs',
    '/settings': 'Settings',
    '/analytics': 'Analytics'
  }

  const getPageTitle = () => {
    // Strip layout prefix /admin, /counselor, /vendor
    const path = location.pathname.replace(/^\/(admin|counselor|vendor)/, '')
    for (const [key, title] of Object.entries(pageTitles)) {
      if (path === key || path.startsWith(key + '/')) {
        return title
      }
    }
    return 'Dashboard'
  }

  const activeUsername = username || localStorage.getItem('username') || 'ADMIN'
  const roleText = (roleName || 'Admin').split(' ')[0].toUpperCase()

  return (
    <motion.nav
      className="layout-navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section - Title / Dropdown */}
      <div className="navbar-left">
        {location.pathname.includes('/leads') ? (
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => setShowFormsDropdown(!showFormsDropdown)}
              className="flex items-center gap-1.5 text-[15px] font-bold text-[#0b1c30] hover:opacity-85 transition-opacity bg-transparent border-none p-0 cursor-pointer select-none"
            >
              <span>
                {activeFormName === 'ALL'
                  ? `All Leads - (${formsList.find(f => f.name === 'ALL')?.count || 0})`
                  : `${activeFormName} - (${formsList.find(f => f.name === activeFormName)?.count || 0})`}
              </span>
              <span className="material-symbols-outlined text-[20px] text-slate-500 transition-transform duration-200" style={{ transform: showFormsDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                keyboard_arrow_down
              </span>
            </button>

            {showFormsDropdown && (
              <>
                {/* Backdrop overlay to close */}
                <div className="fixed inset-0 z-45" onClick={() => setShowFormsDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 top-full mt-2.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-left select-none"
                >
                  {formsList.map((form) => (
                    <button
                      key={form.name}
                      onClick={() => {
                        handleFormSelect(form.name)
                        setShowFormsDropdown(false)
                      }}
                      className={`w-full px-3.5 py-2 text-left text-[12px] font-semibold hover:bg-slate-50 flex items-center justify-between transition-colors border-none bg-transparent cursor-pointer ${activeFormName === form.name ? 'text-blue-600 bg-blue-50/40' : 'text-slate-700 hover:text-slate-900'
                        }`}
                    >
                      <span>{form.displayName === 'ALL' ? 'All Leads' : form.displayName}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeFormName === form.name ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {form.count}
                      </span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        ) : (
          <h2 className="navbar-title">
            {getPageTitle()}
          </h2>
        )}
      </div>

      {/* Right Section - Actions & User Menu */}
      <div className="navbar-right">
        {/* Notifications Icon */}
        <div className="relative" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="navbar-btn"
          >
            <span
              className="material-symbols-outlined icon"
              aria-hidden="true"
            >
              notifications
            </span>
            {/* Notification Dot */}
            <span className="navbar-badge"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <motion.div
                className="navbar-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="dropdown-title">Notifications</div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <div className="dropdown-empty">
                    No new notifications
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Help Icon */}
        <button className="navbar-btn">
          <span
            className="material-symbols-outlined icon"
            aria-hidden="true"
          >
            help
          </span>
        </button>

        {/* Divider */}
        <div className="navbar-divider"></div>

        {/* User Profile */}
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-role">
              {name}
            </span>
          </div>
          <div className="user-avatar">
            {activeUsername.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
