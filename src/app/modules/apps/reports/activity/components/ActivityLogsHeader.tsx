import React from 'react';

interface ActivityLogsHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

export const ActivityLogsHeader: React.FC<ActivityLogsHeaderProps> = ({ 
  title, 
  subtitle,
  onRefresh,
  loading = false
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 className="fw-bold text-gray-800">{title}</h1>
        {subtitle && <span className="text-muted">{subtitle}</span>}
      </div>
      
      {onRefresh && (
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Refreshing...
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt"></i>
              Refresh
            </>
          )}
        </button>
      )}
    </div>
  );
};