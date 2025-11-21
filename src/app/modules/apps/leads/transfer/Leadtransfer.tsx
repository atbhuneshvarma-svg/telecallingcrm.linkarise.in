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
  const [bulkTransferModalOpen, setBulkTransferModalOpen] = useState(false); // New state for bulk transfer modal
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
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Applied filter states
  const [appliedFilters, setAppliedFilters] = useState({
    team: 'All',
    user: 'All',
    stage: 'All',
    status: 'All',
    search: ''
  });

  const { transferLeads: transferApi, loading: transferLoading, error: transferError } = useTransferLead();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await leadTransferApi.getLeadsForTransfer();

        setLeads(response.data || []);
        setUsers(response.users || []);
        setTeams(response.teams || []);
        setStatuses(response.status || []);
        setCampaigns(response.campaigns || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leads data');
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      const response = await leadTransferApi.getLeadsForTransfer();
      setLeads(response.data || []);

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
  };

  // Filter leads based on APPLIED filters
  const filteredLeads = leads.filter(lead => {
    // Team filter
    if (appliedFilters.team !== 'All' && lead.username !== appliedFilters.team) {
      return false;
    }

    // User filter
    if (appliedFilters.user !== 'All' && lead.username !== appliedFilters.user) {
      return false;
    }

    // Stage filter
    if (appliedFilters.stage !== 'All' && lead.stage !== appliedFilters.stage) {
      return false;
    }

    // Status filter
    if (appliedFilters.status !== 'All' && lead.statusname !== appliedFilters.status) {
      return false;
    }

    // Search filter
    if (appliedFilters.search) {
      const searchLower = appliedFilters.search.toLowerCase();
      return (
        lead.leadname.toLowerCase().includes(searchLower) ||
        lead.phone.includes(appliedFilters.search) ||
        lead.campaignname.toLowerCase().includes(searchLower) ||
        (lead.purpose && lead.purpose.toLowerCase().includes(searchLower)) ||
        (lead.detail && lead.detail.toLowerCase().includes(searchLower)) ||
        (lead.email && lead.email.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Get unique values for dropdowns from actual data
  const uniqueTeams = ['All', ...new Set(leads.map(lead => lead.username))];
  const uniqueUsers = ['All', ...new Set(leads.map(lead => lead.username))];
  const uniqueStages = ['All', ...new Set(statuses.map(status => status.stage))];
  const uniqueStatuses = ['All', ...new Set(statuses.map(status => status.statusname))];

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.leadmid));
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
        const response = await leadTransferApi.getLeadsForTransfer();
        setLeads(response.data || []);
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
      const response = await leadTransferApi.getLeadsForTransfer();
      setLeads(response.data || []);
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
          {` (Showing ${filteredLeads.length} of ${leads.length} leads)`}
        </Alert>
      )}

      {/* Leads Table */}
      <LeadsTable
        leads={filteredLeads.slice(0, entriesPerPage)}
        selectedLeads={selectedLeads}
        onSelectAll={handleSelectAll}
        onSelectLead={handleSelectLead}
        totalLeads={filteredLeads.length}
        showingLeads={Math.min(filteredLeads.length, entriesPerPage)}
        entriesPerPage={entriesPerPage}
        onEntriesChange={setEntriesPerPage}
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