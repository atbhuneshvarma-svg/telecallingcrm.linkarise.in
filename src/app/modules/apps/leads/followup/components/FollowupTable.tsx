import React, { useMemo, useState } from 'react';
import { FollowupLead } from '../core/_models';
import { useStatuses } from '../../allleads/core/LeadsContext';

interface FollowupTableProps {
  data: FollowupLead[];
  loading: boolean;
  currentPage?: number;
  entriesPerPage?: number;
  onStatusClick?: (lead: FollowupLead) => void;
  onCallClick?: (lead: FollowupLead) => void;
  onViewClick?: (lead: FollowupLead) => void;
  onEditClick?: (lead: FollowupLead) => void;
  onEntriesPerPageChange?: (perPage: number) => void;
  onSearch?: (searchTerm: string) => void;
  showingFrom?: number;
  showingTo?: number;
  totalRecords?: number;
  showSearch?: boolean;
  searchTerm?: string;
}

type SortField = 'name' | 'assigned' | 'campaign' | 'phone' | 'status' | 'details' | 'followupdate'
type SortDirection = 'asc' | 'desc'

const FollowupTable: React.FC<FollowupTableProps> = ({
  data,
  loading,
  currentPage = 1,
  entriesPerPage = 10,
  onStatusClick,
  onCallClick,
  onViewClick,
  onEditClick,
  onEntriesPerPageChange,
  onSearch,
  showingFrom = 0,
  showingTo = 0,
  totalRecords = 0,
  showSearch = true,
  searchTerm = '',
}) => {
  const { statuses } = useStatuses();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [sortField, setSortField] = useState<SortField>('followupdate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // If onSearch callback is provided, call it for server-side search
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
  };

  // Handle entries per page change
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPage = Number(e.target.value);
    onEntriesPerPageChange?.(perPage);
  };

  // Handle sort - CLIENT-SIDE ONLY (since server doesn't support sorting)
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
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
      <div className="d-flex align-items-center">
        {children}
        <SortIndicator field={field} />
      </div>
    </th>
  );

  // Memoized status color mapping
  const statusColorMap = useMemo(() => {
    const map = new Map();
    statuses.forEach((status) => {
      map.set(status.statusname.toLowerCase(), status.statuscolor);
    });
    return map;
  }, [statuses]);

  const getStatusColor = (statusName: string): string => {
    return statusColorMap.get((statusName || '').toLowerCase()) || '#6c757d';
  };

  // Format phone number
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '-';
    if (phone.length === 10) {
      return `${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  // Handle call button click
  const handleCallClick = (lead: FollowupLead, e: React.MouseEvent) => {
    e.stopPropagation();
    onCallClick?.(lead);
  };

  // ✅ REMOVED CLIENT-SIDE FILTERING - Use server data directly
  // Only apply client-side sorting since server doesn't support it
  const sortedLeads = useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';

      switch (sortField) {
        case 'name':
          aValue = (a.leadname || 'Unnamed Lead').toLowerCase();
          bValue = (b.leadname || 'Unnamed Lead').toLowerCase();
          break;
        case 'assigned':
          aValue = (a.username || 'Unassigned').toLowerCase();
          bValue = (b.username || 'Unassigned').toLowerCase();
          break;
        case 'campaign':
          aValue = (a.campaignname || 'N/A').toLowerCase();
          bValue = (b.campaignname || 'N/A').toLowerCase();
          break;
        case 'phone':
          aValue = a.phone || '';
          bValue = b.phone || '';
          break;
        case 'status':
          aValue = (a.statusname || 'N/A').toLowerCase();
          bValue = (b.statusname || 'N/A').toLowerCase();
          break;
        case 'details':
          aValue = (a.detail || 'No details provided').toLowerCase();
          bValue = (b.detail || 'No details provided').toLowerCase();
          break;
        case 'followupdate':
          aValue = a.followupdate ? new Date(a.followupdate).getTime() : 0;
          bValue = b.followupdate ? new Date(b.followupdate).getTime() : 0;
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

  // Use sorted leads for display
  const displayLeads = sortedLeads;

  // Calculate row numbers
  const getRowNumber = (index: number) => {
    return (currentPage - 1) * entriesPerPage + index + 1;
  };

  // Loading skeleton rows
  const renderLoadingRows = () => {
    return [...Array(entriesPerPage)].map((_, index) => (
      <tr key={`loading-${index}`}>
        <td className="ps-4">
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
      </tr>
    ));
  };

  if (!loading && data.length === 0) {
    return (
      <div className="card">
        <div className="card-body p-0">
          <div className="text-center py-8">
            <div className="mb-4">
              <i className="bi bi-inbox display-1 text-muted opacity-50"></i>
            </div>
            <h5 className="text-muted mb-2">
              {localSearchTerm ? 'No matching follow-up leads found' : 'No follow-up leads found'}
            </h5>
            <p className="text-muted mb-4">
              {localSearchTerm
                ? 'Try adjusting your search terms'
                : 'Try adjusting your filters or search criteria'}
            </p>
            {localSearchTerm && (
              <button className="btn btn-primary" onClick={handleSearchClear}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Clear Search
              </button>
            )}
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
                
                {/* Records Info */}
                <div className="d-flex align-items-center gap-2 ms-3">
                  <span className="text-muted fw-medium">
                    Showing {showingFrom} to {showingTo} of {totalRecords}
                  </span>
                </div>

                {/* Sort Info */}
                {displayLeads.length > 0 && (
                  <div className="d-flex align-items-center gap-2 ms-3">
                    <span className="text-muted fw-medium">Sorted by:</span>
                    <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                      {sortField === 'followupdate' ? 'Follow-up Date' : sortField}
                      <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
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
                        placeholder="Search follow-up leads by name, phone, email..."
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
                      Showing <strong className="text-dark">{displayLeads.length}</strong> follow-up
                      lead{displayLeads.length !== 1 ? 's' : ''}
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

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle gs-0 gy-2">
            <thead className="bg-light">
              <tr>
                <th className="ps-4" style={{ width: '60px' }}>
                  <span className="text-muted fw-semibold fs-7">#</span>
                </th>
                
                <SortableHeader field="name" className="min-w-150px">
                  <span className="text-muted fw-semibold fs-7">Lead Information</span>
                </SortableHeader>
                
                <SortableHeader field="assigned" className="min-w-120px">
                  <span className="text-muted fw-semibold fs-7">Assigned To</span>
                </SortableHeader>
                
                <SortableHeader field="campaign" className="min-w-120px">
                  <span className="text-muted fw-semibold fs-7">Campaign</span>
                </SortableHeader>
                
                <SortableHeader field="phone" className="min-w-130px">
                  <span className="text-muted fw-semibold fs-7">Contact Info</span>
                </SortableHeader>
                
                <SortableHeader field="status" className="min-w-120px text-center">
                  <span className="text-muted fw-semibold fs-7">Status</span>
                </SortableHeader>
                
                <SortableHeader field="details" className="min-w-150px">
                  <span className="text-muted fw-semibold fs-7">Details</span>
                </SortableHeader>
                
                <SortableHeader field="followupdate" className="min-w-120px">
                  <span className="text-muted fw-semibold fs-7">Follow-up Date</span>
                </SortableHeader>
              </tr>
            </thead>

            <tbody className="border-top-0">
              {loading
                ? renderLoadingRows()
                : displayLeads.map((lead, index) => (
                    <tr
                      key={lead.leadmid ?? index}
                      className="lead-row transition-all"
                      style={{
                        cursor: onViewClick ? 'pointer' : 'default',
                        transition: 'all 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        if (onViewClick) {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (onViewClick) {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {/* Row Number */}
                      <td className="ps-4">
                        <span className="text-muted fs-8 fw-medium">{getRowNumber(index)}</span>
                      </td>

                      {/* Lead Information */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="symbol symbol-45px me-3 transition-all"
                            style={{
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <div
                              className="symbol-label bg-light-primary d-flex align-items-center justify-content-center"
                              style={{
                                borderRadius: '10px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              }}
                            >
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
                              className="fw-bold text-gray-800 cursor-pointer transition-all"
                              onClick={() => onViewClick?.(lead)}
                              style={{
                                cursor: onViewClick ? 'pointer' : 'default',
                                transition: 'color 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (onViewClick) {
                                  e.currentTarget.style.color = '#009ef7';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (onViewClick) {
                                  e.currentTarget.style.color = '#3f4254';
                                }
                              }}
                            >
                              {lead.leadname || 'Unnamed Lead'}
                            </span>
                            {lead.email && (
                              <div className="text-muted fs-8 mt-1 d-flex align-items-center gap-1">
                                <i className="bi bi-envelope text-primary"></i>
                                <span className="text-truncate" style={{ maxWidth: '200px' }}>
                                  {lead.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Assigned User */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="d-flex flex-column">
                            <span
                              className="fw-semibold text-gray-700"
                              style={{ fontSize: '0.875rem' }}
                            >
                              {lead.username || 'Unassigned'}
                            </span>
                            {!lead.username && (
                              <span className="text-muted fs-9 mt-1">Not assigned</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Campaign */}
                      <td>
                        <span
                          className="badge px-3 py-2 transition-all"
                          style={{
                            backgroundColor: 'rgba(54, 153, 255, 0.1)',
                            color: '#3699ff',
                            border: '1px solid rgba(54, 153, 255, 0.2)',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(54, 153, 255, 0.2)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(54, 153, 255, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <i className="bi bi-megaphone me-1"></i>
                          {lead.campaignname || 'N/A'}
                        </span>
                      </td>

                      {/* Contact Information */}
                      <td>
                        <div className="d-flex flex-column gap-1">
                          {lead.phone && (
                            <div className="d-flex align-items-center gap-1">
                              <i className="bi bi-telephone text-success fs-8"></i>
                              <a
                                href={`tel:${lead.phone}`}
                                className="text-gray-700 text-decoration-none fs-8 transition-all"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#009ef7';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = '#3f4254';
                                }}
                              >
                                {formatPhoneNumber(lead.phone)}
                              </a>
                            </div>
                          )}
                          {!lead.phone && (
                            <span className="text-muted fs-8 d-flex align-items-center gap-1">
                              <i className="bi bi-telephone-x"></i>
                              No phone
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="text-center">
                        <button
                          className="btn btn-status border-0 bg-transparent p-0 transition-all"
                          onClick={() => onStatusClick?.(lead)}
                          style={{
                            cursor: onStatusClick ? 'pointer' : 'default',
                            transition: 'all 0.2s ease',
                          }}
                          disabled={loading}
                          title={onStatusClick ? 'Click to change status' : 'Status'}
                        >
                          <span
                            className="badge rounded-pill fw-semibold d-inline-flex align-items-center gap-2 px-3 py-2 transition-all"
                            style={{
                              backgroundColor: getStatusColor(lead.statusname || ''),
                              color: '#fff',
                              minWidth: '110px',
                              fontSize: '0.75rem',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                              border: '2px solid transparent',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (onStatusClick) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (onStatusClick) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                                e.currentTarget.style.borderColor = 'transparent';
                              }
                            }}
                          >
                            <i className="bi bi-circle-fill fs-9" style={{ opacity: 0.9 }}></i>
                            {lead.statusname || 'N/A'}
                            {onStatusClick && (
                              <i className="bi bi-pencil fs-9 ms-1" style={{ opacity: 0.8 }}></i>
                            )}
                          </span>
                        </button>
                      </td>

                      {/* Details */}
                      <td>
                        <div className="d-flex flex-column">
                          <span
                            className="text-gray-600 fs-8 line-clamp-2"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {lead.detail || 'No details provided'}
                          </span>
                          {lead.leadremarks && (
                            <small
                              className="text-muted fs-9 mt-1 d-flex align-items-center gap-1 transition-all"
                              style={{
                                transition: 'color 0.2s ease',
                                }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#009ef7';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#7e8299';
                              }}
                            >
                              <i className="bi bi-chat-left-text"></i>
                              <span className="text-truncate" style={{ maxWidth: '180px' }}>
                                {lead.leadremarks}
                              </span>
                            </small>
                          )}
                        </div>
                      </td>

                      {/* Follow-up Date */}
                      <td>
                        {lead.followupdate ? (
                          <div className="d-flex flex-column">
                            <span
                              className="fw-semibold text-gray-800 transition-all"
                              style={{
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#009ef7';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#3f4254';
                              }}
                            >
                              {new Date(lead.followupdate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {new Date(lead.followupdate) < new Date() && (
                              <span
                                className="badge bg-danger fs-9 mt-1 px-2 py-1 transition-all"
                                style={{
                                  borderRadius: '4px',
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                Overdue
                              </span>
                            )}
                          </div>
                        ) : (
                          <span
                            className="text-muted fs-8 d-flex align-items-center gap-1 transition-all"
                            style={{
                              transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#009ef7';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#7e8299';
                            }}
                          >
                            <i className="bi bi-calendar-x"></i>
                            Not set
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Sort Info Footer */}
        {displayLeads.length > 0 && (
          <div className="card-footer bg-transparent border-top-0">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {showingFrom} to {showingTo} of {totalRecords} entries
              </small>
              <small className="text-muted">
                Sorted by: <span className="fw-semibold text-capitalize">
                  {sortField === 'followupdate' ? 'Follow-up Date' : sortField}
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

export default React.memo(FollowupTable);