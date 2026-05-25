import React, { useState, Suspense } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

// Auth Pages
import AuthPage from './pages/Auth/AuthPage'
import OnboardingPage from './pages/Company/OnboardingPage'


// Dashboard Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import RoleUserManagement from './pages/RoleUserManagement'

// Dashboard Pages - Lazy loaded
// const DashboardMain = React.lazy(() => import('./pages/DashboardMain'))
const AllLeadsPage = React.lazy(() => import('./pages/AllLeadsPage'))
const FormBuilderPage = React.lazy(() => import('./pages/FormBuilderPage'))
const TeamsPage = React.lazy(() => import('./pages/Team/TeamsPage'))
const ViewTeamPage = React.lazy(() => import('./pages/Team/ViewTeamPage'))
const ManageTeamPage = React.lazy(() => import('./pages/Team/ManageTeamPage'))
const CampaignsPage = React.lazy(() => import('./pages/CampaignsPage'))
const AuditLogsPage = React.lazy(() => import('./pages/AuditLogs'))
const LmsSettingsPage = React.lazy(() => import('./pages/LmsSettings'))

// Loading Fallback
const LoadingSpinner = () => (
  <div className="grid place-items-center w-full min-h-screen bg-background">
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-.5s]"></div>
    </div>
  </div>
)

// Dashboard Layout Wrapper
function DashboardLayout({ username, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  // Escape key to go back
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        navigate(-1)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <div className="bg-background h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar username={username} onLogout={onLogout} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="roles" element={<RoleUserManagement />} />

              {/* Leads */}
              <Route path="leads" element={<AllLeadsPage />} />

              {/* Forms */}
              <Route path="form-builder" element={<FormBuilderPage />} />

              {/* Teams */}
              <Route path="teams" element={<TeamsPage />} />
              <Route path="teams/:id" element={<ViewTeamPage />} />
              <Route path="teams/:id/manage" element={<ManageTeamPage />} />

              {/* Departments */}
              <Route path="departments" element={<CampaignsPage />} />
              <Route path="departments/:id" element={<ViewTeamPage />} />
              <Route path="departments/:id/manage" element={<ManageTeamPage />} />

              {/* Audit Logs */}
              <Route path="audit-logs" element={<AuditLogsPage />} />

              {/* LMS Settings */}
              <Route path="settings" element={<LmsSettingsPage />} />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function App() {
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
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Auth Route */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <AuthPage onAuthSuccess={handleAuthSuccess} />
            ) : onboardingComplete ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <OnboardingPage username={username} onLogout={handleLogout} onComplete={handleOnboardingComplete} />
            )
          }
        />

        {/* Onboarding Route */}
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

        {/* Dashboard Routes */}
        <Route
          path="/*"
          element={
            isAuthenticated && onboardingComplete ? (
              <DashboardLayout username={username} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  )
}

export default App
