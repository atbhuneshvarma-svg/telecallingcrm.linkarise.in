import React from 'react';

interface TableHeaderControlsProps {
  showTableControls: boolean;
  showSearch: boolean;
  loading: boolean;
  entriesPerPage: number;
  localSearchTerm: string;
  onEntriesChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSearchClear: () => void;
  displayLeads: any[];
  leads: any[];
  showingFrom?: number;
  showingTo?: number;
  totalRecords?: number;
}

export const TableHeaderControls: React.FC<TableHeaderControlsProps> = ({
  showTableControls,
  showSearch,
  loading,
  entriesPerPage,
  localSearchTerm,
  onEntriesChange,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  displayLeads,
  leads,
}) => {
  return (
    <div className="leads-table-header">
      {(showTableControls || showSearch) && (
        <div className="border-bottom">
          <div className="row align-items-center px-3 py-1">
            {showTableControls && (
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted fw-medium">Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={onEntriesChange}
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

            {showSearch && (
              <div className={`col-md-6 ${!showTableControls ? 'col-12' : ''}`}>
                <div className="d-flex justify-content-end">
                  <form onSubmit={onSearchSubmit} className="w-100" style={{ maxWidth: '400px' }}>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        value={localSearchTerm}
                        onChange={onSearchChange}
                        className="form-control border-start-0"
                        placeholder="Search leads by name, email, phone, campaign..."
                        disabled={loading}
                      />
                      {localSearchTerm && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary border"
                          onClick={onSearchClear}
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
                        onClick={onSearchClear}
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
    </div>
  );
};