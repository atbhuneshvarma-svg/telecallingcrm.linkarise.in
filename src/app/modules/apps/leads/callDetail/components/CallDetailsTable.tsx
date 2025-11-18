// Update the CallDetailsTable component to remove local filtering logic
import React, { useState, useMemo } from 'react';
import { CallDetail } from '../core/_models';

interface CallDetailsTableProps {
  data: CallDetail[];
  loading: boolean;
  currentPage?: number;
  entriesPerPage?: number;
  onEntriesPerPageChange?: (perPage: number) => void;
  showingFrom?: number;
  showingTo?: number;
  totalRecords?: number;
  showSearch?: boolean;
  onSearch?: (searchTerm: string) => void;
  searchTerm?: string;
  filters?: {
    user: string;
    campaign: string;
    status: string;
    date: string;
    callType?: string;
    activity?: string;
  };
}

type SortField = 'telecaller' | 'campaign' | 'leadname' | 'mobile' | 'starttime' | 'endtime' | 'duration' | 'calltype' | 'activity' | 'status' | 'remarks'
type SortDirection = 'asc' | 'desc'

const CallDetailsTable: React.FC<CallDetailsTableProps> = ({
  data,
  loading,
  currentPage = 1,
  entriesPerPage = 10,
  onEntriesPerPageChange,
  showingFrom = 0,
  showingTo = 0,
  totalRecords = 0,
  showSearch = true,
  onSearch,
  searchTerm = '',
  filters,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [sortField, setSortField] = useState<SortField>('starttime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
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
  };

  // Handle entries per page change
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPage = Number(e.target.value);
    onEntriesPerPageChange?.(perPage);
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort indicator component
  const SortIndicator: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) {
      return <i className="bi bi-arrow-down-up ms-1 text-muted small opacity-50"></i>;
    }
    
    return sortDirection === 'asc' 
      ? <i className="bi bi-arrow-up ms-1 text-primary small"></i>
      : <i className="bi bi-arrow-down ms-1 text-primary small"></i>;
  };

  // Sortable header component
  const SortableHeader: React.FC<{ 
    field: SortField;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }> = ({ field, children, className = '', style = {} }) => (
    <th 
      className={`${className} cursor-pointer user-select-none`}
      onClick={() => handleSort(field)}
      style={{ cursor: 'pointer', ...style }}
    >
      <div className="d-flex align-items-center justify-content-center">
        {children}
        <SortIndicator field={field} />
      </div>
    </th>
  );

  // Sort call records
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';

      switch (sortField) {
        case 'telecaller':
          aValue = (a.telecaller_name || '-').toLowerCase();
          bValue = (b.telecaller_name || '-').toLowerCase();
          break;
        case 'campaign':
          aValue = (a.campaignname || '-').toLowerCase();
          bValue = (b.campaignname || '-').toLowerCase();
          break;
        case 'leadname':
          aValue = (a.lead_name || '-').toLowerCase();
          bValue = (b.lead_name || '-').toLowerCase();
          break;
        case 'mobile':
          aValue = a.primary_mobile || '';
          bValue = b.primary_mobile || '';
          break;
        case 'starttime':
          aValue = a.starttime ? new Date(a.starttime).getTime() : 0;
          bValue = b.starttime ? new Date(b.starttime).getTime() : 0;
          break;
        case 'endtime':
          aValue = a.endtime ? new Date(a.endtime).getTime() : 0;
          bValue = b.endtime ? new Date(b.endtime).getTime() : 0;
          break;
        case 'duration':
          // Parse duration like "5m 30s" to seconds for sorting
          aValue = parseDurationToSeconds(a.callduration || '0s');
          bValue = parseDurationToSeconds(b.callduration || '0s');
          break;
        case 'calltype':
          aValue = (a.calltype || '-').toLowerCase();
          bValue = (b.calltype || '-').toLowerCase();
          break;
        case 'activity':
          aValue = (a.actvity || '-').toLowerCase();
          bValue = (b.actvity || '-').toLowerCase();
          break;
        case 'status':
          aValue = (a.statusname || 'N/A').toLowerCase();
          bValue = (b.statusname || 'N/A').toLowerCase();
          break;
        case 'remarks':
          aValue = (a.followupremark || '-').toLowerCase();
          bValue = (b.followupremark || '-').toLowerCase();
          break;
        default:
          return 0;
      }

      // Handle empty values
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortDirection === 'asc' ? -1 : 1;
      if (!bValue) return sortDirection === 'asc' ? 1 : -1;

      // Compare values
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  // Helper function to parse duration string to seconds
  const parseDurationToSeconds = (duration: string): number => {
    if (!duration) return 0;
    
    let totalSeconds = 0;
    
    // Match minutes and seconds
    const minutesMatch = duration.match(/(\d+)m/);
    const secondsMatch = duration.match(/(\d+)s/);
    
    if (minutesMatch) {
      totalSeconds += parseInt(minutesMatch[1]) * 60;
    }
    
    if (secondsMatch) {
      totalSeconds += parseInt(secondsMatch[1]);
    }
    
    return totalSeconds;
  };

  // Format duration for display
  const formatDuration = (duration: string): string => {
    if (!duration) return '-';
    return duration;
  };

  // Calculate row numbers
  const getRowNumber = (index: number) => {
    return (currentPage - 1) * entriesPerPage + index + 1;
  };

  // Check if any external filters are active
  const hasActiveFilters = useMemo(() => {
    if (!filters) return false;
    
    return (
      filters.user !== 'All' ||
      filters.campaign !== 'All' ||
      filters.status !== 'All' ||
      (filters.date && filters.date !== new Date().toISOString().split('T')[0]) ||
      (filters.callType && filters.callType !== 'All') ||
      (filters.activity && filters.activity !== 'All')
    );
  }, [filters]);

  // Get filter summary for display
  const getFilterSummary = () => {
    if (!filters || !hasActiveFilters) return null;

    const activeFilters = [];
    if (filters.user !== 'All') activeFilters.push(`Telecaller: ${filters.user}`);
    if (filters.campaign !== 'All') activeFilters.push(`Campaign: ${filters.campaign}`);
    if (filters.status !== 'All') activeFilters.push(`Status: ${filters.status}`);
    if (filters.date && filters.date !== new Date().toISOString().split('T')[0]) {
      activeFilters.push(`Date: ${new Date(filters.date).toLocaleDateString()}`);
    }
    if (filters.callType && filters.callType !== 'All') activeFilters.push(`Call Type: ${filters.callType}`);
    if (filters.activity && filters.activity !== 'All') activeFilters.push(`Activity: ${filters.activity}`);

    return activeFilters.join(', ');
  };

  // Loading skeleton rows
  const renderLoadingRows = () => {
    return [...Array(entriesPerPage)].map((_, index) => (
      <tr key={`loading-${index}`}>
        <td className="text-center">
          <div className="placeholder-glow">
            <span className="placeholder col-4"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-8"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-7"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-5"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-4"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-5"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </td>
        <td className="text-center">
          <div className="placeholder-glow">
            <span className="placeholder col-8"></span>
          </div>
        </td>
        <td>
          <div className="placeholder-glow">
            <span className="placeholder col-7"></span>
          </div>
        </td>
      </tr>
    ));
  };

  if (!loading && sortedData.length === 0) {
    return (
      <div className="card">
        <div className="card-body p-0">
          <div className="text-center py-8">
            <div className="mb-4">
              <i className="bi bi-telephone display-1 text-muted opacity-50"></i>
            </div>
            <h5 className="text-muted mb-2">
              {searchTerm || hasActiveFilters ? 'No matching call records found' : 'No call records found'}
            </h5>
            <p className="text-muted mb-4">
              {searchTerm || hasActiveFilters
                ? 'Try adjusting your search terms or filters'
                : 'Call records will appear here as they are logged'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body p-0">
        {/* Combined Table Controls and Search Bar */}
        <div className="border-bottom bg-light">
          <div className="row align-items-center px-4 py-3">
            {/* Left Side: Table Controls */}
            <div className="col-md-6">
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
                
                {/* Sort Info */}
                <div className="d-flex align-items-center gap-2 ms-3">
                  <span className="text-muted fw-medium">Sorted by:</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                    {sortField === 'starttime' ? 'Start Time' : 
                     sortField === 'endtime' ? 'End Time' : 
                     sortField === 'leadname' ? 'Lead Name' : 
                     sortField === 'calltype' ? 'Call Type' : sortField}
                    <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                  </span>
                </div>

                {/* Active Filters Indicator */}
                {hasActiveFilters && (
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-warning">
                      <i className="bi bi-funnel me-1"></i>
                      Filters Active
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Search Bar */}
            {showSearch && (
              <div className="col-md-6">
                <div className="d-flex justify-content-end">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="w-100"
                    style={{ maxWidth: '400px' }}
                  >
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        value={localSearchTerm}
                        onChange={handleSearchChange}
                        className="form-control border-start-0"
                        placeholder="Search by telecaller, lead name, mobile..."
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
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        title="Search"
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <span>Search</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filter Results Info */}
          {(showSearch && searchTerm) || hasActiveFilters ? (
            <div className="px-4 py-2 bg-info bg-opacity-10 border-top">
              <div className="row align-items-center">
                <div className="col-12">
                  <div className="d-flex align-items-center gap-2 fs-8">
                    <i className="bi bi-info-circle text-info"></i>
                    <span className="text-muted">
                      Showing <strong className="text-dark">{sortedData.length}</strong> call record
                      {sortedData.length !== 1 ? 's' : ''}
                      {hasActiveFilters && (
                        <span className="ms-2">
                          • Filters: <strong>{getFilterSummary()}</strong>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table
            className="table table-hover align-middle gs-0 gy-2"
            style={{ fontSize: '0.875rem', lineHeight: '1.5' }}
          >
            <thead
              className="table-light text-center"
              style={{ fontSize: '0.9rem', fontWeight: 600 }}
            >
              <tr>
                <th style={{ width: '70px' }}>Sr.No</th>
                
                <SortableHeader field="telecaller">
                  Telecaller
                </SortableHeader>
                
                <SortableHeader field="campaign">
                  Campaign
                </SortableHeader>
                
                <SortableHeader field="leadname">
                  Lead Name
                </SortableHeader>
                
                <SortableHeader field="mobile">
                  Mobile
                </SortableHeader>
                
                <SortableHeader field="starttime">
                  Start Time
                </SortableHeader>
                
                <SortableHeader field="endtime">
                  End Time
                </SortableHeader>
                
                <SortableHeader field="duration">
                  Duration
                </SortableHeader>
                
                <SortableHeader field="calltype">
                  Call Type
                </SortableHeader>
                
                <SortableHeader field="activity">
                  Activity
                </SortableHeader>
                
                <SortableHeader field="status">
                  Status
                </SortableHeader>
                
                <SortableHeader field="remarks">
                  Remarks
                </SortableHeader>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderLoadingRows()
              ) : sortedData.length > 0 ? (
                sortedData.map((item, index) => (
                  <tr key={item.ldmid ?? index}>
                    <td className="text-center fw-semibold">{getRowNumber(index)}</td>
                    <td>{item.telecaller_name || '-'}</td>
                    <td>{item.campaignname || '-'}</td>
                    <td>{item.lead_name || '-'}</td>
                    <td>{item.primary_mobile || '-'}</td>
                    <td>{item.starttime || '-'}</td>
                    <td>{item.endtime || '-'}</td>
                    <td>{formatDuration(item.callduration) || '-'}</td>
                    <td>{item.calltype || '-'}</td>
                    <td>{item.actvity || '-'}</td>
                    <td className="text-center">
                      <div className="status-box">
                        <span>{item.statusname || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{item.followupremark || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="text-center text-muted py-4">
                    <i className="bi bi-telephone fs-2 d-block mb-2 opacity-50"></i>
                    No call records available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sort Info Footer */}
        {sortedData.length > 0 && (
          <div className="card-footer bg-transparent border-top-0">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {sortedData.length} call records
              </small>
              <small className="text-muted">
                Sorted by: <span className="fw-semibold text-capitalize">
                  {sortField === 'starttime' ? 'Start Time' : 
                   sortField === 'endtime' ? 'End Time' : 
                   sortField === 'leadname' ? 'Lead Name' : 
                   sortField === 'calltype' ? 'Call Type' : sortField}
                </span> 
                <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallDetailsTable;