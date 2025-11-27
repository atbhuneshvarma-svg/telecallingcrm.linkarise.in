import React from 'react';

interface BulkActionsBarProps {
  selectable: boolean;
  selectedLeads: number[];
  displayLeads: any[];
  onBulkAction: (leadIds: number[], action: string) => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectable,
  selectedLeads,
  displayLeads,
  onBulkAction
}) => {
  if (!selectable || selectedLeads.length === 0) return null;

  return (
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
                  onClick={() => onBulkAction(selectedLeads, 'export')}
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
                  onClick={() => onBulkAction(selectedLeads, 'assign')}
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
                  onClick={() => onBulkAction(selectedLeads, 'status')}
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
                  onClick={() => onBulkAction(selectedLeads, 'delete')}
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
            onClick={() => onBulkAction(selectedLeads, 'clear')}
            title="Clear selection"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
};