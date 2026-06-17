import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserContext } from '../contextApi.jsx'
import { useContext } from 'react'


export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed, onLogout, navigationItems = [], roleName = 'Admin Account', userName, username }) {
  const name = useContext(UserContext);
  const activeUsername = username || userName || localStorage.getItem('username') || 'ADMIN'

  const navigate = useNavigate()
  const location = useLocation()

  const [width, setWidth] = React.useState(() => {
    const saved = localStorage.getItem('sidebarWidth')
    return saved ? parseInt(saved, 10) : 240
  })
  const [isResizing, setIsResizing] = React.useState(false)
  const [hoveredItem, setHoveredItem] = React.useState(null)
  const [tooltipTop, setTooltipTop] = React.useState(0)
  const [expandedItems, setExpandedItems] = React.useState({
    analytics: location.pathname.includes('/analytics')
  })

  // Automatically expand sub-menus if active path is a sub-route
  React.useEffect(() => {
    navigationItems.forEach(item => {
      if (item.subItems && item.subItems.some(sub => location.pathname === sub.path)) {
        setExpandedItems(prev => ({ ...prev, [item.id]: true }))
      }
    })
  }, [location.pathname, navigationItems])

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
    const matched = navigationItems.find(item => {
      if (item.path === location.pathname) return true
      if (item.subItems && item.subItems.some(sub => sub.path === location.pathname)) return true
      return false
    })
    return matched ? matched.id : ''
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
                <h1 className="truncate" style={{ maxWidth: '120px' }}>{activeUsername}</h1>
                <p>{roleName}</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="toggle-btn"
              title={sidebarCollapsed ? 'Expand' : 'Collapse'}
            >
              <span className="material-symbols-outlined icon">
                {sidebarCollapsed ? 'dock_to_left' : 'dock_to_right'}
              </span>
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map(item => {
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isExpanded = !!expandedItems[item.id]
            const isActive = getActiveItem() === item.id

            return (
              <div key={item.id} className="nav-group" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))
                      // If expanding and not already inside a sub-route, navigate to first sub-item
                      if (!location.pathname.includes(item.path)) {
                        navigate(item.subItems[0].path)
                      }
                    } else {
                      navigate(item.path)
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (sidebarCollapsed) {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setTooltipTop(rect.top + rect.height / 2)
                      setHoveredItem(item.label)
                    }
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`nav-item ${isActive ? 'active' : ''} ${sidebarCollapsed ? 'nav-item-collapsed' : ''}`}
                >
                  <span className="material-symbols-outlined icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {!sidebarCollapsed && hasSubItems && (
                    <span className="material-symbols-outlined sub-menu-arrow">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  )}
                </button>

                {/* Sub Menu Items */}
                {!sidebarCollapsed && hasSubItems && isExpanded && (
                  <div className="sub-menu-list">
                    {item.subItems.map(subItem => {
                      const isSubActive = location.pathname === subItem.path
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => navigate(subItem.path)}
                          className={`sub-nav-item ${isSubActive ? 'active' : ''}`}
                        >
                          <span className="sub-nav-dot" />
                          <span className="truncate">{subItem.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => navigate(getSettingsPath())}
            className={`footer-btn ${location.pathname === getSettingsPath() ? 'active' : ''} ${sidebarCollapsed ? 'nav-item-collapsed' : ''}`}
            onMouseEnter={(e) => {
              if (sidebarCollapsed) {
                const rect = e.currentTarget.getBoundingClientRect()
                setTooltipTop(rect.top + rect.height / 2)
                setHoveredItem('Settings')
              }
            }}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="material-symbols-outlined icon">settings</span>
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
          <button
            onClick={onLogout}
            className={`footer-btn ${sidebarCollapsed ? 'nav-item-collapsed' : ''}`}
            onMouseEnter={(e) => {
              if (sidebarCollapsed) {
                const rect = e.currentTarget.getBoundingClientRect()
                setTooltipTop(rect.top + rect.height / 2)
                setHoveredItem('Logout')
              }
            }}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="material-symbols-outlined icon">logout</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

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