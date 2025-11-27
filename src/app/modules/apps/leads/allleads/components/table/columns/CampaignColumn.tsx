import React from 'react';
import { Lead } from '../../../core/_models';

interface CampaignColumnProps {
  lead: Lead;
}

export const CampaignColumn: React.FC<CampaignColumnProps> = ({ lead }) => {
  return (
    <td>
      <span className="badge fs-8 px-3 py-2">
        <i className="bi bi-megaphone me-1"></i>
        {lead.campaignname || 'N/A'}
      </span>
    </td>
  );
};