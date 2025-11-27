import React from 'react';
import { Lead } from '../../../core/_models';

interface LeadDetailColumnProps {
    lead: Lead;
    onViewClick?: (lead: Lead) => void;
}

export const LeadDetailColumn: React.FC<LeadDetailColumnProps> = ({
    lead,
    onViewClick
}) => {
    const handleViewClick = () => {
        if (onViewClick) {
            onViewClick(lead);
        }
    };

    return (
        <td className="min-w-200px">
            <div className="d-flex flex-column">
                {/* Stage */}
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