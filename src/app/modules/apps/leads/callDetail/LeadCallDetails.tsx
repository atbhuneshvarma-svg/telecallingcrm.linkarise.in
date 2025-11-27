import React, { useState, useEffect } from 'react';
import CallDetailsTable from './components/CallDetailsTable';
import CallDetailsPagination from './components/CallDetailsPagination';
import { CallDetail } from './core/_models';
import { callDetailsApi } from './core/_request';
import CallDetailsFilters from './components/CallDetailsFilters';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const LeadCallDetails: React.FC = () => {
  const [callDetails, setCallDetails] = useState<CallDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiStatus, setApiStatus] = useState<string>('Checking API...');

  // Updated filters with date range
  const [filters, setFilters] = useState({
    user: 'All',
    campaign: 'All',
    status: 'All',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Build API parameters matching your working URL format
  const buildApiParams = (page: number = 1) => {
    const params: any = {
      page,
      per_page: entriesPerPage,
    };

    // Date range - use the exact format from working URL
    if (filters.startDate && filters.endDate) {
      const startFormatted = formatDateForAPI(filters.startDate);
      const endFormatted = formatDateForAPI(filters.endDate);
      // Use the exact format: "26-11-2025+-+26-11-2025"
      params.daterange = `${startFormatted}+-+${endFormatted}`;
    }

    // Campaign ID - now using ID directly from filters
    if (filters.campaign !== 'All') {
      params.campaignid = filters.campaign;
    }

    // User MID - now using usermid directly from filters
    if (filters.user !== 'All') {
      params.usermid = filters.user;
    }

    // Status - empty string for "All" status
    if (filters.status !== 'All') {
      params.status = filters.status;
    } else {
      params.status = ''; // Empty string matches your working URL
    }

    // Search term
    if (searchTerm) {
      params.search = searchTerm;
    }

    console.log('📦 Built API params:', params);
    return params;
  };

  const formatDateForAPI = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch data with pagination and filters
  const fetchCallDetails = async (page = 1) => {
    setLoading(true);
    setApiStatus('Loading data...');
    try {
      const apiParams = buildApiParams(page);
      const res = await callDetailsApi.getPaginated(apiParams);

      console.log('📊 Full API response:', res);

      if (res && res.result) {
        setCallDetails(res.data || []);
        setCurrentPage(res.current_page || 1);
        setTotalPages(res.total_pages || 1);
        setTotalEntries(res.total_records || 0);
        setApiStatus(`Loaded ${res.data?.length || 0} records`);
      } else {
        setCallDetails([]);
        setTotalPages(1);
        setTotalEntries(0);
        setApiStatus(res?.message || 'No data received');
      }
    } catch (error: any) {
      console.error('Error fetching call details:', error);
      setCallDetails([]);
      setTotalPages(1);
      setTotalEntries(0);
      setApiStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test the exact working URL
  const testWorkingUrl = async () => {
    setLoading(true);
    setApiStatus('Testing API connection...');
    try {
      const workingUrl = 'https://crmtelecalling.linkarise.in/api/calldetails?daterange=26-11-2025+-+26-11-2025&campaignid=49&usermid=69&status=';

      console.log('🔗 Testing working URL:', workingUrl);

      const response = await fetch(workingUrl);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API test successful:', data);
        setApiStatus('API is working!');
        return data;
      } else {
        console.error('❌ API test failed:', response.status, response.statusText);
        setApiStatus(`API failed: ${response.status} ${response.statusText}`);
        return null;
      }
    } catch (error: any) {
      console.error('❌ API test error:', error);
      setApiStatus(`API error: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Export ALL filtered data
  const handleExportAllData = async () => {
    if (totalEntries === 0) {
      alert('No data available to export');
      return;
    }

    setExportLoading(true);
    try {
      let allData: CallDetail[] = [];
      const totalPagesToFetch = Math.ceil(totalEntries / 100);

      for (let page = 1; page <= totalPagesToFetch; page++) {
        const apiParams = buildApiParams(page);
        apiParams.per_page = 100; // Larger page size for export

        const res = await callDetailsApi.getPaginated(apiParams);

        if (res && res.result && res.data) {
          allData = [...allData, ...res.data];
        }

        if (page < totalPagesToFetch) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (allData.length === 0) {
        alert('No data found to export');
        return;
      }

      exportDataToExcel(allData, 'all_call_details');

    } catch (error: any) {
      console.error('Error exporting all data:', error);
      alert('Failed to export data: ' + (error.message || 'Please try again.'));
    } finally {
      setExportLoading(false);
    }
  };

  // ✅ Helper function to export data to Excel
  const exportDataToExcel = (data: any[], filename: string) => {
    try {
      if (!data || data.length === 0) {
        alert('No data available to export');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Call Details');

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      const dataBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      saveAs(dataBlob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      alert(`Successfully exported ${data.length} records to Excel`);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  // Initialize on component mount
  useEffect(() => {
    const initializeData = async () => {
      // First test with the exact working URL
      const workingData = await testWorkingUrl();

      if (workingData) {
        // If working URL succeeds, load data with current filters
        await fetchCallDetails(1);
      }
    };

    initializeData();
  }, []);

  // Handle entries per page change
  const handleEntriesPerPageChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    const defaultFilters = {
      user: 'All',
      campaign: 'All',
      status: 'All',
      startDate: today,
      endDate: today,
    };
    setFilters(defaultFilters);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchCallDetails(currentPage);
  };

  // Fetch data when dependencies change
  useEffect(() => {
    if (currentPage === 1) {
      fetchCallDetails(1);
    } else {
      setCurrentPage(1); // Reset to page 1 when filters change
    }
  }, [entriesPerPage, searchTerm, filters]);

  // Fetch data when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchCallDetails(currentPage);
    }
  }, [currentPage]);

  // Calculate showing from/to for table
  const showingFrom = totalEntries > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0;
  const showingTo = Math.min(currentPage * entriesPerPage, totalEntries);

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-transparent py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold text-gray-800 mb-0">Lead Call Details</h1>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-light-primary"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <i className="bi bi-arrow-clockwise me-2"></i>
              )}
              Refresh
            </button>

          </div>
        </div>

        {/* Filters Component */}
        <CallDetailsFilters
          entriesPerPage={entriesPerPage}
          onEntriesPerPageChange={handleEntriesPerPageChange}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
          loading={loading}
          totalRecords={totalEntries}
        />

        {/* Table Component */}
        <CallDetailsTable
          data={callDetails}
          loading={loading}
          currentPage={currentPage}
          entriesPerPage={entriesPerPage}
          onEntriesPerPageChange={handleEntriesPerPageChange}
          showingFrom={showingFrom}
          showingTo={showingTo}
          totalRecords={totalEntries}
          showSearch={true}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          filters={filters}
        />

        {/* Pagination */}
        {!loading && callDetails.length > 0 && (
          <CallDetailsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={totalEntries}
            startIndex={showingFrom}
            endIndex={showingTo}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Export Button */}
      <button
        className="btn btn-success btn-sm mt-3"
        onClick={handleExportAllData}
        disabled={exportLoading || loading || totalEntries === 0}
      >
        {exportLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            Exporting All...
          </>
        ) : (
          <>
            <i className="fas fa-file-excel me-2"></i>
            Export All Data ({totalEntries})
          </>
        )}
      </button>
    </div>
  );
};

export default LeadCallDetails;