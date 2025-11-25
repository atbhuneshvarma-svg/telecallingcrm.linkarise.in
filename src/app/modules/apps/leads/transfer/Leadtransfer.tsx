import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { leadTransferApi } from './core/_request';
import { useTransferLead } from './hooks/useTransferLead';
import { Lead, User, Team, Status, Campaign } from './core/types';
import LeadTransferHeader from './components/LeadTransferHeader';
import LeadFilters from './components/LeadFilters';
import LeadsTable from './components/LeadsTable';
import TransferModal from './components/TransferModal';

interface LeadTransferProps {
  onTransferComplete?: () => void;
}

const LeadTransfer: React.FC<LeadTransferProps> = ({ onTransferComplete = () => { } }) => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [bulkTransferModalOpen, setBulkTransferModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<number | ''>('');
  const [targetTeam, setTargetTeam] = useState<number | ''>('');

  // Bulk transfer states
  const [bulkFromUser, setBulkFromUser] = useState('');
  const [bulkFromStatus, setBulkFromStatus] = useState('All');
  const [bulkFromCampaign, setBulkFromCampaign] = useState('All');
  const [bulkToUser, setBulkToUser] = useState('');
  const [bulkTotalLeads, setBulkTotalLeads] = useState(0);

  // Filter states
  const [tempSelectedTeam, setTempSelectedTeam] = useState('All');
  const [tempSelectedUser, setTempSelectedUser] = useState('All');
  const [tempSelectedStage, setTempSelectedStage] = useState('All');
  const [tempSelectedStatus, setTempSelectedStatus] = useState('All');
  const [tempSearchTerm, setTempSearchTerm] = useState('');

  // Applied filter states
  const [appliedFilters, setAppliedFilters] = useState({
    team: 'All',
    user: 'All',
    stage: 'All',
    status: 'All',
    search: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const { transferLeads: transferApi, loading: transferLoading, error: transferError } = useTransferLead();

  // Fetch data function
  const fetchData = async (page: number = currentPage, pageSize: number = perPage) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters for server-side filtering
      const queryParams: any = {
        page,
        perPage: pageSize
      };

      // Add applied filters to query params for server-side filtering
      if (appliedFilters.team !== 'All') queryParams.team = appliedFilters.team;
      if (appliedFilters.user !== 'All') queryParams.user = appliedFilters.user;
      if (appliedFilters.stage !== 'All') queryParams.stage = appliedFilters.stage;
      if (appliedFilters.status !== 'All') queryParams.status = appliedFilters.status;
      if (appliedFilters.search) queryParams.search = appliedFilters.search;

      const response = await leadTransferApi.getLeadsForTransfer(queryParams);

      setLeads(response.data || []);
      setTotalRecords(response.total_records || 0);
      setTotalPages(response.total_pages || 1);

      // Set dropdown data (only on initial load or when needed)
      if (!users.length) setUsers(response.users || []);
      if (!teams.length) setTeams(response.teams || []);
      if (!statuses.length) setStatuses(response.status || []);
      if (!campaigns.length) setCampaigns(response.campaigns || []);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads data');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when pagination changes
  useEffect(() => {
    fetchData(1, perPage); // Always start from page 1 when filters change
  }, [perPage]); // Remove currentPage from dependencies to avoid double fetching

  // Fetch data when currentPage changes
  useEffect(() => {
    if (currentPage > 1) { // Don't fetch on initial load (handled by above useEffect)
      fetchData(currentPage, perPage);
    }
  }, [currentPage]);

  // Reset to page 1 when filters are applied
  useEffect(() => {
    if (appliedFilters.team !== 'All' || appliedFilters.user !== 'All' ||
      appliedFilters.stage !== 'All' || appliedFilters.status !== 'All' ||
      appliedFilters.search) {
      setCurrentPage(1);
      fetchData(1, perPage);
    }
  }, [appliedFilters]);

  // Calculate bulk transfer leads count when filters change
  useEffect(() => {
    if (bulkFromUser || bulkFromStatus !== 'All' || bulkFromCampaign !== 'All') {
      const filtered = leads.filter(lead => {
        // From User filter
        if (bulkFromUser && bulkFromUser !== 'all' && lead.username !== bulkFromUser) {
          return false;
        }

        // From Status filter
        if (bulkFromStatus !== 'All' && lead.statusname !== bulkFromStatus) {
          return false;
        }

        // From Campaign filter
        if (bulkFromCampaign !== 'All' && lead.campaignname !== bulkFromCampaign) {
          return false;
        }

        return true;
      });

      setBulkTotalLeads(filtered.length);
    } else {
      setBulkTotalLeads(0);
    }
  }, [bulkFromUser, bulkFromStatus, bulkFromCampaign, leads]);

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle bulk transfer
  const handleBulkTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bulkToUser) {
      alert('Please select a target user for bulk transfer');
      return;
    }

    try {
      // Get leads based on bulk transfer filters
      const leadsToTransfer = leads.filter(lead => {
        // From User filter
        if (bulkFromUser && bulkFromUser !== 'all' && lead.username !== bulkFromUser) {
          return false;
        }

        // From Status filter
        if (bulkFromStatus !== 'All' && lead.statusname !== bulkFromStatus) {
          return false;
        }

        // From Campaign filter
        if (bulkFromCampaign !== 'All' && lead.campaignname !== bulkFromCampaign) {
          return false;
        }

        return true;
      });

      if (leadsToTransfer.length === 0) {
        alert('No leads found matching the selected criteria');
        return;
      }

      const leadIds = leadsToTransfer.map(lead => lead.leadmid);

      // Perform bulk transfer
      await transferApi({
        leadIds: leadIds,
        targetUserId: parseInt(bulkToUser) || undefined,
      });

      setBulkTransferModalOpen(false);

      // Reset bulk transfer form
      setBulkFromUser('');
      setBulkFromStatus('All');
      setBulkFromCampaign('All');
      setBulkToUser('');
      setBulkTotalLeads(0);

      onTransferComplete();

      // Refresh data after transfer
      await fetchData(currentPage, perPage);

      alert(`Successfully transferred ${leadsToTransfer.length} leads`);
    } catch (err: any) {
      alert(`Bulk transfer failed: ${err.message}`);
      console.error('Bulk transfer error:', err);
    }
  };

  const handleBulkTransferCancel = () => {
    setBulkTransferModalOpen(false);
    // Reset form
    setBulkFromUser('');
    setBulkFromStatus('All');
    setBulkFromCampaign('All');
    setBulkToUser('');
    setBulkTotalLeads(0);
  };

  // Handle filter submission
  const handleSubmitFilters = () => {
    setAppliedFilters({
      team: tempSelectedTeam,
      user: tempSelectedUser,
      stage: tempSelectedStage,
      status: tempSelectedStatus,
      search: tempSearchTerm
    });
    // Reset to page 1 when applying new filters
    setCurrentPage(1);
  };

  // Get unique values for dropdowns from actual data
  const uniqueTeams = ['All', ...new Set(users.map(user => user.username))];
  const uniqueUsers = ['All', ...new Set(users.map(user => user.username))];
  const uniqueStages = ['All', ...new Set(statuses.map(status => status.stage))];
  const uniqueStatuses = ['All', ...new Set(statuses.map(status => status.statusname))];

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedLeads(leads.map(lead => lead.leadmid));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleOpenTransferDialog = () => {
    if (selectedLeads.length === 0) {
      alert('Please select at least one lead to transfer');
      return;
    }
    setTransferDialogOpen(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedLeads.length === 0) {
      alert('Please select at least one lead to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedLeads.length} selected leads?`)) {
      try {
        await leadTransferApi.deleteLeads(selectedLeads);
        alert('Leads deleted successfully');
        setSelectedLeads([]);
        // Refresh data
        await fetchData(currentPage, perPage);
      } catch (err: any) {
        alert(`Failed to delete leads: ${err.message}`);
      }
    }
  };

  const handleTransfer = async () => {
    if (!targetUser && !targetTeam) {
      alert('Please select a user or team to transfer to');
      return;
    }

    try {
      await transferApi({
        leadIds: selectedLeads,
        targetUserId: targetUser || undefined,
        targetTeamId: targetTeam || undefined,
      });

      setTransferDialogOpen(false);
      setSelectedLeads([]);
      setTargetUser('');
      setTargetTeam('');
      onTransferComplete();

      // Refresh data after transfer
      await fetchData(currentPage, perPage);
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  const handleResetFilters = () => {
    // Reset both temporary and applied filters
    setTempSelectedTeam('All');
    setTempSelectedUser('All');
    setTempSelectedStage('All');
    setTempSelectedStatus('All');
    setTempSearchTerm('');
    setAppliedFilters({
      team: 'All',
      user: 'All',
      stage: 'All',
      status: 'All',
      search: ''
    });
    setSelectedLeads([]);
    setCurrentPage(1);
    // Fetch fresh data without filters
    fetchData(1, perPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Alert variant="danger">
          <Alert.Heading>Error Loading Data</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-primary" onClick={handleGoBack}>
            ← Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Header with Back button and Bulk Transfer button */}
      <LeadTransferHeader
        onBack={handleGoBack}
        onBulkTransfer={() => setBulkTransferModalOpen(true)}
      />

      {/* Filter Section */}
      <LeadFilters
        selectedTeam={tempSelectedTeam}
        selectedUser={tempSelectedUser}
        selectedStage={tempSelectedStage}
        selectedStatus={tempSelectedStatus}
        uniqueTeams={uniqueTeams}
        uniqueUsers={uniqueUsers}
        uniqueStages={uniqueStages}
        uniqueStatuses={uniqueStatuses}
        selectedCount={selectedLeads.length}
        onTeamChange={setTempSelectedTeam}
        onUserChange={setTempSelectedUser}
        onStageChange={setTempSelectedStage}
        onStatusChange={setTempSelectedStatus}
        onReset={handleResetFilters}
        onSubmit={handleSubmitFilters}
        onTransfer={handleOpenTransferDialog}
        onDelete={handleDeleteSelected}
      />

      {/* Applied Filters Display */}
      {(appliedFilters.team !== 'All' || appliedFilters.user !== 'All' || appliedFilters.stage !== 'All' || appliedFilters.status !== 'All' || appliedFilters.search) && (
        <Alert variant="info" className="mb-3">
          <strong>Applied Filters:</strong>
          {appliedFilters.team !== 'All' && ` Team: ${appliedFilters.team}`}
          {appliedFilters.user !== 'All' && ` User: ${appliedFilters.user}`}
          {appliedFilters.stage !== 'All' && ` Stage: ${appliedFilters.stage}`}
          {appliedFilters.status !== 'All' && ` Status: ${appliedFilters.status}`}
          {appliedFilters.search && ` Search: "${appliedFilters.search}"`}
          {` (Page ${currentPage} of ${totalPages}, Total: ${totalRecords} leads)`}
        </Alert>
      )}

      {/* Leads Table with Pagination */}
      <LeadsTable
        leads={leads} // Pass the current page's leads (no client-side filtering)
        selectedLeads={selectedLeads}
        onSelectAll={handleSelectAll}
        onSelectLead={handleSelectLead}
        totalLeads={leads.length}
        entriesPerPage={perPage}
        onEntriesChange={handlePerPageChange}
        // Pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
        onPerPageChange={handlePerPageChange}
      />

      {/* Individual Transfer Modal */}
      <TransferModal
        show={transferDialogOpen}
        onHide={() => setTransferDialogOpen(false)}
        selectedCount={selectedLeads.length}
        targetUser={targetUser}
        targetTeam={targetTeam}
        users={users}
        teams={teams}
        loading={transferLoading}
        error={transferError}
        onUserChange={setTargetUser}
        onTeamChange={setTargetTeam}
        onTransfer={handleTransfer}
      />

      {/* Bulk Transfer Modal */}
      {bulkTransferModalOpen && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <div className="d-flex align-items-center">
                    <span className="me-2">📊</span>
                    Bulk Lead Transfer
                  </div>
                </h5>
                <button type="button" className="btn-close" onClick={handleBulkTransferCancel}></button>
              </div>
              <form onSubmit={handleBulkTransfer}>
                <div className="modal-body">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="mb-3">Transfer Data</h6>
                      <p className="text-muted small mb-4">
                        Transfer leads from one telecaller to another telecaller.
                        Whenever a telecaller leaves, you can allocate their leads to another telecaller.
                      </p>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label><strong>From User</strong></label>
                            <select
                              className="form-select"
                              value={bulkFromUser}
                              onChange={(e) => setBulkFromUser(e.target.value)}
                            >
                              <option value="">Select User</option>
                              <option value="all">All</option>
                              {uniqueUsers.filter(user => user !== 'All').map(user => (
                                <option key={user} value={user}>{user}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label><strong>From Status</strong></label>
                            <select
                              className="form-select"
                              value={bulkFromStatus}
                              onChange={(e) => setBulkFromStatus(e.target.value)}
                            >
                              <option value="All">All</option>
                              {uniqueStatuses.filter(status => status !== 'All').map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label><strong>To User</strong></label>
                            <select
                              className="form-select"
                              value={bulkToUser}
                              onChange={(e) => setBulkToUser(e.target.value)}
                              required
                            >
                              <option value="">Select User</option>
                              {users.map(user => (
                                <option key={user.usermid} value={user.usermid}>
                                  {user.username}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label><strong>From Campaign</strong></label>
                            <select
                              className="form-select"
                              value={bulkFromCampaign}
                              onChange={(e) => setBulkFromCampaign(e.target.value)}
                            >
                              <option value="All">All</option>
                              {campaigns.map(campaign => (
                                <option key={campaign.campaignmid} value={campaign.campaignname}>
                                  {campaign.campaignname}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="card bg-light">
                            <div className="card-body py-2">
                              <div className="row align-items-center">
                                <div className="col">
                                  <strong>Total Lead</strong>
                                </div>
                                <div className="col-auto">
                                  <span className="fw-bold">{bulkTotalLeads}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={handleBulkTransferCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={transferLoading}>
                    {transferLoading ? 'Transferring...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default LeadTransfer;