import React from 'react'
import { Card, Badge } from 'react-bootstrap'
import { Lead } from '../../core/_models'

interface TimelineTabProps {
  lead: Lead
}

interface TimelineEvent {
  id: number
  type: 'created' | 'call_attempted' | 'call_connected' | 'whatsapp' | 'import' | 'status_change' | 'followup' | 'brochure_sent'
  title: string
  description: string
  timestamp: string
  user: string
  status: 'completed' | 'in_progress' | 'pending'
}

const TimelineTab: React.FC<TimelineTabProps> = ({ lead }) => {
  // Generate timeline events from actual lead data
  const generateTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = []

    // Lead Creation Event
    events.push({
      id: 1,
      type: 'created',
      title: 'Lead Created',
      description: 'New lead was added to the system',
      timestamp: lead.created_at || lead.addedon || new Date().toISOString(),
      user: lead.username || 'System',
      status: 'completed'
    })

    // Activity-based events
    if (lead.activity) {
      let activityType: TimelineEvent['type'] = 'import'
      let activityTitle = 'Lead Imported'
      let activityDescription = lead.detail || 'Lead imported into system'

      switch (lead.activity.toLowerCase()) {
        case 'call attempted':
          activityType = 'call_attempted'
          activityTitle = 'Call Attempted'
          activityDescription = lead.detail || 'Attempted to contact the lead'
          break
        case 'call connected':
          activityType = 'call_connected'
          activityTitle = 'Call Connected'
          activityDescription = lead.detail || 'Successfully connected with lead'
          break
        case 'whatsapp message sent':
          activityType = 'whatsapp'
          activityTitle = 'WhatsApp Message Sent'
          activityDescription = lead.detail || 'Sent message via WhatsApp'
          break
        case 'brochure sent':
          activityType = 'brochure_sent'
          activityTitle = 'Brochure Sent'
          activityDescription = lead.detail || 'Sent product brochure to lead'
          break
        case 'import':
          activityType = 'import'
          activityTitle = 'Lead Imported'
          activityDescription = lead.detail || 'Lead imported into system'
          break
        case 'follow-up scheduled':
          activityType = 'followup'
          activityTitle = 'Follow-up Scheduled'
          activityDescription = lead.detail || 'Scheduled follow-up with lead'
          break
      }

      events.push({
        id: 2,
        type: activityType,
        title: activityTitle,
        description: activityDescription,
        timestamp: lead.updatedon || lead.updated_at || lead.created_at || new Date().toISOString(),
        user: lead.username || 'System',
        status: 'completed'
      })
    }

    // Status change event
    if (lead.statusname && lead.statusname !== 'New') {
      events.push({
        id: 3,
        type: 'status_change',
        title: 'Status Updated',
        description: `Status changed to "${lead.statusname}"`,
        timestamp: lead.updatedon || lead.updated_at || lead.created_at || new Date().toISOString(),
        user: lead.username || 'System',
        status: 'completed'
      })
    }

    // Follow-up event
    if (lead.followup === 1 && lead.followupdate) {
      events.push({
        id: 4,
        type: 'followup',
        title: 'Follow-up Scheduled',
        description: `Next follow-up scheduled for ${lead.followupdate}`,
        timestamp: lead.updatedon || lead.updated_at || new Date().toISOString(),
        user: lead.username || 'System',
        status: new Date(lead.followupdate) > new Date() ? 'pending' : 'in_progress'
      })
    }

    // Remarks/notes event
    if (lead.leadremarks) {
      events.push({
        id: 5,
        type: 'followup',
        title: 'Note Added',
        description: lead.leadremarks,
        timestamp: lead.updatedon || lead.updated_at || lead.created_at || new Date().toISOString(),
        user: lead.username || 'System',
        status: 'completed'
      })
    }

    // Sort events by timestamp
    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const timelineEvents = generateTimelineEvents()

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created': return 'bi-plus-circle-fill text-success'
      case 'call_attempted': return 'bi-telephone-outbound text-primary'
      case 'call_connected': return 'bi-telephone-inbound text-success'
      case 'whatsapp': return 'bi-whatsapp text-success'
      case 'import': return 'bi-download text-info'
      case 'status_change': return 'bi-arrow-repeat text-warning'
      case 'followup': return 'bi-calendar-check text-secondary'
      case 'brochure_sent': return 'bi-file-earmark-text text-info'
      default: return 'bi-circle-fill text-muted'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge bg="success" className="fs-3">Completed</Badge>
      case 'in_progress': return <Badge bg="warning" text="dark" className="fs-3">In Progress</Badge>
      case 'pending': return <Badge bg="secondary" className="fs-3">Upcoming</Badge>
      default: return <Badge bg="light" text="dark" className="fs-3">Scheduled</Badge>
    }
  }

  const formatTimelineDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return isNaN(date.getTime()) 
        ? 'N/A' 
        : date.toLocaleDateString('en-US', {
            weekday: 'short',
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

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-transparent py-3 border-bottom">
        <h6 className="mb-0 fw-semibold d-flex align-items-center gap-2">
          <i className="bi bi-timeline text-primary"></i>
          Lead Activity Timeline
          <Badge bg="primary" pill className="ms-2">
            {timelineEvents.length}
          </Badge>
        </h6>
      </Card.Header>
      <Card.Body className="p-4">
        {timelineEvents.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-clock-history display-4 d-block mb-3"></i>
            <p>No activity recorded yet</p>
          </div>
        ) : (
          <div className="timeline">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="timeline-item position-relative mb-4">
                {/* Timeline line */}
                {index < timelineEvents.length - 1 && (
                  <div className="timeline-connector position-absolute start-0 top-0 h-100"></div>
                )}
                
                <div className="d-flex">
                  {/* Timeline icon */}
                  <div className="timeline-icon flex-shrink-0 me-3 position-relative">
                    <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center" 
                         style={{ width: '50px', height: '50px' }}>
                      <i className={`bi ${getEventIcon(event.type)} fs-5`}></i>
                    </div>
                  </div>

                  {/* Timeline content */}
                  <div className="timeline-content flex-grow-1 bg-light rounded p-3 border">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1 fw-semibold text-dark">{event.title}</h6>
                        <p className="mb-2 text-muted">{event.description}</p>
                      </div>
                      {getStatusBadge(event.status)}
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-person text-muted fs-7"></i>
                        <small className="text-muted">{event.user}</small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-clock text-muted fs-7"></i>
                        <small className="text-muted">{formatTimelineDate(event.timestamp)}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new activity button */}
        <div className="text-center mt-4">
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Activity
          </button>
        </div>
      </Card.Body>

      <style>{`
        .timeline {
          position: relative;
        }
        .timeline-connector {
          width: 2px;
          background: #dee2e6;
          left: 25px;
          top: 50px;
          z-index: 1;
        }
        .timeline-icon {
          z-index: 2;
        }
        .timeline-item:last-child .timeline-connector {
          display: none;
        }
        .timeline-content {
          transition: all 0.3s ease;
        }
        .timeline-content:hover {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          transform: translateY(-1px);
        }
      `}</style>
    </Card>
  )
}

export default TimelineTab