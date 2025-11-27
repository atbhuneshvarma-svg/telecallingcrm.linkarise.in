import React from 'react';
import { Lead } from '../../../core/_models';

interface ActionsColumnProps {
  lead: Lead;
  loading: boolean;
  deletingId: number | null;
  onViewClick: (lead: Lead) => void;
  onEditClick: (lead: Lead) => void;
  onDeleteClick: (lead: Lead) => void;
}

export const ActionsColumn: React.FC<ActionsColumnProps> = ({
  lead,
  loading,
  deletingId,
  onViewClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
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
          onClick={() => onDeleteClick(lead)}
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
  );
};