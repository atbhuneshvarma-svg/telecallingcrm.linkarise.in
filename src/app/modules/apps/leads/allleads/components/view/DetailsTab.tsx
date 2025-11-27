import React from 'react'
import { Row, Col, Card, Badge } from 'react-bootstrap'
import { Lead } from '../../core/_models'

interface DetailsTabProps {
  lead: Lead
  getStatusColor: (statusname: string) => string
  formatDate: (dateString: string | undefined) => string
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  lead,
  getStatusColor,
  formatDate
}) => {
  const sections = {
    basicInfo: [
      { label: 'Lead ID', value: `#${lead.leadmid || 'N/A'}` },
      { label: 'Full Name', value: lead.leadname || 'Unnamed Lead' },
      { label: 'Phone', value: lead.phone || 'N/A' },
      { label: 'Email', value: lead.email || 'N/A' },
      { label: 'Address', value: lead.address || 'N/A' },
      { label: 'Purpose', value: lead.purpose || 'N/A' },
      { label: 'Source of Inquiry', value: lead.sourceofinquiry || 'N/A' }
    ],
    assignmentInfo: [
      { label: 'Assigned To', value: lead.username || 'Unassigned' },
      { label: 'User ID', value: lead.usermid || 'N/A' },
      { label: 'Campaign', value: lead.campaignname || 'N/A' },
      { label: 'Campaign ID', value: lead.cmpmid || 'N/A' },
      { label: 'Company ID', value: lead.companymid || 'N/A' }
    ],
    statusInfo: [
      { label: 'Status', value: lead.statusname || 'No Status', color: getStatusColor(lead.statusname || '') },
      { label: 'Activity', value: lead.activity || 'No recent activity' },
      { label: 'Detail', value: lead.detail || 'N/A' },
      { label: 'Follow-up', value: lead.followup || 'No' },
      { label: 'Follow-up Date', value: lead.followupdate || 'N/A' },
      { label: 'Is Called', value: lead.iscalled ? 'Yes' : 'No' }
    ],
    timelineInfo: [
      { label: 'Created Date', value: formatDate(lead.created_at) },
      { label: 'Last Updated', value: formatDate(lead.updated_at || lead.created_at) },
      { label: 'Added On', value: lead.addedon || 'N/A' },
      { label: 'Updated On', value: lead.updatedon || 'N/A' }
    ],
    extraFields: [
      { label: 'Extra Field 1', value: lead.extra_field1 || 'N/A' },
      { label: 'Extra Field 2', value: lead.extra_field2 || 'N/A' },
      { label: 'Extra Field 3', value: lead.extra_field3 || 'N/A' }
    ]
  }

  return (
    <Row className="g-4">
      {Object.entries(sections).map(([section, items]) => (
        <Col md={6} key={section}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-transparent py-3 border-bottom">
              <h6 className="mb-0 fw-semibold text-capitalize">
                {section.replace('Info', ' Information').replace('Fields', ' Fields')}
              </h6>
            </Card.Header>
            <Card.Body>
              {items.map((item: any, index: number) => (
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
  )
}

export default DetailsTab