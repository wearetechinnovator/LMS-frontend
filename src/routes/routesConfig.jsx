import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { ProtectRoute } from '../components/ProtectRoute'
import RoleDashboardLayout from '../layouts/RoleDashboardLayout'

import AdminDashboard from '../pages/Admin/Dashboard'
import CounselorDashboard from '../pages/Counselor/Dashboard'
import VendorDashboard from '../pages/Vendor/Dashboard'
import AdminRoleUserManagement from '../pages/Admin/RoleUserManagement'

const AdminAllLeadsPage = React.lazy(() => import('../pages/Admin/AllLeadsPage'))
const CounselorAllLeadsPage = React.lazy(() => import('../pages/Counselor/AllLeadsPage'))
const VendorAllLeadsPage = React.lazy(() => import('../pages/Vendor/AllLeadsPage'))
const AdminLeadDetailsPage = React.lazy(() => import('../pages/Admin/LeadDetailsPage'))

const AdminFormBuilderPage = React.lazy(() => import('../pages/Admin/FormBuilderPage'))
const TeamsPage = React.lazy(() => import('../pages/Team/TeamsPage'))
const ViewTeamPage = React.lazy(() => import('../pages/Team/ViewTeamPage'))
const ManageTeamPage = React.lazy(() => import('../pages/Team/ManageTeamPage'))

const AdminCampaignsPage = React.lazy(() => import('../pages/Admin/CampaignsPage'))
const VendorCampaignsPage = React.lazy(() => import('../pages/Vendor/CampaignsPage'))

const AdminAuditLogsPage = React.lazy(() => import('../pages/Admin/AuditLogs'))

const AdminLmsSettingsPage = React.lazy(() => import('../pages/Admin/LmsSettings'))
const CounselorLmsSettingsPage = React.lazy(() => import('../pages/Counselor/LmsSettings'))
const VendorLmsSettingsPage = React.lazy(() => import('../pages/Vendor/LmsSettings'))

const AdminFormEmbed = React.lazy(() => import('../pages/Admin/FormEmbed'))

const AdminAnalyticsPage = React.lazy(() => import('../pages/Admin/Analytics'))
const CounselorAnalyticsPage = React.lazy(() => import('../pages/Counselor/Analytics'))

export const adminNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
  { id: 'form-builder', label: 'Form Builder', icon: 'build', path: '/admin/form-builder' },
  { id: 'leads', label: 'All Leads', icon: 'people', path: '/admin/leads' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics', path: '/admin/analytics' },
  { id: 'campaigns', label: 'Campaigns', icon: 'campaign', path: '/admin/departments' },
  { id: 'teams', label: 'Teams', icon: 'group', path: '/admin/teams' },
  { id: 'audit-logs', label: 'Audit Logs', icon: 'receipt_long', path: '/admin/audit-logs' },
  { id: 'roles', label: 'Role Management', icon: 'perm_identity', path: '/admin/roles' },
  { id: 'form-embed', label: 'Form Embed', icon: 'integration_instructions', path: '/admin/form-embed' },
]

export const counselorNavItems = [
  { id: 'overview', label: 'Overview', icon: 'dashboard', path: '/counselor/overview' },
  { id: 'leads', label: 'All Leads', icon: 'people', path: '/counselor/leads' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics', path: '/counselor/analytics' },
  // { id: 'roles', label: 'Role Management', icon: 'perm_identity', path: '/counselor/roles' },

]

export const vendorNavItems = [
  { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard', path: '/vendor/dashboard' },
  { id: 'campaigns', label: 'Campaigns', icon: 'campaign', path: '/vendor/campaigns' },
  { id: 'leads', label: 'All Leads', icon: 'people', path: '/vendor/leads' },
]

export const RoleRoutes = ({ username, handleLogout }) => {
  return (
    <>
      <Route
        path="/admin/*"
        element={
          <ProtectRoute allowedRoles={['admin']}>
            <RoleDashboardLayout
              username={username}
              onLogout={handleLogout}
              navigationItems={adminNavItems}
              roleName="Admin Account"
            />
          </ProtectRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="roles" element={<AdminRoleUserManagement />} />
        <Route path="leads" element={<AdminAllLeadsPage />} />
        <Route path="leads/:id" element={<AdminLeadDetailsPage />} />
        <Route path="form-builder" element={<AdminFormBuilderPage />} />
        <Route path="form-embed" element={<AdminFormEmbed />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="teams/:id" element={<ViewTeamPage />} />
        <Route path="teams/:id/manage" element={<ManageTeamPage />} />
        <Route path="departments" element={<AdminCampaignsPage />} />
        <Route path="departments/:id" element={<ViewTeamPage />} />
        <Route path="departments/:id/manage" element={<ManageTeamPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminLmsSettingsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/counselor/*"
        element={
          <ProtectRoute allowedRoles={['counselor']}>
            <RoleDashboardLayout
              username={username}
              onLogout={handleLogout}
              navigationItems={counselorNavItems}
              roleName="Counselor Account"
            />
          </ProtectRoute>
        }
      >
        <Route path="overview" element={<CounselorDashboard />} />
        <Route path="leads" element={<CounselorAllLeadsPage />} />
        <Route path="analytics" element={<CounselorAnalyticsPage />} />
        <Route path="settings" element={<CounselorLmsSettingsPage />} />
        {/* <Route path="roles" element={<AdminRoleUserManagement />} /> */}

        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>

      <Route
        path="/vendor/*"
        element={
          <ProtectRoute allowedRoles={['vendor']}>
            <RoleDashboardLayout
              username={username}
              onLogout={handleLogout}
              navigationItems={vendorNavItems}
              roleName="Vendor Account"
            />
          </ProtectRoute>
        }
      >
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="campaigns" element={<VendorCampaignsPage />} />
        <Route path="leads" element={<VendorAllLeadsPage />} />
        <Route path="settings" element={<VendorLmsSettingsPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </>
  )
}
