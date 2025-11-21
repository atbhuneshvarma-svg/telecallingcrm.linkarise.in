import React, { useRef, useEffect, useState } from 'react';
import { Card, Table, Form, Badge, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { Lead } from '../core/types';

interface LeadsTableProps {
  leads: Lead[];
  selectedLeads: number[];
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectLead: (leadId: number) => void;
  totalLeads: number;
  showingLeads: number;
  entriesPerPage: number;
  onEntriesChange: (value: number) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  selectedLeads,
  onSelectAll,
  onSelectLead,
  totalLeads,
  showingLeads,
  entriesPerPage,
  onEntriesChange
}) => {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const [tableSearchTerm, setTableSearchTerm] = useState('');

  // Handle indeterminate state for select all checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate =
        selectedLeads.length > 0 && selectedLeads.length < filteredLeads.length;
    }
  }, [selectedLeads, leads.length]);

  // Filter leads for table search
  const filteredLeads = leads.filter(lead => {
    if (!tableSearchTerm) return true;

    const searchLower = tableSearchTerm.toLowerCase();
    return (
      lead.leadname.toLowerCase().includes(searchLower) ||
      lead.phone.includes(tableSearchTerm) ||
      lead.campaignname.toLowerCase().includes(searchLower) ||
      lead.username.toLowerCase().includes(searchLower) ||
      (lead.purpose && lead.purpose.toLowerCase().includes(searchLower)) ||
      (lead.detail && lead.detail.toLowerCase().includes(searchLower)) ||
      (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
      lead.statusname.toLowerCase().includes(searchLower) ||
      (lead.stage && lead.stage.toLowerCase().includes(searchLower))
    );
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New': return 'primary';
      case 'Interested': return 'success';
      case 'Cold': return 'secondary';
      case 'Lost': return 'danger';
      case 'Hot': return 'danger';
      case 'Warm': return 'warning';
      case 'Won': return 'success';
      default: return 'secondary';
    }
  };

  const getStageVariant = (stage: string) => {
    switch (stage) {
      case 'Fresh Lead': return 'info';
      case 'Not Interested': return 'warning';
      case 'Interested': return 'success';
      case 'Converted': return 'success';
      default: return 'secondary';
    }
  };

  const handleClearSearch = () => {
    setTableSearchTerm('');
  };

  return (
    <Card>
      <Card.Body className="p-5">
        {/* Table Controls Header */}
        <div className="p-3 border-bottom">
          <Row className="align-items-center">
            <Col md={4}>
              <Row className="align-items-center g-3">
                <Col md="auto">
                  <Form.Group className="mb-0">
                    <Form.Label className="fw-semibold text-dark mb-0 me-2">
                      Show:
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col md="auto">
                  <Form.Select
                    value={entriesPerPage}
                    onChange={(e) => onEntriesChange(Number(e.target.value))}
                    className="border-2 shadow-sm"
                    style={{ width: '120px' }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Form.Select>
                </Col>
                <Col md="auto">
                  <span className="text-muted">entries</span>
                </Col>
              </Row>
            </Col>
            <Col md={8} className="text-end">
              <div className="d-flex justify-content-end">
                <InputGroup style={{ width: '300px' }}>
                  <InputGroup.Text>
                    <i className="fas fa-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search in table..."
                    value={tableSearchTerm}
                    onChange={(e) => setTableSearchTerm(e.target.value)}
                  />
                  {tableSearchTerm && (
                    <Button
                      variant="outline-secondary"
                      onClick={handleClearSearch}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  )}
                </InputGroup>
              </div>
            </Col>
          </Row>
        </div>

        <Table responsive striped hover>
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  ref={selectAllCheckboxRef}
                  checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                  onChange={onSelectAll}
                />
              </th>
              <th>Sr.No</th>
              <th>Campaign</th>
              <th>User</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Purpose</th>
              <th>Detail</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Act</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, index) => (
              <tr key={lead.leadmid}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedLeads.includes(lead.leadmid)}
                    onChange={() => onSelectLead(lead.leadmid)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{lead.campaignname}</td>
                <td>{lead.username}</td>
                <td>{lead.leadname}</td>
                <td>{lead.phone}</td>
                <td>{lead.purpose || '-'}</td>
                <td>{lead.detail || '-'}</td>
                <td>
                  {lead.stage && (
                    <Badge bg={getStageVariant(lead.stage)}>
                      {lead.stage}
                    </Badge>
                  )}
                </td>
                <td>
                  <Badge bg={getStatusVariant(lead.statusname)}>
                    {lead.statusname}
                  </Badge>
                </td>
                <td>
                  <Button size="sm" variant="outline-primary">
                    Actions
                  </Button>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-4">
                  {tableSearchTerm ? 'No leads found matching your search.' : 'No leads found matching your filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Table Footer */}
        <div className="p-3 border-top">
          <Row className="align-items-center">
            <Col>
              Showing {Math.min(filteredLeads.length, showingLeads)} of {filteredLeads.length} entries
              {tableSearchTerm && (
                <span className="text-muted ms-2">
                  (Search: "{tableSearchTerm}")
                </span>
              )}
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LeadsTable;