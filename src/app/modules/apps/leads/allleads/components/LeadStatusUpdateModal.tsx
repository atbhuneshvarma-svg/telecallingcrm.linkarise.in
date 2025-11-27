import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Modal, Button, Form, Spinner, Row, Col, Card, Alert, Badge } from 'react-bootstrap'
import { Lead } from '../core/_models'
import { leadApi } from '../core/_request'
import { useLeads } from '../core/LeadsContext'
import { useToast } from '../hooks/useToast'
import { FreshLead } from '../../fressleads/core/_models'

interface LeadStatusUpdateModalProps {
  show: boolean
  onHide: () => void
  lead: Lead | FreshLead | null
  onStatusUpdated: () => void
}

interface FormData {
  statusname: string
  activityname: string
  followupremark: string
  followup: boolean
  followupdate: string
  isclient: boolean
}

const LeadStatusUpdateModal: React.FC<LeadStatusUpdateModalProps> = ({
  show,
  onHide,
  lead,
  onStatusUpdated,
}) => {
  const { showSuccess, showError } = useToast()
  const { dropdowns, loading: dropdownsLoading } = useLeads()

  const [formData, setFormData] = useState<FormData>({
    statusname: '',
    activityname: '',
    followupremark: '',
    followup: true,
    followupdate: '',
    isclient: false
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  // Memoized current date and time
  const currentDateTime = useMemo(() => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5)

    // Calculate end time (30 minutes from now)
    const endTime = new Date(now.getTime() + 30 * 60000)
    const endTimeString = endTime.toTimeString().split(' ')[0].substring(0, 5)

    return { today, currentTime, endTimeString }
  }, [])

  // Memoized status and activity options
  const statusOptions = useMemo(() =>
    dropdowns?.statuses?.filter(s => s.statusname) || [],
    [dropdowns?.statuses]
  )

  const activityOptions = useMemo(() =>
    dropdowns?.activities?.filter(a => a.activityname) || [],
    [dropdowns?.activities]
  )
  const selectedStatus = statusOptions.find(status => status.statusname === formData.statusname);

  const isStatusNEW = selectedStatus?.statusname.toLowerCase() === 'new';
  // Reset form when modal opens/closes or lead changes
  useEffect(() => {
    if (show && lead) {
      const defaultActivity = activityOptions[0]?.activityname || ''

      setFormData({
        statusname: lead.statusname || '',
        activityname: defaultActivity,
        followupremark: '',
        followup: true,
        followupdate: currentDateTime.today,
        isclient: false
      })

      setErrors({})
      setTouched(new Set())
    }
  }, [show, lead, activityOptions, currentDateTime])

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.statusname.trim()) {
      newErrors.statusname = 'Status is required'
    }

    if (!formData.activityname.trim()) {
      newErrors.activityname = 'Activity type is required'
    }


    // Validate time logic
    if (formData.followup && !formData.followupdate) {
      newErrors.followupdate = 'Follow-up date is required when follow-up is enabled'
    }

    if (formData.followupremark.length > 500) {
      newErrors.followupremark = 'Remark cannot exceed 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Handle field changes
  const handleFieldChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => new Set(prev).add(field))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lead) return

    // Validate form
    if (!validateForm()) {
      showError('Please fix the validation errors before submitting.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        leadmid: lead.leadmid,
        followup: formData.followup ? 1 : 0,
        followupremark: formData.followupremark,
        followupdate: formData.followup ? formData.followupdate : '',
        statusname: formData.statusname,
        activityname: formData.activityname,
        // API expects starttime and endtime — provide current times or empty strings when not scheduling follow-up
        starttime: formData.followup ? currentDateTime.currentTime : '',
        endtime: formData.followup ? currentDateTime.endTimeString : '',
        mobileno: lead.phone || '',
        isclient: formData.isclient ? 1 : 0,
      }

      console.log('Submitting payload:', payload)
      const response = await leadApi.updateLeadStatus(payload)

      if (response.result || response.message?.toLowerCase().includes('success')) {
        showSuccess(response.message || 'Lead status updated successfully!')
        onStatusUpdated()
        handleClose()
      } else {
        throw new Error(response.message || 'Failed to update lead status')
      }
    } catch (error: any) {
      console.error('Error updating lead status:', error)

      let errorMessage = 'Something went wrong while updating. Please try again.'

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
        errorMessage = Object.values(validationErrors).flat().join(', ')
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = useCallback(() => {
    setFormData({
      statusname: '',
      activityname: '',
      followupremark: '',
      followup: false,
      followupdate: '',
      isclient: false
    })
    setErrors({})
    setTouched(new Set())
    setLoading(false)
    onHide()
  }, [onHide])

  // Get status color class
  const getStatusColorClass = useCallback((statusName: string): string => {
    const statusColors: Record<string, string> = {
      warm: 'border-warning bg-warning-subtle',
      hot: 'border-danger bg-danger-subtle',
      cold: 'border-info bg-info-subtle',
      new: 'border-primary bg-primary-subtle',
      converted: 'border-success bg-success-subtle',
      'follow up': 'border-secondary bg-secondary-subtle',
      'in progress': 'border-info bg-info-subtle',
      contacted: 'border-primary bg-primary-subtle',
      qualified: 'border-success bg-success-subtle',
    }
    return statusColors[statusName?.toLowerCase()] || 'border-secondary bg-light'
  }, [])

  // Get activity color class
  const getActivityColorClass = useCallback((activityName: string): string => {
    const activityColors: Record<string, string> = {
      call: 'border-info bg-info-subtle',
      meeting: 'border-primary bg-primary-subtle',
      email: 'border-success bg-success-subtle',
      demo: 'border-warning bg-warning-subtle',
      followup: 'border-secondary bg-secondary-subtle',
      visit: 'border-purple bg-purple-subtle',
      presentation: 'border-indigo bg-indigo-subtle',
    }
    return activityColors[activityName?.toLowerCase()] || 'border-secondary bg-light'
  }, [])

  // Check if field has error and is touched
  const isFieldInvalid = (field: string): boolean => {
    return touched.has(field) && !!errors[field]
  }

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton style={{
          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
        }} className="text-white">
          <Modal.Title className="d-flex align-items-center gap-2">
            <i className="bi bi-pencil-square"></i>
            Update Lead Status
            {lead && (
              <Badge bg="light" text="dark" className="ms-2">
                {'leadname' in lead ? lead.leadname : lead.name}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          {!lead ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-x display-4 d-block mb-3"></i>
              No lead selected
            </div>
          ) : (
            <div className="p-4">
              {/* ========== INFO SECTION ========== */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-bottom">
                  <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle text-primary"></i>
                    Lead Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light-primary bg-opacity-10 rounded-2">
                    <div className="d-flex flex-column flex-md-row align-items-md-center gap-1 gap-md-2">
                      {/* Lead Name */}
                      <div className="d-inline-flex align-items-center bg-light rounded px-2 py-1">
                        <i className="bi bi-person-badge me-1 text-primary fs-7"></i>
                        <span className="fw-medium text-dark fs-7">
                          {'leadname' in lead ? lead.leadname : lead.name}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="d-flex flex-wrap gap-1">
                        {/* Phone */}
                        <div className="d-inline-flex align-items-center bg-light rounded px-2 py-1">
                          <i className="bi bi-telephone me-1 text-success fs-7"></i>
                          <span className="text-dark fs-7">{lead.phone || 'N/A'}</span>
                        </div>

                        {/* Email */}
                        <div className="d-inline-flex align-items-center bg-light rounded px-2 py-1">
                          <i className="bi bi-envelope me-1 text-warning fs-7"></i>
                          <span className="text-dark fs-7">{lead.email || 'N/A'}</span>
                        </div>

                        {/* Assigned User */}
                        <div className="d-inline-flex align-items-center bg-light rounded px-2 py-1">
                          <i className="bi bi-person me-1 text-info fs-7"></i>
                          <span className="text-dark fs-7">
                            {'username' in lead ? lead.username :
                              ('user' in lead && lead?.username) ? lead?.username : 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="ms-2">
                      <span className={`badge ${getStatusColorClass(lead.statusname)} px-3 py-2 fs-7 fw-semibold`}>
                        <i className="bi bi-circle-fill me-1 fs-8"></i>
                        {lead.statusname || 'No Status'}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* ========== INPUT SECTION ========== */}
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-bottom">
                  <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                    <i className="bi bi-pencil text-primary"></i>
                    Update Details
                  </h6>
                </Card.Header>
                <Card.Body>
                  {/* Status and Activity Selection */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                          <i className="bi bi-tag"></i>
                          Select Status *
                          {isFieldInvalid('statusname') && (
                            <i className="bi bi-exclamation-circle text-danger"></i>
                          )}
                        </Form.Label>
                        <Form.Select
                          value={formData.statusname}
                          onChange={(e) => handleFieldChange('statusname', e.target.value)}
                          className={`${getStatusColorClass(formData.statusname)} rounded-3`}
                          isInvalid={isFieldInvalid('statusname')}
                          required
                        >
                          <option value="">-- Select Status --</option>
                          {statusOptions.map((s, i) => (
                            <option key={s.statusmid || `status-${i}`} value={s.statusname}>
                              {s.statusname}
                            </option>
                          ))}
                        </Form.Select>
                        {isFieldInvalid('statusname') && (
                          <Form.Control.Feedback type="invalid">
                            {errors.statusname}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                          <i className="bi bi-activity"></i>
                          Activity Type *
                          {isFieldInvalid('activityname') && (
                            <i className="bi bi-exclamation-circle text-danger"></i>
                          )}
                        </Form.Label>
                        <Form.Select
                          value={formData.activityname}
                          onChange={(e) => handleFieldChange('activityname', e.target.value)}
                          className={`${getActivityColorClass(formData.activityname)} rounded-3`}
                          isInvalid={isFieldInvalid('activityname')}
                          required
                        >
                          <option value="">-- Select Activity --</option>
                          {activityOptions.map((a) => (
                            <option key={a.activitymid} value={a.activityname}>
                              {a.activityname}
                            </option>
                          ))}
                        </Form.Select>
                        {isFieldInvalid('activityname') && (
                          <Form.Control.Feedback type="invalid">
                            {errors.activityname}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Follow-up Remark */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                      <i className="bi bi-chat-left-text"></i>
                      Follow-up Remark
                      {formData.followupremark.length > 0 && (
                        <span className={`badge bg-${formData.followupremark.length > 500 ? 'danger' : 'success'} ms-1`}>
                          {formData.followupremark.length}/500
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.followupremark}
                      onChange={(e) => handleFieldChange('followupremark', e.target.value)}
                      placeholder="Enter follow-up remark..."
                      maxLength={500}
                      isInvalid={isFieldInvalid('followupremark')}
                    />
                    {isFieldInvalid('followupremark') && (
                      <Form.Control.Feedback type="invalid">
                        {errors.followupremark}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  {/* Follow-up Section */}
                  {(!isStatusNEW) && (
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                        <i className="bi bi-calendar-check"></i>
                        Schedule Follow-up?
                      </Form.Label>
                      <div className="d-flex gap-3">
                        <Form.Check
                          type="radio"
                          label="No"
                          name="followup"
                          id="followup-no"
                          checked={!formData.followup}
                          onChange={() => handleFieldChange('followup', false)}
                        />
                        <Form.Check
                          type="radio"
                          label="Yes"
                          name="followup"
                          id="followup-yes"
                          checked={formData.followup}
                          onChange={() => handleFieldChange('followup', true)}
                        />
                      </div>

                      {formData.followup && (
                        <div className="mt-3 p-3 border rounded bg-light">
                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Label className="fw-semibold">
                                Follow-up Date *
                                {isFieldInvalid('followupdate') && (
                                  <i className="bi bi-exclamation-circle text-danger ms-2"></i>
                                )}
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={formData.followupdate}
                                onChange={(e) => handleFieldChange('followupdate', e.target.value)}
                                min={currentDateTime.today}
                                isInvalid={isFieldInvalid('followupdate')}
                                required
                              />
                              {isFieldInvalid('followupdate') && (
                                <Form.Control.Feedback type="invalid">
                                  {errors.followupdate}
                                </Form.Control.Feedback>
                              )}
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Form.Group>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="bg-white border-top">
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" />
                Updating...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg"></i>
                Update Status
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default LeadStatusUpdateModal