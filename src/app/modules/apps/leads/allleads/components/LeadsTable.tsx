import React, { useMemo, useState } from 'react';
import { Lead } from '../core/_models';
import { useStatuses } from '../core/LeadsContext';
import { useToast } from '../hooks/useToast';
import { TableHeaderControls } from './table/TableHeaderControls';
import { BulkActionsBar } from './table/BulkActionsBar';
import { LoadingOverlay } from './table/LoadingOverlay';
import { EmptyState } from './table/EmptyState';
import { TableHeaders } from './table/TableHeaders';
import { LeadRow } from './table/LeadRow';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  onViewClick: (lead: Lead) => void;
  onEditClick: (lead: Lead) => void;
  onDeleteClick: (lead: Lead) => Promise<void>;
  onStatusClick: (lead: Lead) => void;
  onSelectLead?: (lead: Lead) => void;
  onEntriesPerPageChange?: (perPage: number) => void;
  onSearch?: (searchTerm: string) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  currentPage?: number;
  entriesPerPage?: number;
  selectedLeads?: number[];
  selectable?: boolean;
  showRowNumbers?: boolean;
  showSearch?: boolean;
  showTableControls?: boolean;
  searchTerm?: string;
  showingFrom?: number;
  showingTo?: number;
  totalRecords?: number;
  serverSideFiltering?: boolean;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  loading,
  onEditClick,
  onDeleteClick,
  onStatusClick,
  onViewClick,
  onSelectLead,
  onEntriesPerPageChange,
  onSearch,
  onSort,
  currentPage = 1,
  entriesPerPage = 10,
  selectedLeads = [],
  selectable = false,
  showRowNumbers = true,
  showSearch = true,
  showTableControls = true,
  searchTerm = '',
  showingFrom = 0,
  showingTo = 0,
  totalRecords = 0,
  serverSideFiltering = false,
  sortField = '',
  sortDirection = 'asc',
}) => {
  const { statuses } = useStatuses();
  const { showSuccess, showError, showInfo, showConfirm, showWarning } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSortField, setLocalSortField] = useState(sortField);
  const [localSortDirection, setLocalSortDirection] = useState<'asc' | 'desc'>(sortDirection);

  // Search handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(localSearchTerm);
  };

  const handleSearchClear = () => {
    setLocalSearchTerm('');
    if (onSearch) onSearch('');
    showInfo('Search cleared');
  };

  // Entries per page handler
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPage = Number(e.target.value);
    onEntriesPerPageChange?.(perPage);
    showSuccess(`Showing ${perPage} entries per page`);
  };

  // Sorting handlers
  const handleSort = (field: string) => {
    let newDirection: 'asc' | 'desc' = 'asc';
    if (localSortField === field) {
      newDirection = localSortDirection === 'asc' ? 'desc' : 'asc';
    }
    setLocalSortField(field);
    setLocalSortDirection(newDirection);
    if (onSort) {
      onSort(field, newDirection);
    } else {
      showInfo(`Sorted by ${getColumnDisplayName(field)} ${newDirection === 'asc' ? 'ascending' : 'descending'}`);
    }
  };

  const getSortIcon = (field: string) => {
    if (localSortField !== field) {
      return <i className="bi bi-arrow-down-up text-muted fs-9"></i>;
    }
    return localSortDirection === 'asc' 
      ? <i className="bi bi-arrow-up-short text-primary fs-9"></i>
      : <i className="bi bi-arrow-down-short text-primary fs-9"></i>;
  };

  const getColumnDisplayName = (field: string) => {
    const columnNames: { [key: string]: string } = {
      leadname: 'Name',
      username: 'User',
      campaignname: 'Campaign',
      email: 'Email',
      phone: 'Mobile',
      purpose: 'Purpose',
      statusname: 'Lead Status',
      activity: 'Activity',
      address: 'Address',
      leadremarks: 'Remarks',
      updatedon: 'Updated On',
      addedon: 'Added On'
    };
    return columnNames[field] || field;
  };

  // Data filtering and sorting
  const filteredLeads = useMemo(() => {
    if (!localSearchTerm || onSearch) return leads;
    const searchLower = localSearchTerm.toLowerCase();
    return leads.filter(lead =>
      lead.leadname?.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.phone?.toLowerCase().includes(searchLower) ||
      lead.username?.toLowerCase().includes(searchLower) ||
      lead.campaignname?.toLowerCase().includes(searchLower) ||
      lead.statusname?.toLowerCase().includes(searchLower) ||
      lead.address?.toLowerCase().includes(searchLower) ||
      lead.purpose?.toLowerCase().includes(searchLower) ||
      lead.leadremarks?.toLowerCase().includes(searchLower) ||
      false
    );
  }, [leads, localSearchTerm, onSearch]);

  const sortedLeads = useMemo(() => {
    if (onSort || !localSortField) return filteredLeads;
    return [...filteredLeads].sort((a, b) => {
      const aValue = a[localSortField as keyof Lead];
      const bValue = b[localSortField as keyof Lead];
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const compareValue = aValue.localeCompare(bValue);
        return localSortDirection === 'asc' ? compareValue : -compareValue;
      }
      const compareValue = String(aValue).localeCompare(String(bValue));
      return localSortDirection === 'asc' ? compareValue : -compareValue;
    });
  }, [filteredLeads, localSortField, localSortDirection, onSort]);

  const displayLeads = onSearch ? leads : sortedLeads;

  // Utility functions
  const getRowNumber = useMemo(() => {
    return (index: number) => (currentPage - 1) * entriesPerPage + index + 1;
  }, [currentPage, entriesPerPage]);

  const getStatusColor = (statusname: string) => {
    if (!statuses.length) return '#6c757d';
    const status = statuses.find(s =>
      s && typeof s.statusname === 'string' &&
      s.statusname.toLowerCase() === (statusname || '').toLowerCase()
    );
    return status?.statuscolor || '#6c757d';
  };

  const getLeadStage = (statusname: string) => {
    if (!statuses.length) return 'N/A';
    const status = statuses.find(s =>
      s && typeof s.statusname === 'string' &&
      s.statusname.toLowerCase() === (statusname || '').toLowerCase()
    );
    return status?.stage || 'N/A';
  };

  // Action handlers
  const handleDeleteClick = async (lead: Lead) => {
    const confirmed = await showConfirm(`Are you sure you want to delete lead "${lead.leadname || 'Unnamed Lead'}"? This action cannot be undone.`);
    if (!confirmed) {
      showInfo('Delete cancelled');
      return;
    }
    setDeletingId(lead.leadmid);
    try {
      await onDeleteClick(lead);
      showSuccess(`Lead "${lead.leadname || 'Unnamed Lead'}" deleted successfully`);
    } catch (error) {
      showError(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkAction = async (leadIds: number[], action: string) => {
    if (leadIds.length === 0) {
      showWarning('Please select at least one lead');
      return;
    }
    switch (action) {
      case 'export': showSuccess(`Exporting ${leadIds.length} leads...`); break;
      case 'assign': showInfo(`Assigning ${leadIds.length} leads to user...`); break;
      case 'status': showInfo(`Updating status for ${leadIds.length} leads...`); break;
      case 'delete':
        const confirmed = await showConfirm(`Are you sure you want to delete ${leadIds.length} leads? This action cannot be undone.`);
        if (!confirmed) {
          showInfo('Bulk delete cancelled');
          return;
        }
        showSuccess(`Deleting ${leadIds.length} leads...`);
        break;
      case 'clear': showInfo('Selection cleared'); break;
    }
  };

  const handleSelectLead = (lead: Lead) => {
    onSelectLead?.(lead);
  };

  const isLeadSelected = (leadId: number) => {
    return selectedLeads.includes(leadId);
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === displayLeads.length) {
      handleBulkAction([], 'clear');
    } else {
      showInfo(`Selected all ${displayLeads.length} leads`);
    }
  };

  return (
    <div className="card-body p-0">
      <TableHeaderControls
        showTableControls={showTableControls}
        showSearch={showSearch}
        loading={loading}
        entriesPerPage={entriesPerPage}
        localSearchTerm={localSearchTerm}
        onEntriesChange={handleEntriesChange}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSearchClear={handleSearchClear}
        displayLeads={displayLeads}
        leads={leads}
        showingFrom={showingFrom}
        showingTo={showingTo}
        totalRecords={totalRecords}
      />

      <BulkActionsBar
        selectable={selectable}
        selectedLeads={selectedLeads}
        displayLeads={displayLeads}
        onBulkAction={handleBulkAction}
      />

      <div className="table-container position-relative">
        <LoadingOverlay loading={loading} />
        
        <EmptyState
          loading={loading}
          displayLeads={displayLeads}
          localSearchTerm={localSearchTerm}
          onSearchClear={handleSearchClear}
        />

        {!loading && displayLeads.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover table-bordered table-rounded align-middle gs-0 gy-1">
              <TableHeaders
                showRowNumbers={showRowNumbers}
                selectable={selectable}
                loading={loading}
                onSort={handleSort}
                getSortIcon={getSortIcon}
                onSelectAll={handleSelectAll}
                selectedLeads={selectedLeads}
                displayLeads={displayLeads}
              />
              
              <tbody className="border-top-0">
                {displayLeads.map((lead, index) => (
                  <LeadRow
                    key={lead.leadmid}
                    lead={lead}
                    index={index}
                    showRowNumbers={showRowNumbers}
                    selectable={selectable}
                    loading={loading}
                    isLeadSelected={isLeadSelected}
                    onSelectLead={handleSelectLead}
                    onViewClick={onViewClick}
                    onEditClick={onEditClick}
                    onStatusClick={onStatusClick}
                    onDeleteClick={handleDeleteClick}
                    deletingId={deletingId}
                    getRowNumber={getRowNumber}
                    getStatusColor={getStatusColor}
                    getLeadStage={getLeadStage}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;