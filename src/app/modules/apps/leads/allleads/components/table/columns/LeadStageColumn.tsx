import React from 'react';
import { Lead } from '../../../core/_models';
import { Skeleton } from 'antd';

interface LeadStageColumnProps {
  lead: Lead;
  getLeadStage?: (statusname: string) => string;
  loading?: boolean;
}

export const LeadStageColumn: React.FC<LeadStageColumnProps> = ({ 
  lead, 
  getLeadStage,
  loading = false
}) => {
  if (loading) {
    return (
      <td className="min-w-120px text-center">
        <Skeleton.Input style={{ width: 80 }} active size="small" />
      </td>
    );
  }

  const stage = getLeadStage ? getLeadStage(lead.statusname || '') : 'N/A';
  
  const getStageColor = (stage: string) => {
    const stageLower = stage.toLowerCase();
    if (stageLower.includes('new') || stageLower.includes('prospect')) return 'badge-light-primary';
    if (stageLower.includes('qualified') || stageLower.includes('warm')) return 'badge-light-warning';
    if (stageLower.includes('converted') || stageLower.includes('hot')) return 'badge-light-success';
    if (stageLower.includes('lost') || stageLower.includes('cold')) return 'badge-light-danger';
    if (stageLower.includes('nurturing')) return 'badge-light-info';
    return 'badge-light-secondary';
  };

  return (
    <td className="min-w-120px">
      <div className="d-flex justify-content-center">
        <span className={`badge ${getStageColor(stage)} fs-7 fw-semibold`}>
          {stage}
        </span>
      </div>
    </td>
  );
};

export default LeadStageColumn;
