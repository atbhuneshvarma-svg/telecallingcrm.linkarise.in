// ---------- FIXED VERSION ----------
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Modal, Button, Spinner, Alert, Badge, Form } from 'react-bootstrap'
import { useLeads } from '../core/LeadsContext'
import { useLeadActions } from '../core/useLeadActions'
import { useToast } from '../hooks/useToast'
import { CreateLeadRequest, Lead, UpdateLeadRequest } from '../core/_models'
import { InputField } from './InputField'
import { SelectField } from './SelectField'

interface AddEditLeadModalProps {
  show: boolean
  onHide: () => void
  onLeadAdded: () => void
  leadToEdit?: Lead
}

export const AddEditLeadModal: React.FC<AddEditLeadModalProps> = ({ show, onHide, onLeadAdded, leadToEdit }) => {
  const { dropdowns, loading: dropdownsLoading } = useLeads()
  const { createLead, updateLead, isCreating } = useLeadActions()
  const { showError, showSuccess } = useToast()

  // ---------- FIXED INITIAL FORM DATA ----------
  const initialFormData: CreateLeadRequest = {
    name: '',
    phone: '',
    email: '',
    address: '',
    campaignmid: 0,
    purposemid: 0,
    sourceofinquirymid: 0,
    activityname: '',
    statusmid: 0,
    statusname: '',
    usermid: 0,
    detail: '',
    leadremarks: '',
    extra_field1: '',
    extra_field2: '',
    extra_field3: '',
  }

  const [formData, setFormData] = useState<CreateLeadRequest | UpdateLeadRequest>(initialFormData)
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const [autoSave, setAutoSave] = useState(false)

  // ---------- DROPDOWN OPTIONS ----------
  const campaigns = useMemo(
    () => dropdowns?.campaigns?.map((c: any) => ({ value: c.id, label: c.name })) || [],
    [dropdowns?.campaigns]
  )
  const statuses = useMemo(
    () => dropdowns?.statuses?.map((s: any) => ({ value: s.statusmid, label: s.statusname })) || [],
    [dropdowns?.statuses]
  )
  const users = useMemo(
    () => dropdowns?.users?.map((u: any) => ({ value: u.usermid, label: u.username })) || [],
    [dropdowns?.users]
  )
  const purposes = useMemo(
    () => dropdowns?.purposes?.map((p: any) => ({ value: p.id, label: p.name })) || [],
    [dropdowns?.purposes]
  )
  const sources = useMemo(
    () => dropdowns?.sources?.map((s: any) => ({ value: s.id, label: s.name })) || [],
    [dropdowns?.sources]
  )
  const activities = useMemo(
    () => dropdowns?.activities?.map((a: any) => ({ value: a.activityname, label: a.activityname })) || [],
    [dropdowns?.activities]
  )

  // ---------- POPULATE FORM DATA ----------
  useEffect(() => {
    if (dropdownsLoading) return

    if (leadToEdit) {
      setFormData({
        name: leadToEdit.name || leadToEdit.leadname || '',
        phone: leadToEdit.phone || '',
        email: leadToEdit.email || '',
        address: leadToEdit.address || '',
        campaignmid: leadToEdit.campaignmid ?? Number(campaigns[0]?.value) ?? 0,
        purposemid: leadToEdit.purposemid ?? Number(purposes[0]?.value) ?? 0,
        sourceofinquirymid: leadToEdit.sourceofinquirymid ?? Number(sources[0]?.value) ?? 0,
        statusmid: leadToEdit.statusmid ?? Number(statuses[0]?.value) ?? 0,
        usermid: leadToEdit.usermid ?? Number(users[0]?.value) ?? 0,
        statusname: leadToEdit.statusname ?? statuses[0]?.label ?? '',
        activityname: leadToEdit.activity || activities[0]?.value || '',
        detail: leadToEdit.detail || '',
        leadremarks: leadToEdit.leadremarks || '',
        extra_field1: leadToEdit.extra_field1 || '',
        extra_field2: leadToEdit.extra_field2 || '',
        extra_field3: leadToEdit.extra_field3 || '',
      })
    }
    else {
      setFormData({
        ...initialFormData,
        campaignmid: campaigns[0]?.value || 0,
        purposemid: purposes[0]?.value || 0,
        sourceofinquirymid: sources[0]?.value || 0,
        activityname: activities[0]?.value || '',
        statusmid: statuses[0]?.value || 0,
        statusname: statuses[0]?.label || '',
        usermid: users[0]?.value || 0,
      })
    }

    setTouched(new Set())
    setError('')
  }, [leadToEdit, show, campaigns, statuses, purposes, sources, activities, users, dropdownsLoading])

  // ---------- HANDLE CHANGE ----------
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Fields that should be numbers
    const numberFields = ['campaignmid', 'purposemid', 'sourceofinquirymid', 'statusmid', 'usermid'] as const

    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name as typeof numberFields[number]) ? Number(value) : value,
    }))

    setTouched((prev) => new Set([...prev, name]))

    // Auto-save debounce
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    setAutoSave(true)
    autoSaveTimer.current = setTimeout(() => setAutoSave(false), 2000)
  }

  // ---------- VALIDATIONS ----------
  const fieldValidations = useMemo(() => ({
    name: { isValid: !!formData.name, message: 'Enter name' },
    phone: { isValid: /^[0-9]{10}$/.test(formData.phone || ''), message: 'Enter 10-digit phone' },
    email: { isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || ''), message: 'Enter valid email' },
    address: { isValid: !!formData.address, message: 'Enter address' },
    campaignmid: { isValid: !!formData.campaignmid, message: 'Select campaign' },
    statusmid: { isValid: !!formData.statusmid, message: 'Select status' },
  }), [formData])

  const validateForm = () => {
    const invalidFields = Object.entries(fieldValidations).filter(([_, v]) => !v.isValid)
    if (invalidFields.length) {
      setError('Please fill all required fields correctly')
      return false
    }
    setError('')
    return true
  }

  // ---------- SUBMIT ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      if (leadToEdit) {
        await updateLead({ id: leadToEdit.leadmid, data: formData as UpdateLeadRequest })
        showSuccess('Lead updated!')
      } else {
        await createLead(formData as CreateLeadRequest)
        showSuccess('Lead created!')
      }
      onLeadAdded()
      handleClose()
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed'
      setError(msg)
      showError(msg)
    }
  }

  // ---------- CLOSE MODAL ----------
  const handleClose = useCallback(() => {
    setFormData(initialFormData)
    setTouched(new Set())
    setAutoSave(false)
    setError('')
    onHide()
  }, [onHide])

  const completionPercentage = useMemo(() => {
    const total = Object.keys(fieldValidations).length
    const completed = Object.values(fieldValidations).filter(v => v.isValid).length
    return Math.round((completed / total) * 100)
  }, [fieldValidations])

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {leadToEdit ? 'Edit Lead' : 'Add Lead'}
          {autoSave && <Badge bg="warning" className="ms-2">Saving...</Badge>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {dropdownsLoading ? (
          <div className="text-center p-5"><Spinner animation="border" /></div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {/* --- FORM FIELDS (no styling changed) --- */}
            <div className="row">
              {/* Campaign & Purpose Group */}
              <div className="col-md-6 mb-3">
                <SelectField
                  label="Campaign"
                  name="campaignmid"
                  value={formData.campaignmid}
                  options={campaigns}
                  onChange={handleChange}
                  isRequired
                  validation={fieldValidations.campaignmid}
                  isTouched={touched.has('campaignmid')}
                />
              </div>
              <div className="col-md-6 mb-3">
                <SelectField
                  label="Purpose"
                  name="purposemid"
                  value={formData.purposemid}
                  options={purposes}
                  onChange={handleChange}
                />
              </div>

              {/* Source & Activity Group */}
              <div className="col-md-6 mb-3">
                <SelectField
                  label="Source"
                  name="sourceofinquirymid"
                  value={formData.sourceofinquirymid}
                  options={sources}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <SelectField
                  label="Activity"
                  name="activityname"
                  value={formData.activityname}
                  options={activities}
                  onChange={handleChange}
                />
              </div>

              {/* Status & Assigned To Group */}
              <div className="col-md-6 mb-3">
                <SelectField
                  label="Status"
                  name="statusmid"
                  value={formData.statusmid}
                  options={statuses}
                  onChange={handleChange}
                  isRequired
                  validation={fieldValidations.statusmid}
                  isTouched={touched.has('statusmid')}
                />
              </div>
              <div className="col-md-6 mb-3">
                <SelectField
                  label="Assigned To"
                  name="usermid"
                  value={formData.usermid}
                  options={users}
                  onChange={handleChange}
                />
              </div>

              {/* Contact Information Group */}
              <div className="col-md-4 mb-3">
                <InputField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isRequired
                  validation={fieldValidations.name}
                  isTouched={touched.has('name')}
                />
              </div>
              <div className="col-md-4 mb-3">
                <InputField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  isRequired
                  validation={fieldValidations.phone}
                  isTouched={touched.has('phone')}
                />
              </div>
              <div className="col-md-4 mb-3">
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isRequired
                  validation={fieldValidations.email}
                  isTouched={touched.has('email')}
                />
              </div>

              {/* Text Areas - Compact */}
              <div className="col-md-12 mb-2">
                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  as="textarea"
                  rows={1}
                  isRequired
                  validation={fieldValidations.address}
                  isTouched={touched.has('address')}
                />
              </div>
              <div className="col-md-12 mb-2">
                <InputField
                  label="Detail"
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  as="textarea"
                  rows={1}
                />
              </div>

              {/* Extra Fields - Inline */}
              <div className="col-md-4 mb-2">
                <InputField
                  label="Extra Field 1"
                  name="extra_field1"
                  value={formData.extra_field1}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-2">
                <InputField
                  label="Extra Field 2"
                  name="extra_field2"
                  value={formData.extra_field2}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-2">
                <InputField
                  label="Extra Field 3"
                  name="extra_field3"
                  value={formData.extra_field3}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="d-flex justify-content-between mt-3 border-top pt-3">
              <small>Completion: {completionPercentage}%</small>
              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={handleClose} disabled={isCreating}>Cancel</Button>
                <Button type="submit" disabled={isCreating || completionPercentage < 100}>{leadToEdit ? 'Update Lead' : 'Create Lead'}</Button>
              </div>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  )
}
