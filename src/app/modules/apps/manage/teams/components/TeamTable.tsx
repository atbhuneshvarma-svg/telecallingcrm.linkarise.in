import React, { useState, useEffect } from 'react'
import { Table, Skeleton, } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { Team } from '../core/_models'
import { useTeamManagement } from '../hooks/useTeamManagement'
import DeleteModal from './DeleteModal'
import CreateEditModal from './CreateEditModal'

export const TeamTable: React.FC = () => {
  const navigate = useNavigate()

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

  // Skeleton fade-in
  const [showSkeleton, setShowSkeleton] = useState(true)
  useEffect(() => {
    if (loading) {
      setShowSkeleton(true)
    } else {
      const timer = setTimeout(() => setShowSkeleton(false), 500)
      return () => clearTimeout(timer)
    }
  }, [loading])

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [createEditModalOpen, setCreateEditModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isEditing, setIsEditing] = useState(false)

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

  const handleViewClick = (team: Team) => {
    navigate(`${team.tmid}`)
  }

  const handleDeleteClick = (team: Team) => {
    setSelectedTeam(team)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedTeam) {
      await deleteTeam(selectedTeam.tmid)
      setDeleteModalOpen(false)
      refetch()
    }
  }

  const handleModalSuccess = () => {
    setCreateEditModalOpen(false)
    refetch()
  }

  // Skeleton rows
  const skeletonData = Array.from({ length: 6 }).map((_, i) => ({ key: i }))

  // Columns
  const columns: ColumnsType<any> = [
    {
      title: 'Sr.No',
      width: 80,
      render: (_t, _r, index) =>
        showSkeleton ? <Skeleton.Input active size="small" /> : (currentPage - 1) * 10 + index + 1,
    },
    {
      title: 'Team Name',
      dataIndex: 'teamname',
      render: (text) =>
        showSkeleton ? (
          <Skeleton.Input active size="small" className="w-75" />
        ) : (
          <span className="fw-semibold">{text}</span>
        ),
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      render: (leader) =>
        showSkeleton ? (
          <Skeleton.Input active size="small" className="w-50" />
        ) : (
          leader?.username
        ),
    },
    {
      title: <div className="text-center text-end ">Operations</div>, // header aligned right
      fixed: 'right',
      render: (_text, team: Team) =>
        showSkeleton ? (
          <div className="d-flex justify-content-center">
            <Skeleton.Button active size="small" className="me-2" />
            <Skeleton.Button active size="small" className="me-2" />
            <Skeleton.Button active size="small" />
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary btn-sm me-2"
              title="View team"
              onClick={() => handleViewClick(team)}
            >
              <i className="fas fa-eye me-1"></i>View
            </button>
            <button
              className="btn btn-success btn-sm me-2"
              title="Edit team"
              onClick={() => handleEditClick(team)}
            >
              <i className="fas fa-edit me-1"></i>Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              title="Delete team"
              onClick={() => handleDeleteClick(team)}
            >
              <i className="fas fa-trash me-1"></i>Delete
            </button>
          </div>
        ),
    },]

  return (
    <div className="container-fluid p-6">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0 text-gray-800">Team Master</h1>
        <button onClick={handleCreateClick} className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Add Team
        </button>
      </div>

      {/* Search */}
      <div className="d-flex justify-content-between mb-4">
        <span className="text-muted">Show 10 entries</span>
        <div className="input-group" style={{ width: 300 }}>
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

      {/* Table */}
      <div className="card shadow">
        <div className="card-body p-0">
          <Table
            columns={columns}
            dataSource={
              showSkeleton
                ? skeletonData
                : teams.map((team) => ({ ...team, key: team.tmid }))
            }
            pagination={false}
            scroll={{ x: 'max-content' }}
            locale={{
              emptyText: showSkeleton ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <div className="py-10 text-center text-muted">
                  <i className="bi bi-people fs-2x mb-2"></i>
                  <div>No teams found</div>
                </div>
              ),
            }}
          />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Showing {(currentPage - 1) * 10 + 1} to{' '}
            {Math.min(currentPage * 10, totalRecords)} of {totalRecords} entries
          </div>

          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}

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
