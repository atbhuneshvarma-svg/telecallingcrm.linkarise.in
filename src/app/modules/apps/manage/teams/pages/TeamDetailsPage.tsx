import React, { useState, useEffect } from 'react'
import { Team, TeamMember, User } from '../core/_models'
import { AddMemberModal } from '../components/AddMemberModal'
import { TeamMembersTable } from '../components/TeamMembersTable'

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

  // Debug: Log the teamId to see what's being passed
  console.log('TeamDetailsPage - teamId:', teamId, 'Type:', typeof teamId)

  // Mock data for teams - UPDATED to include team ID 8
  const mockTeams: Team[] = [
    {
      tmid: 1,
      teamname: 'MakeYourWish',
      leadermid: 1,
      cmpmid: 1,
      created_at: '2025-11-18T00:00:00Z',
      updated_at: '2025-11-18T00:00:00Z',
      leader: {
        usermid: 1,
        leadermid: 0,
        username: 'bhunesh varma',
        usermobile: '9876543210',
        userloginid: 'bhunesh',
        userstatus: 'Active',
        usertype: 'Team Leader',
        userrole: 'teamleader',
        userlastlogintime: '2025-11-18T10:30:00Z',
        usernooflogin: 15,
        userregip: '192.168.1.1',
        designation: 'Team Leader',
        detail: 'Team lead for MakeYourWish',
        useremail: 'bhunesh@example.com',
        updated_at: '2025-11-18T00:00:00Z',
        created_at: '2025-11-18T00:00:00Z',
        cmpmid: 1
      }
    },
    {
      tmid: 2,
      teamname: 'Sales Warriors',
      leadermid: 2,
      cmpmid: 1,
      created_at: '2025-11-17T00:00:00Z',
      updated_at: '2025-11-18T12:00:00Z',
      leader: {
        usermid: 2,
        leadermid: 0,
        username: 'John Manager',
        usermobile: '9876543211',
        userloginid: 'john',
        userstatus: 'Active',
        usertype: 'Team Leader',
        userrole: 'teamleader',
        userlastlogintime: '2025-11-18T09:15:00Z',
        usernooflogin: 22,
        userregip: '192.168.1.2',
        designation: 'Sales Manager',
        detail: 'Sales team leader',
        useremail: 'john@example.com',
        updated_at: '2025-11-18T00:00:00Z',
        created_at: '2025-11-17T00:00:00Z',
        cmpmid: 1
      }
    },
    {
      tmid: 8, // ADDED: Team with ID 8
      teamname: 'Telecalling Team',
      leadermid: 3,
      cmpmid: 1,
      created_at: '2025-11-16T00:00:00Z',
      updated_at: '2025-11-18T14:30:00Z',
      leader: {
        usermid: 3,
        leadermid: 0,
        username: 'Sarah Wilson',
        usermobile: '9876543215',
        userloginid: 'sarah',
        userstatus: 'Active',
        usertype: 'Team Leader',
        userrole: 'teamleader',
        userlastlogintime: '2025-11-18T11:20:00Z',
        usernooflogin: 18,
        userregip: '192.168.1.6',
        designation: 'Telecalling Manager',
        detail: 'Telecalling team lead',
        useremail: 'sarah@example.com',
        updated_at: '2025-11-18T00:00:00Z',
        created_at: '2025-11-16T00:00:00Z',
        cmpmid: 1
      }
    }
  ]

  // Mock data for available users (sales executives)
  const mockAvailableUsers: User[] = [
    {
      usermid: 4,
      leadermid: 8, // Updated to be under team 8
      username: 'Alice Johnson',
      usermobile: '9876543212',
      userloginid: 'alice',
      userstatus: 'Active',
      usertype: 'Sales Executive',
      userrole: 'telecaller',
      userlastlogintime: '2025-11-18T08:45:00Z',
      usernooflogin: 8,
      userregip: '192.168.1.3',
      designation: 'Sales Executive',
      detail: 'Top performing sales executive',
      useremail: 'alice@example.com',
      updated_at: '2025-11-18T00:00:00Z',
      created_at: '2025-11-15T00:00:00Z',
      cmpmid: 1
    },
    {
      usermid: 5,
      leadermid: 8, // Updated to be under team 8
      username: 'Bob Smith',
      usermobile: '9876543213',
      userloginid: 'bob',
      userstatus: 'Active',
      usertype: 'Sales Executive',
      userrole: 'telecaller',
      userlastlogintime: '2025-11-18T09:30:00Z',
      usernooflogin: 12,
      userregip: '192.168.1.4',
      designation: 'Senior Sales Executive',
      detail: 'Experienced sales professional',
      useremail: 'bob@example.com',
      updated_at: '2025-11-18T00:00:00Z',
      created_at: '2025-11-10T00:00:00Z',
      cmpmid: 1
    },
    {
      usermid: 6,
      leadermid: 8, // Updated to be under team 8
      username: 'Carol Davis',
      usermobile: '9876543214',
      userloginid: 'carol',
      userstatus: 'Active',
      usertype: 'Sales Executive',
      userrole: 'telecaller',
      userlastlogintime: '2025-11-18T10:15:00Z',
      usernooflogin: 5,
      userregip: '192.168.1.5',
      designation: 'Sales Executive',
      detail: 'New team member',
      useremail: 'carol@example.com',
      updated_at: '2025-11-18T00:00:00Z',
      created_at: '2025-11-12T00:00:00Z',
      cmpmid: 1
    }
  ]

  // Mock data for existing team members - UPDATED for team 8
  const mockTeamMembers: TeamMember[] = [
    {
      tmid: 8, // Updated to team 8
      usermid: 4,
      username: 'Alice Johnson',
      userrole: 'Sales Executive',
      operation: 'Remove'
    },
    {
      tmid: 8, // Updated to team 8
      usermid: 5,
      username: 'Bob Smith',
      userrole: 'Senior Sales Executive',
      operation: 'Remove'
    }
  ]

  // Format date to match your design
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Calculate total members
  const totalMembers = teamMembers.length

  // Fetch team details - using mock data
  const fetchTeamDetails = async () => {
    setLoading(true)
    setError('')
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Looking for team with ID:', teamId)
      console.log('Available teams:', mockTeams.map(t => ({ id: t.tmid, name: t.teamname })))
      
      const team = mockTeams.find(t => t.tmid === teamId)
      console.log('Found team:', team)
      
      if (team) {
        const teamData: Team = {
          ...team,
          createdon: formatDate(team.created_at),
          updatedon: formatDate(team.updated_at),
          totalmembers: totalMembers
        }
        setSelectedTeam(teamData)
      } else {
        setError(`Team not found. Looking for ID: ${teamId}, Available IDs: ${mockTeams.map(t => t.tmid).join(', ')}`)
      }
    } catch (err) {
      setError('Error fetching team details')
      console.error('Error fetching team:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch available users - using mock data
  const fetchAvailableUsers = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setAvailableUsers(mockAvailableUsers)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  // Fetch team members - using mock data
  const fetchTeamMembers = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      const members = mockTeamMembers.filter(member => member.tmid === teamId)
      setTeamMembers(members)
    } catch (err) {
      console.error('Error fetching team members:', err)
    }
  }

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails()
      fetchAvailableUsers()
      fetchTeamMembers()
    }
  }, [teamId])

  const handleAddMember = async (usermid: number) => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const selectedUser = availableUsers.find(user => user.usermid === usermid)
      if (selectedUser) {
        const newMember: TeamMember = {
          tmid: teamId,
          usermid: selectedUser.usermid,
          username: selectedUser.username,
          userrole: selectedUser.userrole,
          operation: 'Remove'
        }
        
        // Add to team members
        setTeamMembers(prev => [...prev, newMember])
        
        // Remove from available users
        setAvailableUsers(prev => prev.filter(user => user.usermid !== usermid))
        
        // Refresh team details to update dates
        if (selectedTeam) {
          setSelectedTeam({
            ...selectedTeam,
            updatedon: formatDate(new Date().toISOString()),
            totalmembers: totalMembers + 1
          })
        }
      }
      setAddMemberModalOpen(false)
    } catch (error) {
      console.error('Error adding team member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (usermid: number) => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const removedMember = teamMembers.find(member => member.usermid === usermid)
      
      // Remove from team members
      setTeamMembers(prev => prev.filter(member => member.usermid !== usermid))
      
      // Add back to available users if the user exists
      if (removedMember) {
        const userToAddBack = mockAvailableUsers.find(user => user.usermid === usermid)
        if (userToAddBack) {
          setAvailableUsers(prev => [...prev, userToAddBack])
        }
      }
      
      // Refresh team details to update dates
      if (selectedTeam) {
        setSelectedTeam({
          ...selectedTeam,
          updatedon: formatDate(new Date().toISOString()),
          totalmembers: Math.max(0, totalMembers - 1)
        })
      }
    } catch (error) {
      console.error('Error removing team member:', error)
    } finally {
      setLoading(false)
    }
  }

  // Updated back button handler
  const handleBackClick = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  if (loading && !selectedTeam) {
    return (
      <div className="container-fluid p-6">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-fluid p-6">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    )
  }

  if (!selectedTeam) {
    return (
      <div className="container-fluid p-6">
        <div className="alert alert-warning">Team not found</div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-6">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 text-gray-800">Team Details</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={handleBackClick}
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
                    <td className="fw-bold">{totalMembers}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="fw-semibold text-muted" style={{ width: '140px' }}>Team Leader</td>
                    <td className="fw-bold text-dark">{selectedTeam.leader.username}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Updated On</td>
                    <td>{selectedTeam.updatedon || formatDate(selectedTeam.updated_at)}</td>
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
          <h5 className="mb-0 text-gray-800">Add Team Member</h5>
        </div>
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-8">
              <label className="form-label fw-semibold">Select Sales Executive *</label>
              <select className="form-select" disabled>
                <option>Select Sales Executive</option>
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100"
                onClick={() => setAddMemberModalOpen(true)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus me-2"></i>
                    Add
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
          <h5 className="mb-0 text-gray-800">Team Members</h5>
        </div>
        <div className="card-body p-0">
          <TeamMembersTable
            members={teamMembers}
            onRemoveMember={handleRemoveMember}
            loading={loading}
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