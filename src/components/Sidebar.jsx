import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../assets/custom.css'

export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed, onLogout, navigationItems = [], roleName = 'Admin Account' }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [width, setWidth] = React.useState(() => {
    const saved = localStorage.getItem('sidebarWidth')
    return saved ? parseInt(saved, 10) : 240
  })
  const [isResizing, setIsResizing] = React.useState(false)
  const [hoveredItem, setHoveredItem] = React.useState(null)
  const [tooltipTop, setTooltipTop] = React.useState(0)

  const startResizing = React.useCallback((e) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = React.useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = React.useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX
      if (newWidth >= 160 && newWidth <= 400) {
        setWidth(newWidth)
        localStorage.setItem('sidebarWidth', newWidth.toString())
      }
    }
  }, [isResizing])

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    }
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  const getActiveItem = () => {
    return navigationItems.find(item => item.path === location.pathname)?.id || ''
  }

  const getSettingsPath = () => {
    if (location.pathname.startsWith('/admin')) return '/admin/settings'
    if (location.pathname.startsWith('/counselor')) return '/counselor/settings'
    if (location.pathname.startsWith('/vendor')) return '/vendor/settings'
    return '/settings'
  }

  return (
    <>
      <motion.aside
        className={`sidebar-aside ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
        style={{
          width: sidebarCollapsed ? '64px' : `${width}px`,
          transition: isResizing ? 'none' : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <div className={`header-content ${sidebarCollapsed ? 'header-content-collapsed' : 'header-content-expanded'}`}>
            {!sidebarCollapsed && (
              <div className="logo-info">
                <h1>TIS INDIA</h1>
                <p>{roleName}</p>
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
              onMouseEnter={(e) => {
                if (sidebarCollapsed) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setTooltipTop(rect.top + rect.height / 2)
                  setHoveredItem(item.label)
                }
              }}
              onMouseLeave={() => setHoveredItem(null)}
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
              onClick={() => navigate(getSettingsPath())}
              className={`footer-btn ${location.pathname === getSettingsPath() ? 'active' : ''}`}
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

        {!sidebarCollapsed && (
          <div
            className={`sidebar-resize-handle ${isResizing ? 'resizing' : ''}`}
            onMouseDown={startResizing}
          />
        )}
      </motion.aside>

      {sidebarCollapsed && hoveredItem && (
        <div
          style={{
            position: 'fixed',
            left: '72px',
            top: `${tooltipTop}px`,
            transform: 'translateY(-50%)',
            zIndex: 9999
          }}
          className="bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1.5 rounded-md shadow-md border border-slate-800 flex items-center select-none whitespace-nowrap leading-none tracking-wide"
        >
          {hoveredItem}
        </div>
      )}
    </>
  )
}