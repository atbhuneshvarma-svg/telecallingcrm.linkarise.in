import React from 'react'
import { useIntl } from 'react-intl'
import { DashboardPage } from './DashboardPage'

const DashboardWrapper: React.FC = () => {
  const intl = useIntl()
  return <DashboardPage />
}

export { DashboardWrapper }