import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Modal, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap'
import { useLeads } from '../core/LeadsContext'
import { useLeadActions } from '../core/useLeadActions'
import { useToast } from '../hooks/useToast'
import { CreateLeadRequest, Lead, UpdateLeadRequest } from '../core/_models'

interface AddEditLeadModalProps {
  show: boolean
  onHide: () => void
  onLeadAdded: () => void
  leadToEdit?: Lead
}

interface LeadFormData {
  campaignmid: number
  purposemid: number
  sourceofinquirymid: number
  activityname: string
  statusname: string
  statusmid: number
  usermid: number
  name: string
  phone: string
  email: string
  address: string
}

const initialFormData: LeadFormData = {
  campaignmid: 0,
  purposemid: 0,
  sourceofinquirymid: 0,
  activityname: '',
  statusname: '',
  statusmid: 0,
  usermid: 0,
  name: '',
  phone: '',
  email: '',
  address: '',
}

// Real-time validation indicators
const ValidationIndicator: React.FC<{
  isValid: boolean
  message: string
  isTouched: boolean
}> = ({ isValid, message, isTouched }) => {
  if (!isTouched) return null
  
  return (
    <div className={`d-flex align-items-center mt-1 ${isValid ? 'text-success' : 'text-danger'}`}>
      <i className={`bi ${isValid ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-1`}></i>
      <small className="fs-8">{message}</small>
    </div>
  )
}

export const AddEditLeadModal: React.FC<AddEditLeadModalProps> = ({
  show,
  onHide,
  onLeadAdded,
  leadToEdit
}) => {
  const { dropdowns, loading: dropdownsLoading, error: contextError } = useLeads()
  const { createLead, updateLead, isCreating } = useLeadActions()
  const { showError, showSuccess } = useToast()
  const [formData, setFormData] = useState<LeadFormData>(initialFormData)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState<Set<keyof LeadFormData>>(new Set())
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSave, setAutoSave] = useState(false)

  // Enhanced dropdown data with proper fallbacks
  const statuses = dropdowns?.statuses || []
  const campaigns = dropdowns?.campaigns || []
  const purposes = dropdowns?.purposes || []
  const sources = dropdowns?.sources || []
  const activities = dropdowns?.activities || []
  const users = dropdowns?.users || []

  // Enhanced form population with proper activity field mapping
  useEffect(() => {
    if (leadToEdit) {
      console.log('Editing lead:', leadToEdit)
      
      // Enhanced status matching
      const foundStatus = statuses.find(s => 
        s.statusmid === leadToEdit.statusmid || 
        s.statusname?.toLowerCase() === leadToEdit.statusname?.toLowerCase()
      )

      setFormData({
        campaignmid: leadToEdit.cmpmid || leadToEdit.campaignmid || 0,
        purposemid: leadToEdit.purposemid || 0,
        sourceofinquirymid: leadToEdit.sourceofinquirymid || 0,
        // FIXED: Use 'activity' instead of 'activityname' from Lead type
        activityname: leadToEdit.activity || '',
        statusname: foundStatus?.statusname || leadToEdit.statusname || '',
        statusmid: foundStatus?.statusmid || leadToEdit.statusmid || 0,
        usermid: leadToEdit.usermid || 0,
        name: leadToEdit.leadname || leadToEdit.name || '',
        phone: leadToEdit.phone || '',
        email: leadToEdit.email || '',
        address: leadToEdit.address || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setError('')
    setTouched(new Set())
  }, [leadToEdit, show, statuses])

  // Real-time field validation
  const fieldValidations = useMemo(() => ({
    name: {
      isValid: formData.name.trim().length >= 2,
      message: formData.name.trim().length >= 2 ? 'Name looks good' : 'Name must be at least 2 characters'
    },
    phone: {
      isValid: /^[0-9]{10}$/.test(formData.phone),
      message: /^[0-9]{10}$/.test(formData.phone) ? 'Valid phone number' : 'Must be 10 digits'
    },
    email: {
      isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      message: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Valid email' : 'Enter valid email'
    },
    address: {
      isValid: formData.address.trim().length >= 10,
      message: formData.address.trim().length >= 10 ? 'Address looks good' : 'Address seems too short'
    },
    campaignmid: {
      isValid: formData.campaignmid > 0,
      message: formData.campaignmid > 0 ? 'Campaign selected' : 'Please select campaign'
    },
    statusmid: {
      isValid: formData.statusmid > 0,
      message: formData.statusmid > 0 ? 'Status selected' : 'Please select status'
    }
  }), [formData])

  // Enhanced change handler with auto-save indicator
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const fieldName = name as keyof LeadFormData
    
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    setTouched(prev => new Set(prev).add(fieldName))
    
    // Show auto-save indicator
    setAutoSave(true)
    setTimeout(() => setAutoSave(false), 2000)
  }

  // Enhanced status change handler
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value)
    const selectedStatus = statuses.find(s => s.statusmid === selectedValue)
    
    setFormData(prev => ({
      ...prev,
      statusmid: selectedValue,
      statusname: selectedStatus?.statusname || ''
    }))
    setTouched(prev => new Set(prev).add('statusmid'))
    setAutoSave(true)
    setTimeout(() => setAutoSave(false), 2000)
  }

  // Enhanced form validation
  const validateForm = (): boolean => {
    const requiredFields = [
      { field: 'name', value: formData.name.trim(), label: 'Name' },
      { field: 'phone', value: formData.phone.trim(), label: 'Phone' },
      { field: 'email', value: formData.email.trim(), label: 'Email' },
      { field: 'address', value: formData.address.trim(), label: 'Address' },
      { field: 'campaignmid', value: formData.campaignmid, label: 'Campaign' },
      { field: 'statusmid', value: formData.statusmid, label: 'Status' },
    ]
    
    const missingFields = requiredFields.filter(f => !f.value)
    
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.map(f => f.label).join(', ')}`)
      return false
    }

    if (!fieldValidations.phone.isValid) {
      setError('Phone number must be exactly 10 digits')
      return false
    }

    if (!fieldValidations.email.isValid) {
      setError('Please enter a valid email address')
      return false
    }

    setError('')
    return true
  }

  // Enhanced submit handler with success feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      let result
      if (leadToEdit) {
        const updatePayload: UpdateLeadRequest = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          campaignmid: formData.campaignmid,
          purposemid: formData.purposemid,
          sourceofinquirymid: formData.sourceofinquirymid,
          // FIXED: Use 'activity' for update payload
          activity: formData.activityname,
          statusmid: formData.statusmid,
          statusname: formData.statusname,
          usermid: formData.usermid,
        }

        result = await updateLead({ id: leadToEdit.leadmid, data: updatePayload })
        showSuccess('Lead updated successfully!')
      } else {
        const payload: CreateLeadRequest = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          campaignmid: formData.campaignmid,
          purposemid: formData.purposemid,
          sourceofinquirymid: formData.sourceofinquirymid,
          activityname: formData.activityname,
          statusname: formData.statusname,
          statusmid: formData.statusmid,
          usermid: formData.usermid,
          detail: '',
          leadremarks: '',
          cmpmid: 1,
          companymid: 1,
          followup: 0,
          iscalled: 0,
          extra_field1: null,
          extra_field2: null,
          extra_field3: null,
        }

        result = await createLead(payload)
        showSuccess('Lead created successfully!')
      }
      
      setLastSaved(new Date())
      onLeadAdded()
      handleClose()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit lead'
      setError(errorMessage)
      showError(errorMessage)
    }
  }

  const handleClose = useCallback(() => {
    setFormData(initialFormData)
    setError('')
    setTouched(new Set())
    setAutoSave(false)
    onHide()
  }, [onHide])

  const isFieldInvalid = (fieldName: keyof LeadFormData): boolean => {
    return touched.has(fieldName) && !formData[fieldName]
  }

  const displayError = error || (contextError instanceof Error ? contextError.message : String(contextError || ''))

  // Calculate form completion percentage
  const completionPercentage = useMemo(() => {
    const totalFields = Object.keys(fieldValidations).length
    const completedFields = Object.values(fieldValidations).filter(v => v.isValid).length
    return Math.round((completedFields / totalFields) * 100)
  }, [fieldValidations])

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <Modal.Title className="fs-4 fw-bold text-gray-800">
              {leadToEdit ? 'Edit Lead' : 'Add New Lead'}
              {autoSave && (
                <Badge bg="warning" className="ms-2 fs-3">
                  <i className="bi bi-cloud-arrow-up me-1"></i>
                  Saving...
                </Badge>
              )}
            </Modal.Title>
            {lastSaved && (
              <small className="text-muted">
                Last saved: {lastSaved.toLocaleTimeString()}
              </small>
            )}
          </div>
          <div className="text-end">
            <div className="d-flex align-items-center">
              <small className="text-muted me-2">Completion:</small>
              <div className="progress" style={{width: '80px', height: '6px'}}>
                <div 
                  className={`progress-bar ${completionPercentage === 100 ? 'bg-success' : 'bg-primary'}`}
                  role="progressbar" 
                  style={{width: `${completionPercentage}%`}}
                ></div>
              </div>
              <small className="text-muted ms-2">{completionPercentage}%</small>
            </div>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="pt-0">
        {dropdownsLoading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5 className="text-muted">Loading form data...</h5>
            <p className="text-muted">Preparing your lead management form</p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit} noValidate>
            {displayError && (
              <Alert variant="danger" className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{displayError}</div>
              </Alert>
            )}

            {/* FIXED: Using regular div with Bootstrap grid classes instead of Row component */}
            <div className="row">
              {/* Campaign */}
              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold d-flex align-items-center">
                  Campaign *
                  {touched.has('campaignmid') && fieldValidations.campaignmid.isValid && (
                    <i className="bi bi-check-circle-fill text-success ms-1 fs-6"></i>
                  )}
                </Form.Label>
                <Form.Select
                  name="campaignmid"
                  value={formData.campaignmid}
                  onChange={handleChange}
                  isInvalid={isFieldInvalid('campaignmid')}
                  required
                >
                  <option value="">Select Campaign</option>
                  {campaigns.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </Form.Select>
                <ValidationIndicator
                  isValid={fieldValidations.campaignmid.isValid}
                  message={fieldValidations.campaignmid.message}
                  isTouched={touched.has('campaignmid')}
                />
              </div>

              {/* Purpose */}
              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold">Purpose</Form.Label>
                <Form.Select
                  name="purposemid"
                  value={formData.purposemid}
                  onChange={handleChange}
                >
                  <option value="">Select Purpose</option>
                  {purposes.map(purpose => (
                    <option key={purpose.id} value={purpose.id}>
                      {purpose.name}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Source */}
              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold">Source</Form.Label>
                <Form.Select
                  name="sourceofinquirymid"
                  value={formData.sourceofinquirymid}
                  onChange={handleChange}
                >
                  <option value="">Select Source</option>
                  {sources.map(source => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Activity */}
              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold">Activity</Form.Label>
                <Form.Select
                  name="activityname"
                  value={formData.activityname}
                  onChange={handleChange}
                >
                  <option value="">Select Activity</option>
                  {activities.map((activity, index) => (
                    <option key={activity.activitymid || index} value={activity.activityname}>
                      {activity.activityname}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Status */}
              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold d-flex align-items-center">
                  Status *
                  {touched.has('statusmid') && fieldValidations.statusmid.isValid && (
                    <i className="bi bi-check-circle-fill text-success ms-1 fs-6"></i>
                  )}
                </Form.Label>
                <Form.Select
                  name="statusmid"
                  value={formData.statusmid}
                  onChange={handleStatusChange}
                  isInvalid={isFieldInvalid('statusmid')}
                  required
                >
                  <option value="">Select Status</option>
                  {statuses.map((status, index) => (
                    <option
                      key={index}
                      value={status.statusmid || ''}
                    >
                      {status.statusname || 'Unnamed Status'}
                    </option>
                  ))}
                </Form.Select>
                <ValidationIndicator
                  isValid={fieldValidations.statusmid.isValid}
                  message={fieldValidations.statusmid.message}
                  isTouched={touched.has('statusmid')}
                />
              </div>

              {/* Assigned To */}
              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold">Assigned To</Form.Label>
                <Form.Select
                  name="usermid"
                  value={formData.usermid}
                  onChange={handleChange}
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.usermid} value={user.usermid}>
                      {user.username}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* Name */}
              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold d-flex align-items-center">
                  Name *
                  {touched.has('name') && fieldValidations.name.isValid && (
                    <i className="bi bi-check-circle-fill text-success ms-1 fs-6"></i>
                  )}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={isFieldInvalid('name')}
                  placeholder="Enter lead name"
                  required
                />
                <ValidationIndicator
                  isValid={fieldValidations.name.isValid}
                  message={fieldValidations.name.message}
                  isTouched={touched.has('name')}
                />
              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold d-flex align-items-center">
                  Phone *
                  {touched.has('phone') && fieldValidations.phone.isValid && (
                    <i className="bi bi-check-circle-fill text-success ms-1 fs-6"></i>
                  )}
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="^[0-9]{10}$"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  isInvalid={isFieldInvalid('phone')}
                  required
                />
                <ValidationIndicator
                  isValid={fieldValidations.phone.isValid}
                  message={fieldValidations.phone.message}
                  isTouched={touched.has('phone')}
                />
              </div>

              {/* Email */}
              <div className="col-12 mb-3">
                <Form.Label className="fw-semibold d-flex align-items-center">
                  Email *
                  {touched.has('email') && fieldValidations.email.isValid && (
                    <i className="bi bi-check-circle-fill text-success ms-1 fs-6"></i>
                  )}
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  isInvalid={isFieldInvalid('email')}
                  required
                />
                <ValidationIndicator
                  isValid={fieldValidations.email.isValid}
                  message={fieldValidations.email.message}
                  isTouched={touched.has('email')}
                />
              </div>

              {/* Address */}
              <div className="col-12 mb-3">
                <Form.Label className="fw-semibold d-flex align-items-center">
                  Address *
                  {touched.has('address') && fieldValidations.address.isValid && (
                    <i className="bi bi-check-circle-fill text-success ms-1 fs-6"></i>
                  )}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  isInvalid={isFieldInvalid('address')}
                  required
                />
                <ValidationIndicator
                  isValid={fieldValidations.address.isValid}
                  message={fieldValidations.address.message}
                  isTouched={touched.has('address')}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
              <div>
                <small className="text-muted">
                  {completionPercentage === 100 ? '✅ Form ready to submit' : 'Fill all required fields'}
                </small>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={handleClose}
                  disabled={isCreating}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isCreating || completionPercentage < 100}
                >
                  {isCreating ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {leadToEdit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className={`bi ${leadToEdit ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>
                      {leadToEdit ? 'Update Lead' : 'Create Lead'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  )
}