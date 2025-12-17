import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Table, Badge, Button, Spinner, Row, Col, Form } from 'react-bootstrap'
import { KTIcon } from '../../../../_metronic/helpers'
import { Notification } from '../../../modules/auth/core/_models'
import { notificationsApi } from '../../../modules/auth/core/_requests'

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // Fetch notifications
  const fetchNotifications = async (page: number = 1) => {
    setLoading(true)
    try {
      const response = await notificationsApi.getNotifications(page, perPage)
      if (response.result) {
        setNotifications(response.data || [])
        setCurrentPage(response.current_page)
        setTotalRecords(response.total_records)
        setTotalPages(response.total_pages)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications(currentPage)
  }, [currentPage, perPage])

  // Filter notifications
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => n.is_read === 0)
    : notifications

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get notification icon and color
  const getNotificationConfig = (type: string) => {
    const config = {
      lead: { icon: 'person-plus', color: 'primary', bg: 'primary' },
      system: { icon: 'setting', color: 'info', bg: 'info' },
      alert: { icon: 'shield-cross', color: 'warning', bg: 'warning' },
      message: { icon: 'message-text', color: 'success', bg: 'success' }
    }

    const defaultConfig = { icon: 'notification', color: 'secondary', bg: 'secondary' }
    return config[type as keyof typeof config] || defaultConfig
  }

  // Mark as read (if you have the endpoint)
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      // If you have mark as read endpoint, implement here
      // await notificationsApi.markAsRead(notificationId)
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.notimid === notificationId ? { ...n, is_read: 1 } : n
        )
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      // If you have mark all as read endpoint, implement here
      // await notificationsApi.markAllAsRead()
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: 1 }))
      )
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <Button
            variant="outline-primary"
            className="page-link"
            onClick={() => setCurrentPage(i)}
            disabled={currentPage === i}
          >
            {i}
          </Button>
        </li>
      )
    }

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <Button
              variant="outline-primary"
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
          </li>
          {pages}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <Button
              variant="outline-primary"
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </li>
        </ul>
      </nav>
    )
  }

  const unreadCount = notifications.filter(n => n.is_read === 0).length

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="page-header d-flex flex-column justify-content-center gap-2 pt-8 pb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/dashboard" className="btn btn-icon btn-light btn-sm">
            <KTIcon iconName="arrow-left" className="fs-2" />
          </Link>
          <div className='text-center'>
            <h1 className="text-gray-800 fw-bold mb-1">Notifications</h1>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-6">
        <Col md={4}>
          <Card className="card-flush border-0 bg-primary bg-opacity-10">
            <Card.Body className="py-5">
              <div className="d-flex align-items-center">
                <KTIcon iconName="notification-bing" className="text-primary fs-2hx me-3" />
                <div>
                  <div className="fs-4 fw-bold text-gray-800">{totalRecords}</div>
                  <div className="text-muted">Total Notifications</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-flush border-0 bg-warning bg-opacity-10">
            <Card.Body className="py-5">
              <div className="d-flex align-items-center">
                <KTIcon iconName="message-unread" className="text-warning fs-2hx me-3" />
                <div>
                  <div className="fs-4 fw-bold text-gray-800">{unreadCount}</div>
                  <div className="text-muted">Unread Notifications</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-flush border-0 bg-success bg-opacity-10">
            <Card.Body className="py-5">
              <div className="d-flex align-items-center">
                <KTIcon iconName="check-circle" className="text-success fs-2hx me-3" />
                <div>
                  <div className="fs-4 fw-bold text-gray-800">{totalRecords - unreadCount}</div>
                  <div className="text-muted">Read Notifications</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Notifications Card */}
      <Card className="card-flush shadow-sm">
        <Card.Header className="border-0 pt-6">
          <div className="card-title">
            <h3 className="fw-bold text-gray-800">All Notifications</h3>
          </div>
          <div className="card-toolbar">
            <div className="d-flex align-items-center gap-3">
              {/* Filter */}
              <Form.Select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
                className="w-auto"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
              </Form.Select>

              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <Button
                  variant="outline-primary"
                  onClick={handleMarkAllAsRead}
                  className="d-flex align-items-center gap-2"
                >
                  <KTIcon iconName="check-all" className="fs-4" />
                  Mark All as Read
                </Button>
              )}

              {/* Entries Per Page */}
              <Form.Select 
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="w-auto"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </Form.Select>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="pt-0">
          {loading ? (
            <div className="text-center py-10">
              <Spinner animation="border" variant="primary" />
              <div className="text-muted mt-3">Loading notifications...</div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-10">
              <KTIcon iconName="check-circle" className="fs-2x text-success opacity-50 mb-3" />
              <h4 className="text-gray-800 fw-bold mb-2">No notifications found</h4>
              <p className="text-muted">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "No notifications available at the moment."
                }
              </p>
            </div>
          ) : (
            <>
              {/* Notifications Table */}
              <div className="table-responsive">
                <Table className="table align-middle table-row-dashed fs-6 gy-5">
                  <thead>
                    <tr className="text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                      <th className="min-w-250px">Notification</th>
                      <th className="min-w-100px">Type</th>
                      <th className="min-w-100px">Status</th>
                      <th className="min-w-150px">Date & Time</th>
                      <th className="min-w-100px text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="fw-semibold text-gray-600">
                    {filteredNotifications.map((notification) => {
                      const config = getNotificationConfig(notification.type)
                      return (
                        <tr key={notification.notimid}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="symbol symbol-40px me-4">
                                <span className={`symbol-label bg-light-${config.bg}`}>
                                  <KTIcon 
                                    iconName={config.icon} 
                                    className={`fs-3 text-${config.color}`} 
                                  />
                                </span>
                              </div>
                              <div>
                                <div className="fw-bold text-gray-800 mb-1">
                                  {notification.title}
                                </div>
                                <div className="text-gray-600">
                                  {notification.message}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg={config.bg} className="text-capitalize">
                              {notification.type}
                            </Badge>
                          </td>
                          <td>
                            <Badge 
                              bg={notification.is_read === 0 ? 'warning' : 'success'}
                            >
                              {notification.is_read === 0 ? 'Unread' : 'Read'}
                            </Badge>
                          </td>
                          <td>
                            <div className="text-gray-600">
                              {formatDate(notification.created_at)}
                            </div>
                          </td>
                          <td className="text-end">
                            {notification.is_read === 0 && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.notimid)}
                                className="d-flex align-items-center gap-1"
                              >
                                <KTIcon iconName="check" className="fs-5" />
                                Mark Read
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default NotificationsPage