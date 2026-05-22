import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../assets/custom.css'

export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: 'form-builder', label: 'Form Builder', icon: 'build', path: '/form-builder' },
    { id: 'leads', label: 'All Leads', icon: 'people', path: '/leads' },
    { id: 'campaigns', label: 'Campaigns', icon: 'campaign', path: '/departments' },
    { id: 'teams', label: 'Teams', icon: 'group', path: '/teams' },
    { id: 'audit-logs', label: 'Audit Logs', icon: 'receipt_long', path: '/audit-logs' }
  ]

  const getActiveItem = () => {
    return navigationItems.find(item => item.path === location.pathname)?.id || 'dashboard'
  }

  return (
    <motion.aside
      className={`sidebar-aside ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <div className={`header-content ${sidebarCollapsed ? 'header-content-collapsed' : 'header-content-expanded'}`}>
          {!sidebarCollapsed && (
            <div className="logo-info">
              <h1>TIS INDIA</h1>
              <p>Admin Account</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="toggle-btn"
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            <span className="material-symbols-outlined icon">
              {sidebarCollapsed ? 'right_panel_close' : 'right_panel_open'}
            </span>
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            title={sidebarCollapsed ? item.label : ''}
            className={`nav-item ${getActiveItem() === item.id ? 'active' : ''} ${sidebarCollapsed ? 'nav-item-collapsed' : ''}`}
          >
            <span className="material-symbols-outlined icon">{item.icon}</span>
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {!sidebarCollapsed && (
        <div className="sidebar-footer">
          <button
            onClick={() => navigate('/settings')}
            className={`footer-btn ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined icon">settings</span>
            <span>Settings</span>
          </button>
          <button onClick={onLogout} className="footer-btn">
            <span className="material-symbols-outlined icon">logout</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </motion.aside>
  )
}