import React from 'react'
import { TeamMember } from '../core/_models'

interface TeamMembersTableProps {
  members: TeamMember[]
  onRemoveMember: (usermid: number) => void
  loading: boolean
}

export const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onRemoveMember,
  loading
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th className="ps-4" style={{ width: '80px' }}>Sr.No</th>
            <th>Member Name</th>
            <th>User Role</th>
            <th className="text-center" style={{ width: '150px' }}>Operation</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-muted">
                <i className="fas fa-users fa-2x mb-3 d-block"></i>
                <h5>No members found</h5>
                <p className="mb-0">Add team members using the form above</p>
              </td>
            </tr>
          ) : (
            members.map((member, index) => (
              <tr key={member.usermid}>
                <td className="ps-4 fw-medium">{index + 1}</td>
                <td className="fw-semibold">{member.username}</td>
                <td>{member.userrole}</td>
                <td className="text-center">
                  <button
                    onClick={() => onRemoveMember(member.usermid)}
                    className="btn btn-outline-danger btn-sm"
                    disabled={loading}
                    title="Remove member"
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <>
                        <i className="fas fa-times me-1"></i>
                        Remove
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}