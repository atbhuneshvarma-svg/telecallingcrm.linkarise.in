import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import FollowupFilters from './components/FollowupFilters';
import FollowupTable from './components/FollowupTable';
import FollowupPagination from './components/FollowupPagination';
import LeadStatusUpdateModal from '../allleads/components/LeadStatusUpdateModal';
import { getLeadFollowupList } from './core/_request';
import { Lead } from '../allleads/core/_models';
import { FollowupLead } from './core/_models';

const LeadFollowup: React.FC = () => {
  const location = useLocation();
  const [followupLeads, setFollowupLeads] = useState<FollowupLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Status modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<FollowupLead | null>(null);

  // Parse URL parameters for initial filters
  const getInitialFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    
    return {
      user: searchParams.get('user_filter') || 'All',
      campaign: searchParams.get('campaign_filter') || 'All',
      status: searchParams.get('status_filter') || 'All',
      followupDate: searchParams.get('followup_date') || '',
    };
  };

  const [filters, setFilters] = useState(getInitialFilters());
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Memoized fetch function with all filters
  const fetchFollowups = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching with filters:', filters);
      
      const res = await getLeadFollowupList(
        currentPage,
        entriesPerPage,
        filters.followupDate,
        filters.user,
        filters.campaign,
        filters.status
      );

      if (res.result) {
        setFollowupLeads(res.data || []);
        setTotalPages(res.total_pages || 1);
        setTotalRecords(res.total_records || 0);
        
        if (res.data?.length === 0 && currentPage > 1) {
          setCurrentPage((prev) => Math.max(1, prev - 1));
        }
        
        const activeFilters = Object.values(filters).filter(val => 
          val && val !== 'All'
        ).length;
        
        if (activeFilters > 0) {
          toast.success(`Found ${res.data?.length || 0} leads with current filters`);
        }
      } else {
        setFollowupLeads([]);
        toast.error(res.message || 'Failed to load follow-up leads');
      }
    } catch (err: any) {
      console.error('Error fetching followups:', err);
      setFollowupLeads([]);
      toast.error(err.response?.data?.message || 'Error loading follow-up leads');
    } finally {
      setLoading(false);
    }
  }, [currentPage, entriesPerPage, filters]);

  // Initial load and when dependencies change
  useEffect(() => {
    fetchFollowups();
  }, [fetchFollowups]);

  // Handle URL changes
  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);
    setCurrentPage(1);
  }, [location.search]);

  // ✅ ADD MISSING HANDLER FUNCTIONS
  const handleStatusClick = useCallback((lead: FollowupLead) => {
    setSelectedLead(lead);
    setShowStatusModal(true);
  }, []);

  const handleViewClick = useCallback((lead: FollowupLead) => {
    console.log('View lead:', lead);
    toast.info('View lead functionality to be implemented');
  }, []);

  const handleEditClick = useCallback((lead: FollowupLead) => {
    console.log('Edit lead:', lead);
    toast.info('Edit lead functionality to be implemented');
  }, []);

  const handleCallClick = useCallback((lead: FollowupLead) => {
    if (lead.phone) {
      window.open(`tel:${lead.phone}`, '_self');
    } else {
      toast.warning('No phone number available for this lead');
    }
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    // Implement server-side search if needed
    console.log('Search term:', searchTerm);
    toast.info('Search functionality to be implemented');
  }, []);

  // Refresh leads after update
  const refreshLeads = useCallback(() => {
    fetchFollowups();
    toast.success('Follow-up status updated successfully');
  }, [fetchFollowups]);

  // Handle entries per page change
  const handleEntriesPerPageChange = useCallback((value: number) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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

  // Calculate pagination data
  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const showingFrom = startIndex + 1;
    const showingTo = Math.min(startIndex + followupLeads.length, totalRecords);

    return {
      data: followupLeads,
      startIndex,
      showingFrom,
      showingTo,
      totalFilteredPages: totalPages,
      totalFilteredRecords: totalRecords,
    };
  }, [followupLeads, currentPage, entriesPerPage, totalPages, totalRecords]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchFollowups();
      }
    }, 120000);

    return () => clearInterval(interval);
  }, [fetchFollowups, loading]);

  return (
    <div className="container-fluid py-4">
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
        {/* Active Filters Badge */}
        

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

        {/* Table - PASS THE HANDLER FUNCTIONS */}
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
          onSearch={handleSearch}
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