import React from 'react';
import { Lead } from '../../../core/_models';
import { Skeleton } from 'antd';

interface RemarksColumnProps {
  lead: Lead;
  loading?: boolean;
}

export const RemarksColumn: React.FC<RemarksColumnProps> = ({ lead, loading = false }) => {
  if (loading) {
    return (
      <td className="min-w-150px">
        <Skeleton.Input style={{ width: '100%' }} active size="small" />
      </td>
    );
  }

  return (
    <td className="min-w-150px">
      <div className="d-flex flex-column">
        {lead.leadremarks ? (
          <span className="text-gray-800 fs-7">
            {lead.leadremarks.length > 100
              ? `${lead.leadremarks.substring(0, 100)}...`
              : lead.leadremarks
            }
          </span>
        ) : (
          <span className="text-muted fs-8">No remarks</span>
        )}
      </div>
    </td>
  );
};

export default RemarksColumn;
