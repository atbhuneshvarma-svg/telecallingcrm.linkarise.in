// ValidationIndicator.tsx
import React from 'react'

interface ValidationIndicatorProps {
  isValid: boolean
  message: string
  isTouched: boolean
}

export const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({ isValid, message, isTouched }) => {
  if (!isTouched) return null
  return (
    <div className={`d-flex align-items-center mt-1 ${isValid ? 'text-success' : 'text-danger'}`}>
      <i className={`bi ${isValid ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-1`}></i>
      <small className="fs-8">{message}</small>
    </div>
  )
}
