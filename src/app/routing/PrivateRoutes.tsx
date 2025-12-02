import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import StatusMaster from '../modules/apps/master/status/StatusMaster'
import ActivityMaster from '../modules/apps/master/activity/ActivityMaster'
import PurposeMaster from '../modules/apps/master/purpose/PurposeMaster'
import SourceOfInquiryMaster from '../modules/apps/master/sourceOFinquiry/SourceOfInquiryMaster'
import WhatsAppTemplatesMaster from '../modules/apps/master/whatsapp/WhatsAppTemplatesMaster'
import RemarksTemplatesMaster from '../modules/apps/master/remarks/RemarksTemplatesMaster'
import AllLeads from '../modules/apps/leads/allleads/AllLeads'
import LeadCallDetails from '../modules/apps/leads/callDetail/LeadCallDetails'
import LeadFollowup from '../modules/apps/leads/followup/LeadFollowup'
import { FreshLeadsPage } from '../modules/apps/leads/fressleads/pages/FreshLeadsPage'
import { ActivityLogsPage } from '../modules/apps/reports/activity/ActivityLogsPage'
import LeadAllocationRoutes from '../modules/apps/leads/allocation/LeadAllocationRoutes'
import NotificationsPage from '../pages/dashboard/components/NotificationsPage'
import ReportsRoutes from '../modules/apps/reports/ReportsRoutes'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const UsersPage = lazy(() => import('../modules/apps/master/user-management/UsersMaster'))
  const CampaignsPage = lazy(() => import('../modules/apps/master/campaings/campaingMaster'))
  const TeamsPage = lazy(() => import('../modules/apps/manage/teams/pages/TeamsPage'))
  
  // Add Telecaller Performance Report
  const TelecallerPerformancePage = lazy(() => 
    import('../modules/apps/reports/performance/pages/TelecallerPerformancePage')
      .then(module => ({ default: module.TelecallerPerformancePage }))
  )

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        
        {/* Management Routes */}
        <Route
          path='manage/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        <Route
          path='manage/teams/*'
          element={
            <SuspensedView>
              <TeamsPage />
            </SuspensedView>
          }
        />
        
        {/* Master Routes */}
        <Route
          path='campaigns/*'
          element={
            <SuspensedView>
              <CampaignsPage />
            </SuspensedView>
          }
        />
        <Route
          path='master/status/*'
          element={
            <SuspensedView>
              <StatusMaster />
            </SuspensedView>
          }
        />
        <Route
          path='master/activity/*'
          element={
            <SuspensedView>
              <ActivityMaster />
            </SuspensedView>
          }
        />
        <Route
          path='master/purpose/*'
          element={
            <SuspensedView>
              <PurposeMaster />
            </SuspensedView>
          }
        />
        <Route
          path='master/sourceOFinquiry/*'
          element={
            <SuspensedView>
              <SourceOfInquiryMaster />
            </SuspensedView>
          }
        />
        <Route
          path='master/whatsapptemplate/*'
          element={
            <SuspensedView>
              <WhatsAppTemplatesMaster />
            </SuspensedView>
          }
        />
        <Route
          path='master/remarkstemplate/*'
          element={
            <SuspensedView>
              <RemarksTemplatesMaster />
            </SuspensedView>
          }
        />
        
        {/* Leads Routes */}
        <Route
          path='leads/allleads/*'
          element={
            <SuspensedView>
              <AllLeads />
            </SuspensedView>
          }
        />
        <Route
          path='leads/freshleads/*'
          element={
            <SuspensedView>
              <FreshLeadsPage />
            </SuspensedView>
          }
        />
        <Route
          path='leads/allocate/*'
          element={
            <SuspensedView>
              <LeadAllocationRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='leads/call-details/*'
          element={
            <SuspensedView>
              <LeadCallDetails />
            </SuspensedView>
          }
        />
        <Route
          path='leads/followup/*'
          element={
            <SuspensedView>
              <LeadFollowup />
            </SuspensedView>
          }
        />

        {/* Reports Routes */}
        <Route
          path='reports/*'
          element={
            <SuspensedView>
              <ReportsRoutes />
            </SuspensedView>
          }
        />
     
        <Route
          path='notifications/*'
          element={
            <SuspensedView>
              <NotificationsPage />
            </SuspensedView>
          }
        />


        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }