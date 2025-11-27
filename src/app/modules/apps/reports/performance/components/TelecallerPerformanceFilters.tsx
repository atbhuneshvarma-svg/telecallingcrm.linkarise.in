import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Button, Card } from 'react-bootstrap'
import { DateRangePicker } from 'react-date-range'
import { format } from 'date-fns'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { TelecallerPerformanceFilters as TelecallerPerformanceFiltersType, Telecaller } from '../core/_models'
import { useLeads } from '../../../leads/allleads/core/LeadsContext'

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

  // Access dropdowns from leads context if needed
  const { dropdowns } = useLeads()

  const useroptions = dropdowns.users || []

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  // Set default current date if no date is selected
  useEffect(() => {
    if (!filters.date_from && !filters.date_to) {
      const currentDate = getCurrentDate()
      onFiltersChange({
        date_from: currentDate,
        date_to: currentDate
      })
    }
  }, [filters.date_from, filters.date_to, onFiltersChange])

  // Update dateRange when filters change
  useEffect(() => {
    if (filters.date_from && filters.date_to) {
      setDateRange([
        {
          startDate: new Date(filters.date_from),
          endDate: new Date(filters.date_to),
          key: 'selection'
        }
      ])
    }
  }, [filters.date_from, filters.date_to])

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0]
  }


  const handleDateRangeChange = (ranges: any) => {
    const range = ranges.selection
    setDateRange([range])

    const date_from = format(range.startDate, 'yyyy-MM-dd')
    const date_to = format(range.endDate, 'yyyy-MM-dd')

    onFiltersChange({
      date_from,
      date_to
    })
  }

  const handleQuickDateRange = (days: number) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    setDateRange([{
      startDate,
      endDate,
      key: 'selection'
    }])

    onFiltersChange({
      date_from: format(startDate, 'yyyy-MM-dd'),
      date_to: format(endDate, 'yyyy-MM-dd')
    })
    setShowDatePicker(false)
  }

  const clearDateFilter = () => {
    const today = getCurrentDate()
    setDateRange([{
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }])
    onFiltersChange({
      date_from: today,
      date_to: today
    })
  }

  const getDisplayDateRange = () => {
    if (!filters.date_from || !filters.date_to) return 'Select Date Range'

    if (filters.date_from === filters.date_to) {
      return format(new Date(filters.date_from), 'MMM dd, yyyy')
    }
    return `${format(new Date(filters.date_from), 'MMM dd, yyyy')} - ${format(new Date(filters.date_to), 'MMM dd, yyyy')}`
  }

  const isDefaultDate = () => {
    const today = getCurrentDate()
    return filters.date_from === today && filters.date_to === today
  }

  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Performance Report</h3>
        </div>
        <div className="d-flex justify-content-between align-items-center">

          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={onReset} disabled={isLoading}>
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={onRefresh} disabled={isLoading}>
              Refresh
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {/* Date Range Filter */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>Date Range</Form.Label>
              <div className="position-relative">
                <div className="input-group">
                  <button
                    className="form-control text-start"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    disabled={isLoading}
                    style={{ cursor: 'pointer', border: '1px solid #dee2e6' }}
                  >
                    <i className="bi bi-calendar me-2"></i>
                    {getDisplayDateRange()}
                  </button>
                  {!isDefaultDate() && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={clearDateFilter}
                      disabled={isLoading}
                      title="Reset to today"
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  )}
                </div>


                {/* Date Range Picker */}
                {showDatePicker && (
                  <div
                    className="position-absolute top-100 start-0 mt-1 bg-white border rounded shadow-lg"
                    style={{
                      zIndex: 9999,
                      width: 'max-content',
                      transform: 'scale(0.85)',
                      transformOrigin: 'top left'
                    }}
                  >
                    <DateRangePicker
                      onChange={handleDateRangeChange}
                      moveRangeOnFirstSelection={false}
                      months={1}
                      ranges={dateRange}
                      direction="horizontal"
                      showDateDisplay={false}
                    />
                    <div className="p-2 border-top">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setShowDatePicker(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Form.Group>
          </Col>

          {/* Telecaller Filter */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>User</Form.Label>
              <Form.Select
                value={filters.usermid || filters.telecaller_id || ''}
                onChange={(e) => onFiltersChange({
                  usermid: e.target.value ? Number(e.target.value) : undefined,
                  telecaller_id: e.target.value ? Number(e.target.value) : undefined
                })}
                disabled={isLoading}
              >
                <option value="">All Users</option>
                {useroptions.map((telecaller) => (
                  <option key={telecaller.usermid} value={telecaller.usermid}>
                    {telecaller.username}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Search Filter */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search telecallers..."
                value={filters.search || ''}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
                disabled={isLoading}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}