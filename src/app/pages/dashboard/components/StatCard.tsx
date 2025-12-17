interface StatCardProps {
  title: string
  value: string | number
  color: string
  icon: string
  loading?: boolean
  actionText?: string
  onAction?: () => void
  onClick?: () => void   // Add onClick for card click
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  icon,
  loading = false,
  actionText,
  onAction,
  onClick
}) => {
  if (loading) {
    return (
      <div className={`card bg-light-${color} hoverable`}>
        <div className='card-body'>
          <div className='placeholder-glow'>
            <span className='placeholder col-6 mb-2'></span>
            <span className='placeholder col-4'></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`card bg-light-${color} hoverable`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className='card-body'>
        <div className='d-flex align-items-center'>
          <div className='flex-grow-1'>
            <span className='text-gray-900 fw-bolder d-block fs-2x'>
              {value}
            </span>
            <span className='text-gray-700 fw-bold fs-6'>
              {title}
            </span>

            {actionText && (
              <button
                className={`btn btn-sm btn-${color} mt-2`}
                onClick={e => {
                  e.stopPropagation()  // Prevent card onClick when button clicked
                  onAction?.()
                }}
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
