import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: 'form-builder', label: 'Form Builder', icon: 'build', path: '/form-builder' },
    { id: 'leads', label: 'All Leads', icon: 'people', path: '/leads' },
    { id: 'campaigns', label: 'Campaigns', icon: 'campaign', path: '/departments' },
    { id: 'teams', label: 'Teams', icon: 'group', path: '/teams' }
  ]

  const getActiveItem = () => {
    const path = location.pathname.replace(/^\//, '')
    return navigationItems.find(item => item.path === location.pathname)?.id || 'dashboard'
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <motion.aside
      className={`bg-surface border-r border-outline-variant flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-15' : 'w-40'
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo Section */}
      <div className="px-2 border-b border-outline-variant h-11">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-headline-md text-headline-md text-on-background text-[12px] leading-tight">TIS INDIA</h1>
                <p className="text-body-sm text-body-sm text-on-surface-variant text-[10px] leading-tight">Admin Account</p>
              </div>
            )}
          </div>
          
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-surface-container rounded transition-colors shrink-0"
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              {sidebarCollapsed ? 'right_panel_close' : 'right_panel_open'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.path)}
            title={sidebarCollapsed ? item.label : ''}
            className={`w-full flex items-center gap-3 px-2 py-2.5 rounded font-body-md text-body-md transition-colors ${
              getActiveItem() === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            } ${sidebarCollapsed ? 'justify-center px-1' : ''}`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {!sidebarCollapsed && <span className="text-[12px]">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer Section */}
      {!sidebarCollapsed && (
        <div className="border-t border-outline-variant">
          <button className="w-full flex items-center gap-2 p-2 rounded text-body-md font-body-md text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-[12px]">Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 p-2 rounded text-body-md font-body-md text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-[12px]">Logout</span>
          </button>
        </div>
      )}
    </motion.aside>
  )
}
