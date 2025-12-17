import React from 'react';
import { Skeleton } from 'antd';
import { Lead } from '../../../core/_models';

interface StatusColumnProps {
  lead: Lead;
  loading: boolean;
  onStatusClick: (lead: Lead) => void;
  getStatusColor: (statusname: string) => string;
}

export const StatusColumn: React.FC<StatusColumnProps> = ({
  lead,
  loading,
  onStatusClick,
  getStatusColor
}) => {
  return (
    <td className="text-center">
      {loading ? (
        <Skeleton.Input style={{ width: 80 }} active size="small" />
      ) : (
        <button
          className="btn btn-status border-0 bg-transparent p-0 transition-all"
          onClick={() => onStatusClick?.(lead)}
          style={{ cursor: 'pointer' }}
          disabled={loading}
          title="Click to change status"
        >
          <span
            className="badge rounded-pill fw-semibold d-inline-flex align-items-center gap-2 px-3 py-2 transition-all"
            style={{
              backgroundColor: getStatusColor(lead.statusname || ''),
              color: '#fff',
              minWidth: '70px',
              fontSize: '0.75rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {lead.statusname || 'N/A'}
            <i className="bi bi-pencil-fill"></i>
          </span>
        </button>
      )}
    </td>
  );
};
