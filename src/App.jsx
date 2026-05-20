import React, { useState } from 'react'
import AuthPage from './pages/Auth/AuthPage'
import OnboardingPage from './pages/Company/OnboardingPage'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [username, setUsername] = useState('')

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
  }

  return (
    <>
      {!isAuthenticated ? (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      ) : onboardingComplete ? (
        <Dashboard username={username} onLogout={handleLogout} />
      ) : (
        <OnboardingPage username={username} onLogout={handleLogout} onComplete={handleOnboardingComplete} />
      )}
    </>
  )
}
