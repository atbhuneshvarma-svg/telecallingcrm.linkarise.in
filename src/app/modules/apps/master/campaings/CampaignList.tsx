import React from 'react'
import { Campaign } from './core/_request'

interface CampaignListProps {
  campaigns: Campaign[]
  onEdit: (campaign: Campaign) => void
  onDelete: (id: number) => void
  loading?: boolean
}

// Skeleton loader component
const CampaignListSkeleton = () => (
  <div className="card shadow-sm">
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-bordered table-hover mb-0">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="px-4 py-3 text-uppercase font-sm text-muted">#</th>
              <th className="px-4 py-3 text-uppercase font-sm text-muted">Campaign Name</th>
              <th className="px-4 py-3 text-uppercase font-sm text-muted">Campaign Date</th>
              <th className="px-4 py-3 text-uppercase font-sm text-muted">Operations</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="align-middle">
                <td className="px-4 py-3">
                  <div className="skeleton-loading h-20px w-30px"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="skeleton-loading h-25px w-150px"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="skeleton-loading h-20px w-100px"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="skeleton-loading h-32px w-120px"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

const CampaignList: React.FC<CampaignListProps> = ({ 
  campaigns, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  if (loading) {
    return <CampaignListSkeleton />
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        {/* Desktop Table */}
        <div className="d-none d-lg-block">
          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">#</th>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">Campaign Name</th>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">Campaign Date</th>
                  <th className="px-4 py-3 text-uppercase font-sm text-muted">Operations</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length > 0 ? (
                  campaigns.map((campaign, index) => (
                    <tr key={campaign.id} className="align-middle">
                      <td className="px-4 py-3 fw-semibold">{index + 1}</td>
                      <td className="px-4 py-3">
                        <span className="badge bg-light text-dark fs-6">{campaign.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted">
                          {new Date(campaign.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-outline-success"
                            onClick={() => onEdit(campaign)}
                            title="Edit Campaign"
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => onDelete(campaign.id)}
                            title="Delete Campaign"
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-15">
                      <div className="d-flex flex-column align-items-center">
                        <i className="bi bi-megaphone fs-2x text-gray-400 mb-3"></i>
                        <span className="text-gray-600 fs-5 fw-semibold mb-2">No campaigns found</span>
                        <span className="text-muted fs-7">Try adjusting your search or add a new campaign</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="d-lg-none">
          {campaigns.length === 0 ? (
            <div className="text-center py-10">
              <i className="bi bi-megaphone fs-2x text-muted mb-2"></i>
              <span className="text-muted fs-6 d-block">No campaigns found</span>
            </div>
          ) : (
            <div className="row g-3 p-3">
              {campaigns.map((campaign, index) => (
                <div key={campaign.id} className="col-12">
                  <div className="card card-flat border">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-50px symbol-circle me-3 bg-light-primary">
                            <div className="symbol-label text-primary">
                              <i className="bi bi-megaphone fs-4"></i>
                            </div>
                          </div>
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-gray-800">{campaign.name}</span>
                            <span className="text-muted fs-7">#{index + 1}</span>
                          </div>
                        </div>
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-light" 
                            type="button" 
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => onEdit(campaign)}
                              >
                                <i className="bi bi-pencil me-2"></i>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item text-danger" 
                                onClick={() => onDelete(campaign.id)}
                              >
                                <i className="bi bi-trash me-2"></i>
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="row g-2">
                        <div className="col-12">
                          <small className="text-muted">Campaign Date</small>
                          <div className="fw-semibold">
                            {new Date(campaign.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="row g-2 mt-3">
                        <div className="col-6">
                          <button
                            className="btn btn-outline-success btn-sm w-100"
                            onClick={() => onEdit(campaign)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                        </div>
                        <div className="col-6">
                          <button
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={() => onDelete(campaign.id)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampaignList