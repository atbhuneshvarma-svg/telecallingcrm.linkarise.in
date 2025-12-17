import React, { useMemo, useState } from 'react';
import { Lead } from '../core/_models';
import { useStatuses } from '../core/LeadsContext';
import { useToast } from '../hooks/useToast';
import { TableHeaderControls } from './table/TableHeaderControls';
import { BulkActionsBar } from './table/BulkActionsBar';
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
  const { showSuccess, showError, showInfo, showConfirm } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSortField, setLocalSortField] = useState(sortField);
  const [localSortDirection, setLocalSortDirection] = useState<'asc' | 'desc'>(sortDirection);

  // Search handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearch?.(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearchTerm);
  };

  const handleSearchClear = () => {
    setLocalSearchTerm('');
    onSearch?.('');
    showInfo('Search cleared');
  };

  // Entries per page
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPage = Number(e.target.value);
    onEntriesPerPageChange?.(perPage);
    showSuccess(`Showing ${perPage} entries per page`);
  };

  // Sorting
  const handleSort = (field: string) => {
    const newDirection = localSortField === field && localSortDirection === 'asc' ? 'desc' : 'asc';
    setLocalSortField(field);
    setLocalSortDirection(newDirection);
    onSort?.(field, newDirection);
  };

  const getSortIcon = (field: string) => {
    if (localSortField !== field) return <i className="bi bi-arrow-down-up text-muted fs-9"></i>;
    return localSortDirection === 'asc'
      ? <i className="bi bi-arrow-up-short text-primary fs-9"></i>
      : <i className="bi bi-arrow-down-short text-primary fs-9"></i>;
  };

  // Filtering & sorting
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
      lead.leadremarks?.toLowerCase().includes(searchLower)
    );
  }, [leads, localSearchTerm, onSearch]);

  const sortedLeads = useMemo(() => {
    if (onSort || !localSortField) return filteredLeads;
    return [...filteredLeads].sort((a, b) => {
      const aValue = a[localSortField as keyof Lead];
      const bValue = b[localSortField as keyof Lead];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      return localSortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredLeads, localSortField, localSortDirection, onSort]);

  const displayLeads = onSearch ? leads : sortedLeads;

  // Utils
  const getRowNumber = useMemo(() => (index: number) => (currentPage - 1) * entriesPerPage + index + 1, [currentPage, entriesPerPage]);

  const getStatusColor = (statusname: string) => {
    const status = statuses.find(s => s.statusname?.toLowerCase() === (statusname || '').toLowerCase());
    return status?.statuscolor || '#6c757d';
  };

  const getLeadStage = (statusname: string) => {
    const status = statuses.find(s => s.statusname?.toLowerCase() === (statusname || '').toLowerCase());
    return status?.stage || 'N/A';
  };

  // Actions
  const handleDeleteClick = async (lead: Lead) => {
    const confirmed = await showConfirm(`Delete lead "${lead.leadname}"?`);
    if (!confirmed) return showInfo('Delete cancelled');
    setDeletingId(lead.leadmid);
    try {
      await onDeleteClick(lead);
      showSuccess(`Lead "${lead.leadname}" deleted`);
    } catch (error) {
      showError(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelectLead = (lead: Lead) => onSelectLead?.(lead);
  const isLeadSelected = (leadId: number) => selectedLeads.includes(leadId);

  const handleSelectAll = () => {
    if (selectedLeads.length === displayLeads.length) {
      showInfo('Selection cleared');
    } else {
      showInfo(`Selected all ${displayLeads.length} leads`);
    }
  };

  return (
    <div className="card-body p-0">
      <div className="pb-2"><TableHeaderControls
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
      </div>

      <BulkActionsBar
        selectable={selectable}
        selectedLeads={selectedLeads}
        displayLeads={displayLeads}
        onBulkAction={() => { }}
      />

      <div className="table-container position-relative">
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
              {displayLeads.length > 0
                ? displayLeads.map((lead, idx) => (
                  <LeadRow
                    key={lead.leadmid}
                    lead={lead}
                    index={idx}
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
                ))
                : <EmptyState
                  loading={loading}
                  displayLeads={displayLeads}
                  localSearchTerm={localSearchTerm}
                  onSearchClear={handleSearchClear}
                />
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsTable;
