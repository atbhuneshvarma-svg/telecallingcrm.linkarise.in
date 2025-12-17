import React from 'react';
import { Lead } from '../../../core/_models';
import { Skeleton } from 'antd';

interface PurposeColumnProps {
  lead: Lead;
  loading?: boolean;
}

export const PurposeColumn: React.FC<PurposeColumnProps> = ({ lead, loading = false }) => {
  if (loading) {
    return (
      <td>
        <Skeleton.Input style={{ width: 80 }} active size="small" />
      </td>
    );
  }

  return (
    <td>
      <span className="badge bg-light text-dark fs-8 px-2 py-1">
        {lead.purpose || 'N/A'}
      </span>
    </td>
  );
};
