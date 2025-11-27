import React from 'react';
import { Lead } from '../../../core/_models';

interface LeadInfoColumnProps {
  lead: Lead;
  onViewClick: (lead: Lead) => void;
}

export const LeadInfoColumn: React.FC<LeadInfoColumnProps> = ({
  lead,
  onViewClick
}) => {
  return (
    <td>
      <div className="d-flex align-items-center">
        <div className="symbol symbol-45px me-3">
          <div className="symbol-label bg-light-primary">
            <span className="text-primary fw-bold fs-6">
              {lead.leadname
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || 'L'}
            </span>
          </div>
        </div>
        <div className="d-flex flex-column">
          <span
            className="fw-bold text-dark cursor-pointer hover-primary text-hover-primary"
            onClick={() => onViewClick?.(lead)}
            style={{ cursor: 'pointer' }}
          >
            {lead.leadname || 'Unnamed Lead'}
          </span>
        </div>
      </div>
    </td>
  );
};