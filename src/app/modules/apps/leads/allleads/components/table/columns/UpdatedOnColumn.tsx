import React from 'react';
import { Lead } from '../../../core/_models';

interface UpdatedOnColumnProps {
  lead: Lead;
}

export const UpdatedOnColumn: React.FC<UpdatedOnColumnProps> = ({ 
  lead 
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    // Parse DD-MM-YYYY format
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <td className="min-w-120px">
      <div className="d-flex flex-column">
        {lead.updatedon ? (
          <span className="text-gray-800 fs-7 fw-semibold">
            {formatDate(lead.updatedon)}
          </span>
        ) : (
          <span className="text-muted fs-8">Not updated</span>
        )}
      </div>
    </td>
  );
};

export default UpdatedOnColumn;