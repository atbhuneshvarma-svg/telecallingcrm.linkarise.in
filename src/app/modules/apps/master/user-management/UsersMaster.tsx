// UsersMaster.tsx
import React, { useEffect, useState } from 'react'
import UserModal from './UserModal'
import UsersList from './UsersList'
import { userApi } from './core/_requests'
import { User, PaginationInfo } from './core/_models'

const UsersMaster = () => {
  // State for server-side pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 1
  })

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User>({
    usermid: 0,
    username: '',
    userloginid: '',
    userpassword: '',
    useremail: '',
    usermobile: '',
    userrole: 'telecaller',
    usertype: 'User',
    userstatus: 'Active',
    designation: '',
    detail: '',
    avatar: 'avatars/300-6.jpg',
    cmpmid: undefined,
    initials: { label: '', state: 'primary' }
  })
  const [loading, setLoading] = useState(false)

  // Fetch users when page or entries per page changes
  useEffect(() => {
    fetchUsers()
  }, [currentPage, entriesPerPage])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await userApi.getUsersPaginated(currentPage, entriesPerPage)
      console.log(response.data);

      setUsers(response.data)
      setPagination({
        current_page: response.current_page,
        per_page: response.per_page,
        total_records: response.total_records,
        total_pages: response.total_pages
      })
    } catch (error) {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value)
    setEntriesPerPage(newPerPage)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddOrUpdateUser = async () => {
    if (!currentUser.username.trim() || !currentUser.useremail.trim()) return;

    try {
      if (modalMode === "add") {
        await userApi.createUser({
          username: currentUser.username,
          userloginid: currentUser.userloginid,
          userpassword: currentUser.userpassword,
          useremail: currentUser.useremail,
          usermobile: currentUser.usermobile,
          userrole: currentUser.userrole,
          usertype: currentUser.usertype, // ✅ ADD THIS
          userstatus: currentUser.userstatus,
          designation: currentUser.designation,
          detail: currentUser.detail,
          avatar: currentUser.avatar,
          cmpmid: currentUser.cmpmid,
          initials: currentUser.initials
        });
        fetchUsers();
      } else {
        await userApi.updateUser(currentUser.usermid, {
          username: currentUser.username,
          userloginid: currentUser.userloginid,
          userpassword: currentUser.userpassword,
          useremail: currentUser.useremail,
          usermobile: currentUser.usermobile,
          userrole: currentUser.userrole,
          usertype: currentUser.usertype, // ✅ ADD THIS
          userstatus: currentUser.userstatus,
          designation: currentUser.designation,
          detail: currentUser.detail,
          avatar: currentUser.avatar,
          cmpmid: currentUser.cmpmid,
          initials: currentUser.initials
        });
        fetchUsers();
      }

      setCurrentUser({
        usermid: 0,
        username: '',
        userloginid: '',
        userpassword: '',
        useremail: '',
        usermobile: '',
        userrole: 'telecaller',
        usertype: 'User', // ✅ ADD DEFAULT VALUE
        userstatus: 'Active',
        designation: '',
        detail: '',
        avatar: 'avatars/300-6.jpg',
        cmpmid: undefined,
        initials: { label: '', state: 'primary' }
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEditUser = (user: User) => {
    setModalMode('edit')
    setCurrentUser(user)
    setShowModal(true)
  }

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      await userApi.deleteUser(id)
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleAddNew = () => {
    setModalMode('add')
    setCurrentUser({
      usermid: 0,
      username: '',
      userloginid: '',
      userpassword: '',
      useremail: '',
      usermobile: '',
      userrole: 'telecaller',
      usertype: 'User',
      userstatus: 'Active',
      designation: '',
      detail: '',
      avatar: 'avatars/300-6.jpg',
      cmpmid: undefined,
      initials: { label: '', state: 'primary' }
    })
    setShowModal(true)
  }

  // Client-side filtering for search
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.useremail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userloginid.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : []

  const displayedUsers = Array.isArray(filteredUsers)
    ? filteredUsers
    : []

  return (
    <div className="container-fluid py-4">
      {/* Main Card */}
      <div className="card shadow-sm">
        {/* Card Header - Fixed Layout */}
        <div className="card-header bg-transparent py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h4 fw-bold mb-1">User Master</h1>
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle"></i>
            Add User
          </button>
        </div>

        {/* Card Body */}
        <div className="card-body">
          {/* Controls Card */}
          <div className="card card-flat mb-4">
            <div className="card-body py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label mb-0 text-muted">Show</label>
                    <select
                      value={entriesPerPage}
                      onChange={handleEntriesChange}
                      className="form-select form-select-sm w-auto"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                    <label className="form-label mb-0 text-muted">entries</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2 justify-content-md-end">
                    <label className="form-label mb-0 text-muted">Search:</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control form-control-sm"
                      />
                      <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-2 text-muted"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users List Card */}
          <div className="card">
            <div className="card-body p-0">
             
                <UsersList
                  users={displayedUsers}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  loading={loading}
                />
            </div>
          </div>

          {/* Footer Card */}
          <div className="card card-flat mt-4">
            <div className="card-body py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  Showing {displayedUsers.length} of {pagination.total_records} entries
                  {searchTerm && ` (filtered from ${users.length} entries on this page)`}
                </div>

                {/* Pagination Controls */}
                {pagination.total_pages > 1 && (
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-muted small">
                      Page {pagination.current_page} of {pagination.total_pages}
                    </div>
                    <nav>
                      <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                          >
                            Previous
                          </button>
                        </li>

                        {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                          <li
                            key={page}
                            className={`page-item ${pagination.current_page === page ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.total_pages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Moved outside the main card */}
      <UserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        user={currentUser}
        setUser={setCurrentUser}
        onSubmit={handleAddOrUpdateUser}
      />
    </div>
  )
}

export default UsersMaster