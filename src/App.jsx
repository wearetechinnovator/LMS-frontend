import React, { useState, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import AuthPage from './pages/Auth/AuthPage'
import OnboardingPage from './pages/Admin/Company/OnboardingPage'
import { UnProtectRoute } from './components/ProtectRoute'
import { RoleRoutes } from './routes/routesConfig'
import Unauthorized from './pages/Unauthorized'
import UserProvider from './contextApi.jsx'
import ChatBot from './components/ChatBot'

const PublicEmbedForm = React.lazy(() => import('./pages/PublicEmbedForm'))

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
  const [progress, setProgress] = useState(0)
  const [showBar, setShowBar] = useState(false)
  const timerRef = useRef(null)
  const location = useLocation()

  const handleStartLoading = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(15)
    setShowBar(true)

    // Progressively increment progress towards 85%
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.floor(Math.random() * 8) + 2
      })
    }, 120)

    timerRef.current = progressInterval
  }

  const handleStopLoading = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(100)
    setTimeout(() => {
      setShowBar(false)
      setProgress(0)
    }, 350)
  }

  useEffect(() => {
    handleStartLoading()
    const timer = setTimeout(() => {
      handleStopLoading()
    }, 450)
    return () => {
      clearTimeout(timer)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [location])

  useEffect(() => {
    const onStart = () => handleStartLoading()
    const onStop = () => handleStopLoading()

    window.addEventListener('lms-loading-start', onStart)
    window.addEventListener('lms-loading-stop', onStop)

    return () => {
      window.removeEventListener('lms-loading-start', onStart)
      window.removeEventListener('lms-loading-stop', onStop)
    }
  }, [])

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('authToken')
  })
  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    const role = localStorage.getItem('userRole')
    const complete = localStorage.getItem('onboardingComplete') === 'true'
    if (role && role !== 'admin') return true
    return complete
  })
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || ''
  })
  const navigate = useNavigate()

  const fetchAndCacheCompany = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/company/get-company`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data && data.company_name) {
          localStorage.setItem('companyName', data.company_name)
          if (data.industry) localStorage.setItem('companyIndustry', data.industry)
          if (data.company_size) localStorage.setItem('companySize', data.company_size)
          if (data.primary_email) localStorage.setItem('companyEmail', data.primary_email)
          if (data.support_phone) localStorage.setItem('companyPhone', data.support_phone)
          if (data.logo_file) localStorage.setItem('companyLogo', data.logo_file)
          
          // Trigger sidebar update
          window.dispatchEvent(new Event('profile-updated'))
        }
      }
    } catch (err) {
      console.error("Error fetching company details:", err)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (isAuthenticated && token && token !== 'mock-jwt-token') {
      fetchAndCacheCompany(token)
    }
  }, [isAuthenticated])

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
    localStorage.setItem('username', user.username)

    // Automatically skip the tour for existing users logging in
    if (user.isNewUser === false) {
      localStorage.setItem(`lms_tour_completed_${user.username}`, 'true')
    }

    const role = localStorage.getItem('userRole') || user.role
    if (role === 'admin') {
      if (user.isNewUser === false) {
        setOnboardingComplete(true)
        localStorage.setItem('onboardingComplete', 'true')
      } else {
        setOnboardingComplete(false)
        localStorage.removeItem('onboardingComplete')
      }
    } else {
      setOnboardingComplete(true)
      localStorage.setItem('onboardingComplete', 'true')
    }

    const token = localStorage.getItem('authToken')
    if (token && token !== 'mock-jwt-token') {
      fetchAndCacheCompany(token)
    }
  }

  const handleOnboardingComplete = async (data, stages) => {
    setOnboardingComplete(true)
    localStorage.setItem('onboardingComplete', 'true')
    
    // Save locally
    if (data) {
      if (data.companyName) localStorage.setItem('companyName', data.companyName)
      if (data.industry) localStorage.setItem('companyIndustry', data.industry)
      if (data.companySize) localStorage.setItem('companySize', data.companySize)
      if (data.primaryEmail) localStorage.setItem('companyEmail', data.primaryEmail)
      if (data.supportPhone) localStorage.setItem('companyPhone', data.supportPhone)
      if (data.logoFile) localStorage.setItem('companyLogo', data.logoFile)
    }

    const token = localStorage.getItem('authToken')
    if (!token || token === 'mock-jwt-token') return;

    // Save company details to backend database
    if (data) {
      try {
        await fetch(`${import.meta.env.VITE_BASE_URL}/company/save-company`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            company_name: data.companyName,
            industry: data.industry,
            company_size: data.companySize,
            primary_email: data.primaryEmail,
            support_phone: data.supportPhone,
            logo_file: data.logoFile
          })
        })
      } catch (err) {
        console.error("Error saving company to backend:", err)
      }
    }

    // Save stages to backend database
    if (stages && stages.length > 0) {
      try {
        for (const stage of stages) {
          await fetch(`${import.meta.env.VITE_BASE_URL}/lead-status/create-lead-status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              status_name: stage.name.toUpperCase().trim(),
              color: stage.color,
              description: `${stage.name} stage set during onboarding`
            })
          })
        }
      } catch (err) {
        console.error("Error saving stages to backend:", err)
      }
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setOnboardingComplete(false)
    setUsername('')
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('onboardingComplete')
    localStorage.removeItem('username')
    localStorage.removeItem('companyName')
    localStorage.removeItem('companyIndustry')
    localStorage.removeItem('companySize')
    localStorage.removeItem('companyEmail')
    localStorage.removeItem('companyPhone')
    localStorage.removeItem('companyLogo')
  }

  const getRedirectPath = () => {
    return '/admin/dashboard'
  }

  return (
    <UserProvider>
      {showBar && (
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${progress}%`, 
            height: '3px',
            backgroundColor: 'rgb(2, 137, 247)',
            zIndex: 999999,
            opacity: progress === 100 ? 0 : 1,
            transition: 'width 0.2s ease, opacity 0.4s ease',
            pointerEvents: 'none'
          }} 
        />
      )}
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

          <Route path="/embed/form/:formId" element={<PublicEmbedForm />} />

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* {isAuthenticated && <ChatBot />} */}

        {isAuthenticated}
      </Suspense>
    </UserProvider>
  )
}

export default App
