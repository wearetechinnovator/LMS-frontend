import React from 'react'
import { Navigate } from 'react-router-dom'

export const hasPermission = (permissionKey) => {
  const role = localStorage.getItem('userRole')
  // Super admin / admin role gets bypass access to all settings
  if (role === 'admin' || role === 'Admin' || role === 'System Admin') return true

  const permsStr = localStorage.getItem('userPermissions')
  if (!permsStr) return false

  try {
    const perms = JSON.parse(permsStr)
    return !!perms[permissionKey]
  } catch (e) {
    return false
  }
}

export const PermissionGate = ({ permission, fallback = <Navigate to="/unauthorized" replace />, children }) => {
  if (hasPermission(permission)) {
    return children
  }
  return fallback
}

export const ProtectRoute = ({ children }) => {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

export const UnProtectRoute = ({ children, login }) => {
  const token = localStorage.getItem('authToken')

  if (login && token) {
    return <Navigate to="/admin/dashboard" replace />
  }
  return children
}

const ProtectCP = ({ children }) => {
  const companyId = localStorage.getItem('companyId')
  if (!companyId) {
    return <Navigate to="/admin/company" replace />
  }
  return children
}

export default ProtectCP
