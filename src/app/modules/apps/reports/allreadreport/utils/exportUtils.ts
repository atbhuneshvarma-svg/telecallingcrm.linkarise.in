// src/app/modules/apps/reports/allleadreport/utils/exportUtils.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_THEME_API_URL

interface ExportApiResponse {
  success: boolean;
  count: number;
  header: string[];
  rows: any[][];
}

interface ExportFilters {
  status_filter?: string;
  campaign_filter?: string;
  user_filter?: string;
  team_filter?: string;
  date_from?: string;
  date_to?: string;
  per_page?: string;
}

interface LeadExportData {
  'S.No': number;
  'Lead ID': string | number;
  'Campaign': string;
  'User': string;
  'Name': string;
  'Mobile': string;
  'Email': string;
  'Address': string;
  'Purpose': string;
  'Detail': string;
  'Status': string;
  'Activity': string;
  'Remarks': string;
  'Updated On': string;
  'Follow-up Date': string;
  'Follow-up Required': string;
  'Created At': string;
  'Updated By'?: string;
  'Extra Field 1'?: string;
  'Extra Field 2'?: string;
  'Extra Field 3'?: string;
}

/**
 * Fetch data from export endpoint
 */
const fetchExportData = async (filters: ExportFilters): Promise<ExportApiResponse> => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      per_page: filters.per_page || 'all'
    });

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'per_page') {
        params.append(key, value);
      }
    });

    const url = `${API_URL}/exportall-lead`;
    console.log('Fetching export data from:', url, 'with params:', params.toString());

    const response = await axios.post<ExportApiResponse>(
      url,
      {}, // Empty body for POST request
      {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 300000, // 5 minute timeout for large exports
      }
    );

    if (!response.data.success) {
      throw new Error('Export API returned unsuccessful response');
    }

    if (!response.data.rows || response.data.rows.length === 0) {
      throw new Error('No data available for export');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching export data:', error);
    throw error;
  }
};

/**
 * Transform export API response to formatted export data
 */
const transformExportData = (apiData: ExportApiResponse): LeadExportData[] => {
  const { header, rows } = apiData;
  
  return rows.map((row, index) => {
    const exportRow: any = {
      'S.No': index + 1
    };

    // Map each column based on header
    header.forEach((columnName, colIndex) => {
      const value = row[colIndex] !== undefined && row[colIndex] !== null 
        ? row[colIndex] 
        : '';
      
      // Clean the column name for display
      const cleanColumnName = columnName.trim();
      
      // Map to export column names
      switch(cleanColumnName) {
        case 'Sr No':
          exportRow['Lead ID'] = value || index + 1;
          break;
        case 'Campaign':
          exportRow['Campaign'] = value;
          break;
        case 'User':
          exportRow['User'] = value;
          break;
        case 'Lead Name':
          exportRow['Name'] = value;
          break;
        case 'Mobile':
          exportRow['Mobile'] = value.toString();
          break;
        case 'Email':
          exportRow['Email'] = value || 'N/A';
          break;
        case 'Address':
          exportRow['Address'] = value || 'N/A';
          break;
        case 'Purpose':
          exportRow['Purpose'] = value === '-' || value === '' ? 'N/A' : value;
          break;
        case 'Detail':
          exportRow['Detail'] = value;
          break;
        case 'Status':
          exportRow['Status'] = value;
          break;
        case 'Activity':
          exportRow['Activity'] = value;
          break;
        case 'Remarks':
          exportRow['Remarks'] = value === '-' || value === '' ? 'N/A' : value;
          break;
        case 'Updated On':
          exportRow['Updated On'] = value;
          exportRow['Created At'] = value; // Use same as created if not available
          break;
        case 'Follow-up Date':
          exportRow['Follow-up Date'] = value === '-' || value === '' ? 'N/A' : value;
          break;
        case 'Updated By':
          exportRow['Updated By'] = value;
          break;
        case 'Extra_field1':
          exportRow['Extra Field 1'] = value;
          break;
        case 'Extra_field2':
          exportRow['Extra Field 2'] = value;
          break;
        case 'Extra_field3':
          exportRow['Extra Field 3'] = value;
          break;
        default:
          // For any unmapped columns, add them as-is
          exportRow[cleanColumnName] = value;
      }
    });

    // Set defaults for any missing required fields
    exportRow['Email'] = exportRow['Email'] || 'N/A';
    exportRow['Address'] = exportRow['Address'] || 'N/A';
    exportRow['Purpose'] = exportRow['Purpose'] || 'N/A';
    exportRow['Remarks'] = exportRow['Remarks'] || 'N/A';
    exportRow['Follow-up Date'] = exportRow['Follow-up Date'] || 'N/A';
    exportRow['Follow-up Required'] = 'No'; // Default value
    exportRow['Created At'] = exportRow['Created At'] || exportRow['Updated On'] || 'N/A';
    
    return exportRow as LeadExportData;
  });
};

/**
 * Main Excel export function
 */
export const exportToExcel = async (
  filters: ExportFilters = {},
  filename: string = 'lead-report'
) => {
  try {
    // Fetch data from export endpoint
    const apiData = await fetchExportData(filters);
    
    // Transform data for export
    const formattedData = transformExportData(apiData);
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Set column widths
    const wscols = [
      { wch: 5 },   // S.No
      { wch: 8 },   // Lead ID
      { wch: 15 },  // Campaign
      { wch: 12 },  // User
      { wch: 20 },  // Name
      { wch: 15 },  // Mobile
      { wch: 25 },  // Email
      { wch: 20 },  // Address
      { wch: 15 },  // Purpose
      { wch: 30 },  // Detail
      { wch: 12 },  // Status
      { wch: 15 },  // Activity
      { wch: 25 },  // Remarks
      { wch: 12 },  // Updated On
      { wch: 15 },  // Follow-up Date
      { wch: 15 },  // Follow-up Required
      { wch: 15 },  // Created At
      { wch: 12 },  // Updated By
      { wch: 15 },  // Extra Field 1
      { wch: 15 },  // Extra Field 2
      { wch: 15 },  // Extra Field 3
    ];
    worksheet['!cols'] = wscols;
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Save file
    const dateStr = new Date().toISOString().split('T')[0];
    saveAs(blob, `${filename}-${dateStr}.xlsx`);
    
    console.log(`Excel export completed: ${formattedData.length} records`);
    
  } catch (error) {
    console.error('Excel export failed:', error);
    alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

/**
 * Main CSV export function
 */
export const exportToCSV = async (
  filters: ExportFilters = {},
  filename: string = 'lead-report'
) => {
  try {
    // Fetch data from export endpoint
    const apiData = await fetchExportData(filters);
    
    // Transform data for export
    const formattedData = transformExportData(apiData);
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Generate CSV
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    // Save file
    const dateStr = new Date().toISOString().split('T')[0];
    saveAs(blob, `${filename}-${dateStr}.csv`);
    
    console.log(`CSV export completed: ${formattedData.length} records`);
    
  } catch (error) {
    console.error('CSV export failed:', error);
    alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

/**
 * Main PDF export function
 */
export const exportToPDF = async (
  filters: ExportFilters = {},
  filename: string = 'lead-report'
) => {
  try {
    // Fetch data from export endpoint
    const apiData = await fetchExportData(filters);
    
    if (apiData.rows.length === 0) {
      alert('No data to export');
      return;
    }
    
    // Get status color for badges
    const getStatusColor = (status: string): string => {
      const statusLower = status.toLowerCase();
      const colors: { [key: string]: string } = {
        'new': '#3498db',
        'hot': '#e74c3c',
        'warm': '#f39c12',
        'cold': '#95a5a6',
        'lost': '#7f8c8d',
        'won': '#2ecc71',
        'follow-up': '#9b59b6',
      };
      return colors[statusLower] || '#34495e';
    };
    
    // Create HTML table for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 20px; 
                font-size: 11px;
              }
              .header { 
                text-align: center; 
                margin-bottom: 20px;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
              }
              .header h1 { 
                margin: 0; 
                color: #333;
                font-size: 20px;
              }
              .header p { 
                margin: 3px 0; 
                color: #666;
              }
              table { 
                width: 100%; 
                border-collapse: collapse;
                margin-top: 15px;
                font-size: 10px;
              }
              th { 
                background-color: #f5f5f5; 
                border: 1px solid #ddd; 
                padding: 8px 6px; 
                text-align: left; 
                font-weight: 600;
                color: #333;
              }
              td { 
                border: 1px solid #ddd; 
                padding: 6px; 
                text-align: left;
                vertical-align: top;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 10px;
                color: #777;
                border-top: 1px solid #ddd;
                padding-top: 8px;
              }
              .status-badge {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 3px;
                color: white;
                font-size: 9px;
                font-weight: bold;
              }
              @media print {
                body { margin: 10px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Lead Report</h1>
              <p>Generated on: ${new Date().toLocaleString()}</p>
              <p>Total Records: ${apiData.count || apiData.rows.length}</p>
              <button class="no-print" onclick="window.print()" style="padding: 5px 10px; margin-top: 10px;">
                Print Report
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Lead ID</th>
                  <th>Campaign</th>
                  <th>User</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Activity</th>
                  <th>Updated On</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${apiData.rows.map((row, index) => {
                  // Find status column index
                  const statusIndex = apiData.header.indexOf('Status');
                  const status = statusIndex !== -1 ? row[statusIndex] || '' : '';
                  const statusColor = getStatusColor(status);
                  
                  // Get other column values
                  const leadIdIndex = apiData.header.indexOf('Sr No');
                  const campaignIndex = apiData.header.indexOf('Campaign');
                  const userIndex = apiData.header.indexOf('User');
                  const nameIndex = apiData.header.indexOf('Lead Name');
                  const mobileIndex = apiData.header.indexOf('Mobile');
                  const activityIndex = apiData.header.indexOf('Activity');
                  const updatedIndex = apiData.header.indexOf('Updated On');
                  const remarksIndex = apiData.header.indexOf('Remarks');
                  
                  return `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${leadIdIndex !== -1 ? row[leadIdIndex] || '' : index + 1}</td>
                      <td>${campaignIndex !== -1 ? row[campaignIndex] || '' : ''}</td>
                      <td>${userIndex !== -1 ? row[userIndex] || '' : ''}</td>
                      <td><strong>${nameIndex !== -1 ? row[nameIndex] || '' : ''}</strong></td>
                      <td>${mobileIndex !== -1 ? row[mobileIndex] || '' : ''}</td>
                      <td>
                        <span class="status-badge" style="background-color: ${statusColor}">
                          ${status}
                        </span>
                      </td>
                      <td>${activityIndex !== -1 ? row[activityIndex] || '' : ''}</td>
                      <td>${updatedIndex !== -1 ? row[updatedIndex] || '' : ''}</td>
                      <td>${remarksIndex !== -1 ? (row[remarksIndex] === '-' || row[remarksIndex] === '' ? 'N/A' : row[remarksIndex]) : 'N/A'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Lead Management System</p>
              <p>Page generated from export API</p>
            </div>
            <script>
              // Auto-print after loading
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                }, 1000);
              };
              
              window.onafterprint = function() {
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    
    console.log(`PDF export completed: ${apiData.rows.length} records`);
    
  } catch (error) {
    console.error('PDF export failed:', error);
    alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

/**
 * Export all formats with progress indicator
 */
export const exportAllFormats = async (
  filters: ExportFilters = {},
  formats: ('excel' | 'csv' | 'pdf')[] = ['excel', 'csv', 'pdf'],
  filename: string = 'lead-report'
) => {
  try {
    // Show loading indicator
    console.log('Starting export process...');
    
    for (const format of formats) {
      console.log(`Exporting ${format.toUpperCase()}...`);
      
      switch (format) {
        case 'excel':
          await exportToExcel(filters, filename);
          break;
        case 'csv':
          await exportToCSV(filters, filename);
          break;
        case 'pdf':
          await exportToPDF(filters, filename);
          break;
      }
    }
    
    console.log('All exports completed successfully');
    
  } catch (error) {
    console.error('Export process failed:', error);
    throw error;
  }
};