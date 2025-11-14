import React from 'react';

interface ActivityLogsControlsProps {
  perPage: number;
  searchTerm: string;
  loading: boolean;
  onPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchResultsCount?: number; // Add this prop
}

export const ActivityLogsControls: React.FC<ActivityLogsControlsProps> = ({
  perPage,
  searchTerm,
  loading,
  onPerPageChange,
  onSearchChange,
  searchResultsCount,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted">Show</span>
        <select 
          className="form-select form-select-sm w-auto"
          value={perPage}
          onChange={onPerPageChange}
          disabled={loading}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span className="text-muted">entries</span>
      </div>
      
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted">Search:</span>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search in action, description, module or IP..."
          value={searchTerm}
          onChange={onSearchChange}
          disabled={loading}
          style={{ width: '300px' }}
        />
        {searchTerm && (
          <span className="text-muted small">
            ({searchResultsCount || 0} results)
          </span>
        )}
      </div>
    </div>
  );
};