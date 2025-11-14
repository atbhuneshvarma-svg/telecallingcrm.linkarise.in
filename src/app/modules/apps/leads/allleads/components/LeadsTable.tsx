import React, { useMemo, useState } from 'react';
import { Lead } from '../core/_models';
import { useStatuses } from '../core/LeadsContext';
import { useToast } from '../hooks/useToast';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  onViewClick: (lead: Lead) => void;
  onEditClick: (lead: Lead) => void;
  onDeleteClick: (lead: Lead) => Promise<void>;
  onStatusClick: (lead: Lead) => void;
  onSelectLead?: (lead: Lead) => void;
  onBulkAction?: (leadIds: number[], action: string) => void;
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
  onBulkAction,
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
  const { showSuccess, showError, showInfo, showConfirm , showWarning } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSortField, setLocalSortField] = useState(sortField);
  const [localSortDirection, setLocalSortDirection] = useState<'asc' | 'desc'>(sortDirection);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearchTerm);
    }
  };

  // Handle search clear
  const handleSearchClear = () => {
    setLocalSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
    showInfo('Search cleared');
  };

  // Handle entries per page change
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPage = Number(e.target.value);
    onEntriesPerPageChange?.(perPage);
    showSuccess(`Showing ${perPage} entries per page`);
  };

  // Handle column sorting
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
      // Local sorting fallback
      showInfo(`Sorted by ${getColumnDisplayName(field)} ${newDirection === 'asc' ? 'ascending' : 'descending'}`);
    }
  };

  // Get sort icon for column
  const getSortIcon = (field: string) => {
    if (localSortField !== field) {
      return <i className="bi bi-arrow-down-up text-muted fs-9"></i>;
    }
    
    return localSortDirection === 'asc' 
      ? <i className="bi bi-arrow-up-short text-primary fs-9"></i>
      : <i className="bi bi-arrow-down-short text-primary fs-9"></i>;
  };

  // Get column display name
  const getColumnDisplayName = (field: string) => {
    const columnNames: { [key: string]: string } = {
      leadname: 'Lead Name',
      username: 'Assigned To',
      campaignname: 'Campaign',
      email: 'Email',
      phone: 'Phone',
      statusname: 'Status',
      activity: 'Last Activity',
      address: 'Address'
    };
    
    return columnNames[field] || field;
  };

  // Filter leads locally based on search term (if no external search is provided)
  const filteredLeads = useMemo(() => {
    if (!localSearchTerm || onSearch) {
      return leads;
    }

    const searchLower = localSearchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.leadname?.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.phone?.toLowerCase().includes(searchLower) ||
        lead.username?.toLowerCase().includes(searchLower) ||
        lead.campaignname?.toLowerCase().includes(searchLower) ||
        lead.statusname?.toLowerCase().includes(searchLower) ||
        lead.address?.toLowerCase().includes(searchLower) ||
        false
    );
  }, [leads, localSearchTerm, onSearch]);

  // Sort leads locally if no external sort is provided
  const sortedLeads = useMemo(() => {
    if (onSort || !localSortField) {
      return filteredLeads;
    }

    return [...filteredLeads].sort((a, b) => {
      const aValue = a[localSortField as keyof Lead];
      const bValue = b[localSortField as keyof Lead];
      
      // Handle null/undefined values
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const compareValue = aValue.localeCompare(bValue);
        return localSortDirection === 'asc' ? compareValue : -compareValue;
      }
      
      // Fallback for other types
      const compareValue = String(aValue).localeCompare(String(bValue));
      return localSortDirection === 'asc' ? compareValue : -compareValue;
    });
  }, [filteredLeads, localSortField, localSortDirection, onSort]);

  // Use filtered and sorted leads for display
  const displayLeads = onSearch ? leads : sortedLeads;

  // Calculate row numbers based on pagination
  const getRowNumber = useMemo(() => {
    return (index: number) => {
      return (currentPage - 1) * entriesPerPage + index + 1;
    };
  }, [currentPage, entriesPerPage]);

  // Get status color with fallback
  const getStatusColor = (statusname: string) => {
    if (!statuses.length) return '#6c757d';
    const status = statuses.find(
      (s) =>
        s &&
        typeof s.statusname === 'string' &&
        s.statusname.toLowerCase() === (statusname || '').toLowerCase()
    );
    return status?.statuscolor || '#6c757d';
  };

  // Handle delete with loading state and confirmation
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

  // Handle bulk actions with toast notifications
  const handleBulkAction = async (leadIds: number[], action: string) => {
    if (leadIds.length === 0) {
      showWarning('Please select at least one lead');
      return;
    }

    switch (action) {
      case 'export':
        showSuccess(`Exporting ${leadIds.length} leads...`);
        break;
      case 'assign':
        showInfo(`Assigning ${leadIds.length} leads to user...`);
        break;
      case 'status':
        showInfo(`Updating status for ${leadIds.length} leads...`);
        break;
      case 'delete':
        const confirmed = await showConfirm(`Are you sure you want to delete ${leadIds.length} leads? This action cannot be undone.`);
        if (!confirmed) {
          showInfo('Bulk delete cancelled');
          return;
        }
        showSuccess(`Deleting ${leadIds.length} leads...`);
        break;
      case 'clear':
        showInfo('Selection cleared');
        break;
    }

    onBulkAction?.(leadIds, action);
  };

  // Handle lead selection
  const handleSelectLead = (lead: Lead) => {
    onSelectLead?.(lead);
  };

  // Check if lead is selected
  const isLeadSelected = (leadId: number) => {
    return selectedLeads.includes(leadId);
  };

  // Select all leads
  const handleSelectAll = () => {
    if (selectedLeads.length === displayLeads.length) {
      // Clear all selection
      handleBulkAction([], 'clear');
    } else {
      // Select all
      const allLeadIds = displayLeads.map(lead => lead.leadmid);
      onBulkAction?.(allLeadIds, 'select');
      showInfo(`Selected all ${displayLeads.length} leads`);
    }
  };

  // Loading skeleton rows
  const renderLoadingRows = () => {
    return [...Array(entriesPerPage)].map((_, index) => (
      <tr key={`loading-${index}`}>
        {showRowNumbers && (
          <td className="ps-4">
            <div className="placeholder-glow">
              <span className="placeholder col-4"></span>
            </div>
          </td>
        )}
        {selectable && (
          <td>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" disabled />
            </div>
          </td>
        )}
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-8"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-7"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-10"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-8"></span>
          </div>
        </td>
        <td className="text-center">
          <div className="placeholder-glow">
            <span className="placeholder col-12" style={{ height: '24px' }}></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </td>
        <td className="pe-4 text-center">
          <div className="d-flex justify-content-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="btn btn-sm btn-icon btn-light disabled opacity-0">
                <i className="bi bi-circle"></i>
              </div>
            ))}
          </div>
        </td>
      </tr>
    ));
  };

  if (!loading && displayLeads.length === 0) {
    return (
      <div className="card-body text-center py-5">
        <i className="bi bi-inbox display-4 d-block mb-2 text-muted"></i>
        <p className="text-muted mb-2">
          {localSearchTerm ? 'No leads match your search' : 'No leads found'}
        </p>
        <small className="text-muted">
          {localSearchTerm
            ? 'Try adjusting your search terms'
            : 'Try adjusting your filters or add a new lead'}
        </small>
        {localSearchTerm && (
          <div className="mt-3">
            <button className="btn btn-sm btn-light" onClick={handleSearchClear}>
              Clear Search
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card-body p-0">
      {/* Header Controls Group */}
      <div className="leads-table-header">
        {/* Combined Table Controls and Search Bar */}
        {(showTableControls || showSearch) && (
          <div className="border-bottom bg-light">
            <div className="row align-items-center px-4 py-3">
              {/* Left Side: Table Controls */}
              {showTableControls && (
                <div className="col-md-6 p-5">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted fw-medium">Show</span>
                      <select
                        value={entriesPerPage}
                        onChange={handleEntriesChange}
                        className="form-select form-select-sm w-auto border-primary"
                        disabled={loading}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <span className="text-muted fw-medium">entries</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Side: Search Bar */}
              {showSearch && (
                <div className={`col-md-6 ${!showTableControls ? 'col-12' : ''}`}>
                  <div className="d-flex justify-content-end">
                    <form onSubmit={handleSearchSubmit} className="w-100" style={{ maxWidth: '400px' }}>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                          type="text"
                          value={localSearchTerm}
                          onChange={handleSearchChange}
                          className="form-control border-start-0"
                          placeholder="Search leads by name, email, phone, campaign..."
                          disabled={loading}
                        />
                        {localSearchTerm && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary border"
                            onClick={handleSearchClear}
                            disabled={loading}
                            title="Clear search"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        )}                   
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Search Results Info */}
            {showSearch && localSearchTerm && (
              <div className="px-4 py-2 bg-info bg-opacity-10 border-top">
                <div className="row align-items-center">
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-2 fs-8">
                      <i className="bi bi-info-circle text-info"></i>
                      <span className="text-muted">
                        Found <strong className="text-dark">{displayLeads.length}</strong> lead{displayLeads.length !== 1 ? 's' : ''} 
                        {leads.length !== displayLeads.length && (
                          <span> (filtered from <strong>{leads.length}</strong> total leads)</span>
                        )}
                      </span>
                      {localSearchTerm && (
                        <button 
                          className="btn btn-sm btn-link p-0 ms-2 text-decoration-none"
                          onClick={handleSearchClear}
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectable && selectedLeads.length > 0 && (
          <div className="border-bottom bg-warning bg-opacity-10 px-4 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-warning"></i>
                  <span className="fw-semibold text-dark">
                    {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-warning dropdown-toggle d-flex align-items-center gap-1"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-lightning-fill"></i>
                    Bulk Actions
                  </button>
                  <ul className="dropdown-menu shadow">
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2"
                        onClick={() => handleBulkAction(selectedLeads, 'export')}
                      >
                        <i className="bi bi-download text-primary"></i>
                        <div>
                          <div className="fw-medium">Export Selected</div>
                          <small className="text-muted">Download as CSV/Excel</small>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2"
                        onClick={() => handleBulkAction(selectedLeads, 'assign')}
                      >
                        <i className="bi bi-person-plus text-success"></i>
                        <div>
                          <div className="fw-medium">Assign to User</div>
                          <small className="text-muted">Reassign selected leads</small>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2"
                        onClick={() => handleBulkAction(selectedLeads, 'status')}
                      >
                        <i className="bi bi-tag text-info"></i>
                        <div>
                          <div className="fw-medium">Update Status</div>
                          <small className="text-muted">Change lead status</small>
                        </div>
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        onClick={() => handleBulkAction(selectedLeads, 'delete')}
                      >
                        <i className="bi bi-trash"></i>
                        <div>
                          <div className="fw-medium">Delete Selected</div>
                          <small className="text-muted">Permanently remove</small>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted fs-8">
                  {selectedLeads.length} of {displayLeads.length} selected
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleBulkAction(selectedLeads, 'clear')}
                  title="Clear selection"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="table-container position-relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-1">
            <div className="text-center">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="text-muted fs-7">Loading leads...</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayLeads.length === 0 && (
          <div className="text-center py-8">
            <div className="mb-4">
              <i className="bi bi-inbox display-1 text-muted opacity-50"></i>
            </div>
            <h5 className="text-muted mb-2">
              {localSearchTerm ? 'No matching leads found' : 'No leads available'}
            </h5>
            <p className="text-muted mb-4">
              {localSearchTerm 
                ? 'Try adjusting your search terms or filters' 
                : 'Get started by adding your first lead'
              }
            </p>
            {localSearchTerm && (
              <button 
                className="btn btn-primary"
                onClick={handleSearchClear}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Data Table */}
        {!loading && displayLeads.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover align-middle gs-0 gy-2">
              <thead className="bg-light">
                <tr>
                  {showRowNumbers && (
                    <th className="ps-4" style={{ width: '60px' }}>
                      <span className="text-muted fw-semibold fs-7">#</span>
                    </th>
                  )}
                  
                  {selectable && (
                    <th style={{ width: '40px' }}>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                          onChange={handleSelectAll}
                          disabled={loading}
                        />
                      </div>
                    </th>
                  )}
                  
                  <th className="min-w-150px">
                    <button
                      className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
                      onClick={() => handleSort('leadname')}
                      disabled={loading}
                    >
                      <span className="text-muted fw-semibold fs-7">Lead Information</span>
                      {getSortIcon('leadname')}
                    </button>
                  </th>
                  
                  <th className="min-w-120px">
                    <button
                      className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
                      onClick={() => handleSort('username')}
                      disabled={loading}
                    >
                      <span className="text-muted fw-semibold fs-7">Assigned To</span>
                      {getSortIcon('username')}
                    </button>
                  </th>
                  
                  <th className="min-w-120px">
                    <button
                      className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
                      onClick={() => handleSort('campaignname')}
                      disabled={loading}
                    >
                      <span className="text-muted fw-semibold fs-7">Campaign</span>
                      {getSortIcon('campaignname')}
                    </button>
                  </th>
                  
                  <th className="min-w-130px">
                    <span className="text-muted fw-semibold fs-7">Contact Info</span>
                  </th>
                  
                  <th className="min-w-120px text-center">
                    <button
                      className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent mx-auto"
                      onClick={() => handleSort('statusname')}
                      disabled={loading}
                    >
                      <span className="text-muted fw-semibold fs-7">Status</span>
                      {getSortIcon('statusname')}
                    </button>
                  </th>
                  
                  <th className="min-w-100px">
                    <button
                      className="btn btn-sort d-flex align-items-center gap-1 p-0 border-0 bg-transparent"
                      onClick={() => handleSort('activity')}
                      disabled={loading}
                    >
                      <span className="text-muted fw-semibold fs-7">Last Activity</span>
                      {getSortIcon('activity')}
                    </button>
                  </th>
                  
                  <th className="pe-4 text-center" style={{ width: '140px' }}>
                    <span className="text-muted fw-semibold fs-7">Actions</span>
                  </th>
                </tr>
              </thead>
              
              <tbody className="border-top-0">
                {displayLeads.map((lead, index) => (
                  <tr 
                    key={lead.leadmid}
                    className={`lead-row ${isLeadSelected(lead.leadmid) ? 'table-active selected' : ''}`}
                  >
                    {/* Row Number */}
                    {showRowNumbers && (
                      <td className="ps-4">
                        <span className="text-muted fs-8 fw-medium">
                          {getRowNumber(index)}
                        </span>
                      </td>
                    )}
                    
                    {/* Selection Checkbox */}
                    {selectable && (
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={isLeadSelected(lead.leadmid)}
                            onChange={() => handleSelectLead(lead)}
                            disabled={loading}
                          />
                        </div>
                      </td>
                    )}
                    
                    {/* Lead Information */}
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-45px me-3">
                          <div className="symbol-label bg-light-primary">
                            <span className="text-primary fw-bold fs-6">
                              {lead.leadname
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase() || 'L'}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <span
                            className="fw-bold text-dark cursor-pointer hover-primary text-hover-primary"
                            onClick={() => onViewClick?.(lead)}
                            style={{ cursor: 'pointer' }}
                          >
                            {lead.leadname || 'Unnamed Lead'}
                          </span>
                          {lead.address && (
                            <div className="text-muted fs-8 mt-1 d-flex align-items-center gap-1">
                              <i className="bi bi-geo-alt"></i>
                              {lead.address.substring(0, 35)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Assigned User */}
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="d-flex flex-column">
                          <span className="fw-semibold text-gray-800">
                            {lead.username || 'Unassigned'}
                          </span>
                          {lead.teamname && (
                            <span className="text-muted fs-8">{lead.teamname}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Campaign */}
                    <td>
                      <span className="badge badge-light-info fs-8 px-3 py-2">
                        <i className="bi bi-megaphone me-1"></i>
                        {lead.campaignname || 'N/A'}
                      </span>
                    </td>
                    
                    {/* Contact Information */}
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {lead.phone && (
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
                        )}
                        {lead.email && (
                          <div className="d-flex align-items-center gap-1">
                            <i className="bi bi-envelope text-muted fs-8"></i>
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-primary text-decoration-none fs-8 text-truncate"
                              onClick={(e) => e.stopPropagation()}
                              style={{ maxWidth: '150px' }}
                            >
                              {lead.email}
                            </a>
                          </div>
                        )}
                        {!lead.phone && !lead.email && (
                          <span className="text-muted fs-8">No contact info</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="text-center">
                      <button
                        className="btn btn-status border-0 bg-transparent p-0 transition-all"
                        onClick={() => onStatusClick?.(lead)}
                        style={{ cursor: 'pointer' }}
                        disabled={loading}
                        title="Click to change status"
                      >
                        <span
                          className="badge rounded-pill fw-semibold d-inline-flex align-items-center gap-2 px-3 py-2 transition-all"
                          style={{
                            backgroundColor: getStatusColor(lead.statusname || ''),
                            color: '#fff',
                            minWidth: '110px',
                            fontSize: '0.75rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {lead.statusname || 'N/A'}
                          <i className="bi bi-pencil fs-9 opacity-75"></i>
                        </span>
                      </button>
                    </td>
                    
                    {/* Last Activity */}
                    <td>
                      <div className="d-flex flex-column">
                        <span className="text-muted fs-8">
                          {lead.activity || 'No activity'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="pe-4 text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <button
                          className="btn btn-sm btn-icon btn-light-primary btn-hover-scale"
                          onClick={() => onViewClick?.(lead)}
                          disabled={loading}
                          title="View lead details"
                        >
                          <i className="bi bi-eye-fill fs-6"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-icon btn-light-warning btn-hover-scale"
                          onClick={() => onEditClick?.(lead)}
                          disabled={loading}
                          title="Edit lead"
                        >
                          <i className="bi bi-pencil-fill fs-6"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-icon btn-light-danger btn-hover-scale"
                          onClick={() => handleDeleteClick(lead)}
                          disabled={loading || deletingId === lead.leadmid}
                          title="Delete lead"
                        >
                          {deletingId === lead.leadmid ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <i className="bi bi-trash-fill fs-6"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
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