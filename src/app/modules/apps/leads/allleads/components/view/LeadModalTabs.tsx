import React from 'react'
import { Tab, Nav, Badge } from 'react-bootstrap'
import { Lead } from '../../core/_models'
import OverviewTab from './OverviewTab'
import TimelineTab from './TimelineTab'
import DetailsTab from './DetailsTab'

interface LeadModalTabsProps {
  activeTab: string
  onTabSelect: (tab: string | null) => void
  lead: Lead
  getStatusColor: (statusname: string) => string
  formatDate: (dateString: string | undefined) => string
}

const LeadModalTabs: React.FC<LeadModalTabsProps> = ({
  activeTab,
  onTabSelect,
  lead,
  getStatusColor,
  formatDate
}) => {
  return (
    <Tab.Container activeKey={activeTab} onSelect={onTabSelect}>
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
            <Badge bg="primary" pill className="ms-1">
              0
            </Badge>
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
        <Tab.Pane eventKey="overview">
          <OverviewTab 
            lead={lead} 
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        </Tab.Pane>
        
        <Tab.Pane eventKey="timeline">
          <TimelineTab lead={lead} />
        </Tab.Pane>
        
        <Tab.Pane eventKey="details">
          <DetailsTab 
            lead={lead}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  )
}

export default LeadModalTabs