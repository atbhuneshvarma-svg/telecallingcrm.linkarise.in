import React from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';

interface LeadSummaryFiltersProps {
  pageSize: number;
  searchTerm: string;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (term: string) => void;
  onExport?: () => void;
}

const LeadSummaryFilters: React.FC<LeadSummaryFiltersProps> = ({
  pageSize,
  searchTerm,
  onPageSizeChange,
  onSearchChange,
  onExport,
}) => {
  return (
    <Row className="mb-3 align-items-center">
      <Col md={6} className="d-flex align-items-center">
        <div className="d-flex align-items-center">
          <span className="me-2" style={{ color: '#666', fontSize: '0.9rem' }}>Show</span>
          <Form.Select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{ 
              width: '70px', 
              height: '40px',
              fontSize: '0.875rem'
            }}
            className="me-2"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Form.Select>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>entries</span>
        </div>
      </Col>
      
      <Col md={6} className="d-flex justify-content-end">
        <div className="d-flex gap-2">
          <InputGroup style={{ width: '250px' }}>
            <InputGroup.Text>
              {/* Bootstrap Icon for Search */}
              <i className="bi bi-search" style={{ fontSize: '0.875rem' }}></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                height: '32px',
                fontSize: '0.875rem'
              }}
            />
          </InputGroup>
          
          {onExport && (
            <Button
              variant="outline-primary"
              onClick={onExport}
              style={{
                height: '32px',
                padding: '0 0.75rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {/* Bootstrap Icon for Excel */}
              <i className="bi bi-file-earmark-excel" style={{ fontSize: '0.875rem' }}></i>
              <span>Export Excel</span>
            </Button>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default LeadSummaryFilters;