import React, { useState, useEffect } from 'react'
import { Team, TeamMember, User } from '../core/_models'
import { AddMemberModal } from '../components/AddMemberModal'
import { TeamMembersTable } from '../components/TeamMembersTable'
import { teamRequests } from '../core/_requests'

interface TeamDetailsPageProps {
  teamId: number
  onBack?: () => void
}

export const TeamDetailsPage: React.FC<TeamDetailsPageProps> = ({
  teamId,
  onBack
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Fetch team details
  const fetchTeamDetails = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await teamRequests.getTeamMembers(teamId)

      if (response && response.status === 'success') {
        const teamData = response.team
        const agents = response.agents || []
        const members = teamData?.members || []

        if (teamData) {
          const formattedTeam: Team = {
            ...teamData,
            createdon: formatDate(teamData.created_at),
            updatedon: formatDate(teamData.updated_at),
            totalmembers: members.length
          }

          setSelectedTeam(formattedTeam)

          // Transform members data
          const transformedMembers: TeamMember[] = members.map((member: any) => ({
            tmbmid: member.tmbmid,
            teamid: teamId,
            usermid: member.usermid,
            created_at: member.created_at,
            updated_at: member.updated_at,
            user: member.user
          }))

          setTeamMembers(transformedMembers)

          // Filter available users (agents not in team)
          const existingMemberIds = transformedMembers.map(member => member.usermid)
          const availableUsers = agents.filter(agent =>
            !existingMemberIds.includes(agent.usermid) &&
            agent.userstatus === 'Active'
          )
          setAvailableUsers(availableUsers)
          return
        }
      } else {
        setError(`Failed to load team details. Status: ${response?.status}`)
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error fetching team details'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle adding a team member - FIXED: Use array as expected by the function
  const handleAddMember = async (usermid: number) => {
    setLoading(true)
    try {
      const result = await teamRequests.addTeamMembers(teamId, usermid) // Pass as array

      // FIXED: Check result.result instead of result.status
      if (result.status) {
        await fetchTeamDetails()
        setAddMemberModalOpen(false)
      } else {
        setError(result.message || 'Failed to add team member')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error adding team member'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle removing a team member - FIXED: Check result.result
  const handleRemoveMember = async (usermid: number) => {
    setLoading(true)
    try {
      const result = await teamRequests.removeTeamMember(teamId, usermid)

      // FIXED: Check result.result instead of result.status
      if (result.status) {
        await fetchTeamDetails()
      } else {
        setError(result.message || 'Failed to remove team member')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error removing team member'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Load data when component mounts
  useEffect(() => {
    if (teamId) {
      fetchTeamDetails()
    }
  }, [teamId])

  const handleBackClick = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  const clearError = () => setError('')

  if (loading && !selectedTeam) {
    return (
      <div className="container-fluid p-6">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading team details...</span>
        </div>
      </div>
    )
  }

  if (error && !selectedTeam) {
    return (
      <div className="container-fluid p-6">
        <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
          <div>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button type="button" className="btn-close" onClick={clearError}></button>
        </div>
        <button
          className="btn btn-outline-secondary mt-3"
          onClick={handleBackClick}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Teams
        </button>
      </div>
    )
  }

  if (!selectedTeam) {
    return (
      <div className="container-fluid p-6">
        <div className="alert alert-warning">Team not found</div>
        <button
          className="btn btn-outline-secondary mt-3"
          onClick={handleBackClick}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Teams
        </button>
      </div>
    )
  }

  return (
    <div className="container-fluid p-6">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between mb-4" role="alert">
          <div>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button type="button" className="btn-close" onClick={clearError}></button>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 text-gray-800">Team Details</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={handleBackClick}
          disabled={loading}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Teams
        </button>
      </div>

      {/* Team Details Card */}
      <div className="card shadow mb-4">
        <div className="card-header bg-light py-3">
          <h5 className="mb-0 text-gray-800">Team Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="fw-semibold text-muted" style={{ width: '140px' }}>Team Name</td>
                    <td className="fw-bold text-dark">{selectedTeam.teamname}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Created On</td>
                    <td>{selectedTeam.createdon || formatDate(selectedTeam.created_at)}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Total Members</td>
                    <td className="fw-bold">{teamMembers.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="fw-semibold text-muted" style={{ width: '140px' }}>Team Leader</td>
                    <td className="fw-bold text-dark">{selectedTeam.leader?.username || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Updated On</td>
                    <td>{selectedTeam.updatedon || formatDate(selectedTeam.updated_at)}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Team ID</td>
                    <td className="fw-bold text-muted">#{selectedTeam.tmid}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Member Section */}
      <div className="card shadow mb-4">
        <div className="card-header bg-light py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-gray-800">Add Team Member</h5>
          </div>
        </div>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8 mb-3">
              <label className="form-label fw-semibold">Select Agent *</label>
              <select className="form-select" disabled>
                <option>
                  {availableUsers.length === 0
                    ? 'No available agents'
                    : `Select from ${availableUsers.length} available agents`
                  }
                </option>
              </select>
              <div className="form-text">
                {availableUsers.length === 0
                  ? 'All agents are already part of this team or no active agents available.'
                  : `Click "Add Agent" to select from available agents.`
                }
              </div>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100"
                onClick={() => setAddMemberModalOpen(true)}
                disabled={loading || availableUsers.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus me-2"></i>
                    Add Agent
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="card shadow">
        <div className="card-header bg-light py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-gray-800">Team Members</h5>
            <span className="badge bg-secondary">
              {teamMembers.length} agent{teamMembers.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="card-body p-0">
          <TeamMembersTable
            members={teamMembers}
            onRemoveMember={handleRemoveMember}
            loading={loading}
            teamLeaderId={selectedTeam?.leadermid}
          />
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        onAddMember={handleAddMember}
        users={availableUsers}
        loading={loading}
      />
    </div>
  )
}