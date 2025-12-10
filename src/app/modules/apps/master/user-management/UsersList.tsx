import React, { useEffect, useState } from 'react'
import { Table, Skeleton, Dropdown, Menu } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { User } from './core/_models'

interface UsersListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: number) => void
  loading?: boolean
}

const UsersList: React.FC<UsersListProps> = ({ users, onEdit, onDelete, loading = false }) => {
  const [showSkeleton, setShowSkeleton] = useState(true)

  // Smooth skeleton fade-in logic
  useEffect(() => {
    if (loading) {
      setShowSkeleton(true)
    } else {
      const timer = setTimeout(() => setShowSkeleton(false), 500)
      return () => clearTimeout(timer)
    }
  }, [loading])

  // Skeleton placeholder rows
  const skeletonData = Array.from({ length: 6 }).map((_, i) => ({
    key: i,
  }))

  const columns: ColumnsType<User | any> = [
    {
      title: 'Sr.No',
      width: 80,
      render: (_row, _record, index) =>
        showSkeleton ? <Skeleton.Input active size="small" /> : index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'username',
      render: (_text, row: User) =>
        showSkeleton ? (
          <div className="d-flex align-items-center">
            <Skeleton.Avatar active size="large" shape="circle" className="me-3" />
            <Skeleton.Input active size="small" className="w-50" />
          </div>
        ) : (
          <div className="d-flex align-items-center px-2 py-2">
            <div className="symbol symbol-40px symbol-circle me-3">
              <div className={`symbol-label bg-light-${row.initials?.state || 'primary'}`}>
                <span className="text-uppercase fs-7">
                  {row.initials?.label || row.username.charAt(0)}
                </span>
              </div>
            </div>
            <div className="d-flex flex-column">
              <span className="fw-bold text-gray-800">{row.username}</span>
              <span className="text-muted fs-8">{row.designation}</span>
            </div>
          </div>
        ),
    },
    {
      title: 'Email',
      dataIndex: 'useremail',
      render: (text) =>
        showSkeleton ? <Skeleton.Input active size="small" className="w-75" /> : text,
    },
    {
      title: 'Login ID',
      dataIndex: 'userloginid',
      render: (text) =>
        showSkeleton ? <Skeleton.Input active size="small" className="w-50" /> : text,
    },
    {
      title: 'Type',
      dataIndex: 'userrole',
      render: (role) =>
        showSkeleton ? (
          <Skeleton.Input active size="small" className="w-50" />
        ) : (
          <span className="badge badge-light-primary">{role}</span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'userstatus',
      render: (status) =>
        showSkeleton ? (
          <Skeleton.Input active size="small" className="w-50" />
        ) : (
          <span className="badge badge-light-success">{status}</span>
        ),
    },
    {
      title: 'Actions',
      fixed: 'right',
      render: (_text, row: User) =>
        showSkeleton ? (
          <Skeleton.Button active size="small" className="float-end" />
        ) : (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => onEdit(row)}>
                  <i className="bi bi-pencil me-2"></i>Edit
                </Menu.Item>
                <Menu.Item danger onClick={() => onDelete(row.usermid)}>
                  <i className="bi bi-trash me-2"></i>Delete
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <button className="btn btn-sm btn-light btn-active-light-primary">
              Actions <i className="bi bi-chevron-down ms-2"></i>
            </button>
          </Dropdown>
        ),
    },
  ]

  return (
    <div className="card">
      <div className="card-body p-0">
        <Table
          columns={columns}
          dataSource={showSkeleton ? skeletonData : users.map((u) => ({ ...u, key: u.usermid }))}
          pagination={false}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: showSkeleton ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <div className="py-10 text-center">
                <i className="bi bi-people fs-2x text-muted mb-2"></i>
                <div className="text-muted">No users found</div>
              </div>
            ),
          }}
        />
      </div>
    </div>
  )
}

export default UsersList
