import React from 'react';
import { Lead } from '../../../core/_models';

interface ActivityColumnProps {
  lead: Lead;
}

export const ActivityColumn: React.FC<ActivityColumnProps> = ({ lead }) => {
  return (
    <td>
      <div className="d-flex flex-column">
        <span className="fs-8">
          {lead.activity || 'No activity'}
        </span>
      </div>
    </td>
  );
};