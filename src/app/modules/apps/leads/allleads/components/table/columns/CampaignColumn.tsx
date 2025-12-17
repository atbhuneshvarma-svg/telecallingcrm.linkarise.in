import React from 'react';
import { Lead } from '../../../core/_models';
import { Skeleton } from 'antd';

interface CampaignColumnProps {
  lead: Lead;
  loading?: boolean;
}

export const CampaignColumn: React.FC<CampaignColumnProps> = ({
  lead,
  loading = false
}) => {
  if (loading) {
    return (
      <td>
        <Skeleton.Input style={{ width: 100 }} active size="small" />
      </td>
    );
  }

  return (
    <td>
      <span className="badge fs-8 px-3 py-2">
        <i className="bi bi-megaphone me-1"></i>
        {lead.campaignname || 'N/A'}
      </span>
    </td>
  );
};
