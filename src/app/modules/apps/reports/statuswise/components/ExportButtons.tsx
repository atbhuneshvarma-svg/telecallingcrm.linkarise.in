// src/app/modules/apps/leads/statuswise/components/ExportButtons/ExportButtons.tsx
import React from 'react'
import { LeadStatusData } from '../core/_models'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface ExportButtonsProps {
  onExportExcel: () => void
  onExportPDF: () => void
  dataCount: number
  leads: LeadStatusData[]
  filters: {
    date_from: string
    date_to: string
    campaign: string
    telecaller: string
    statusname: string
  }
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportExcel,
  onExportPDF,
  dataCount,
  leads,
  filters
}) => {
  // Prepare data for export
  const prepareExportData = () => {
    return leads.map((lead, index) => ({
      'Sr.No': index + 1,
      'Campaign': lead.campaign || '',
      'User': lead.telecaller || '',
      'Lead Name': lead.prospectname || '',
      'Mobile': lead.mobile || '',
      'Status': lead.statusname || '',
      'Status Date': lead.statusdate ? format(new Date(lead.statusdate), 'dd-MM-yyyy HH:mm') : '',
      'Added On': lead.created_at ? format(new Date(lead.created_at), 'dd-MM-yyyy') : '',
      'Lead ID': lead.leadmid || '',
    }))
  }

  const handleExportExcel = () => {
    if (dataCount === 0) {
      alert('No data to export!')
      return
    }

    try {
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
      const sheetName = 'Status Wise Leads'
      XLSX.utils.book_append_sheet(wb, ws, sheetName)
      
      // Generate filename with date and filters
      const fileName = generateFileName('xlsx')
      
      // Generate and save Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      saveAs(blob, fileName)
      
      onExportExcel() // Call parent callback if needed
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Failed to export to Excel. Please try again.')
    }
  }

  const handleExportPDF = () => {
    if (dataCount === 0) {
      alert('No data to export!')
      return
    }

    try {
      // For PDF export, we'll generate an HTML table and use print dialog
      // You can also use libraries like jsPDF or html2pdf if needed
      const exportData = prepareExportData()
      
      // Create HTML table
      let html = `
        <html>
        <head>
          <title>Status Wise Leads Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; font-size: 20px; margin-bottom: 20px; }
            h2 { color: #666; font-size: 14px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8f9fa; color: #333; font-weight: 600; 
                  padding: 10px; border: 1px solid #dee2e6; text-align: left; }
            td { padding: 8px 10px; border: 1px solid #dee2e6; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
            .filter-info { background-color: #f8f9fa; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
            .filter-item { margin-right: 15px; display: inline-block; }
          </style>
        </head>
        <body>
          <h1>Status Wise Leads Report</h1>
          
          <div class="filter-info">
            <strong>Report Filters:</strong><br/>
            <span class="filter-item">Date: ${filters.date_from} to ${filters.date_to}</span>
            ${filters.campaign ? `<span class="filter-item">Campaign: ${filters.campaign}</span>` : ''}
            ${filters.telecaller ? `<span class="filter-item">User: ${filters.telecaller}</span>` : ''}
            ${filters.statusname ? `<span class="filter-item">Status: ${filters.statusname}</span>` : ''}
            <span class="filter-item">Total Records: ${dataCount}</span>
          </div>
          
          <table>
            <thead>
              <tr>
                ${Object.keys(exportData[0] || {}).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${exportData.map(row => `
                <tr>
                  ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            Generated on: ${format(new Date(), 'dd-MM-yyyy HH:mm')}<br/>
            © 2025 Arth Technology
          </div>
        </body>
        </html>
      `
      
      // Open print dialog for PDF
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()
        printWindow.print()
        printWindow.onafterprint = () => printWindow.close()
      }
      
      onExportPDF() // Call parent callback if needed
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      alert('Failed to export to PDF. Please try again.')
    }
  }

  const generateFileName = (extension: string): string => {
    const dateStr = format(new Date(), 'dd-MM-yyyy')
    const filterStr = [
      filters.campaign ? `_${filters.campaign}` : '',
      filters.telecaller ? `_${filters.telecaller}` : '',
      filters.statusname ? `_${filters.statusname}` : ''
    ].join('')
    
    return `Status_Wise_Leads_${dateStr}${filterStr}.${extension}`
  }

  return (
    <div className="mt-4">
      <div className="d-flex gap-2">
        <button 
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={handleExportExcel}
          style={{ 
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: '500'
          }}
          disabled={dataCount === 0}
          title={dataCount === 0 ? 'No data to export' : 'Export to Excel'}
        >
          <i className="bi bi-file-earmark-excel"></i>
          Export to Excel
        </button>
        <button 
          className="btn btn-danger d-flex align-items-center gap-2"
          onClick={handleExportPDF}
          style={{ 
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: '500'
          }}
          disabled={dataCount === 0}
          title={dataCount === 0 ? 'No data to export' : 'Export to PDF'}
        >
          <i className="bi bi-file-earmark-pdf"></i>
          Export PDF
        </button>
      </div>
      
      {/* Export info */}
      {dataCount > 0 && (
        <div className="mt-2 text-muted" style={{ fontSize: '12px' }}>
          Export will include {dataCount} records
        </div>
      )}
    </div>
  )
}

export default ExportButtons