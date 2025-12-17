import React from 'react'
import { Lead } from '../core/types'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface ExportButtonProps {
  data: Lead[]
  pagination: {
    page: number
    per_page: number
  }
  filename?: string
  exportType?: 'csv' | 'excel'
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  pagination,
  filename = 'leads_export',
  exportType = 'excel' // default to Excel
}) => {
  // Prepare data for export
  const prepareExportData = () => {
    return data.map((lead, index) => ({
      'Sr.No': index + 1 + (pagination.page - 1) * pagination.per_page,
      'Campaign': lead.campaign || '',
      'User': lead.telecaller || '',
      'Lead Name': lead.prospectname || '',
      'Mobile': lead.mobile || '',
      'Stage': lead.stage || '',
      'Stage Date': lead.stagedate ? format(new Date(lead.stagedate), 'dd-MM-yyyy') : '',
      'Added On': lead.created_at ? format(new Date(lead.created_at), 'dd-MM-yyyy') : '',
      // Add any additional fields you need
      'Lead ID': lead.leadmid || '',
    }))
  }

  const exportToCSV = () => {
    const exportData = prepareExportData()
    const headers = Object.keys(exportData[0] || {})
    
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row]
          const stringValue = String(value)
          
          // Escape commas, quotes, and newlines
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `${filename}.csv`)
  }

  const exportToExcel = () => {
    const exportData = prepareExportData()
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // Auto-size columns
    const maxWidths: number[] = []
    exportData.forEach(row => {
      Object.values(row).forEach((value, colIndex) => {
        const length = String(value).length
        maxWidths[colIndex] = Math.max(maxWidths[colIndex] || 0, length)
      })
    })
    
    ws['!cols'] = maxWidths.map(width => ({ wch: Math.min(width + 2, 50) }))
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Leads')
    
    // Generate and save Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `${filename}.xlsx`)
  }

  const handleExport = () => {
    if (exportType === 'excel') {
      exportToExcel()
    } else {
      exportToCSV()
    }
  }

  const handleExportMenu = (type: 'csv' | 'excel') => {
    if (type === 'excel') {
      exportToExcel()
    } else {
      exportToCSV()
    }
  }

  return (
    <div className="btn-group mt-3">
      <button 
        className="btn btn-success"
        onClick={handleExport}
        disabled={data.length === 0}
      >
        <i className="bi bi-download me-2"></i>
        Export {exportType === 'excel' ? 'Excel' : 'CSV'} ({data.length})
      </button>
      
      <button 
        type="button" 
        className="btn btn-success dropdown-toggle dropdown-toggle-split"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={data.length === 0}
      >
        <span className="visually-hidden">Toggle Dropdown</span>
      </button>
      
      <ul className="dropdown-menu">
        <li>
          <button 
            className="dropdown-item" 
            onClick={() => handleExportMenu('excel')}
          >
            <i className="bi bi-file-earmark-excel me-2 text-success"></i>
            Export as Excel (.xlsx)
          </button>
        </li>
        <li>
          <button 
            className="dropdown-item" 
            onClick={() => handleExportMenu('csv')}
          >
            <i className="bi bi-filetype-csv me-2 text-primary"></i>
            Export as CSV (.csv)
          </button>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button 
            className="dropdown-item" 
            onClick={() => {
              const exportData = prepareExportData()
              console.log('Export Data:', exportData)
              navigator.clipboard.writeText(JSON.stringify(exportData, null, 2))
                .then(() => alert('Data copied to clipboard!'))
            }}
          >
            <i className="bi bi-clipboard me-2"></i>
            Copy JSON to Clipboard
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ExportButton