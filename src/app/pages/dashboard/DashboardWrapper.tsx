import React from 'react'
import { useIntl } from 'react-intl'
import { DashboardPage } from './DashboardPage'
import SlugBreadcrumb from './components/SlugBreadcrumb'

const DashboardWrapper: React.FC = () => {
  const intl = useIntl()
  
  return (
    <>
      {/* Use SlugBreadcrumb separately from PageTitle */}
      <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
        <SlugBreadcrumb className="mb-1" />
      </div>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }