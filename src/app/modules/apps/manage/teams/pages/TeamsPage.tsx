import React from 'react'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import { TeamTable } from '../components/TeamTable'
import { TeamDetailsPage } from './TeamDetailsPage'

const TeamsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TeamTable />} />
      <Route path=":teamId" element={<TeamDetailsWrapper />} />
    </Routes>
  )
}

// Wrapper component to handle the team details with navigation
const TeamDetailsWrapper: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()

  if (!teamId) {
    return <div>Team ID not found</div>
  }

  const handleBack = () => {
    navigate('/manage/teams')
  }

  return (
    <TeamDetailsPage 
      teamId={parseInt(teamId)} 
      onBack={handleBack}
    />
  )
}

export default TeamsPage