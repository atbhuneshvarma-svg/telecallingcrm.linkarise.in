import React, { useMemo, useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Badge, Card, Spinner, Tab, Nav } from 'react-bootstrap'
import { Lead } from '../core/_models'
import { useStatuses } from '../core/LeadsContext'

interface LeadViewModalProps {
  show: boolean
  lead: Lead | null
  onClose: () => void
  onEdit: (lead: Lead) => void
  onStatusUpdate?: (lead: Lead) => void
  loading?: boolean
}

interface TimelineEvent {
  id: number
  type: 'status_change' | 'activity' | 'note' | 'followup'
  title: string
  description: string
  timestamp: string
  user: string
  metadata?: any
}

const LeadViewModal: React.FC<LeadViewModalProps> = ({
  show,
  lead,
  onClose,
  onEdit,
  onStatusUpdate,
  loading = false
}) => {
  const { statuses } = useStatuses()
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])

  // Mock timeline data - replace with actual API call
  useEffect(() => {
    if (lead) {
      // Simulate fetching timeline data
      const mockTimeline: TimelineEvent[] = [
        {
          id: 1,
          type: 'status_change',
          title: 'Status Updated',
          description: `Changed from "New" to "${lead.statusname || 'Current'}"`,
          timestamp: lead.updated_at || lead.created_at || new Date().toISOString(),
          user: lead.username || 'System'
        },
        {
          id: 2,
          type: 'activity',
          title: 'Activity Recorded',
          description: lead.activity || 'Initial contact made',
          timestamp: lead.created_at || new Date().toISOString(),
          user: lead.username || 'System'
        },
        {
          id: 3,
          type: 'note',
          title: 'Note Added',
          description: lead.leadremarks || 'Initial lead qualification',
          timestamp: lead.created_at || new Date().toISOString(),
          user: lead.username || 'System'
        }
      ]
      setTimelineEvents(mockTimeline)
    }
  }, [lead])

  const getStatusColor = (statusname: string) => {
    if (!statuses || statuses.length === 0) return '#6c757d'

    const status = statuses.find(
      (s) =>
        s &&
        typeof s.statusname === 'string' &&
        s.statusname.toLowerCase() === (statusname || '').toLowerCase()
    )

    return status?.statuscolor || '#6c757d'
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) 
        ? 'N/A' 
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
    } catch {
      return 'N/A'
    }
  }

  const formatFollowupDate = (followup: number | undefined): string => {
    if (!followup) return 'N/A'
    
    try {
      // Try different date formats
      const date = new Date(followup * 1000) // Unix timestamp
      if (isNaN(date.getTime())) {
        const dateMs = new Date(followup) // Milliseconds
        return isNaN(dateMs.getTime()) 
          ? 'N/A' 
          : dateMs.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  // Memoized lead information for better performance
  const leadInfo = useMemo(() => {
    if (!lead) return null

    return {
      basicInfo: [
        { label: 'Lead ID', value: `#${lead.leadmid || 'N/A'}`, icon: 'bi-hash' },
        { label: 'Full Name', value: lead.leadname || lead.name || 'Unnamed Lead', icon: 'bi-person' },
        { label: 'Phone', value: lead.phone || 'N/A', icon: 'bi-telephone' },
        { label: 'Email', value: lead.email || 'N/A', icon: 'bi-envelope' },
        { label: 'Address', value: lead.address || 'N/A', icon: 'bi-geo-alt' }
      ],
      assignmentInfo: [
        { label: 'Assigned To', value: lead.username || 'Unassigned', icon: 'bi-person-badge' },
        { label: 'Campaign', value: lead.campaignname || 'N/A', icon: 'bi-megaphone' },
        { label: 'Current Activity', value: lead.activity || 'No recent activity', icon: 'bi-activity' },
        { label: 'Status', value: lead.statusname || 'No Status', icon: 'bi-tag', color: getStatusColor(lead.statusname || '') }
      ],
      timelineInfo: [
        { label: 'Created Date', value: formatDate(lead.created_at), icon: 'bi-calendar-plus' },
        { label: 'Last Updated', value: formatDate(lead.updated_at || lead.created_at), icon: 'bi-calendar-check' },
        // FIXED: Remove last_contacted since it doesn't exist on Lead type
        { label: 'Next Follow-up', value: formatFollowupDate(lead.followup), icon: 'bi-calendar-event' }
      ]
    }
  }, [lead, statuses])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'status_change': return 'bi-arrow-repeat text-primary'
      case 'activity': return 'bi-activity text-warning'
      case 'note': return 'bi-chat-left-text text-info'
      case 'followup': return 'bi-calendar-check text-success'
      default: return 'bi-circle text-muted'
    }
  }

  const getEventBadgeVariant = (type: string) => {
    switch (type) {
      case 'status_change': return 'primary'
      case 'activity': return 'warning'
      case 'note': return 'info'
      case 'followup': return 'success'
      default: return 'secondary'
    }
  }

  // FIXED: Handle tab selection with proper type
  const handleTabSelect = (tab: string | null) => {
    if (tab) {
      setActiveTab(tab)
    }
  }

  if (!lead) return null

  return (
    <Modal show={show} onHide={onClose} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-light border-bottom-0">
        <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-person-badge fs-4 text-primary"></i>
          Lead Details
          {loading && <Spinner animation="border" size="sm" className="ms-2" />}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Header Section */}
        <div className="bg-primary bg-opacity-10 p-4 border-bottom">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h4 className="fw-bold text-dark mb-2">
                {lead.leadname || lead.name || 'Unnamed Lead'}
              </h4>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Badge 
                  className="rounded-pill px-3 py-2 fs-7"
                  style={{ 
                    backgroundColor: getStatusColor(lead.statusname || ''),
                    color: 'white'
                  }}
                >
                  <i className="bi bi-tag me-1"></i>
                  {lead.statusname || 'No Status'}
                </Badge>
                <span className="text-muted fs-7">
                  <i className="bi bi-hash me-1"></i>
                  ID: #{lead.leadmid}
                </span>
                <span className="text-muted fs-7">
                  <i className="bi bi-calendar me-1"></i>
                  Created: {formatDate(lead.created_at)}
                </span>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onStatusUpdate?.(lead)}
                disabled={loading}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Update Status
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(lead)}
                disabled={loading}
              >
                <i className="bi bi-pencil me-2"></i>
                Edit Lead
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {/* FIXED: Use proper type for onSelect */}
        <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
          <Nav variant="tabs" className="px-4 pt-3 border-bottom-0">
            <Nav.Item>
              <Nav.Link eventKey="overview" className="d-flex align-items-center gap-2">
                <i className="bi bi-info-circle"></i>
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="timeline" className="d-flex align-items-center gap-2">
                <i className="bi bi-clock-history"></i>
                Timeline
                {timelineEvents.length > 0 && (
                  <Badge bg="primary" pill className="ms-1">
                    {timelineEvents.length}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="details" className="d-flex align-items-center gap-2">
                <i className="bi bi-card-checklist"></i>
                Full Details
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="p-4">
            {/* Overview Tab */}
            <Tab.Pane eventKey="overview">
              <Row className="g-4">
                {/* Contact Information */}
                <Col md={6}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Header className="bg-transparent py-3 border-bottom">
                      <h6 className="mb-0 fw-semibold text-primary d-flex align-items-center gap-2">
                        <i className="bi bi-person-circle"></i>
                        Contact Information
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      {leadInfo?.basicInfo.map((info, index) => (
                        <div key={index} className="mb-3 pb-2 border-bottom">
                          <label className="small text-muted mb-1 d-block">
                            <i className={`bi ${info.icon} me-2`}></i>
                            {info.label}
                          </label>
                          <div className={`fw-semibold ${info.label === 'Email' ? 'text-primary' : 'text-dark'} fs-6`}>
                            {info.value}
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Assignment & Status */}
                <Col md={6}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Header className="bg-transparent py-3 border-bottom">
                      <h6 className="mb-0 fw-semibold text-warning d-flex align-items-center gap-2">
                        <i className="bi bi-briefcase"></i>
                        Assignment & Status
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      {leadInfo?.assignmentInfo.map((info, index) => (
                        <div key={index} className="mb-3 pb-2 border-bottom">
                          <label className="small text-muted mb-1 d-block">
                            <i className={`bi ${info.icon} me-2`}></i>
                            {info.label}
                          </label>
                          {info.color ? (
                            <Badge 
                              style={{ 
                                backgroundColor: info.color,
                                color: 'white'
                              }}
                              className="fs-7"
                            >
                              {info.value}
                            </Badge>
                          ) : (
                            <div className="fw-semibold text-dark fs-6">
                              {info.value}
                            </div>
                          )}
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Remarks Section */}
                {lead.leadremarks && (
                  <Col md={12}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-transparent py-3 border-bottom">
                        <h6 className="mb-0 fw-semibold text-info d-flex align-items-center gap-2">
                          <i className="bi bi-chat-left-text"></i>
                          Remarks & Notes
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="p-3 bg-light rounded">
                          <i className="bi bi-quote me-2 text-muted"></i>
                          {lead.leadremarks}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            </Tab.Pane>

            {/* Timeline Tab */}
            <Tab.Pane eventKey="timeline">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent py-3 border-bottom">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                    <i className="bi bi-timeline text-primary"></i>
                    Lead Activity Timeline
                  </h6>
                </Card.Header>
                <Card.Body>
                  {timelineEvents.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-clock-history display-4 d-block mb-3"></i>
                      <p>No activity recorded yet</p>
                    </div>
                  ) : (
                    <div className="timeline">
                      {timelineEvents.map((event, index) => (
                        <div key={event.id} className="timeline-item d-flex mb-4">
                          <div className="timeline-badge flex-shrink-0 me-3">
                            <i className={`bi ${getEventIcon(event.type)} fs-5`}></i>
                          </div>
                          <div className="timeline-content flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <h6 className="mb-0 fw-semibold">{event.title}</h6>
                              <Badge bg={getEventBadgeVariant(event.type)} className="fs-3">
                                {event.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-muted mb-1">{event.description}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                <i className="bi bi-person me-1"></i>
                                {event.user}
                              </small>
                              <small className="text-muted">
                                {formatDate(event.timestamp)}
                              </small>
                            </div>
                            {index < timelineEvents.length - 1 && (
                              <div className="timeline-connector"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Full Details Tab */}
            <Tab.Pane eventKey="details">
              <Row className="g-4">
                {leadInfo && Object.entries(leadInfo).map(([section, items]) => (
                  <Col md={6} key={section}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Header className="bg-transparent py-3 border-bottom">
                        <h6 className="mb-0 fw-semibold text-capitalize">
                          {section.replace('Info', ' Information')}
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {(items as any[]).map((item: any, index: number) => (
                          <div key={index} className="mb-3">
                            <dt className="small text-muted mb-1">{item.label}</dt>
                            <dd className="mb-0 fw-semibold">
                              {item.color ? (
                                <Badge style={{ backgroundColor: item.color, color: 'white' }}>
                                  {item.value}
                                </Badge>
                              ) : (
                                item.value
                              )}
                            </dd>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>

      <Modal.Footer className="bg-light border-top-0">
        <Button variant="outline-secondary" onClick={onClose} disabled={loading}>
          <i className="bi bi-x-circle me-2"></i>
          Close
        </Button>
        <Button 
          variant="outline-primary"
          onClick={() => onStatusUpdate?.(lead)}
          disabled={loading}
        >
          <i className="bi bi-arrow-repeat me-2"></i>
          Update Status
        </Button>
        <Button 
          variant="primary"
          onClick={() => {
            onEdit(lead)
            onClose()
          }}
          disabled={loading}
        >
          <i className="bi bi-pencil me-2"></i>
          Edit Lead
        </Button>
      </Modal.Footer>

      {/* FIXED: Use regular style tag instead of jsx */}
      <style>{`
        .timeline-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #dee2e6;
        }
        .timeline-connector {
          position: absolute;
          left: -23px;
          top: 40px;
          bottom: -20px;
          width: 2px;
          background: #dee2e6;
        }
        .timeline-item {
          position: relative;
        }
      `}</style>
    </Modal>
  )
}

export default LeadViewModal