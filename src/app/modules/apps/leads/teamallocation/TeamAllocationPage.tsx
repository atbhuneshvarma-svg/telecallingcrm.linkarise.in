// src/app/modules/apps/leads/teamallocation/TeamAllocationPage.tsx
import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import BulkAllocateToTeams from './BulkAllocateToTeams';

const TeamAllocationPage: React.FC = () => {
  const [modalShow, setModalShow] = useState(true);

  const handleClose = () => {
    setModalShow(false);
    // Optionally navigate back
    window.history.back();
  };

  const handleAllocationComplete = () => {
    console.log('Allocation completed successfully!');
    // You can show a success toast or notification here
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bulk Allocation to Teams</h2>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Open Allocation Modal
        </Button>
      </div>
      
      <BulkAllocateToTeams
        show={modalShow}
        onHide={handleClose}
        onAllocationComplete={handleAllocationComplete}
      />
      
      <div className="mt-4">
        <p>This is the bulk team allocation page. Click the button above to open the allocation modal.</p>
      </div>
    </Container>
  );
};

export default TeamAllocationPage;