import React from 'react'
import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom'
import { TeamTable } from '../components/TeamTable'
import { TeamDetailsPage } from './TeamDetailsPage'

const TeamsPage: React.FC = () => {
  return (
    <div className="teams-page">
      <Routes>
        <Route index element={<TeamTable />} />
        <Route path=":teamId" element={<TeamDetailsWrapper />} />
        {/* Optional: Add a catch-all route for better UX */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </div>
  )
}

// Enhanced wrapper with better error handling and navigation
const TeamDetailsWrapper: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Enhanced validation
  if (!teamId) {
    return (
      <div className="error-message">
        <h2>Team Not Found</h2>
        <p>Team ID is missing from the URL.</p>
        <button onClick={() => navigate('/manage/teams')}>
          Back to Teams
        </button>
      </div>
    )
  }

  const parsedTeamId = parseInt(teamId)
  
  if (isNaN(parsedTeamId)) {
    return (
      <div className="error-message">
        <h2>Invalid Team ID</h2>
        <p>The team ID "{teamId}" is not valid.</p>
        <button onClick={() => navigate('/manage/teams')}>
          Back to Teams
        </button>
      </div>
    )
  }

  const handleBack = () => {
    // Optional: Go back to previous page or fallback to teams list
    navigate(-1)
  }

  // Enhanced back handler with fallback
  const handleBackWithFallback = () => {
    // If we came directly to this page (no history), go to teams list
    if (location.key === 'default') {
      navigate('/manage/teams')
    } else {
      navigate(-1)
    }
  }

  return (
    <TeamDetailsPage 
      teamId={parsedTeamId} 
      onBack={handleBackWithFallback}
    />
  )
}

export default TeamsPage