import { FC, useState, useEffect } from 'react'

interface FilterOption {
  value: string
  label: string
}

interface Props {
  selectedTeam?: string
  selectedUser?: string
  selectedCampaign?: string
  onTeamChange: (team: string) => void
  onUserChange: (user: string) => void
  onCampaignChange: (campaign: string) => void
  teams?: FilterOption[]
  users?: FilterOption[]
  campaigns?: FilterOption[]
}

const ConvertedLeadsFilter: FC<Props> = ({
  selectedTeam = 'all',
  selectedUser = 'all',
  selectedCampaign = 'all',
  onTeamChange,
  onUserChange,
  onCampaignChange,
  teams = [],
  users = [],
  campaigns = []
}) => {
  const [localFilters, setLocalFilters] = useState({
    team: selectedTeam,
    user: selectedUser,
    campaign: selectedCampaign
  })

  // Update local state when props change - FIXED: use useEffect instead of useState
  useEffect(() => {
    setLocalFilters({
      team: selectedTeam,
      user: selectedUser,
      campaign: selectedCampaign
    })
  }, [selectedTeam, selectedUser, selectedCampaign])

  const handleLocalChange = (type: 'team' | 'user' | 'campaign', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleSubmit = () => {
    onTeamChange(localFilters.team)
    onUserChange(localFilters.user)
    onCampaignChange(localFilters.campaign)
  }

  const handleReset = () => {
    const resetFilters = {
      team: 'all',
      user: 'all',
      campaign: 'all'
    }
    setLocalFilters(resetFilters)
    onTeamChange(resetFilters.team)
    onUserChange(resetFilters.user)
    onCampaignChange(resetFilters.campaign)
  }

  // Default options with "All" option
  const teamOptions: FilterOption[] = [
    { value: 'all', label: 'All Teams' },
    ...teams
  ]

  const userOptions: FilterOption[] = [
    { value: 'all', label: 'All Users' },
    ...users
  ]

  const campaignOptions: FilterOption[] = [
    { value: 'all', label: 'All Campaigns' },
    ...campaigns
  ]

  return (
    <div className='d-flex align-items-center gap-4'>
      {/* Team Filter */}
      <div className='d-flex align-items-center'>
        <label className='form-label fw-bold text-dark me-3 mb-0'>Select Team:</label>
        <select
          className='form-select form-select-sm w-150px'
          value={localFilters.team}
          onChange={(e) => handleLocalChange('team', e.target.value)}
        >
          {teamOptions.map((team) => (
            <option key={team.value} value={team.value}>
              {team.label}
            </option>
          ))}
        </select>
      </div>

      {/* User Filter */}
      <div className='d-flex align-items-center'>
        <label className='form-label fw-bold text-dark me-3 mb-0'>User:</label>
        <select
          className='form-select form-select-sm w-150px'
          value={localFilters.user}
          onChange={(e) => handleLocalChange('user', e.target.value)}
        >
          {userOptions.map((user) => (
            <option key={user.value} value={user.value}>
              {user.label}
            </option>
          ))}
        </select>
      </div>

      {/* Campaign Filter */}
      <div className='d-flex align-items-center'>
        <label className='form-label fw-bold text-dark me-3 mb-0'>Campaign:</label>
        <select
          className='form-select form-select-sm w-150px'
          value={localFilters.campaign}
          onChange={(e) => handleLocalChange('campaign', e.target.value)}
        >
          {campaignOptions.map((campaign) => (
            <option key={campaign.value} value={campaign.value}>
              {campaign.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type='button'
        className='btn btn-sm btn-primary'
        onClick={handleSubmit}
      >
        Apply Filters
      </button>

      {/* Reset Button */}
      <button
        type='button'
        className='btn btn-sm btn-light'
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  )
}

export { ConvertedLeadsFilter }