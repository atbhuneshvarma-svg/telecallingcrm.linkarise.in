import React from 'react'
import { Row, Col, Card, Badge } from 'react-bootstrap'
import { Lead } from '../../core/_models'

interface OverviewTabProps {
  lead: Lead
  getStatusColor: (statusname: string) => string
  formatDate: (dateString: string | undefined) => string
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  lead,
  getStatusColor,
  formatDate
}) => {
  const basicInfo = [
    { label: 'Lead ID', value: `#${lead.leadmid || 'N/A'}`, icon: 'bi-hash' },
    { label: 'Full Name', value: lead.leadname || 'Unnamed Lead', icon: 'bi-person' },
    { label: 'Phone', value: lead.phone || 'N/A', icon: 'bi-telephone' },
    { label: 'Email', value: lead.email || 'N/A', icon: 'bi-envelope' },
    { label: 'Address', value: lead.address || 'N/A', icon: 'bi-geo-alt' }
  ]

  const assignmentInfo = [
    { label: 'Assigned To', value: lead.username || 'Unassigned', icon: 'bi-person-badge' },
    { label: 'Campaign', value: lead.campaignname || 'N/A', icon: 'bi-megaphone' },
    { label: 'Current Activity', value: lead.activity || 'No recent activity', icon: 'bi-activity' },
    { label: 'Status', value: lead.statusname || 'No Status', icon: 'bi-tag', color: getStatusColor(lead.statusname || '') }
  ]

  const timelineInfo = [
    { label: 'Created Date', value: formatDate(lead.created_at), icon: 'bi-calendar-plus' },
    { label: 'Last Updated', value: formatDate(lead.updated_at || lead.created_at), icon: 'bi-calendar-check' }
  ]

  return (
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
            {basicInfo.map((info, index) => (
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
            {assignmentInfo.map((info, index) => (
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
  )
}

export default OverviewTab