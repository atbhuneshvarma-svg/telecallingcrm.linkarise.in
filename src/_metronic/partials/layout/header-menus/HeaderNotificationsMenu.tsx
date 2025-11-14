import clsx from 'clsx'
import {FC, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import { Notification, notificationsApi } from '../../../../app/modules/auth/core/_requests'

const HeaderNotificationsMenu: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('updates')

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await notificationsApi.getNotifications(1, 10) // Fixed method name
      if (res.result) {
        setNotifications(res.data || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

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
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Get notification icon and color
  const getNotificationConfig = (type: string, isRead: number) => {
    const config = {
      lead: { icon: 'person-plus', color: 'primary', bg: 'light-primary' },
      system: { icon: 'setting', color: 'info', bg: 'light-info' },
      alert: { icon: 'shield-cross', color: 'warning', bg: 'light-warning' },
      message: { icon: 'message-text', color: 'success', bg: 'light-success' }
    }

    const defaultConfig = { icon: 'notification', color: 'dark', bg: 'light-dark' }
    return config[type as keyof typeof config] || defaultConfig
  }

  // Filter notifications by type
  const leadNotifications = notifications.filter(n => n.type === 'lead')
  const unreadCount = notifications.filter(n => n.is_read === 0).length

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column w-400px w-lg-475px'
      data-kt-menu='true'
    >
      {/* Header */}
      <div className='d-flex flex-column bgi-no-repeat rounded-top' style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className='d-flex justify-content-between align-items-center px-9 pt-7 pb-5'>
          <div>
            <h3 className='text-white fw-bold mb-2'>Notifications</h3>
            <div className='text-white opacity-75'>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </div>
          </div>
          <div className='symbol symbol-50px'>
            <div className='symbol-label bg-white bg-opacity-20'>
              <KTIcon iconName='notification-bing' className='text-white fs-2' />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className='nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-bold px-9'>
          <li className='nav-item'>
            <a
              className={`nav-link text-white opacity-75 opacity-state-100 pb-4 ${activeTab === 'updates' ? 'active' : ''}`}
              onClick={() => setActiveTab('updates')}
              style={{cursor: 'pointer'}}
            >
              Updates
              {leadNotifications.length > 0 && (
                <span className='badge badge-circle badge-sm bg-white text-primary ms-2'>
                  {leadNotifications.length}
                </span>
              )}
            </a>
          </li>
          <li className='nav-item'>
            <a
              className={`nav-link text-white opacity-75 opacity-state-100 pb-4 ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
              style={{cursor: 'pointer'}}
            >
              Alerts
            </a>
          </li>
          <li className='nav-item'>
            <a
              className={`nav-link text-white opacity-75 opacity-state-100 pb-4 ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
              style={{cursor: 'pointer'}}
            >
              Activity
            </a>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className='tab-content'>
        {/* Updates Tab */}
        <div className={`tab-pane fade ${activeTab === 'updates' ? 'show active' : ''}`}>
          <div className='scroll-y mh-350px my-5 px-8'>
            {loading ? (
              <div className='text-center py-8'>
                <div className='spinner-border text-primary' role='status'>
                  <span className='visually-hidden'>Loading...</span>
                </div>
                <div className='text-muted mt-3'>Loading notifications...</div>
              </div>
            ) : leadNotifications.length === 0 ? (
              <div className='text-center py-8'>
                <KTIcon iconName='check-circle' className='fs-2x text-success opacity-50 mb-3' />
                <div className='text-muted'>No new notifications</div>
                <div className='text-muted fs-8 mt-1'>You're all caught up!</div>
              </div>
            ) : (
              leadNotifications.map((notification) => {
                const config = getNotificationConfig(notification.type, notification.is_read)
                return (
                  <div 
                    key={notification.notimid} 
                    className={clsx(
                      'd-flex flex-stack py-4 transition-all rounded-3 px-3',
                      notification.is_read === 0 && 'bg-light-primary bg-opacity-10'
                    )}
                  >
                    <div className='d-flex align-items-center flex-grow-1'>
                      <div className='symbol symbol-40px me-4'>
                        <span className={clsx('symbol-label', config.bg)}>
                          <KTIcon iconName={config.icon} className={clsx('fs-3', `text-${config.color}`)} />
                        </span>
                      </div>

                      <div className='flex-grow-1 me-3'>
                        <div className='fw-bold text-gray-800 mb-1'>{notification.title}</div>
                        <div className='text-gray-600 fs-7'>{notification.message}</div>
                        <div className='text-gray-400 fs-8 mt-1'>
                          {formatDate(notification.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className='d-flex flex-column align-items-end'>
                      {/* Removed mark as read button since we don't have the endpoint */}
                      <span className={clsx(
                        'badge fs-8 fw-semibold',
                        notification.is_read === 0 ? 'badge-light-primary' : 'badge-light'
                      )}>
                        {notification.is_read === 0 ? 'New' : 'Read'}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {leadNotifications.length > 0 && (
            <div className='py-3 text-center border-top bg-light'>
              <Link
                to='/notifications'
                className='btn btn-color-gray-700 btn-active-color-primary btn-sm'
              >
                View All Notifications
                <KTIcon iconName='arrow-right' className='fs-5 ms-2' />
              </Link>
            </div>
          )}
        </div>

        {/* Alerts Tab */}
        <div className={`tab-pane fade ${activeTab === 'alerts' ? 'show active' : ''}`}>
          <div className='d-flex flex-column align-items-center text-center py-10 px-8'>
            <KTIcon iconName='shield-tick' className='fs-2x text-success opacity-50 mb-3' />
            <h4 className='text-gray-800 fw-bold mb-2'>No Active Alerts</h4>
            <p className='text-gray-600 fs-6'>
              You're all set! No urgent alerts at this time.
            </p>
          </div>
        </div>

        {/* Activity Tab */}
        <div className={`tab-pane fade ${activeTab === 'activity' ? 'show active' : ''}`}>
          <div className='d-flex flex-column align-items-center text-center py-10 px-8'>
            <KTIcon iconName='chart-simple' className='fs-2x text-info opacity-50 mb-3' />
            <h4 className='text-gray-800 fw-bold mb-2'>Activity Summary</h4>
            <p className='text-gray-600 fs-6 mb-4'>
              Recent system activity and performance metrics
            </p>
            <div className='w-100'>
              <div className='d-flex justify-content-between text-gray-600 fs-7 mb-2'>
                <span>Leads Processed</span>
                <span className='fw-bold text-gray-800'>1,897</span>
              </div>
              <div className='d-flex justify-content-between text-gray-600 fs-7 mb-2'>
                <span>Team Activity</span>
                <span className='fw-bold text-gray-800'>Active</span>
              </div>
              <div className='d-flex justify-content-between text-gray-600 fs-7'>
                <span>System Status</span>
                <span className='fw-bold text-success'>Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {HeaderNotificationsMenu}