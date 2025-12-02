// src/app/modules/apps/reports/allleadreport/utils/exportUtils.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LeadData } from '../core/types';

export const exportToExcel = (data: LeadData[], filename: string = 'lead-report') => {
  // Format data for export
  const formattedData = data.map((lead, index) => ({
    'S.No': index + 1,
    'Lead ID': lead.leadmid,
    'Campaign': lead.campaignname,
    'User': lead.username,
    'Name': lead.leadname,
    'Mobile': lead.phone,
    'Email': lead.email || 'N/A',
    'Address': lead.address || 'N/A',
    'Purpose': lead.purpose || 'N/A',
    'Detail': lead.detail,
    'Status': lead.statusname,
    'Activity': lead.activity,
    'Remarks': lead.leadremarks || 'N/A',
    'Updated On': lead.updatedon,
    'Follow-up Date': lead.followupdate || 'N/A',
    'Follow-up Required': lead.followup === 1 ? 'Yes' : 'No',
    'Created At': lead.created_at || 'N/A',
  }));

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
  ];
  worksheet['!cols'] = wscols;
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  saveAs(blob, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToCSV = (data: LeadData[], filename: string = 'lead-report') => {
  // Format data for CSV
  const formattedData = data.map((lead, index) => ({
    'S.No': index + 1,
    'Lead ID': lead.leadmid,
    'Campaign': lead.campaignname,
    'User': lead.username,
    'Name': lead.leadname,
    'Mobile': lead.phone,
    'Email': lead.email || 'N/A',
    'Address': lead.address || 'N/A',
    'Purpose': lead.purpose || 'N/A',
    'Detail': lead.detail,
    'Status': lead.statusname,
    'Activity': lead.activity,
    'Remarks': lead.leadremarks || 'N/A',
    'Updated On': lead.updatedon,
    'Follow-up Date': lead.followupdate || 'N/A',
    'Follow-up Required': lead.followup === 1 ? 'Yes' : 'No',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Generate CSV
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  
  // Save file
  saveAs(blob, `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportToPDF = (data: LeadData[], filename: string = 'lead-report') => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }
  
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
              font-size: 12px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h1 { 
              margin: 0; 
              color: #333;
              font-size: 24px;
            }
            .header p { 
              margin: 5px 0; 
              color: #666;
            }
            table { 
              width: 100%; 
              border-collapse: collapse;
              margin-top: 20px;
            }
            th { 
              background-color: #f5f5f5; 
              border: 1px solid #ddd; 
              padding: 10px 8px; 
              text-align: left; 
              font-weight: 600;
              color: #333;
            }
            td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left;
              vertical-align: top;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 11px;
              color: #777;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            .status-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              color: white;
              font-size: 11px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lead Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Total Records: ${data.length}</p>
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
              ${data.map((lead, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>#${lead.leadmid}</td>
                  <td>${lead.campaignname}</td>
                  <td>${lead.username}</td>
                  <td><strong>${lead.leadname}</strong></td>
                  <td>${lead.phone}</td>
                  <td>
                    <span class="status-badge" style="background-color: ${lead.statuscolor}">
                      ${lead.statusname}
                    </span>
                  </td>
                  <td>${lead.activity}</td>
                  <td>${lead.updatedon}</td>
                  <td>${lead.leadremarks || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Lead Management System</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 500);
  }
};