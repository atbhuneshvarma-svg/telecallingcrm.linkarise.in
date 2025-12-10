import React from 'react';
import { Lead } from '../../../core/_models';
import { Skeleton } from 'antd';

interface ActivityColumnProps {
  lead: Lead;
  loading?: boolean;
}

export const ActivityColumn: React.FC<ActivityColumnProps> = ({ lead, loading = false }) => {
  if (loading) {
    return (
      <td>
        <Skeleton.Input style={{ width: '100%' }} active size="small" />
      </td>
    );
  }

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
