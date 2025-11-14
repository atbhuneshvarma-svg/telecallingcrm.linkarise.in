import React, { useState } from 'react'
import { useLeadAllocation } from '../hooks/useLeadAllocation'

interface CampaignFileModalProps {
  show: boolean
  onFileSelect: (file: File, campaignmid: number) => Promise<void> // ✅ make async-safe
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
      await onFileSelect(file, Number(campaignmid)) // ✅ use your hook’s importLeads method
      setFile(null)
      setCampaignmid('')
      const fileInput = document.getElementById('fileInput') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      onClose() // ✅ close modal on success
    } catch (error) {
      console.error('❌ Error importing leads:', error)
      setError('Failed to import leads. Please try again.')
    } finally {
      setIsSubmitting(false)
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
                disabled={ isSubmitting}
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

            {/* ✅ Error display */}
            {error && (
              <div className="alert alert-danger py-2">
                <small>{error}</small>
              </div>
            )}

            {/* ✅ File info */}
            {file && (
              <div className="alert alert-info py-2">
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
              className="btn btn-secondary"
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
              {isSubmitting ? 'Uploading...' : 'Import Leads'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
