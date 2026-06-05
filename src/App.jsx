import React, { useState, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AuthPage from './pages/Auth/AuthPage'
import OnboardingPage from './pages/Admin/Company/OnboardingPage'
import { UnProtectRoute } from './components/ProtectRoute'
import { RoleRoutes } from './routes/routesConfig'
import Unauthorized from './pages/Unauthorized'
import UserProvider from './contextApi.jsx'

const LoadingSpinner = () => (
  <div className="grid place-items-center w-full min-h-screen bg-background">
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-.5s]"></div>
    </div>
  </div>
)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        navigate(-1)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const handleAuthSuccess = (user) => {
    setUsername(user.username)
    setIsAuthenticated(true)
  }

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setOnboardingComplete(false)
    setUsername('')
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
  }

  const getRedirectPath = () => {
    const role = localStorage.getItem('userRole')
    if (role === 'admin') {
      return '/admin/dashboard'
    }
    if (role === 'counselor') {
      return '/counselor/overview'
    }
    if (role === 'vendor') {
      return '/vendor/dashboard'
    }
    return '/dashboard'
  }

  return (
    <UserProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <UnProtectRoute login={true}>
                  <AuthPage onAuthSuccess={handleAuthSuccess} />
                </UnProtectRoute>
              ) : onboardingComplete ? (
                <Navigate to={getRedirectPath()} replace />
              ) : (
                <OnboardingPage username={username} onLogout={handleLogout} onComplete={handleOnboardingComplete} />
              )
            }
          />

          <Route
            path="/onboarding"
            element={
              isAuthenticated && !onboardingComplete ? (
                <OnboardingPage username={username} onLogout={handleLogout} onComplete={handleOnboardingComplete} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {RoleRoutes({ username, handleLogout })}

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </UserProvider>
  )
}

export default App
