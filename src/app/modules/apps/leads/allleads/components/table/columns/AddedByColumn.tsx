import React from 'react';
import { Lead } from '../../../core/_models';

interface AddedByColumnProps {
  lead: Lead;
}

export const AddedByColumn: React.FC<AddedByColumnProps> = ({ 
  lead 
}) => {
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