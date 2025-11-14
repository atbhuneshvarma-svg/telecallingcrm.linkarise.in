import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLeads } from './hooks/useLeads';
import { Lead } from './core/_models';
import LeadsHeader from './components/LeadsHeader';
import LeadViewModal from './components/LeadViewModal';
import LeadsFilters from './components/LeadsFilters';
import LeadsTable from './components/LeadsTable';
import LeadsPagination from './components/LeadsPagination';
import { AddEditLeadModal } from './components/CreateLeadModal';
import LeadStatusUpdateModal from './components/LeadStatusUpdateModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTeamManagement } from '../../manage/teams';
import { useToast } from './hooks/useToast'; // Import your toast hook

const AllLeads: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | undefined>(undefined);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [serverSideFiltering, setServerSideFiltering] = useState<boolean>(true);

  // Use your toast hook
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  const {
    leads,
    filteredLeads,
    loading,
    filters,
    entriesPerPage,
    currentPage,
    handleFilterChange,
    handlePageChange,
    handleEntriesPerPageChange,
    refreshLeads,
    uniqueUsers,
    uniqueCampaigns,
    uniqueStatuses,
    uniqueTeams,
    deleteLead: deleteLeadFromHook,
    pagination,
    filterOptions,
    filterOptionsLoading,
  } = useLeads({ serverSideFiltering });

  const { teams, loading: teamLoading } = useTeamManagement();

  const allTeams = useMemo(() => {
    const baseTeams =
      uniqueTeams.length > 1 ? uniqueTeams.map((team) => team.name) : teams.map((t) => t.teamname);
    return ['All Teams', ...baseTeams.filter((team) => team !== 'All Teams')];
  }, [uniqueTeams, teams]);

  const dataToRender = serverSideFiltering ? leads : filteredLeads;

  const showingFrom = useMemo(
    () => (dataToRender.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0),
    [currentPage, entriesPerPage, dataToRender.length]
  );

  const showingTo = useMemo(
    () => Math.min(currentPage * entriesPerPage, pagination?.total_records || dataToRender.length),
    [currentPage, entriesPerPage, pagination?.total_records, dataToRender.length]
  );

  const handleEntriesChange = useCallback(
    (perPage: number) => {
      handleEntriesPerPageChange(perPage);
      showInfo(`Showing ${perPage} entries per page`);
    },
    [handleEntriesPerPageChange, showInfo]
  );

  const handlePageChangeWithToast = useCallback(
    (page: number) => {
      handlePageChange(page);
      showInfo(`Navigated to page ${page}`);
    },
    [handlePageChange, showInfo]
  );

  const handleAddSuccess = useCallback(() => {
    refreshLeads();
    showSuccess(leadToEdit ? 'Lead updated successfully!' : 'Lead created successfully!');
    setShowModal(false);
    setLeadToEdit(undefined);
  }, [refreshLeads, leadToEdit, showSuccess]);

  const handleViewClick = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  }, []);

  const handleEditClick = useCallback((lead: Lead) => {
    setLeadToEdit(lead);
    setShowModal(true);
  }, []);

  const handleDeleteClick = useCallback(
    async (lead: Lead) => {
      if (
        window.confirm(
          `Are you sure you want to delete "${
            lead.leadname || 'this lead'
          }"? This action cannot be undone.`
        )
      ) {
        try {
          const result = await deleteLeadFromHook(lead.leadmid);
          if (result.success) {
            showSuccess(result.message || 'Lead deleted successfully!');
            refreshLeads();
          } else {
            showError(result.message || 'Failed to delete lead');
          }
        } catch (err: any) {
          showError(err);
        }
      }
    },
    [deleteLeadFromHook, refreshLeads, showSuccess, showError]
  );

  const handleStatusClick = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setShowStatusModal(true);
  }, []);

  const handleAddNewClick = useCallback(() => {
    setLeadToEdit(undefined);
    setShowModal(true);
    showInfo('Adding new lead...');
  }, [showInfo]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setLeadToEdit(undefined);
  }, []);

  const handleViewModalClose = useCallback(() => {
    setShowViewModal(false);
    setSelectedLead(null);
  }, []);

  const handleStatusModalClose = useCallback(() => {
    setShowStatusModal(false);
    setSelectedLead(null);
  }, []);

  const handleStatusUpdate = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setShowViewModal(false);
    setShowStatusModal(true);
  }, []);

  const handleRefresh = useCallback(() => {
    showInfo('Refreshing leads...');
    refreshLeads();
  }, [refreshLeads, showInfo]);

  const handleFilterChangeWithToast = useCallback(
    (filterType: 'user' | 'campaign' | 'status' | 'team', value: any) => {
      handleFilterChange(filterType, value);
      
      // Show toast for status filter changes
      if (filterType === 'status' && value !== 'All Statuses') {
        showInfo(`Filtering by status: ${value}`);
      }
    },
    [handleFilterChange, showInfo]
  );

  const userOptions = useMemo(() => {
    if (serverSideFiltering) {
      return ['All Users', ...filterOptions.users.map((user) => user.name)];
    }
    return ['All Users', ...uniqueUsers.map((user) => user.name)];
  }, [serverSideFiltering, filterOptions.users, uniqueUsers]);

  const campaignOptions = useMemo(() => {
    if (serverSideFiltering) {
      return ['All Campaigns', ...filterOptions.campaigns.map((campaign) => campaign.name)];
    }
    return ['All Campaigns', ...uniqueCampaigns.map((campaign) => campaign.name)];
  }, [serverSideFiltering, filterOptions.campaigns, uniqueCampaigns]);

  const statusOptions = useMemo(() => {
    if (serverSideFiltering) {
      return ['All Statuses', ...filterOptions.statuses.map((status) => status.name)];
    }
    return ['All Statuses', ...uniqueStatuses.map((status) => status.name)];
  }, [serverSideFiltering, filterOptions.statuses, uniqueStatuses]);

  const teamOptions = useMemo(() => {
    if (serverSideFiltering) {
      return ['All Teams', ...filterOptions.teams.map((team) => team.name)];
    }
    return allTeams;
  }, [serverSideFiltering, filterOptions.teams, allTeams]);

  return (
    <div className="container-fluid py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="card shadow-sm">
        <LeadsHeader
          onAddClick={handleAddNewClick}
          onRefreshClick={handleRefresh}
          totalLeads={pagination?.total_records || dataToRender.length}
          loading={loading}
        />

        <LeadsFilters
          filters={filters}
          onFilterChange={handleFilterChangeWithToast}
          uniqueUsers={userOptions}
          uniqueCampaigns={campaignOptions}
          uniqueStatuses={statusOptions}
          uniqueTeams={teamOptions}
          loading={loading || teamLoading || filterOptionsLoading}
          totalLeads={pagination?.total_records}
          filteredCount={dataToRender.length}
          showQuickFilters={true}
          serverSideFiltering={serverSideFiltering}
        />

        <LeadsTable
          leads={dataToRender}
          loading={loading}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onStatusClick={handleStatusClick}
          currentPage={currentPage}
          entriesPerPage={entriesPerPage}
          onEntriesPerPageChange={handleEntriesChange}
          showingFrom={showingFrom}
          showingTo={showingTo}
          totalRecords={pagination?.total_records || dataToRender.length}
          serverSideFiltering={serverSideFiltering}
        />

        <LeadsPagination
          currentPage={currentPage}
          totalPages={pagination?.total_pages || 1}
          totalRecords={pagination?.total_records || dataToRender.length}
          onPageChange={handlePageChangeWithToast}
          onPageSizeChange={handleEntriesPerPageChange}
          showingFrom={showingFrom}
          showingTo={showingTo}
          loading={loading}
          pageSize={entriesPerPage}
          showPageSizeSelector={false}
        />
      </div>

      <AddEditLeadModal
        show={showModal}
        onHide={handleModalClose}
        onLeadAdded={handleAddSuccess}
        leadToEdit={leadToEdit}
      />

      {selectedLead && (
        <>
          <LeadViewModal
            show={showViewModal}
            lead={selectedLead}
            onClose={handleViewModalClose}
            onEdit={handleEditClick}
            onStatusUpdate={handleStatusUpdate}
            loading={loading}
          />

          <LeadStatusUpdateModal
            show={showStatusModal}
            onHide={handleStatusModalClose}
            lead={selectedLead}
            onStatusUpdated={() => {
              refreshLeads();
              showSuccess('Lead status updated successfully!');
            }}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(AllLeads);