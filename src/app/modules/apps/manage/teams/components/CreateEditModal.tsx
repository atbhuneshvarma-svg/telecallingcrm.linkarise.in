// src/app/modules/apps/manage/teams/components/CreateEditModal.tsx
import React, { useState, useEffect } from 'react'
import { Team, User } from '../core/_models'
import { teamRequests } from '../core/_requests'
import { useTeamManagement } from '../hooks/useTeamManagement'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  team?: Team | null
  isEditing: boolean
}

const CreateEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  team,
  isEditing
}) => {
  const [formData, setFormData] = useState({
    teamname: '',
    leadermid: 0
  })
  const [teamLeads, setTeamLeads] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        const leads = await teamRequests.getTeamLeads()
        setTeamLeads(leads)
      } catch (error) {
        console.error('Error fetching team leads:', error)
      }
    }

    if (isOpen) {
      fetchTeamLeads()
      if (isEditing && team) {
        setFormData({
          teamname: team.teamname || '',
          leadermid: team.leadermid || 0
        })
      } else {
        setFormData({ teamname: '', leadermid: 0 })
      }
      setErrors({})
    }
  }, [isOpen, team, isEditing])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.teamname.trim()) newErrors.teamname = 'Team name is required'
    else if (formData.teamname.length < 2)
      newErrors.teamname = 'Team name must be at least 2 characters'

    if (!formData.leadermid || formData.leadermid === 0)
      newErrors.leadermid = 'Team lead is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!validateForm()) return

  setLoading(true)
  try {
    // Prepare body
    const teamData = {
      teamname: formData.teamname.trim(),
      leadermid: formData.leadermid,
      ...(isEditing && team ? { tmid: team.tmid } : {}), // only send tmid for update
    }

    if (isEditing && team) {
      // PUT /teams/:id
      await teamRequests.updateTeam(team.tmid, teamData)
    } else {
      // POST /teams
      await teamRequests.createTeam(teamData)
    }

    onSuccess()
    onClose()
  } catch (error) {
    console.error('Error saving team:', error)
    setErrors({ submit: 'Failed to save team. Please try again.' })
  } finally {
    setLoading(false)
  }
}


  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  if (!isOpen) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? 'Edit Team' : 'Create New Team'}</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="teamname" className="form-label">Team Name *</label>
                <input
                  id="teamname"
                  type="text"
                  className={`form-control ${errors.teamname ? 'is-invalid' : ''}`}
                  value={formData.teamname}
                  onChange={(e) => handleChange('teamname', e.target.value)}
                  placeholder="Enter team name"
                  disabled={loading}
                />
                {errors.teamname && <div className="invalid-feedback">{errors.teamname}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="leadermid" className="form-label">Team Lead *</label>
                <select
                  id="leadermid"
                  className={`form-select ${errors.leadermid ? 'is-invalid' : ''}`}
                  value={formData.leadermid}
                  onChange={(e) => handleChange('leadermid', parseInt(e.target.value))}
                  disabled={loading}
                >
                  <option value={0}>Select Team Lead</option>
                  {teamLeads
                    .filter(user => user.userstatus === 'Active')
                    .map(user => (
                      <option key={user.usermid} value={user.usermid}>
                        {user.username} ({user.useremail})
                      </option>
                    ))}
                </select>
                {errors.leadermid && <div className="invalid-feedback">{errors.leadermid}</div>}
              </div>

              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading
                  ? <>{isEditing ? 'Updating...' : 'Creating...'} <span className="spinner-border spinner-border-sm"></span></>
                  : isEditing ? 'Update Team' : 'Create Team'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateEditModal
