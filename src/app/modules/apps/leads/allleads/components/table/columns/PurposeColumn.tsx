import React from 'react';
import { Lead } from '../../../core/_models';

interface PurposeColumnProps {
  lead: Lead;
}

export const PurposeColumn: React.FC<PurposeColumnProps> = ({ lead }) => {
  return (
    <td>
      <span className="badge bg-light text-dark- fs-8 px-2 py-1">
        {lead.purpose || 'N/A'}
      </span>
    </td>
  );
};