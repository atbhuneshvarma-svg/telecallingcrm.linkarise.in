import React from 'react'
import { Table, Card, Badge, Form, InputGroup } from 'react-bootstrap'
import { TelecallerPerformance } from '../core/_models'

interface TelecallerPerformanceTableProps {
  performanceData: TelecallerPerformance[]
  isLoading: boolean
  currentPage: number
  perPage: number
  searchTerm: string
  onSearchChange: (search: string) => void
}

export const TelecallerPerformanceTable: React.FC<TelecallerPerformanceTableProps> = ({
  performanceData,
  isLoading,
  currentPage,
  perPage,
  searchTerm,
  onSearchChange
}) => {
  if (isLoading) return null

  // Calculate starting index for serial numbers
  const startIndex = ((currentPage - 1) * perPage) + 1

  // Helper function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Helper function to determine badge color based on performance
  const getPerformanceBadge = (answered: number, dialed: number) => {
    if (dialed === 0) return 'secondary'
    const rate = (answered / dialed) * 100
    if (rate >= 50) return 'success'
    if (rate >= 25) return 'warning'
    return 'danger'
  }

  // Filter data based on search term
  const filteredData = performanceData.filter(item =>
    item.telecaller.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
         <span className='text-info '>Performance Data</span> 
        </div>
        <div className="d-flex justify-content-between align-items-center w-25">
          <InputGroup size="sm">
            <Form.Control
              type="text"
              placeholder="Search telecaller..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
          </InputGroup>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table striped hover className="mb-0 align-middle table-bordered">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">Sr.No</th>
                <th>Telecaller</th>
                <th>Date</th>
                <th>First Call</th>
                <th>Last Call</th>
                <th className="text-center">Dialed</th>
                <th className="text-center">Answered</th>
                <th className="text-center">Interested</th>
                <th className="text-center">Confirmed</th>
                <th className="text-center">Talk Time</th>
                <th className="text-center">Answer Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const answerRate = item.dialed > 0 ? ((item.answered / item.dialed) * 100) : 0
                const conversionRate = item.answered > 0 ? ((item.interested / item.answered) * 100) : 0

                return (
                  <tr key={item.sr_no} className="border-bottom">
                    <td className="ps-4 fw-semibold">{startIndex + index}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-35px symbol-circle me-3">
                          <span className="symbol-label bg-light-primary text-primary fw-bold">
                            {item.telecaller.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="fw-bold text-gray-800">{item.telecaller}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-gray-600">{item.date}</span>
                    </td>
                    <td>
                      <span className={`badge badge-light-${item.first_call === '-' ? 'danger' : 'success'} fs-8`}>
                        {item.first_call}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-light-${item.last_call === '-' ? 'danger' : 'success'} fs-8`}>
                        {item.last_call}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="fw-bold text-gray-800">{formatNumber(item.dialed)}</span>
                    </td>
                    <td className="text-center">
                      <Badge
                        bg={getPerformanceBadge(item.answered, item.dialed)}
                        className="fs-8"
                      >
                        {formatNumber(item.answered)}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <span className="fw-bold text-warning">{formatNumber(item.interested)}</span>
                    </td>
                    <td className="text-center">
                      <span className="fw-bold text-success">{formatNumber(item.confirmed)}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge badge-light-${item.talk_time === '0:00' ? 'danger' : 'info'} fs-8`}>
                        {item.talk_time}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`fw-bold ${answerRate >= 50 ? 'text-success' :
                          answerRate >= 25 ? 'text-warning' : 'text-danger'
                        }`}>
                        {answerRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-10">
            <i className="bi bi-table fs-2x text-gray-400 mb-3"></i>
            <h5 className="text-gray-600">
              {searchTerm ? 'No matching telecallers found' : 'No performance data available'}
            </h5>
            <p className="text-muted">
              {searchTerm
                ? 'No telecaller performance records match your search criteria.'
                : 'No telecaller performance records found for the selected criteria.'
              }
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}