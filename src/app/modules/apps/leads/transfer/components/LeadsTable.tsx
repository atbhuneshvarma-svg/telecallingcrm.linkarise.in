import React, { useRef, useEffect, useState } from 'react';
import { Card, Table, Form, Badge, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { Lead } from '../core/types';
import CustomPagination from './Pagination';

interface LeadsTableProps {
  leads: Lead[];
  selectedLeads: number[];
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectLead: (leadId: number) => void;
  totalLeads: number;
  entriesPerPage: number;
  onEntriesChange: (value: number) => void;
  // Pagination props - for server-side pagination
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  selectedLeads,
  onSelectAll,
  onSelectLead,
  totalLeads,
  entriesPerPage,
  onEntriesChange,
  // Pagination props
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange = () => {},
  onPerPageChange = () => {},
}) => {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const [tableSearchTerm, setTableSearchTerm] = useState('');

  // Handle indeterminate state for select all checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current && leads.length > 0) {
      const visibleLeadIds = leads.map(lead => lead.leadmid);
      const selectedVisibleLeads = selectedLeads.filter(id => 
        visibleLeadIds.includes(id)
      );
      
      selectAllCheckboxRef.current.indeterminate =
        selectedVisibleLeads.length > 0 && 
        selectedVisibleLeads.length < leads.length;
    }
  }, [selectedLeads, leads]);

  // Filter leads for table search (client-side filtering within current page)
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

  // Calculate showing range for SERVER-SIDE pagination
  const showingFrom = totalRecords > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0;
  const showingTo = Math.min(currentPage * entriesPerPage, totalRecords);

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

  const handlePerPageChange = (newPerPage: number) => {
    onPerPageChange(newPerPage);
    onPageChange(1); // Reset to first page when changing page size
  };

  return (
    <Card>
      <Card.Body className="p-0"> {/* Remove padding from Card.Body */}
        
        {/* Table Controls Header - REMOVED THE EXTRA ENTRIES PER PAGE HERE */}
        <div className="p-3 border-bottom bg-light">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center">
                <span className="fw-semibold text-dark me-2">
                  Total Leads: {totalRecords}
                </span>
                {tableSearchTerm && (
                  <span className="text-muted ms-2">
                    (Filtered: {filteredLeads.length})
                  </span>
                )}
              </div>
            </Col>
            <Col className="text-end">
              <div className="d-flex justify-content-end">
                <InputGroup style={{ width: '300px' }}>
                  <InputGroup.Text>
                    <i className="fas fa-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search in current page..."
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

        {/* Table */}
        <div className="table-responsive">
          <Table responsive striped hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th style={{ width: '50px' }}>
                  <Form.Check
                    type="checkbox"
                    ref={selectAllCheckboxRef}
                    checked={leads.length > 0 && selectedLeads.length === leads.length}
                    onChange={onSelectAll}
                  />
                </th>
                <th style={{ width: '70px' }}>Sr.No</th>
                <th>Campaign</th>
                <th>User</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Purpose</th>
                <th>Detail</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Activity</th>
                <th>Remarks</th>
                <th>Updated On</th>
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
                  <td className="text-muted">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                  <td>{lead.campaignname}</td>
                  <td>{lead.username}</td>
                  <td>
                    <strong>{lead.leadname}</strong>
                    {lead.email && (
                      <div className="small text-muted">{lead.email}</div>
                    )}
                  </td>
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
                    {lead.activity || '-'}
                  </td>
                  <td>
                    {lead.leadremarks || '-'}
                  </td>
                  <td>
                    <small className="text-muted">
                      {lead.updatedon || '-'}
                    </small>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={13} className="text-center py-4">
                    {tableSearchTerm 
                      ? 'No leads found matching your search in the current page.' 
                      : 'No leads found in the current page.'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-top">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            perPage={entriesPerPage}
            onPageChange={onPageChange}
            onPerPageChange={handlePerPageChange}
            showingFrom={showingFrom}
            showingTo={showingTo}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default LeadsTable;