import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Modal, Button, Form, Input, Select, DatePicker, Radio, Spin, Row, Col, Badge, Typography, Card } from 'antd'
import moment from 'moment'
import { Lead } from '../core/_models'
import { leadApi } from '../core/_request'
import { useLeads } from '../core/LeadsContext'
import { useToast } from '../hooks/useToast'
import { FreshLead } from '../../fressleads/core/_models'
import { whatsAppTemplateApi } from '../../../master/whatsapp/core/_requests'

const { Text } = Typography
const { TextArea } = Input
const { Option } = Select

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
  followupdate: moment.Moment | null
  isclient: boolean
  sendWhatsApp: string
  whatsappTemplate: string
  whatsappMessage: string
}

interface WhatsAppTemplate {
  id: string
  name: string
  content: string
}

const LeadStatusUpdateModal: React.FC<LeadStatusUpdateModalProps> = ({ show, onHide, lead, onStatusUpdated }) => {
  const { showSuccess, showError } = useToast()
  const { dropdowns } = useLeads()

  const [formData, setFormData] = useState<FormData>({
    statusname: '',
    activityname: '',
    followupremark: '',
    followup: true,
    followupdate: moment(),
    isclient: false,
    sendWhatsApp: 'No',
    whatsappTemplate: '',
    whatsappMessage: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetchingTemplates, setFetchingTemplates] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>([])

  const currentDateTime = useMemo(() => {
    const now = new Date()
    const today = moment(now).format('YYYY-MM-DD')
    const currentTime = moment(now).format('HH:mm')
    const endTime = moment(now).add(30, 'minutes').format('HH:mm')
    return { today, currentTime, endTime }
  }, [])

  const statusOptions = useMemo(() => dropdowns?.statuses?.filter(s => s.statusname) || [], [dropdowns?.statuses])
  const activityOptions = useMemo(() => dropdowns?.activities?.filter(a => a.activityname) || [], [dropdowns?.activities])

  const selectedStatus = statusOptions.find(s => s.statusname === formData.statusname)
  const isStatusNEW = selectedStatus?.statusname?.toLowerCase() === 'new'
  const showWhatsAppFields = formData.sendWhatsApp === 'Yes'

  // Simple fetch function without useCallback
  const fetchWhatsAppTemplates = async () => {
    if (whatsappTemplates.length > 0) return // Don't fetch if already loaded

    try {
      setFetchingTemplates(true)
      const response = await whatsAppTemplateApi.getTemplatesPaginated()

      console.log('WhatsApp templates API response:', response)

      const apiResponse = response as any

      if (apiResponse.data && Array.isArray(apiResponse.data)) {
        const templates: WhatsAppTemplate[] = apiResponse.data.map((template: any) => ({
          id: template.wtmid?.toString() || '',
          name: template.template_name || '',
          content: template.message || ''
        }))
        setWhatsappTemplates(templates)
      }
    } catch (error: any) {
      console.error('Error fetching WhatsApp templates:', error)
      setWhatsappTemplates([
        { id: '1', name: 'frfr', content: 'Hello {name}' },
        { id: '2', name: 'welcome', content: 'Welcome {name}, thank you for your interest!' },
      ])
      showError('Failed to load WhatsApp templates. Using default templates.')
    } finally {
      setFetchingTemplates(false)
    }
  }

  useEffect(() => {
  if (show && lead) {
    const defaultActivity = activityOptions[0]?.activityname || ''

    // Parse lead.followupdate correctly if it exists, else use today
    const initialFollowup = lead.followupdate
      ? moment(lead.followupdate, 'YYYY-MM-DD')  // adjust format if API returns DD-MM-YYYY
      : moment()

    setFormData({
      statusname: lead.statusname || '',
      activityname: defaultActivity,
      followupremark: '',
      followup: true,
      followupdate: initialFollowup,
      isclient: false,
      sendWhatsApp: 'No',
      whatsappTemplate: '',
      whatsappMessage: ''
    })
    setErrors({})
  }
}, [show, lead, activityOptions])


  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.statusname.trim()) newErrors.statusname = 'Status is required'
    if (!formData.activityname.trim()) newErrors.activityname = 'Activity type is required'
    if (formData.followup && !formData.followupdate) newErrors.followupdate = 'Follow-up date is required'
    if (formData.followupremark.length > 500) newErrors.followupremark = 'Remark cannot exceed 500 characters'

    if (showWhatsAppFields) {
      if (!formData.whatsappTemplate) newErrors.whatsappTemplate = 'Please select a WhatsApp template'
      if (!formData.whatsappMessage.trim()) newErrors.whatsappMessage = 'WhatsApp message is required'
      if (formData.whatsappMessage.length > 1000) newErrors.whatsappMessage = 'Message cannot exceed 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSendWhatsApp = () => {
    if (!lead) return

    if (!formData.whatsappMessage.trim()) {
      showError('WhatsApp message is empty')
      return
    }

    const phone = lead.phone?.replace(/\D/g, '') // remove spaces & symbols
    if (!phone) {
      showError('Invalid phone number')
      return
    }

    const message = encodeURIComponent(formData.whatsappMessage)

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`

    window.open(whatsappUrl, '_blank')
  }

  const handleFieldChange = (field: keyof FormData, value: any) => {
    console.log(`Changing ${field} to:`, value)

    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const e = { ...prev };
        delete e[field];
        return e
      })
    }

    // Auto-fill whatsappMessage when template is selected
    if (field === 'whatsappTemplate' && value && lead) {
      const selectedTemplate = whatsappTemplates.find(t => t.name === value)
      if (selectedTemplate) {
        let message = selectedTemplate.content
        message = message.replace(/#LeadName/g, lead.leadname || '')
        message = message.replace(/#Interest/g, lead.purpose || '')
        message = message.replace(/#Phone/g, lead.phone || '')
        setFormData(prev => ({ ...prev, whatsappMessage: message }))
      }
    }

    // Fetch templates when user selects "Yes" for WhatsApp
    if (field === 'sendWhatsApp' && value === 'Yes' && whatsappTemplates.length === 0) {
      console.log('Will fetch templates')
      // Use setTimeout to prevent immediate state updates during render
      setTimeout(() => {
        fetchWhatsAppTemplates()
      }, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!lead) return
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
        followupdate: formData.followup ? moment(formData.followupdate).format('DD-MM-YYYY') : '',
        statusname: formData.statusname,
        activityname: formData.activityname,
        starttime: formData.followup ? currentDateTime.currentTime : '',
        endtime: formData.followup ? currentDateTime.endTime : '',
        mobileno: lead.phone || '',
        isclient: formData.isclient ? 1 : 0,
        ...(showWhatsAppFields && {
          whatsapptamplate: formData.whatsappTemplate,
          whatsappmessage: formData.whatsappMessage
        })
      }

      console.log('Submitting payload:', payload)

      const response = await leadApi.updateLeadStatus(payload)
      if (response.result || response.message?.toLowerCase().includes('success')) {
        showSuccess(response.message || 'Lead status updated successfully!')
        onStatusUpdated()
        handleClose()
      } else throw new Error(response.message || 'Failed to update lead status')
    } catch (error: any) {
      showError(error?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      statusname: '',
      activityname: '',
      followupremark: '',
      followup: false,
      followupdate: moment(),
      isclient: false,
      sendWhatsApp: 'No',
      whatsappTemplate: '',
      whatsappMessage: ''
    })
    setErrors({})
    setWhatsappTemplates([]) // Clear templates when modal closes
    onHide()
  }

  const getStatusColor = (statusName?: string) => {
    const colors: Record<string, string> = {
      warm: 'orange',
      hot: 'red',
      cold: 'blue',
      new: 'blue',
      converted: 'green',
      'follow up': 'gray',
      'in progress': 'cyan',
      contacted: 'purple',
      qualified: 'green',
    }
    return colors[statusName?.toLowerCase() || ''] || 'gray'
  }

  return (
    <Modal
      open={show}
      onCancel={handleClose}
      footer={null}
      title="Update Lead Status"
      width={600}
     destroyOnHidden // Add this to destroy modal when closed
    >
      {!lead ? (
        <div className="text-center p-5 text-muted">
          <Text>No lead selected</Text>
        </div>
      ) : (
        <>
          {/* Lead Info */}
          <Card className="mb-4">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Name: </Text> {lead.leadname ?? 'Unknown'}
              </Col>
              <Col span={12}>
                <Text strong>Mobile: </Text> {lead.phone || 'N/A'}
              </Col>
              <Col span={12}>
                <Text strong>Email: </Text> {lead.email || 'N/A'}
              </Col>
              <Col span={12}>
                <Text strong>Assigned: </Text> {lead.username || 'Unassigned'}
              </Col>
              <Col span={24}>
                <Badge color={getStatusColor(lead.statusname)} text={lead.statusname || 'No Status'} />
              </Col>
            </Row>
          </Card>

          {/* Form */}
          <form onSubmit={handleSubmit}> {/* Use regular form tag */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Select Status*"
                  validateStatus={errors.statusname ? 'error' : ''}
                  help={errors.statusname || ''}
                >
                  <Select
                    value={formData.statusname}
                    onChange={(val) => handleFieldChange('statusname', val)}
                    placeholder="-- Select Status --"
                  >
                    {statusOptions.map(s => (
                      <Option key={s.statusmid} value={s.statusname}>{s.statusname}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Activity Type*"
                  validateStatus={errors.activityname ? 'error' : ''}
                  help={errors.activityname || ''}
                >
                  <Select
                    value={formData.activityname}
                    onChange={(val) => handleFieldChange('activityname', val)}
                    placeholder="-- Select Activity --"
                  >
                    {activityOptions.map(a => (
                      <Option key={a.activitymid} value={a.activityname}>{a.activityname}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* WhatsApp Section */}
            <Card className="mb-4" size="small">
              <div className="d-flex align-items-center mb-2">
                <Text strong>WhatsApp Message</Text>
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Send WhatsApp?"
                    validateStatus={errors.sendWhatsApp ? 'error' : ''}
                    help={errors.sendWhatsApp || ''}
                  >
                    <Select
                      value={formData.sendWhatsApp}
                      onChange={(val) => {
                        console.log('Send WhatsApp onChange:', val)
                        handleFieldChange('sendWhatsApp', val)
                      }}
                      onSelect={(val) => {
                        console.log('Send WhatsApp onSelect:', val)
                        // This might work better than onChange
                      }}
                      placeholder="-- Select --"
                       popupMatchSelectWidth={false}
                    >
                      <Option value="No">No</Option>
                      <Option value="Yes">Yes</Option>
                    </Select>
                  </Form.Item>
                </Col>
                {showWhatsAppFields && (
                  <>

                    <Col span={12}>
                      <Form.Item
                        label="Template"
                        validateStatus={errors.whatsappTemplate ? 'error' : ''}
                        help={errors.whatsappTemplate || ''}
                      >
                        <Select
                          value={formData.whatsappTemplate}
                          onChange={(val) => handleFieldChange('whatsappTemplate', val)}
                          placeholder={fetchingTemplates ? "Select Template" : null}
                          loading={fetchingTemplates}
                          disabled={fetchingTemplates}
                        >
                          {whatsappTemplates.map(template => (
                            <Option key={template.id} value={template.name}>
                              {template.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={20}>
                      <Form.Item
                        label="WhatsApp Message"
                        validateStatus={errors.whatsappMessage ? 'error' : ''}
                        help={errors.whatsappMessage || ''}
                      >
                        <TextArea
                          rows={3}
                          value={formData.whatsappMessage}
                          onChange={(e) => handleFieldChange('whatsappMessage', e.target.value)}
                          maxLength={1000}
                          placeholder="Type or edit your WhatsApp message here..."
                          disabled={fetchingTemplates}
                        />
                      </Form.Item>
                      <Button
                        type="primary"
                        onClick={handleSendWhatsApp}
                        disabled={!formData.whatsappMessage.trim()}
                      >
                        Send WhatsApp
                      </Button>

                    </Col>
                  </>
                )}
              </Row>

            </Card>

            <Form.Item
              label="Follow-up Remark"
              validateStatus={errors.followupremark ? 'error' : ''}
              help={errors.followupremark || ''}
            >
              <TextArea
                rows={3}
                value={formData.followupremark}
                onChange={(e) => handleFieldChange('followupremark', e.target.value)}
                maxLength={500}
                placeholder="Enter remarks for this activity..."
              />
            </Form.Item>

            {!isStatusNEW && (
              <Form.Item label="Schedule Follow-up?">
                <Radio.Group
                  value={formData.followup}
                  onChange={(e) => handleFieldChange('followup', e.target.value)}
                >
                  <Radio value={false}>No</Radio>
                  <Radio value={true}>Yes</Radio>
                </Radio.Group>

                {formData.followup && (
                  <DatePicker
                    style={{ marginTop: 8, width: '100%' }}
                    value={formData.followupdate ?? null}
                    onChange={(date) => handleFieldChange('followupdate', date)}
                    
                    format="DD-MM-YYYY"
                  />

                )}
              </Form.Item>
            )}

            <Form.Item>
              <Button type="default" onClick={handleClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" disabled={loading || fetchingTemplates}>
                {loading ? <Spin size="small" /> : 'Update Status'}
              </Button>
            </Form.Item>
          </form>
        </>
      )}
    </Modal>
  )
}

export default LeadStatusUpdateModal