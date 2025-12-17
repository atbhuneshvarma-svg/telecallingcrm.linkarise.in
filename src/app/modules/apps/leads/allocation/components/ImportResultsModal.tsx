// components/ImportResultsModal.tsx
import React from 'react'

interface ImportResult {
  row: number
  email: string
  phone: string
  message: string
}

interface ImportError {
  row: number
  field?: string
  message: string
}

interface ImportResultsModalProps {
  show: boolean
  onClose: () => void
  results: {
    imported: number
    duplicates: ImportResult[]
    errors: ImportError[]
  } | null
}

export const ImportResultsModal: React.FC<ImportResultsModalProps> = ({
  show,
  onClose,
  results
}) => {
  if (!show || !results) return null

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Import Results</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {/* Summary */}
            <div className="alert alert-info mb-4">
              <h6 className="alert-heading">Import Summary</h6>
              <p className="mb-0">
                <strong>Successfully Imported:</strong> {results.imported} leads
              </p>
            </div>

            {/* Duplicates */}
            {results.duplicates.length > 0 && (
              <div className="mb-4">
                <h6 className="text-warning mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Duplicates Found: {results.duplicates.length}
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead className="table-warning">
                      <tr>
                        <th>Row</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.duplicates.map((dup, index) => (
                        <tr key={index}>
                          <td>{dup.row}</td>
                          <td>{dup.email}</td>
                          <td>{dup.phone}</td>
                          <td className="text-danger">{dup.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Errors */}
            {results.errors.length > 0 && (
              <div className="mb-4">
                <h6 className="text-danger mb-3">
                  <i className="bi bi-x-circle me-2"></i>
                  Errors: {results.errors.length}
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead className="table-danger">
                      <tr>
                        <th>Row</th>
                        <th>Field</th>
                        <th>Error Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.errors.map((error, index) => (
                        <tr key={index}>
                          <td>{error.row}</td>
                          <td>{error.field || 'N/A'}</td>
                          <td className="text-danger">{error.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Success message when no issues */}
            {results.imported > 0 && results.duplicates.length === 0 && results.errors.length === 0 && (
              <div className="alert alert-success">
                <i className="bi bi-check-circle me-2"></i>
                All {results.imported} leads were successfully imported!
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}