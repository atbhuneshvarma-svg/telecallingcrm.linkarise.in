import React from 'react'
import { Filters as FiltersType, Lead } from '../core/types'

interface FiltersProps {
  filters: FiltersType
  onFilterChange: (filters: FiltersType) => void
  onReset: () => void
  onFetch: () => void
  leads: Lead[]
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onFetch,
  leads
}) => {
  const campaigns = [...new Set(leads.map(l => l.campaign))]
  const users = [...new Set(leads.map(l => l.telecaller))]
  const stages = [...new Set(leads.map(l => l.stage))]

  const handleChange = (key: keyof FiltersType, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="d-flex gap-3 mb-3">
      <select 
        className="form-select"
        value={filters.campaign}
        onChange={e => handleChange('campaign', e.target.value)}
      >
        <option value="">Select Campaign</option>
        {campaigns.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select 
        className="form-select"
        value={filters.user}
        onChange={e => handleChange('user', e.target.value)}
      >
        <option value="">Select User</option>
        {users.map(u => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>

      <select 
        className="form-select"
        value={filters.stage}
        onChange={e => handleChange('stage', e.target.value)}
      >
        <option value="">Select Stage</option>
        {stages.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button className="btn btn-primary" onClick={onFetch}>
        Submit
      </button>
      <button className="btn btn-secondary" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}

export default Filters