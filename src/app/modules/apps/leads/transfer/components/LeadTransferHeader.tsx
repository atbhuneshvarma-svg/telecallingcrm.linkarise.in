import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

// Update the LeadTransferHeader component interface
interface LeadTransferHeaderProps {
  onBack: () => void;
  onBulkTransfer: () => void; // Add this line
}

const LeadTransferHeader: React.FC<LeadTransferHeaderProps> = ({
  onBack,
  onBulkTransfer // Add this line
}) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col>
            <Card.Title as="h1" className="mb-0">
              Manage Leads
            </Card.Title>
          </Col>
          <Col md="auto" className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={onBulkTransfer} // Use the prop here
            >
              Bulk Transfer
            </Button>
            <Button
              variant="outline-secondary"
              onClick={onBack}
            >
              ← Back
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default LeadTransferHeader;