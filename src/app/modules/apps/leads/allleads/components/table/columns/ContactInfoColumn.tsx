import React from 'react';
import { Lead } from '../../../core/_models';

interface ContactInfoColumnProps {
  lead: Lead;
}

export const ContactInfoColumn: React.FC<ContactInfoColumnProps> = ({ lead }) => {
  return (
    <td>
      <div className="d-flex flex-column gap-1">
        {lead.phone ? (
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-telephone text-muted fs-8"></i>
            <a 
              href={`tel:${lead.phone}`}
              className="text-gray-700 text-decoration-none fs-8"
              onClick={(e) => e.stopPropagation()}
            >
              {lead.phone}
            </a>
          </div>
        ) : (
          <span className="text-muted fs-8">No contact info</span>
        )}
      </div>
    </td>
  );
};