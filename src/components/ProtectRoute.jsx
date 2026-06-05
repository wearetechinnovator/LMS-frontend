import React from 'react'
import { Navigate } from 'react-router-dom'

const isAuthenticated = () => {
  const token = localStorage.getItem('authToken')
  return !!token
}

export const ProtectRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('userRole')

  if (!token) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export const UnProtectRoute = ({ children, login }) => {
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('userRole')

  if (login && token) {
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    if (role === 'counselor') {
      return <Navigate to="/counselor/overview" replace />
    }
    if (role === 'vendor') {
      return <Navigate to="/vendor/portal" replace />
    }
    return <Navigate to="/dashboard" replace />
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
