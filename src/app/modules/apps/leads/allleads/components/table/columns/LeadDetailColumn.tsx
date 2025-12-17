import React from 'react';
import { Lead } from '../../../core/_models';
import { Skeleton } from 'antd';

interface LeadDetailColumnProps {
  lead: Lead;
  onViewClick?: (lead: Lead) => void;
  loading?: boolean;
}

export const LeadDetailColumn: React.FC<LeadDetailColumnProps> = ({
  lead,
  onViewClick,
  loading = false
}) => {
  const handleViewClick = () => {
    onViewClick?.(lead);
  };

  if (loading) {
    return (
      <td className="min-w-200px">
        <Skeleton.Input style={{ width: '100%' }} active size="small" />
      </td>
    );
  }

  return (
    <td className="min-w-200px">
      <div className="d-flex flex-column">
        {lead.detail && (
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-chat text-muted fs-8"></i>
            <span className="text-gray-600 fs-8">{lead.detail}</span>
          </div>
        )}
      </div>
    </td>
  );
};
