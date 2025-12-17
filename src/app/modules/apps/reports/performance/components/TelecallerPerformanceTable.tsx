import React, { useState, useEffect } from 'react'
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
  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    if (isLoading) setShowSkeleton(true)
    else {
      const timeout = setTimeout(() => setShowSkeleton(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

  // Skeleton rows
  const skeletonRows: TelecallerPerformance[] = Array.from({ length: perPage }).map((_, index) => ({
    sr_no: index,
    telecaller: '',
    date: '',
    first_call: '',
    last_call: '',
    dialed: 0,
    answered: 0,
    interested: 0,
    confirmed: 0,
    talk_time: ''
  }))

  const startIndex = ((currentPage - 1) * perPage) + 1

  const formatNumber = (num: number) => num.toLocaleString()

  const getPerformanceBadge = (answered: number, dialed: number) => {
    if (dialed === 0) return 'secondary'
    const rate = (answered / dialed) * 100
    if (rate >= 50) return 'success'
    if (rate >= 25) return 'warning'
    return 'danger'
  }

  // Filtered data
  const filteredData = (showSkeleton ? skeletonRows : performanceData).filter(item =>
    item.telecaller.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Skeleton Cell
  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span style={{ height: '20px', display: 'block', borderRadius: '4px' }} className="placeholder col-12"></span>
    </div>
  )

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span className="text-info">Performance Data</span>
        <div className="w-25">
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
                if (showSkeleton) {
                  return (
                    <tr key={index}>
                      {Array.from({ length: 11 }).map((_, i) => (
                        <td key={i}><SkeletonCell /></td>
                      ))}
                    </tr>
                  )
                }

                const answerRate = item.dialed > 0 ? ((item.answered / item.dialed) * 100) : 0

                return (
                  <tr key={item.sr_no}>
                    <td className="ps-4 fw-semibold">{startIndex + index}</td>
                    <td>{item.telecaller || <SkeletonCell />}</td>
                    <td>{item.date || <SkeletonCell />}</td>
                    <td>
                      <span className={`badge badge-light-${item.first_call === '-' ? 'danger' : 'success'} fs-8`}>
                        {item.first_call || <SkeletonCell />}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-light-${item.last_call === '-' ? 'danger' : 'success'} fs-8`}>
                        {item.last_call || <SkeletonCell />}
                      </span>
                    </td>
                    <td className="text-center">{formatNumber(item.dialed)}</td>
                    <td className="text-center">
                      <Badge bg={getPerformanceBadge(item.answered, item.dialed)} className="fs-8">
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
                        answerRate >= 25 ? 'text-warning' : 'text-danger'}`}>
                        {answerRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>

        {filteredData.length === 0 && !showSkeleton && (
          <div className="text-center py-10">
            <i className="bi bi-table fs-2x text-gray-400 mb-3"></i>
            <h5 className="text-gray-600">
              {searchTerm ? 'No matching telecallers found' : 'No performance data available'}
            </h5>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
