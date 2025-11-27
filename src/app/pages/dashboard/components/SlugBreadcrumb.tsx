import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { KTIcon } from '../../../../_metronic/helpers'

interface SlugBreadcrumbProps {
  className?: string
}

const SlugBreadcrumb: React.FC<SlugBreadcrumbProps> = ({ className = '' }) => {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(segment => segment)

  // Map path segments to display names
  const getDisplayName = (segment: string): string => {
    const nameMap: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'leads': 'Leads',
      'notifications': 'Notifications',
      'settings': 'Settings',
      'profile': 'Profile',
      'builder': 'Layout Builder',
      'apps': 'Apps',
      'master': 'Master',
      'purpose': 'Purpose',
      'status': 'Status',
    }
    return nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  return (
    <div className={`d-flex align-items-center gap-2 text-gray-600 fs-6 ${className}`}>
      {/* Home - Always muted */}
      <Link to="/dashboard" className="text-muted text-hover-primary">
      </Link>
      
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <KTIcon iconName="arrow-right" className="text-muted fs-4" />
          
          {index === pathSegments.length - 1 ? (
            // Current page - glowing/active
            <span className="text-gray-800 fw-bold">
              {getDisplayName(segment)}
            </span>
          ) : (
            // Parent pages - muted
            <Link 
              to={`/${pathSegments.slice(0, index + 1).join('/')}`}
              className="text-muted text-hover-primary"
            >
              {getDisplayName(segment)}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default SlugBreadcrumb