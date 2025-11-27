import React from 'react';
import { Lead } from '../../core/_models';
import { RowNumberColumn } from './columns/RowNumberColumn';
import { SelectionCheckboxColumn } from './columns/SelectionCheckboxColumn';
import { LeadInfoColumn } from './columns/LeadInfoColumn';
import { AssignedUserColumn } from './columns/AssignedUserColumn';
import { CampaignColumn } from './columns/CampaignColumn';
import { ContactInfoColumn } from './columns/ContactInfoColumn';
import { PurposeColumn } from './columns/PurposeColumn';
import { StatusColumn } from './columns/StatusColumn';
import { ActivityColumn } from './columns/ActivityColumn';
import { ActionsColumn } from './columns/ActionsColumn';
import { LeadDetailColumn } from './columns/LeadDetailColumn';
import { LeadStageColumn } from './columns/LeadStageColumn';
import { RemarksColumn } from './columns/RemarksColumn';
import { UpdatedOnColumn } from './columns/UpdatedOnColumn';
import { UpdatedByColumn } from './columns/UpdatedByColumn';
import { AddedOnColumn } from './columns/AddedOnColumn';
import { AddedByColumn } from './columns/AddedByColumn';

interface LeadRowProps {
  lead: Lead;
  index: number;
  showRowNumbers: boolean;
  selectable: boolean;
  loading: boolean;
  isLeadSelected: (leadId: number) => boolean;
  onSelectLead: (lead: Lead) => void;
  onViewClick: (lead: Lead) => void;
  onEditClick: (lead: Lead) => void;
  onStatusClick: (lead: Lead) => void;
  onDeleteClick: (lead: Lead) => void;
  deletingId: number | null;
  getRowNumber: (index: number) => number;
  getStatusColor: (statusname: string) => string;
  getLeadStage: (statusname: string) => string;
}

export const LeadRow: React.FC<LeadRowProps> = (props) => {
  const {
    lead,
    index,
    showRowNumbers,
    selectable,
    loading,
    isLeadSelected,
    onSelectLead,
    onViewClick,
    onEditClick,
    onStatusClick,
    onDeleteClick,
    deletingId,
    getRowNumber,
    getStatusColor,
    getLeadStage
  } = props;

  return (
    <tr className={`lead-row ${isLeadSelected(lead.leadmid) ? 'table-active selected' : ''}`}>
      <RowNumberColumn
        showRowNumbers={showRowNumbers}
        index={index}
        getRowNumber={getRowNumber}

      />
      <SelectionCheckboxColumn
        selectable={selectable}
        loading={loading}
        lead={lead}
        isLeadSelected={isLeadSelected}
        onSelectLead={onSelectLead}
      />
      <CampaignColumn lead={lead} />

      <AssignedUserColumn lead={lead} />

      <LeadInfoColumn
        lead={lead}
        onViewClick={onViewClick}
      />

      



      <ContactInfoColumn lead={lead} />

      <PurposeColumn lead={lead} />
      <LeadDetailColumn lead={lead} onViewClick={onViewClick} />

      <LeadStageColumn
        lead={lead}
        getLeadStage={getLeadStage}
      />

      <StatusColumn
        lead={lead}
        loading={loading}
        onStatusClick={onStatusClick}
        getStatusColor={getStatusColor}
      />

      <ActivityColumn lead={lead} />

      <RemarksColumn lead={lead} />

      <UpdatedOnColumn lead={lead} />

      <UpdatedByColumn lead={lead} />

      <AddedOnColumn lead={lead} />

      <AddedByColumn lead={lead} />



      <ActionsColumn
        lead={lead}
        loading={loading}
        deletingId={deletingId}
        onViewClick={onViewClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    </tr>
  );
};