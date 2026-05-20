import React from 'react'
import { motion } from 'framer-motion'

export default function Navbar({ username, onLogout, currentPage = 'dashboard' }) {
  // Page titles map
  const pageTitles = {
    dashboard: 'Dashboard',
    leads: 'All Leads',
    campaigns: 'Campaigns',
    teams: 'Teams',
    'form-builder': 'Form Builder',
    'add-lead': 'Create Lead'
  }

  const getPageTitle = () => {
    return pageTitles[currentPage] || 'Dashboard'
  }

  return (
    <motion.nav
      className="bg-surface border-b border-outline-variant px-8 flex items-center relative"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section - Search */}


      {/* Center Section - Title */}
      <div className="absolute left-4">
        <h2 className="font-headline-md text-headline-md text-on-background whitespace-nowrap">{getPageTitle()}</h2>
      </div>

      {/* Right Section - Actions & User Menu */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-1">
          {/* Search */}
          <div className="relative w-48">
            <span
              className="material-symbols-outlined absolute left-3 inset-y-0 flex items-center text-on-surface-variant text-[18px] pointer-events-none"
              aria-hidden="true"
            >
              search
            </span>
            
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-8 pr-3 h-7 bg-surface-container-lowest border border-outline-variant rounded font-body-xs text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        {/* Create Lead Button */}
        <button className="px-4 h-7 bg-primary hover:bg-primary/90 rounded text-on-primary font-body-md text-body-md font-semibold transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Create Lead
        </button>

        {/* User Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-surface-container rounded transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              notifications
            </span>
          </button>
          <button className="p-2 hover:bg-surface-container rounded transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              settings
            </span>
          </button>
          <button className="p-2 hover:bg-surface-container rounded transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              account_circle
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
