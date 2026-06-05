import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function RoleDashboardLayout({ username, onLogout, navigationItems, roleName }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <div className="bg-background h-screen flex overflow-hidden">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onLogout={onLogout}
        navigationItems={navigationItems}
        roleName={roleName}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar username={username} onLogout={onLogout} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
