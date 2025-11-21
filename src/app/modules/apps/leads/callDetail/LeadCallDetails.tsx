import React, { useState, useEffect } from 'react';
import CallDetailsTable from './components/CallDetailsTable';
import CallDetailsPagination from './components/CallDetailsPagination';
import { CallDetail } from './core/_models';
import { callDetailsApi } from './core/_request';
import CallDetailsFilters from './components/CallDetailsFilters';
import * as XLSX from 'xlsx'; // Add this import
import { saveAs } from 'file-saver'; // Add this import

const LeadCallDetails: React.FC = () => {
  const [callDetails, setCallDetails] = useState<CallDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Add missing filters state
  const [filters, setFilters] = useState({
    user: 'All',
    campaign: 'All',
    status: 'All',
    date: new Date().toISOString().split('T')[0],
  });

  // ✅ Fetch data with pagination and filters
  const fetchCallDetails = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams: any = {
        page,
        per_page: entriesPerPage,
      };

      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      if (filters.user !== 'All') {
        queryParams.user = filters.user;
      }
      if (filters.campaign !== 'All') {
        queryParams.campaign = filters.campaign;
      }
      if (filters.status !== 'All') {
        queryParams.status = filters.status;
      }
      if (filters.date) {
        queryParams.date = filters.date;
      }

      const res = await callDetailsApi.getPaginated(queryParams);

      if (res.result) {
        setCallDetails(res.data || []);
        setCurrentPage(res.current_page || 1);
        setTotalPages(res.total_pages || 1);
        setTotalEntries(res.total_records || 0);
      } else {
        setCallDetails([]);
      }
    } catch (error: any) {
      console.error('Error fetching call details:', error);
      setCallDetails([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Export ALL filtered data by fetching all pages
  const handleExportAllData = async () => {
    if (totalEntries === 0) {
      alert('No data available to export');
      return;
    }

    setExportLoading(true);
    try {
      let allData: CallDetail[] = [];

      // Calculate how many pages we need to fetch
      const totalPagesToFetch = Math.ceil(totalEntries / 100); // Use larger page size for efficiency

      for (let page = 1; page <= totalPagesToFetch; page++) {
        const queryParams: any = {
          page,
          per_page: 100, // Larger page size for export
        };

        if (searchTerm) {
          queryParams.search = searchTerm;
        }

        if (filters.user !== 'All') {
          queryParams.user = filters.user;
        }
        if (filters.campaign !== 'All') {
          queryParams.campaign = filters.campaign;
        }
        if (filters.status !== 'All') {
          queryParams.status = filters.status;
        }
        if (filters.date) {
          queryParams.date = filters.date;
        }

        const res = await callDetailsApi.getPaginated(queryParams);

        if (res.result && res.data) {
          allData = [...allData, ...res.data];
        }

        // Small delay to avoid overwhelming the server
        if (page < totalPagesToFetch) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (allData.length === 0) {
        alert('No data found to export');
        return;
      }

      // Export the collected data
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

      // Create worksheet from data
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Call Details');

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      const dataBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Save file
      saveAs(dataBlob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);

      alert(`Successfully exported ${data.length} records to Excel`);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  // ✅ Handle entries per page change
  const handleEntriesPerPageChange = (value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  // ✅ Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // ✅ Handle filters change
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // ✅ Handle reset filters
  const handleResetFilters = () => {
    const defaultFilters = {
      user: 'All',
      campaign: 'All',
      status: 'All',
      date: new Date().toISOString().split('T')[0],
    };
    setFilters(defaultFilters);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // ✅ Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ✅ Refresh data
  const handleRefresh = () => {
    fetchCallDetails(currentPage);
  };

  // ✅ Fetch data when dependencies change
  useEffect(() => {
    fetchCallDetails(currentPage);
  }, [currentPage, entriesPerPage, searchTerm, filters]);

  // ✅ Calculate showing from/to for table
  const showingFrom = (currentPage - 1) * entriesPerPage + 1;
  const showingTo = Math.min(currentPage * entriesPerPage, totalEntries);

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-transparent py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="fw-bold text-gray-800 mb-0">Lead Call Details</h1>
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
            startIndex={(currentPage - 1) * entriesPerPage}
            endIndex={showingTo}
            onPageChange={handlePageChange}
          />
        )}

      </div>
        <button
          className="btn btn-success btn-sm mt-3 "
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