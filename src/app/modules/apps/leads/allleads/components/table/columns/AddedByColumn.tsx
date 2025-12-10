import React from 'react';
import { Lead } from '../../../core/_models';
import { Skeleton } from 'antd';

interface AddedByColumnProps {
  lead: Lead;
  loading?: boolean;
}

export const AddedByColumn: React.FC<AddedByColumnProps> = ({ 
  lead,
  loading = false
}) => {
  if (loading) {
    return (
      <td className="min-w-120px">
        <Skeleton.Input style={{ width: '80px' }} active size="small" />
      </td>
    );
  }

  return (
    <td className="min-w-120px">
      <div className="d-flex flex-column">
        {lead.username ? (
          <span className="text-gray-800 fs-7">
            {lead.username}
          </span>
        ) : (
          <span className="text-muted fs-8">System</span>
        )}
      </div>
    </td>
  );
};

export default AddedByColumn;
