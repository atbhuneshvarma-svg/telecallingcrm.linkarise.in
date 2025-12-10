import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Modal, Button, Form, Input, Select, DatePicker, Radio, Spin, Row, Col, Badge, Typography, Card } from 'antd'
import moment from 'moment'
import { Lead } from '../core/_models'
import { leadApi } from '../core/_request'
import { useLeads } from '../core/LeadsContext'
import { useToast } from '../hooks/useToast'
import { FreshLead } from '../../fressleads/core/_models'

const { Text, Title } = Typography
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
  followupdate: string
  isclient: boolean
}

const LeadStatusUpdateModal: React.FC<LeadStatusUpdateModalProps> = ({ show, onHide, lead, onStatusUpdated }) => {
  const { showSuccess, showError } = useToast()
  const { dropdowns } = useLeads()

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
    }
  }, [show, lead, activityOptions, currentDateTime])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!formData.statusname.trim()) newErrors.statusname = 'Status is required'
    if (!formData.activityname.trim()) newErrors.activityname = 'Activity type is required'
    if (formData.followup && !formData.followupdate) newErrors.followupdate = 'Follow-up date is required'
    if (formData.followupremark.length > 500) newErrors.followupremark = 'Remark cannot exceed 500 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleFieldChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e })
  }, [errors])

  const handleSubmit = async () => {
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
        followupdate: formData.followup ? formData.followupdate : '',
        statusname: formData.statusname,
        activityname: formData.activityname,
        starttime: formData.followup ? currentDateTime.currentTime : '',
        endtime: formData.followup ? currentDateTime.endTime : '',
        mobileno: lead.phone || '',
        isclient: formData.isclient ? 1 : 0
      }
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
      followupdate: '',
      isclient: false
    })
    setErrors({})
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
    <Modal open={show} onCancel={handleClose} footer={null} title={`Update Lead Status`}>
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
          <Form layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Select Status"
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
                  label="Activity Type"
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
                    value={formData.followupdate ? moment(formData.followupdate) : undefined}
                    onChange={(date) => handleFieldChange('followupdate', date ? date.format('YYYY-MM-DD') : '')}
                    disabledDate={(current) => current && current < moment(currentDateTime.today)}
                  />
                )}
              </Form.Item>
            )}

            <Form.Item>
              <Button type="default" onClick={handleClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" disabled={loading}>
                {loading ? <Spin size="small" /> : 'Update Status'}
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  )
}

export default LeadStatusUpdateModal
