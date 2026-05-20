import React from 'react'
import { Navigate } from 'react-router-dom'

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken')
  return !!token
}

// Protected Route - Only authenticated users can access
export const ProtectRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }
  return children
}

// Unprotected Route - Only unauthenticated users can access (auth pages)
export const UnProtectRoute = ({ children, login }) => {
  if (login && isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

// Company Protection - Check if user has company selected
const ProtectCP = ({ children }) => {
  const companyId = localStorage.getItem('companyId')
  if (!companyId) {
    return <Navigate to="/admin/company" replace />
  }
  return children
}

export default ProtectCP
