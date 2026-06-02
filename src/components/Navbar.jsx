import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const location = useLocation()
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Page titles map
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/leads': 'All Leads',
    '/departments': 'Campaigns',
    '/teams': 'Teams',
    '/form-builder': 'Form Builder'
  }

  const getPageTitle = () => {
    for (const [path, title] of Object.entries(pageTitles)) {
      if (location.pathname.startsWith(path)) {
        return title
      }
    }
    return 'Dashboard'
  }

  const username = localStorage.getItem('username') || 'ADMIN'

  return (
    <motion.nav
      className="bg-surface border-b border-outline-variant px-8 flex items-center justify-between h-11 sticky top-0 z-30"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section - Title */}
      <div>
        <h2 className="text-headline-md font-headline-md text-on-background whitespace-nowrap">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right Section - Actions & User Menu */}
      <div className="flex items-center gap-2">
        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <span
              className="material-symbols-outlined text-on-surface text-[24px]"
              aria-hidden="true"
            >
              notifications
            </span>
            {/* Notification Dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <motion.div
              className="absolute right-0 mt-2 w-80 bg-surface border border-outline-variant rounded-lg shadow-lg p-4 z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-body-md font-body-md text-on-surface mb-3">Notifications</div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="p-2 bg-surface-container-lowest rounded text-body-sm text-on-surface-variant">
                  No new notifications
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Help Icon */}
        <button className="p-2 rounded-full hover:bg-surface-container transition-colors">
          <span
            className="material-symbols-outlined text-on-surface text-[24px]"
            aria-hidden="true"
          >
            help
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-outline-variant"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-body-md font-body-md text-on-surface text-[12px] uppercase tracking-wide">
              {username}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-[14px] font-bold cursor-pointer hover:opacity-80 transition-opacity">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
