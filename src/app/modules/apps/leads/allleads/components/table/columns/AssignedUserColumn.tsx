import React from 'react';
import { Lead } from '../../../core/_models';

interface AssignedUserColumnProps {
  lead: Lead;
}

export const AssignedUserColumn: React.FC<AssignedUserColumnProps> = ({ lead }) => {
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