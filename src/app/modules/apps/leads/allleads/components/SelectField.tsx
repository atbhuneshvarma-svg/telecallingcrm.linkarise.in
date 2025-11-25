import React from 'react'
import { Form } from 'react-bootstrap'

interface SelectFieldProps {
  label: string
  name: string
  value: any
  options: { value: any; label: string }[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  isRequired?: boolean
  validation?: { isValid: boolean; message: string }
  isTouched?: boolean
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  isRequired,
  validation,
  isTouched
}) => {
  const showError = !!validation && isTouched && !validation.isValid
  const selectValue = value ?? ''

  return (
    <div className="mb-3">
      <Form.Label className="fw-semibold">
        {label} {isRequired && '*'}
      </Form.Label>
      <Form.Select
        name={name}
        value={selectValue}
        onChange={onChange}
        required={isRequired}
        isInvalid={showError}
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Form.Select>
      {showError && validation && (
        <Form.Control.Feedback type="invalid">{validation.message}</Form.Control.Feedback>
      )}
    </div>
  )
}
