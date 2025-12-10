import React from 'react';
import { Lead } from '../../../core/_models';
import { Skeleton } from 'antd';

interface AssignedUserColumnProps {
  lead: Lead;
  loading?: boolean;
}

export const AssignedUserColumn: React.FC<AssignedUserColumnProps> = ({ 
  lead,
  loading = false
}) => {
  if (loading) {
    return (
      <td>
        <div className="d-flex flex-column gap-1">
          <Skeleton.Input style={{ width: 50 }} active size="small" />
        </div>
      </td>
    );
  }

  return (
    <td>
      <div className="d-flex align-items-center">
        <div className="d-flex flex-column">
          <span className="fw-semibold text-gray-800">
            {lead.username || 'Unassigned'}
          </span>
          {lead.teamname && (
            <span className="text-muted fs-8">{lead.teamname}</span>
          )}
        </div>
      </div>
    </td>
  );
};
