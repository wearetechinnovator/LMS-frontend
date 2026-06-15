import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { ProtectRoute, PermissionGate, hasPermission } from '../components/ProtectRoute'
import RoleDashboardLayout from '../layouts/RoleDashboardLayout'

import AdminDashboard from '../pages/Admin/dashboard/Dashboard'
import AdminRoleUserManagement from '../pages/Admin/RoleManage/RoleUserManagement'

const AdminAllLeadsPage = React.lazy(() => import('../pages/Admin/Leads/AllLeadsPage'))
const AdminLeadDetailsPage = React.lazy(() => import('../pages/Admin/Leads/LeadDetailsPage'))

const AdminFormBuilderPage = React.lazy(() => import('../pages/Admin/form/FormBuilderPage'))
const TeamsPage = React.lazy(() => import('../pages/Admin/teams/Teams'))
const ViewTeamPage = React.lazy(() => import('../pages/Admin/teams/ViewTeam'))
const ManageTeamPage = React.lazy(() => import('../pages/Admin/teams/ManageTeam'))

const AdminCampaignsPage = React.lazy(() => import('../pages/Admin/campaign/CampaignsPage'))

const AdminAuditLogsPage = React.lazy(() => import('../pages/Admin/audit/AuditLogs'))

const AdminLmsSettingsPage = React.lazy(() => import('../pages/Admin/settings/LmsSettings'))

const AdminFormEmbed = React.lazy(() => import('../pages/Admin/form/FormEmbed'))

const AdminAnalyticsPage = React.lazy(() => import('../pages/Admin/analysis/Analysis'))

const adminNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
  { id: 'form-builder', label: 'Form Builder', icon: 'build', path: '/admin/form-builder' },
  { id: 'leads', label: 'All Leads', icon: 'people', path: '/admin/leads' },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'analytics',
    path: '/admin/analytics',
    subItems: [
      { id: 'stage', label: 'Lead Stage wise', path: '/admin/analytics/stage' },
      { id: 'registration', label: 'Lead Registration wise', path: '/admin/analytics/registration' },
      { id: 'demographics', label: 'Demographics wise', path: '/admin/analytics/demographics' },
      { id: 'source', label: 'Source Channel Report', path: '/admin/analytics/source' },
      { id: 'vendor_counselor', label: 'Vendors & Counselors', path: '/admin/analytics/vendor-counselor' }
    ]
  },
  { id: 'campaigns', label: 'Campaigns', icon: 'campaign', path: '/admin/departments' },
  { id: 'teams', label: 'Teams', icon: 'group', path: '/admin/teams' },
  { id: 'audit-logs', label: 'Audit Logs', icon: 'receipt_long', path: '/admin/audit-logs' },
  { id: 'roles', label: 'Roles', icon: 'perm_identity', path: '/admin/roles' },
  { id: 'form-embed', label: 'Form Embed', icon: 'integration_instructions', path: '/admin/form-embed' },
]

export const RoleRoutes = ({ username, handleLogout }) => {
  const role = localStorage.getItem('userRole')
  
  const filteredNavItems = adminNavItems.filter(item => {
    if (item.id === 'dashboard' || item.id === 'analytics') {
      return hasPermission('dashboard')
    }
    if (item.id === 'form-builder' || item.id === 'form-embed') {
      return hasPermission('forms_view')
    }
    if (item.id === 'leads') {
      return hasPermission('leads_view')
    }
    if (item.id === 'campaigns') {
      return hasPermission('leads_view') || hasPermission('dashboard')
    }
    if (item.id === 'teams' || item.id === 'roles') {
      return hasPermission('settings')
    }
    if (item.id === 'audit-logs') {
      return hasPermission('auditLogs')
    }
    return true
  })

  const displayRoleName = role ? `${role} Account` : 'User Account'

  return (
    <>
      <Route
        path="/admin/*"
        element={
          <ProtectRoute>
            <RoleDashboardLayout
              username={username}
              onLogout={handleLogout}
              navigationItems={filteredNavItems}
              roleName={displayRoleName}
            />
          </ProtectRoute>
        }
      >
        <Route path="dashboard" element={
          <PermissionGate permission="dashboard" fallback={<Navigate to="/admin/leads" replace />}>
            <AdminDashboard />
          </PermissionGate>
        } />
        <Route path="roles" element={
          <PermissionGate permission="settings">
            <AdminRoleUserManagement />
          </PermissionGate>
        } />
        <Route path="leads" element={
          <PermissionGate permission="leads_view" fallback={<Navigate to="/unauthorized" replace />}>
            <AdminAllLeadsPage />
          </PermissionGate>
        } />
        <Route path="leads/:id" element={
          <PermissionGate permission="leads_view">
            <AdminLeadDetailsPage />
          </PermissionGate>
        } />
        <Route path="form-builder" element={
          <PermissionGate permission="forms_view">
            <AdminFormBuilderPage />
          </PermissionGate>
        } />
        <Route path="form-embed" element={
          <PermissionGate permission="forms_view">
            <AdminFormEmbed />
          </PermissionGate>
        } />
        <Route path="teams" element={
          <PermissionGate permission="settings">
            <TeamsPage />
          </PermissionGate>
        } />
        <Route path="teams/:id" element={
          <PermissionGate permission="settings">
            <ViewTeamPage />
          </PermissionGate>
        } />
        <Route path="teams/:id/manage" element={
          <PermissionGate permission="settings">
            <ManageTeamPage />
          </PermissionGate>
        } />
        <Route path="departments" element={
          <PermissionGate permission="leads_view">
            <AdminCampaignsPage />
          </PermissionGate>
        } />
        <Route path="departments/:id" element={
          <PermissionGate permission="leads_view">
            <ViewTeamPage />
          </PermissionGate>
        } />
        <Route path="departments/:id/manage" element={
          <PermissionGate permission="leads_view">
            <ManageTeamPage />
          </PermissionGate>
        } />
        <Route path="audit-logs" element={
          <PermissionGate permission="auditLogs">
            <AdminAuditLogsPage />
          </PermissionGate>
        } />
        <Route path="settings" element={
          <PermissionGate permission="settings">
            <AdminLmsSettingsPage />
          </PermissionGate>
        } />
        <Route path="analytics">
          <Route index element={<Navigate to="stage" replace />} />
          <Route path="stage" element={
            <PermissionGate permission="dashboard">
              <AdminAnalyticsPage activeTabProp="stage" />
            </PermissionGate>
          } />
          <Route path="registration" element={
            <PermissionGate permission="dashboard">
              <AdminAnalyticsPage activeTabProp="registration" />
            </PermissionGate>
          } />
          <Route path="demographics" element={
            <PermissionGate permission="dashboard">
              <AdminAnalyticsPage activeTabProp="demographics" />
            </PermissionGate>
          } />
          <Route path="source" element={
            <PermissionGate permission="dashboard">
              <AdminAnalyticsPage activeTabProp="source" />
            </PermissionGate>
          } />
          <Route path="vendor-counselor" element={
            <PermissionGate permission="dashboard">
              <AdminAnalyticsPage activeTabProp="vendor_counselor" />
            </PermissionGate>
          } />
        </Route>
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </>
  )
}
