import React from 'react';
import { Skeleton } from 'antd';
import { Lead } from '../../../core/_models';

interface UpdatedByColumnProps {
  lead: Lead;
  loading?: boolean;
}

export const UpdatedByColumn: React.FC<UpdatedByColumnProps> = ({ 
  lead,
  loading = false
}) => {
  return (
    <td className="min-w-120px">
      <div className="d-flex flex-column">
        {loading ? (
          <Skeleton.Input style={{ width: 80 }} active size="small" />
        ) : lead.username ? (
          <span className="text-gray-800 fs-7">
            {lead.username}
          </span>
        ) : (
          <span className="text-muted fs-8">Not assigned</span>
        )}
      </div>
    </td>
  );
};

export default UpdatedByColumn;
