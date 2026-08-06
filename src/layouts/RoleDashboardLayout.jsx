import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import InteractiveTour from '../components/InteractiveTour'
import SpotlightSearch from '../components/SpotlightSearch'
import { hasPermission } from '../components/ProtectRoute'

export default function RoleDashboardLayout({ username, onLogout, navigationItems, roleName }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [permsVersion, setPermsVersion] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const fetchLatestPermissions = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) return
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          if (data && data.permissions) {
            localStorage.setItem('userPermissions', JSON.stringify(data.permissions))
            if (data.role) {
              localStorage.setItem('userRole', data.role)
            }
            setPermsVersion(v => v + 1)
          }
        }
      } catch (err) {
        console.warn("Failed to sync latest permissions:", err)
      }
    }
    fetchLatestPermissions()
  }, [location.pathname])

  const filteredNavItems = navigationItems.filter(item => {
    if (item.id === 'dashboard' || item.id === 'analytics') {
      return hasPermission('dashboard')
    }
    if (item.id === 'form-builder' || item.id === 'form-embed') {
      return hasPermission('forms_view')
    }
    if (item.id === 'meta-ads') {
      return hasPermission('campaigns_view')
    }
    if (item.id === 'leads') {
      return hasPermission('leads_view')
    }
    if (item.id === 'campaigns') {
      return hasPermission('leads_view') || hasPermission('dashboard')
    }
    if (item.id === 'teams') {
      return hasPermission('settings')
    }
    if (item.id === 'roles') {
      const uRole = localStorage.getItem('userRole')
      return uRole === 'Admin' || uRole === 'System Admin'
    }
    if (item.id === 'audit-logs') {
      return hasPermission('auditLogs')
    }
    return true
  })

  return (
    <div className="bg-background h-screen flex overflow-hidden">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onLogout={onLogout}
        navigationItems={filteredNavItems}
        roleName={roleName}
        username={username}
      />
      <div className="layout-main">
        <Navbar username={username} onLogout={onLogout} roleName={roleName} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
      <InteractiveTour username={username} />
      <SpotlightSearch
        onLogout={onLogout}
        navigationItems={filteredNavItems}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </div>
  )
}
