// components/FreshLeadFilters.tsx
import React from 'react';
import { FreshLead, FreshLeadFilters as FreshLeadFiltersType } from '../core/_models';
import { useLeads } from '../../allleads/core/LeadsContext';
import { useAuth } from '../../../../auth';

interface FreshLeadFiltersProps {
  leads: FreshLead[];
  filters: FreshLeadFiltersType;
  onFiltersChange: (filters: FreshLeadFiltersType) => void;
  onReset: () => void;
  onRefresh: () => void;
  totalLeads: number;
  isLoading?: boolean;
  onSubmitFilters?: () => void;
}

export const FreshLeadFilters: React.FC<FreshLeadFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  onRefresh,
  isLoading = false,
  leads,
}) => {

  const { currentUser } = useAuth();
  const userRole = currentUser?.user?.userrole || 'telecaller';
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';

  const { dropdowns } = useLeads();
  const campaigns = dropdowns?.campaigns ?? [];
  const statuses = dropdowns?.statuses ?? [];

  const handleFilterChange = (key: keyof FreshLeadFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const handleResetAll = () => {
    onReset();
  };

  // Get unique users from leads
  const uniqueUsers = React.useMemo(() => {
    if (!leads) return [];
    return Array.from(
      new Map(
        leads
          .filter((l) => l)
          .map((l) => [l.usermid, l])
      ).values()
    );
  }, [leads]);

  return (
    <div className="">
      <div className="card-body">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold text-gray-800">Fresh Leads</h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light btn-active-light-primary"
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <i className="bi bi-arrow-clockwise me-2"></i>
              )}
              Refresh
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Campaign Filter */}
          <div className="col-md-3">
            <label className="form-label">Campaign</label>
            <select
              value={filters.campaignmid || ''}
              onChange={(e) =>
                handleFilterChange(
                  'campaignmid',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="form-select"
              disabled={isLoading}
            >
              <option value="">All Campaigns</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              value={filters.statusname || ''}
              onChange={(e) =>
                handleFilterChange('statusname', e.target.value ? e.target.value : undefined)
              }
              className="form-select"
              disabled={isLoading}
            >
              <option value="">All Status</option>
              {statuses.map((s) => (
                <option key={s.statusmid} value={s.statusname}>
                  {s.statusname}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned To Filter */}
          {(isAdmin || isManager) && (<div className="col-md-3">
            <label className="form-label">Assigned To</label>
            <select
              value={filters.usermid || ''}
              onChange={(e) =>
                handleFilterChange(
                  'usermid',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="form-select"
              disabled={isLoading}
            >
              <option value="">All Users</option>
              {uniqueUsers.map((u) => (
                <option key={u.usermid} value={u.usermid}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
          )}
          {/* Reset Button */}
          <div className="col-md-3 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-light w-100"
              onClick={handleResetAll}
              disabled={isLoading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};