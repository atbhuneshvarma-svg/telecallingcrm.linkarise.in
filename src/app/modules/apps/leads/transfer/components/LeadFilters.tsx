import React from 'react';
import { Card, Form, Button, Row, Col, Badge } from 'react-bootstrap';

interface LeadFiltersProps {
  selectedTeam: string;
  selectedUser: string;
  selectedStage: string;
  selectedStatus: string;
  selectedCount: number;
  uniqueTeams: string[];
  uniqueUsers: string[];
  uniqueStages: string[];
  uniqueStatuses: string[];
  onTeamChange: (value: string) => void;
  onUserChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  onSubmit: () => void;
  onTransfer: () => void;
  onDelete: () => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({
  selectedTeam,
  selectedUser,
  selectedStage,
  selectedStatus,
  selectedCount,
  uniqueTeams,
  uniqueUsers,
  uniqueStages,
  uniqueStatuses,
  onTeamChange,
  onUserChange,
  onStageChange,
  onStatusChange,
  onReset,
  onSubmit,
  onTransfer,
  onDelete
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Body className="p-4">
        {/* Header Section */}
        <Row className="align-items-center mb-4 pb-3 border-bottom">
          <Col>
            <Card.Title as="h2" className="mb-0 text-dark fw-bold fs-3">
              Campaign
            </Card.Title>
          </Col>
          <Col md="auto">
            {/* Selected Count Badge */}
            {selectedCount > 0 && (
              <Badge bg="primary" className="fs-6 px-3 py-2 rounded-pill">
                <i className="fas fa-check-circle me-2"></i>
                Selected: {selectedCount} lead{selectedCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </Col>
        </Row>

        {/* Filter Form */}
        <Form onSubmit={handleSubmit}>
          {/* Main Filter Row */}
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold text-dark mb-2">
                  Select Team
                </Form.Label>
                <Form.Select
                  value={selectedTeam}
                  onChange={(e) => onTeamChange(e.target.value)}
                  className="border-2 shadow-sm"
                >
                  {uniqueTeams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold text-dark mb-2">
                  User
                </Form.Label>
                <Form.Select
                  value={selectedUser}
                  onChange={(e) => onUserChange(e.target.value)}
                  className="border-2 shadow-sm"
                >
                  {uniqueUsers.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold text-dark mb-2">
                  Stage
                </Form.Label>
                <Form.Select
                  value={selectedStage}
                  onChange={(e) => onStageChange(e.target.value)}
                  className="border-2 shadow-sm"
                >
                  {uniqueStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold text-dark mb-2">
                  Status
                </Form.Label>
                <Form.Select
                  value={selectedStatus}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="border-2 shadow-sm"
                >
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Action Buttons Row */}
          <Row className="g-3 align-items-center pt-3 border-top">
            <Col md={6}>
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="px-4 shadow-sm"
                >
                  Apply Filters
                </Button>
                <Button 
                  variant="outline-secondary" 
                  type="button" 
                  onClick={onReset}
                  className="px-4"
                >
                  <i className="fas fa-redo me-2"></i>
                  Reset
                </Button>
              </div>
            </Col>
            
            <Col md={6} className="d-flex justify-content-end">
              <div className="d-flex gap-3">
                <Button
                  variant="primary"
                  onClick={onTransfer}
                  disabled={selectedCount === 0}
                  className="px-4 shadow-sm"
                  size="lg"
                >
                  <i className="fas fa-exchange-alt me-2"></i>
                  Transfer ({selectedCount})
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={onDelete}
                  disabled={selectedCount === 0}
                  className="px-4"
                  size="lg"
                >
                  <i className="fas fa-trash me-2"></i>
                  Delete ({selectedCount})
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LeadFilters;