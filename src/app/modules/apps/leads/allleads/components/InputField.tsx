// InputField.tsx
import React from 'react'
import { Form } from 'react-bootstrap'
import { ValidationIndicator } from './ValidationIndicator'

interface ValidationProps {
  isValid: boolean
  message: string
}

interface InputFieldProps {
  label: string
  name: string
  value: string | number | undefined | null
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  type?: string
  as?: 'input' | 'textarea'
  rows?: number
  isRequired?: boolean
  placeholder?: string
  minLength?: number
  maxLength?: number
  disabled?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  validation?: ValidationProps
  isTouched?: boolean
  className?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  as = 'input',
  rows,
  isRequired,
  placeholder,
  minLength,
  maxLength,
  disabled,
  readOnly,
  autoFocus,
  validation,
  isTouched,
  className
}) => {
  const inputValue = value ?? '' // ensures controlled input
  const showError = !!validation && isTouched && !validation.isValid

  return (
    <div className="mb-3">
      <Form.Label className="fw-semibold">
        {label} {isRequired && '*'}
      </Form.Label>
      <Form.Control
        as={as}
        name={name}
        value={inputValue}
        onChange={onChange}
        required={isRequired}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        className={className}
        isInvalid={showError}
        {...(as === 'input' ? { type } : { rows })}
      />
      {showError && validation && (
        <Form.Control.Feedback type="invalid">{validation.message}</Form.Control.Feedback>
      )}
    </div>
  )
}
