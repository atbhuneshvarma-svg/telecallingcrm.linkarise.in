import React from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { User, Team } from '../core/types';

interface TransferModalProps {
  show: boolean;
  onHide: () => void;
  selectedCount: number;
  targetUser: number | '';
  targetTeam: number | '';
  users: User[];
  teams: Team[];
  loading: boolean;
  error: string | null;
  onUserChange: (userId: number | '') => void;
  onTeamChange: (teamId: number | '') => void;
  onTransfer: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  show,
  onHide,
  selectedCount,
  targetUser,
  targetTeam,
  users,
  teams,
  loading,
  error,
  onUserChange,
  onTeamChange,
  onTransfer
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Transfer Selected Leads</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <p className="mb-3">
          Transferring <strong>{selectedCount}</strong> lead(s) to:
        </p>

        <Form.Group className="mb-3">
          <Form.Label>Select Team</Form.Label>
          <Form.Select
            value={targetTeam}
            onChange={(e) => onTeamChange(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Choose team...</option>
            {teams.map(team => (
              <option key={team.tmid} value={team.tmid}>
                {team.teamname} (Leader: {team.leader.username})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select User</Form.Label>
          <Form.Select
            value={targetUser}
            onChange={(e) => onUserChange(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Choose user...</option>
            {users.map(user => (
              <option key={user.usermid} value={user.usermid}>
                {user.username} ({user.userrole})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onHide}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onTransfer}
          disabled={loading || (!targetUser && !targetTeam)}
        >
          {loading ? 'Transferring...' : 'Transfer Leads'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransferModal;