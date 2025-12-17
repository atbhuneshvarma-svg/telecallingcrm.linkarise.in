import React from 'react';
import { Lead } from '../../../core/_models';
import { Skeleton } from 'antd';

interface AddedOnColumnProps {
  lead: Lead;
  loading?: boolean;
}

export const AddedOnColumn: React.FC<AddedOnColumnProps> = ({ 
  lead,
  loading = false
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        {lead.addedon ? (
          <span className="text-gray-800 fs-7 fw-semibold">
            {formatDate(lead.addedon)}
          </span>
        ) : (
          <span className="text-muted fs-8">N/A</span>
        )}
      </div>
    </td>
  );
};

export default AddedOnColumn;
