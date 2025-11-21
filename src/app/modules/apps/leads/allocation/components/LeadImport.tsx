import React, { useState } from 'react'
import { useLeadAllocation } from '../hooks/useLeadAllocation'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface CampaignFileModalProps {
  show: boolean
  onFileSelect: (file: File, campaignmid: number) => Promise<void>
  onClose: () => void
}

export const CampaignFileModal: React.FC<CampaignFileModalProps> = ({
  show,
  onFileSelect,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [campaignmid, setCampaignmid] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ Pull campaign dropdowns from context
  const { campaigns } = useLeadAllocation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (selectedFile) {
      const validTypes = [
        '.csv',
        '.xlsx',
        '.xls',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ]
      const fileExtension = selectedFile.name
        .toLowerCase()
        .slice(selectedFile.name.lastIndexOf('.'))
      const fileType = selectedFile.type

      if (!validTypes.includes(fileExtension) && !validTypes.includes(fileType)) {
        setError('Please select a valid file type (CSV, XLSX, XLS)')
        setFile(null)
        return
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        setFile(null)
        return
      }
    }

    setFile(selectedFile)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError('Please choose a file to upload.')
      return
    }

    if (!campaignmid) {
      setError('Please select a campaign.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      console.log('📤 Uploading file:', file.name, 'for campaignmid:', campaignmid)
      await onFileSelect(file, Number(campaignmid))
      setFile(null)
      setCampaignmid('')
      const fileInput = document.getElementById('fileInput') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      onClose()
    } catch (error) {
      console.error('❌ Error importing leads:', error)
      setError('Failed to import leads. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ Download Sample File Function - Updated to match your exact format
  const downloadSampleFile = (format: 'xlsx' | 'csv') => {
    // Sample data matching your exact format
    const sampleData = [
      {
        'Name': 'John Doe',
        'Mobile': '9876543210',
        'Email': 'john@example.com',
        'Address': 'Vadodara',
        'Purpose': 'study',
        'Detail': 'Interested in plan A',
        'Extra_field1': 'Value1',
        'Extra_field2': 'Value2',
        'Extra_field3': 'Value3'
      },
      {
        'Name': 'Jane Smith',
        'Mobile': '9123456780',
        'Email': 'jane@example.com',
        'Address': 'Jarod',
        'Purpose': '',
        'Detail': 'Follow-up required',
        'Extra_field1': '',
        'Extra_field2': '',
        'Extra_field3': ''
      },
      {
        'Name': 'Bob Lee',
        'Mobile': '9988776655',
        'Email': 'bob@example.com',
        'Address': 'Banglore',
        'Purpose': '',
        'Detail': 'High priority lead',
        'Extra_field1': 'Extra1',
        'Extra_field2': 'Extra2',
        'Extra_field3': 'Extra3'
      },
      {
        'Name': 'Alice Brown',
        'Mobile': '9876543211',
        'Email': 'alice@example.com',
        'Address': 'Mumbai',
        'Purpose': 'inquiry',
        'Detail': 'Requested callback',
        'Extra_field1': 'Test1',
        'Extra_field2': 'Test2',
        'Extra_field3': 'Test3'
      },
      {
        'Name': 'Charlie Wilson',
        'Mobile': '9123456789',
        'Email': 'charlie@example.com',
        'Address': 'Delhi',
        'Purpose': 'demo',
        'Detail': 'Scheduled for product demo',
        'Extra_field1': '',
        'Extra_field2': '',
        'Extra_field3': ''
      }
    ]

    try {
      const worksheet = XLSX.utils.json_to_sheet(sampleData)
      
      // Set column widths for better readability
      const colWidths = [
        { wch: 15 }, // Name
        { wch: 12 }, // Mobile
        { wch: 25 }, // Email
        { wch: 15 }, // Address
        { wch: 12 }, // Purpose
        { wch: 20 }, // Detail
        { wch: 12 }, // Extra_field1
        { wch: 12 }, // Extra_field2
        { wch: 12 }, // Extra_field3
      ]
      worksheet['!cols'] = colWidths

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Template')

      if (format === 'xlsx') {
        // Download as Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        })
        saveAs(data, 'sample-leads.xlsx')
      } else {
        // Download as CSV
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet)
        const data = new Blob([csvOutput], { type: 'text/csv;charset=utf-8' })
        saveAs(data, 'sample-leads.csv')
      }
    } catch (error) {
      console.error('Error generating sample file:', error)
      setError('Failed to generate sample file. Please try again.')
    }
  }

  if (!show) return null

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Import Leads</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>

          <div className="modal-body">
            {/* ✅ Sample Download Section */}
            <div className="alert alert-info mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Need a sample file?</strong>
                  <p className="mb-0 small">Download our template to ensure proper formatting.</p>
                </div>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => downloadSampleFile('xlsx')}
                    disabled={isSubmitting}
                  >
                    <i className="fas fa-download me-1"></i>
                    Excel Template
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => downloadSampleFile('csv')}
                    disabled={isSubmitting}
                  >
                    <i className="fas fa-download me-1"></i>
                    CSV Template
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ File Format Instructions */}
            <div className="card mb-3">
              <div className="card-body py-2">
                <h6 className="card-title mb-2">Expected File Format:</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Purpose</th>
                        <th>Detail</th>
                        <th>Extra_field1</th>
                        <th>Extra_field2</th>
                        <th>Extra_field3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John Doe</td>
                        <td>9876543210</td>
                        <td>john@example.com</td>
                        <td>Vadodara</td>
                        <td>study</td>
                        <td>Interested in plan A</td>
                        <td>Value1</td>
                        <td>Value2</td>
                        <td>Value3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <small className="text-muted">
                  <strong>Note:</strong> Keep the column headers exactly as shown above.
                </small>
              </div>
            </div>

            {/* ✅ Campaign dropdown */}
            <div className="mb-3">
              <label htmlFor="campaignmid" className="form-label fw-semibold">
                Select Campaign *
              </label>
              <select
                id="campaignmid"
                className="form-select"
                value={campaignmid}
                onChange={(e) => setCampaignmid(e.target.value)}
                disabled={isSubmitting}
                required
              >
                <option value="">-- Select Campaign --</option>
                {campaigns.map((cm: any) => (
                  <option key={cm.campaignmid} value={cm.campaignmid}>
                    {cm.campaignname}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ File input */}
            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label fw-semibold">
                Select File *
              </label>
              <input
                id="fileInput"
                type="file"
                className="form-control"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
                disabled={isSubmitting}
                required
              />
              <div className="form-text">
                Supported formats: CSV, XLSX, XLS (Max 10MB)
              </div>
            </div>

            {/* ✅ Required Fields Info */}
            <div className="alert alert-warning py-2 small">
              <strong>Required Fields:</strong> Name, Mobile, Email
              <br />
              <strong>Optional Fields:</strong> Address, Purpose, Detail, Extra_field1, Extra_field2, Extra_field3
            </div>

            {/* ✅ Error display */}
            {error && (
              <div className="alert alert-danger py-2">
                <small>{error}</small>
              </div>
            )}

            {/* ✅ File info */}
            {file && (
              <div className="alert alert-success py-2">
                <small>
                  <strong>Selected file:</strong> {file.name} (
                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                </small>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || !campaignmid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload me-2"></i>
                  Import Leads
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}