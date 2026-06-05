import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function RoleDashboardLayout({ username, onLogout, navigationItems, roleName }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <div className="layout-container">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onLogout={onLogout}
        navigationItems={navigationItems}
        roleName={roleName}
      />
      <div className="layout-main">
        <Navbar username={username} onLogout={onLogout} roleName={roleName} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
