import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon: string
  loading?: boolean
  actionText?: string // Add this line
  onAction?: () => void // Add this line
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  icon,
  loading = false,
  actionText, // Add this
  onAction // Add this
}) => {
  if (loading) {
    return (
      <div className={`card bg-light-${color} hoverable`}>
        <div className='card-body'>
          <div className='d-flex align-items-center'>
            <div className='flex-grow-1'>
              <div className='placeholder-glow'>
                <span className='placeholder col-6'></span>
                <span className='placeholder col-4'></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`card bg-light-${color} hoverable`}>
      <div className='card-body'>
        <div className='d-flex align-items-center'>
          <div className='flex-grow-1'>
            <span className='text-gray-900 fw-bolder d-block fs-2x'>{value}</span>
            <span className='text-gray-700 fw-bold fs-6'>{title}</span>
            
            {/* Add action button if provided */}
            {actionText && (
              <button 
                className={`btn btn-sm btn-${color} mt-2`}
                onClick={onAction}
              >
                {actionText}
              </button>
            )}
          </div>
          
          <div className='symbol symbol-50px'>
            <div className={`symbol-label bg-${color}`}>
              <i className={`${icon} fs-2x text-white`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}