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

  if (!loading && data.length === 0) {
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
                
                {/* Active Filters Indicator */}
                {hasActiveFilters && (
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary">
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
                      Showing <strong className="text-dark">{data.length}</strong> call record
                      {data.length !== 1 ? 's' : ''}
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
                <th>Telecaller</th>
                <th>Campaign</th>
                <th>Lead Name</th>
                <th>Mobile</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Call Type</th>
                <th>Activity</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                renderLoadingRows()
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.ldmid ?? index}>
                    <td className="text-center fw-semibold">{getRowNumber(index)}</td>
                    <td>{item.telecaller_name || '-'}</td>
                    <td>{item.campaignname || '-'}</td>
                    <td>{item.lead_name || '-'}</td>
                    <td>{item.primary_mobile || '-'}</td>
                    <td>{item.starttime || '-'}</td>
                    <td>{item.endtime || '-'}</td>
                    <td>{item.callduration || '-'}</td>
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
      </div>
    </div>
  );
};

export default CallDetailsTable;