import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Add this import
import { Team } from '../core/_models'
import { useTeamManagement } from '../hooks/useTeamManagement'
import DeleteModal from './DeleteModal'
import CreateEditModal from './CreateEditModal'

export const TeamTable: React.FC = () => {
  const navigate = useNavigate() // Add this hook
  
  const {
    teams,
    loading,
    error,
    totalRecords,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    deleteTeam,
    refetch,
  } = useTeamManagement(10)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [createEditModalOpen, setCreateEditModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleDeleteClick = (team: Team) => {
    setSelectedTeam(team)
    setDeleteModalOpen(true)
  }

  const handleEditClick = (team: Team) => {
    setSelectedTeam(team)
    setIsEditing(true)
    setCreateEditModalOpen(true)
  }

  const handleCreateClick = () => {
    setSelectedTeam(null)
    setIsEditing(false)
    setCreateEditModalOpen(true)
  }

  // Updated: Use React Router navigation
  const handleViewClick = (team: Team) => {
    navigate(`${team.tmid}`) // This will navigate to /manage/teams/123 internally
  }

  const handleDeleteConfirm = async () => {
    if (selectedTeam) {
      try {
        await deleteTeam(selectedTeam.tmid)
        setDeleteModalOpen(false)
        setSelectedTeam(null)
        refetch()
      } catch (err) {
        console.error('Error deleting team:', err)
      }
    }
  }

  const handleModalSuccess = () => {
    setCreateEditModalOpen(false)
    setSelectedTeam(null)
    refetch()
  }

  const startRecord = (currentPage - 1) * 10 + 1
  const endRecord = Math.min(currentPage * 10, totalRecords)

  return (
    <div className="container-fluid p-6">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 text-gray-800">Team Master</h1>
        <button
          onClick={handleCreateClick}
          className="btn btn-primary d-flex align-items-center"
        >
          <i className="fas fa-plus me-2"></i>
          Add Team
        </button>
      </div>

      {/* Controls */}
      <div className="row mb-4">
        <div className="col-md-6">
          <span className="text-muted">Show 10 entries</span>
        </div>
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Team or Leader..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card shadow">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Sr.No</th>
                  <th>Team Name</th>
                  <th>Leader</th>
                  <th className="text-center">Operations</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <div
                          className="spinner-border spinner-border-sm text-primary me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Loading teams...</span>
                      </div>
                    </td>
                  </tr>
                ) : teams.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      <i className="fas fa-users fa-2x mb-3 d-block"></i>
                      <h5>No teams found</h5>
                      <p className="mb-3">
                        {searchTerm
                          ? 'Try adjusting your search terms'
                          : 'Get started by creating your first team'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={handleCreateClick}
                          className="btn btn-primary"
                        >
                          <i className="fas fa-plus me-2"></i>
                          Add Team
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  teams.map((team, index) => (
                    <tr key={team.tmid}>
                      <td className="ps-4 fw-medium">{startRecord + index}</td>
                      <td className="fw-semibold">{team.teamname}</td>
                      <td>{team.leader.username}</td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            title="View team"
                            onClick={() => handleViewClick(team)} // Updated: Use the new handler
                          >
                            <i className="fas fa-eye me-1"></i>
                            View
                          </button>
                          <button
                            onClick={() => handleEditClick(team)}
                            className="btn btn-outline-success btn-sm me-2"
                            title="Edit team"
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(team)}
                            className="btn btn-outline-danger btn-sm"
                            title="Delete team"
                          >
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="text-muted">
          Showing {startRecord} to {endRecord} of {totalRecords} entries
        </div>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Modals */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        teamName={selectedTeam?.teamname || ''}
      />

      <CreateEditModal
        isOpen={createEditModalOpen}
        onClose={() => setCreateEditModalOpen(false)}
        onSuccess={handleModalSuccess}
        team={selectedTeam}
        isEditing={isEditing}
      />
    </div>
  )
}