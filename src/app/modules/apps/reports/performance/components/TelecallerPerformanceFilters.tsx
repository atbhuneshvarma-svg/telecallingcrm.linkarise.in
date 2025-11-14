import React from 'react'
import { Form, Row, Col, Button, Card } from 'react-bootstrap'
import { TelecallerPerformanceFilters as TelecallerPerformanceFiltersType, Telecaller } from '../core/_models'

interface TelecallerPerformanceFiltersProps {
  filters: TelecallerPerformanceFiltersType
  telecallers: Telecaller[]
  onFiltersChange: (filters: Partial<TelecallerPerformanceFiltersType>) => void
  onReset: () => void
  onRefresh: () => void
  totalTelecallers: number
  isLoading: boolean
}

export const TelecallerPerformanceFilters: React.FC<TelecallerPerformanceFiltersProps> = ({
  filters,
  telecallers,
  onFiltersChange,
  onReset,
  onRefresh,
  isLoading
}) => {
  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  // Set default current date if no date is selected
  React.useEffect(() => {
    if (!filters.date_from && !filters.date_to) {
      const currentDate = getCurrentDate()
      onFiltersChange({
        date_from: currentDate,
        date_to: currentDate
      })
    }
  }, [filters.date_from, filters.date_to, onFiltersChange])

  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Performance Report</h3>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-4">
          <Button variant="outline-secondary" size="sm" onClick={onReset} disabled={isLoading}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={onRefresh} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Date From</Form.Label>
              <Form.Control
                type="date"
                value={filters.date_from || getCurrentDate()}
                onChange={(e) => onFiltersChange({ date_from: e.target.value })}
                disabled={isLoading}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Date To</Form.Label>
              <Form.Control
                type="date"
                value={filters.date_to || getCurrentDate()}
                onChange={(e) => onFiltersChange({ date_to: e.target.value })}
                disabled={isLoading}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Telecaller</Form.Label>
              <Form.Select
                value={filters.telecaller_id || ''}
                onChange={(e) => onFiltersChange({ telecaller_id: e.target.value ? Number(e.target.value) : undefined })}
                disabled={isLoading}
              >
                <option value="">All Telecallers</option>
                {telecallers.map((telecaller) => (
                  <option key={telecaller.usermid} value={telecaller.usermid}>
                    {telecaller.username}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}