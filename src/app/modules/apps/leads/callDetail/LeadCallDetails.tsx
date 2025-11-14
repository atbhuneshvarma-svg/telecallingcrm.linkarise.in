import React, { useState, useEffect } from 'react';
import CallDetailsTable from './components/CallDetailsTable';
import CallDetailsPagination from './components/CallDetailsPagination';
import { CallDetail } from './core/_models';
import { callDetailsApi } from './core/_request';
import CallDetailsFilters from './components/CallDetailsFilters';

const LeadCallDetails: React.FC = () => {
  const [callDetails, setCallDetails] = useState<CallDetail[]>([]);
  const [loading, setLoading] = useState(false);
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
    date: new Date().toISOString().split('T')[0], // Default to current date
  });

  // ✅ Fetch data with pagination and filters
  const fetchCallDetails = async (page = 1) => {
    setLoading(true);
    try {
      // Build query parameters including filters
      const queryParams: any = {
        page,
        per_page: entriesPerPage,
      };

      // Add search term if provided
      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      // Add filters if not set to "All"
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
    // Don't call fetchCallDetails here as it will be triggered by useEffect
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
    </div>
  );
};

export default LeadCallDetails;