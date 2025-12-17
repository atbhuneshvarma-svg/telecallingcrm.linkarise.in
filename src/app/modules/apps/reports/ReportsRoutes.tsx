// src/app/modules/apps/reports/ReportsRoutes.tsx
import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { WithChildren } from '../../../../_metronic/helpers'
import TopBarProgress from 'react-topbar-progress-indicator'
import { getCSSVariableValue } from '../../../../_metronic/assets/ts/_utils'

const TelecallerPerformancePage = lazy(() =>
    import('./performance/pages/TelecallerPerformancePage').then(module => ({
        default: module.TelecallerPerformancePage,
    }))
)

const ActivityLogsPage = lazy(() =>
    import('./activity/ActivityLogsPage').then(module => ({
        default: module.ActivityLogsPage,
    }))
)

const StageWiseLeadPage = lazy(() =>
    import('./Stagewise/index').then(module => ({
        default: module.StageWiseLeadPage,
    }))
)
// src/app/modules/apps/reports/ReportsRoutes.tsx
const AllleadReportpage = lazy(() => 
  import('./allreadreport/LeadReportPage').then(module => ({
    default: module.default
  }))
);
const LeadSummaryPage = lazy(() => 
  import('./leadsummary/index').then(module => ({
    default: module.LeadSummaryPage
  }))
);

const StatusWiseLeadsPage = lazy(() => import('./statuswise/pages/StatusWiseLeadsPage'))


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

const ReportsRoutes: FC = () => {
    return (
        <Routes>
            {/* Note: These routes are relative to "/reports" */}
            <Route index element={<Navigate to='performance' replace />} />

            <Route
                path='performance'  // This becomes "/reports/performance"
                element={
                    <SuspensedView>
                        <TelecallerPerformancePage />
                    </SuspensedView>
                }
            />

            <Route
                path='activity'  // This becomes "/reports/activity"
                element={
                    <SuspensedView>
                        <ActivityLogsPage />
                    </SuspensedView>
                }
            />

            <Route
                path='stagewise'  // This becomes "/reports/stagewise"
                element={
                    <SuspensedView>
                        <StageWiseLeadPage />
                    </SuspensedView>
                }
            />

            <Route
                path="statuswise"
                element={
                    <SuspensedView>
                        <StatusWiseLeadsPage />
                    </SuspensedView>
                }
            />
            <Route
                path="allleadreport"
                element={
                    <SuspensedView>
                        <AllleadReportpage />
                    </SuspensedView>
                }
            />
            <Route
                path="leadsummary"
                element={
                    <SuspensedView>
                        <LeadSummaryPage />
                    </SuspensedView>
                }
            />

            <Route path='*' element={<Navigate to='activity' replace />} />
        </Routes>
    )
}

export default ReportsRoutes