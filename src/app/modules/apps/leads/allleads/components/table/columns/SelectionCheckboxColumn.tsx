import React from 'react';
import { Lead } from '../../../core/_models';

interface SelectionCheckboxColumnProps {
  selectable: boolean;
  loading: boolean;
  lead: Lead;
  isLeadSelected: (leadId: number) => boolean;
  onSelectLead: (lead: Lead) => void;
}

export const SelectionCheckboxColumn: React.FC<SelectionCheckboxColumnProps> = ({
  selectable,
  loading,
  lead,
  isLeadSelected,
  onSelectLead
}) => {
  if (!selectable) return null;
  
  return (
    <td>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isLeadSelected(lead.leadmid)}
          onChange={() => onSelectLead(lead)}
          disabled={loading}
        />
      </div>
    </td>
  );
};