import React from 'react'
import DashboardMain from '../pages/Dashboard/DashboardMain'
import AllLeadsPage from '../pages/Leads/AllLeadsPage'
import FormBuilderPage from '../pages/Forms/FormBuilderPage'
import TeamsPage from '../pages/Team/TeamsPage'
import ViewTeamPage from '../pages/Team/ViewTeamPage'
import ManageTeamPage from '../pages/Team/ManageTeamPage'
import CampaignsPage from '../pages/Department/CampaignsPage'

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: <DashboardMain />,
    label: 'Dashboard'
  },
  {
    path: 'leads',
    element: <AllLeadsPage />,
    label: 'All Leads'
  },
  {
    path: 'form-builder',
    element: <FormBuilderPage />,
    label: 'Form Builder'
  },
  {
    path: 'teams',
    element: <TeamsPage />,
    label: 'Teams'
  },
  {
    path: 'teams/:id',
    element: <ViewTeamPage />,
    label: 'View Team'
  },
  {
    path: 'teams/:id/manage',
    element: <ManageTeamPage />,
    label: 'Manage Team'
  },
  {
    path: 'departments',
    element: <CampaignsPage />,
    label: 'Departments'
  },
  {
    path: 'departments/:id',
    element: <ViewTeamPage />,
    label: 'View Department'
  },
  {
    path: 'departments/:id/manage',
    element: <ManageTeamPage />,
    label: 'Manage Department'
  }
]

export const authRoutes = [
  {
    path: '/',
    label: 'Auth'
  },
  {
    path: '/onboarding',
    label: 'Onboarding'
  }
]
