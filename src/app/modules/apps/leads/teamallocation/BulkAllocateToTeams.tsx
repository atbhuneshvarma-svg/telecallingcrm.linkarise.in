import React, { useState, useEffect } from 'react';
import { Modal, Form, Table, Alert, Button, Spinner } from 'react-bootstrap';
import { leadTransferApi } from './core/_request';

interface BulkAllocateToTeamsProps {
  show: boolean;
  onHide: () => void;
  onAllocationComplete?: () => void;
}

interface Campaign {
  campaignmid: number;
  campaignname: string;
}

interface Team {
  tmid: number;
  teamname: string;
  leadermid: number;
  membercount?: number;
  teamleadername?: string;
}

interface BulkAllocationResponse {
  success: boolean;
  data: {
    campaigns: Campaign[];
    teams: {
      current_page: number;
      data: Team[];
      total: number;
    };
    leadids: number[];
  };
}

const BulkAllocateToTeams: React.FC<BulkAllocateToTeamsProps> = ({
  show,
  onHide,
  onAllocationComplete = () => {}
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [leadIds, setLeadIds] = useState<number[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch data when modal opens
  useEffect(() => {
    if (show) {
      fetchBulkAllocationData();
    }
  }, [show]);

  const fetchBulkAllocationData = async () => {
    try {
      setFetching(true);
      setError(null);
      
      const response: BulkAllocationResponse = await leadTransferApi.getBulkAllocateTeams();
      
      if (response.success) {
        setCampaigns(response.data.campaigns || []);
        setTeams(response.data.teams.data || []);
        setLeadIds(response.data.leadids || []);
        
        if (response.data.campaigns.length > 0) {
          setSelectedCampaign(response.data.campaigns[0].campaignmid.toString());
        }
      }
    } catch (err: any) {
      console.error('Error fetching bulk allocation data:', err);
      setError(err.message || 'Failed to load data. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setSelectedCampaign('');
    setSelectedTeams([]);
    setError(null);
    setSuccess(null);
    onHide();
  };

  // Handle team selection
  const handleTeamSelect = (teamId: number) => {
    setSelectedTeams(prev => 
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  // Handle select all teams
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTeams(teams.map(team => team.tmid));
    } else {
      setSelectedTeams([]);
    }
  };

  // Handle bulk allocation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCampaign) {
      setError('Please select a campaign');
      return;
    }

    if (selectedTeams.length === 0) {
      setError('Please select at least one team');
      return;
    }

    if (leadIds.length === 0) {
      setError('No leads available for allocation');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const selectedCampaignObj = campaigns.find(c => c.campaignmid.toString() === selectedCampaign);
      
      if (!selectedCampaignObj) {
        throw new Error('Selected campaign not found');
      }

      // Call API to allocate leads to teams
      const response = await leadTransferApi.bulkAllocateToTeams({
        campaignmid: parseInt(selectedCampaign),
        lead_ids: leadIds,
        team_ids: selectedTeams
      });
      
      if (response.success) {
        setSuccess(`Successfully allocated ${leadIds.length} leads to ${selectedTeams.length} team(s)`);
        
        // Reset form after successful submission
        setTimeout(() => {
          handleClose();
          onAllocationComplete();
        }, 2000);
      } else {
        throw new Error(response.message || 'Allocation failed');
      }
    } catch (err: any) {
      console.error('Bulk allocation error:', err);
      setError(err.message || 'Failed to allocate leads to teams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get selected campaign object
  const getSelectedCampaign = () => {
    return campaigns.find(c => c.campaignmid.toString() === selectedCampaign);
  };

  // Calculate total leads count
  const totalLeadsCount = leadIds.length;

  // Get team leader name (you may need to fetch this separately or map from users)
  const getTeamLeaderName = (team: Team) => {
    return team.teamleadername || 'Not assigned';
  };

  // Get member count
  const getMemberCount = (team: Team) => {
    return team.membercount || 0;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div>
            <h4 className="mb-1">Bulk Allocate To Teams</h4>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {fetching ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading data...</p>
            </div>
          ) : (
            <>
              {/* Campaign Selection */}
              <div className="mb-4">
                <Form.Group controlId="campaignSelect">
                  <Form.Label className="fw-bold">
                    Select Campaign <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    required
                    className="border-primary"
                  >
                    <option value="">Select Campaign</option>
                    {campaigns.map(campaign => (
                      <option key={campaign.campaignmid} value={campaign.campaignmid}>
                        {campaign.campaignname}
                      </option>
                    ))}
                  </Form.Select>
                  
                  {selectedCampaign && getSelectedCampaign() && (
                    <div className="mt-2 p-2 bg-light rounded">
                      <small className="text-muted">
                        Selected: <strong>{getSelectedCampaign()?.campaignname}</strong>
                        {totalLeadsCount > 0 && (
                          <span className="ms-3">
                            <strong>{totalLeadsCount}</strong> leads available
                          </span>
                        )}
                      </small>
                    </div>
                  )}
                </Form.Group>
              </div>

              {/* Teams Selection */}
              <div className="mb-4">
                <Form.Label className="fw-bold mb-3">
                  Select Team <span className="text-danger">*</span>
                </Form.Label>
                
                <div className="border rounded">
                  <Table hover responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '50px' }}>
                          <Form.Check
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={teams.length > 0 && selectedTeams.length === teams.length}
                          />
                        </th>
                        <th>Sr.No</th>
                        <th>Team Name</th>
                        <th>Team Leader</th>
                        <th>Members Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.length > 0 ? (
                        teams.map((team, index) => (
                          <tr key={team.tmid} className={selectedTeams.includes(team.tmid) ? 'table-primary' : ''}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={selectedTeams.includes(team.tmid)}
                                onChange={() => handleTeamSelect(team.tmid)}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>
                              <div className="fw-semibold">{team.teamname}</div>
                            </td>
                            <td>
                              {getTeamLeaderName(team)}
                            </td>
                            <td>
                              <span className="badge bg-secondary rounded-pill px-3 py-1">
                                {getMemberCount(team)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <div className="text-muted">No teams available</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  
                  {teams.length > 0 && (
                    <div className="px-3 py-2 border-top bg-light">
                      <small className="text-muted">
                        Showing 1 to {teams.length} of {teams.length} records
                      </small>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <Alert variant="danger" className="py-2">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="py-2">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </Alert>
              )}

              {/* Selection Summary */}
              {selectedTeams.length > 0 && totalLeadsCount > 0 && (
                <div className="alert alert-info py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-info-circle-fill me-2"></i>
                      <strong>{selectedTeams.length} team(s)</strong> selected for allocation
                      <span className="ms-3">
                        <strong>{totalLeadsCount} leads</strong> will be allocated
                      </span>
                    </div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setSelectedTeams([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="text-muted small">
              © {new Date().getFullYear()} Arth Technology
            </div>
            <div>
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                className="me-2"
                disabled={loading || fetching}
              >
                X Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || fetching || !selectedCampaign || selectedTeams.length === 0 || totalLeadsCount === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Allocating...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BulkAllocateToTeams;