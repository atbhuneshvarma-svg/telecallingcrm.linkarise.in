import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FollowupFilters from './components/FollowupFilters';
import FollowupTable from './components/FollowupTable';
import FollowupPagination from './components/FollowupPagination';
import LeadStatusUpdateModal from '../allleads/components/LeadStatusUpdateModal';
import { getLeadFollowupList } from './core/_request';
import { Lead } from '../allleads/core/_models';
import { FollowupLead } from './core/_models';

const LeadFollowup: React.FC = () => {
  const [followupLeads, setFollowupLeads] = useState<FollowupLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Status modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<FollowupLead | null>(null);

  const [filters, setFilters] = useState({
    user: 'All',
    campaign: 'All',
    status: 'All',
    followupDate: '',
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Memoized fetch function
  const fetchFollowups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getLeadFollowupList(currentPage, entriesPerPage);
      if (res.result) {
        setFollowupLeads(res.data || []);
        setTotalPages(res.total_pages || 1);
        setTotalRecords(res.total_records || 0);
        if (res.data?.length === 0 && currentPage > 1) {
          // If no data on current page, go to previous page
          setCurrentPage((prev) => Math.max(1, prev - 1));
        }
      } else {
        setFollowupLeads([]);
        toast.error('Failed to load follow-up leads');
      }
    } catch (err) {
      console.error('Error fetching followups:', err);
      setFollowupLeads([]);
      toast.error('Error loading follow-up leads');
    } finally {
      setLoading(false);
    }
  }, [currentPage, entriesPerPage]);

  // Initial load and when dependencies change
  useEffect(() => {
    fetchFollowups();
  }, [fetchFollowups]);

  // Handle opening modal
  const handleStatusClick = useCallback((lead: FollowupLead) => {
    setSelectedLead(lead);
    setShowStatusModal(true);
  }, []);

  // Handle view click
  const handleViewClick = useCallback((lead: FollowupLead) => {
    // You can implement view functionality here
    console.log('View lead:', lead);
    toast.info('View lead functionality to be implemented');
  }, []);

  // Handle edit click
  const handleEditClick = useCallback((lead: FollowupLead) => {
    // You can implement edit functionality here
    console.log('Edit lead:', lead);
    toast.info('Edit lead functionality to be implemented');
  }, []);

  // Handle call click
  const handleCallClick = useCallback((lead: FollowupLead) => {
    if (lead.phone) {
      window.open(`tel:${lead.phone}`, '_self');
    } else {
      toast.warning('No phone number available for this lead');
    }
  }, []);

  // Refresh leads after update
  const refreshLeads = useCallback(() => {
    fetchFollowups();
    toast.success('Follow-up status updated successfully');
  }, [fetchFollowups]);

  // Handle entries per page change
  const handleEntriesPerPageChange = useCallback((value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1); // Reset to first page when changing entries per page
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    setFilters({
      user: 'All',
      campaign: 'All',
      status: 'All',
      followupDate: '',
    });
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // ✅ Client-side filtering with useMemo for performance
  const filteredData = useMemo(() => {
    return followupLeads.filter(
      (lead) =>
        (filters.user === 'All' || lead.username === filters.user) &&
        (filters.campaign === 'All' || lead.campaignname === filters.campaign) &&
        (filters.status === 'All' || lead.statusname === filters.status) &&
        (filters.followupDate === '' || lead.followupdate === filters.followupDate)
    );
  }, [followupLeads, filters]);

  // Calculate pagination data
  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);
    const totalFilteredPages = Math.ceil(filteredData.length / entriesPerPage);

    return {
      data: paginatedData,
      startIndex,
      showingFrom: startIndex + 1,
      showingTo: startIndex + paginatedData.length,
      totalFilteredPages,
      totalFilteredRecords: filteredData.length,
    };
  }, [filteredData, currentPage, entriesPerPage]);

  // Auto-refresh every 2 minutes for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchFollowups();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [fetchFollowups, loading]);

  return (
    <div className="container-fluid py-4">
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="card shadow-sm">
        {/* Filters */}
        <FollowupFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
          loading={loading}
        />

        {/* Status Update Modal */}
        {selectedLead && (
          <LeadStatusUpdateModal
            show={showStatusModal}
            onHide={() => setShowStatusModal(false)}
            lead={selectedLead as unknown as Lead}
            onStatusUpdated={refreshLeads}
          />
        )}

        {/* Table */}
        <FollowupTable
          data={paginationData.data}
          loading={loading}
          currentPage={currentPage}
          entriesPerPage={entriesPerPage}
          onStatusClick={handleStatusClick}
          onCallClick={handleCallClick}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
          onEntriesPerPageChange={handleEntriesPerPageChange}
          showingFrom={paginationData.showingFrom}
          showingTo={paginationData.showingTo}
          totalRecords={paginationData.totalFilteredRecords}
        />

        {/* Pagination */}
        <FollowupPagination
          currentPage={currentPage}
          totalPages={paginationData.totalFilteredPages}
          totalEntries={paginationData.totalFilteredRecords}
          startIndex={paginationData.startIndex}
          endIndex={paginationData.showingTo}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default React.memo(LeadFollowup);