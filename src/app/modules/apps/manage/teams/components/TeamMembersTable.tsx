import React, { useState, useEffect } from 'react'
import { Skeleton } from 'antd'
import { TeamMember } from '../core/_models'

interface TeamMembersTableProps {
  members: TeamMember[]
  onRemoveMember: (usermid: number) => void
  loading: boolean
  teamLeaderId?: number
}

export const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onRemoveMember,
  loading,
  teamLeaderId
}) => {
  const [removingMember, setRemovingMember] = useState<number | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true)
    } else {
      const timer = setTimeout(() => setShowSkeleton(false), 500)
      return () => clearTimeout(timer)
    }
  }, [loading])

  const handleRemoveClick = async (usermid: number) => {
    const confirmRemove = window.confirm(
      `Are you sure you want to remove this member from the team?`
    )
    if (!confirmRemove) return

    setRemovingMember(usermid)
    try {
      await onRemoveMember(usermid)
    } catch (error) {
      console.error('Error removing member:', error)
    } finally {
      setRemovingMember(null)
    }
  }

  const isRemoving = (usermid: number) => removingMember === usermid
  const isTeamLeader = (usermid: number) => teamLeaderId === usermid

  // Skeleton rows
  const skeletonData = Array.from({ length: 6 }).map((_, i) => ({ key: i }))

  // Safe members data
  const safeMembers = members.map(member => ({
    ...member,
    user: member.user || {
      usermid: member.usermid,
      username: 'Unknown User',
      usermobile: 'N/A',
      userloginid: 'N/A',
      userstatus: 'Unknown',
      userrole: 'N/A',
      designation: null,
      useremail: 'N/A'
    }
  }))

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th className="ps-4" style={{ width: '80px' }}>Sr.No</th>
            <th>Member Name</th>
            <th>User Role</th>
            <th>Login ID</th>
            <th>Mobile</th>
            <th>Status</th>
            <th className="text-center" style={{ width: '150px' }}>Operation</th>
          </tr>
        </thead>
        <tbody>
          {showSkeleton
            ? skeletonData.map((_, index) => (
                <tr key={index}>
                  <td className="ps-4"><Skeleton.Input active size="small" /></td>
                  <td><Skeleton.Input active size="small" className="w-75" /></td>
                  <td><Skeleton.Input active size="small" className="w-50" /></td>
                  <td><Skeleton.Input active size="small" className="w-50" /></td>
                  <td><Skeleton.Input active size="small" className="w-50" /></td>
                  <td><Skeleton.Input active size="small" className="w-50" /></td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center">
                      <Skeleton.Button active size="small" className="me-2" />
                      <Skeleton.Button active size="small" className="me-2" />
                      <Skeleton.Button active size="small" />
                    </div>
                  </td>
                </tr>
              ))
            : safeMembers.length === 0
            ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  <i className="fas fa-users fa-2x mb-3 d-block"></i>
                  <h5>No members found</h5>
                  <p className="mb-0">Add team members using the form above</p>
                </td>
              </tr>
            )
            : safeMembers.map((member, index) => (
                <tr key={member.usermid}>
                  <td className="ps-4 fw-medium">{index + 1}</td>
                  <td className="fw-semibold">
                    {member.user.username}
                    {isTeamLeader(member.usermid) && (
                      <span className="badge bg-warning ms-2" title="Team Leader">Leader</span>
                    )}
                  </td>
                  <td>{member.user.userrole}</td>
                  <td>{member.user.userloginid}</td>
                  <td>{member.user.usermobile}</td>
                  <td>
                    <span className={`badge ${member.user.userstatus === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                      {member.user.userstatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleRemoveClick(member.usermid)}
                      className="btn btn-danger btn-sm"
                      disabled={loading || isRemoving(member.usermid) || isTeamLeader(member.usermid)}
                      title={
                        isTeamLeader(member.usermid) 
                          ? "Cannot remove team leader" 
                          : "Remove member from team"
                      }
                    >
                      {isRemoving(member.usermid) ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times me-1"></i>
                          {isTeamLeader(member.usermid) ? 'Leader' : 'Remove'}
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  )
}
