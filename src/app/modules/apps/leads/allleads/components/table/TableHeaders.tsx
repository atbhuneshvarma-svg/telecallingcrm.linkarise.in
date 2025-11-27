import React from 'react';

interface TableHeadersProps {
  showRowNumbers: boolean;
  selectable: boolean;
  loading: boolean;
  onSort: (field: string) => void;
  getSortIcon: (field: string) => JSX.Element;
  onSelectAll: () => void;
  selectedLeads: number[];
  displayLeads: any[];
}

export const TableHeaders: React.FC<TableHeadersProps> = ({
  showRowNumbers,
  selectable,
  loading,
  onSort,
  getSortIcon,
  onSelectAll,
  selectedLeads,
  displayLeads
}) => {
  return (
    <thead className="bg-light">
      <tr>
        {/* Sr.No */}
        {showRowNumbers && (
          <th className="ps-4" style={{ width: '60px' }}>
            <span className="text-muted fw-semibold fs-7">Sr.No</span>
          </th>
        )}
        
        {/* Selection Checkbox */}
        {selectable && (
          <th style={{ width: '40px' }}>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                onChange={onSelectAll}
                disabled={loading}
              />
            </div>
          </th>
        )}
        
        {/* Campaign */}
        <th className="min-w-150px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('campaignname')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Campaign</span>
            {getSortIcon('campaignname')}
          </button>
        </th>
        
        {/* User */}
        <th className="min-w-120px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('username')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">User</span>
            {getSortIcon('username')}
          </button>
        </th>
        
        {/* Name */}
        <th className="min-w-150px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('leadname')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Name</span>
            {getSortIcon('leadname')}
          </button>
        </th>
        
        {/* Mobile */}
        <th className="min-w-120px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('phone')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Mobile</span>
            {getSortIcon('phone')}
          </button>
        </th>
        
        {/* Purpose */}
        <th className="min-w-120px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('purpose')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Purpose</span>
            {getSortIcon('purpose')}
          </button>
        </th>
        
        {/* Lead Detail */}
        <th className="min-w-200px">
          <span className="text-muted fw-semibold fs-7">Lead Detail</span>
        </th>
        
        {/* Lead Stage */}
        <th className="min-w-120px">
          <span className="text-muted fw-semibold fs-7">Lead Stage</span>
        </th>
        
        {/* Lead Status */}
        <th className="min-w-120px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('statusname')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Lead Status</span>
            {getSortIcon('statusname')}
          </button>
        </th>
        
        {/* Activity */}
        <th className="min-w-120px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('activity')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Activity</span>
            {getSortIcon('activity')}
          </button>
        </th>
        
        {/* Remarks */}
        <th className="min-w-150px">
          <span className="text-muted fw-semibold fs-7">Remarks</span>
        </th>
        
        {/* Updated On */}
        <th className="min-w-120px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('updatedon')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Updated On</span>
            {getSortIcon('updatedon')}
          </button>
        </th>
        
        {/* Updated By */}
        <th className="min-w-120px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('updatedby')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Updated By</span>
            {getSortIcon('updatedby')}
          </button>
        </th>
        
        {/* Added On */}
        <th className="min-w-120px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('addedon')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Added On</span>
            {getSortIcon('addedon')}
          </button>
        </th>
        
        {/* Added By */}
        <th className="min-w-120px">
          <button
            className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
            onClick={() => onSort('addedby')}
            disabled={loading}
          >
            <span className="text-muted fw-semibold fs-7">Added By</span>
            {getSortIcon('addedby')}
          </button>
        </th>
        
        {/* Operations */}
        <th className="pe-4 text-center" style={{ width: '140px' }}>
          <span className="text-muted fw-semibold fs-7">Operations</span>
        </th>
      </tr>
    </thead>
  );
};