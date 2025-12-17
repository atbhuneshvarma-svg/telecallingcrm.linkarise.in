// src/app/modules/apps/master/purpose/PurposeModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Purpose } from './core/_request';

interface PurposeModalProps {
  show: boolean;
  mode: 'add' | 'edit';
  purpose: Purpose;
  onClose: () => void;
  onSave: () => void;
  onPurposeChange: (purpose: Purpose) => void;
  isLoading?: boolean;
  error?: string | null;
}

const PurposeModal: React.FC<PurposeModalProps> = ({
  show,
  mode,
  purpose,
  onClose,
  onSave,
  onPurposeChange,
  isLoading = false,
  error = null,
}) => {
  const [localError, setLocalError] = useState<string | null>(null);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (show) {
      setLocalError(null);
    }
  }, [show]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onPurposeChange({ ...purpose, name: value });
    
    // Clear error when user starts typing
    if (localError && value.trim()) {
      setLocalError(null);
    }
  };

  const handleSave = () => {
    if (!purpose.name.trim()) {
      setLocalError('Purpose name is required');
      return;
    }
    
    if (purpose.name.length > 50) {
      setLocalError('Purpose name must be less than 50 characters');
      return;
    }
    
    setLocalError(null);
    onSave();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid) {
      handleSave();
    }
  };

  const isFormValid = purpose.name.trim() !== '' && purpose.name.length <= 50;

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          <i className={`bi ${mode === 'add' ? 'bi-plus-circle' : 'bi-pencil'} me-2`}></i>
          {mode === 'add' ? 'Add Purpose' : 'Edit Purpose'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Error Display */}
        {(error || localError) && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error || localError}
          </Alert>
        )}

        {/* Purpose Name Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Purpose Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={purpose.name}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter purpose name"
            disabled={isLoading}
            maxLength={50}
          />
          <div className="form-text">
            {purpose.name.length}/50 characters
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onClose}
          disabled={isLoading}
        >
          <i className="bi bi-x-circle me-1"></i>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </span>
              {mode === 'add' ? 'Adding...' : 'Updating...'}
            </>
          ) : (
            <>
              <i className={`bi ${mode === 'add' ? 'bi-plus-circle' : 'bi-check-circle'} me-1`}></i>
              {mode === 'add' ? 'Add Purpose' : 'Update Purpose'}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurposeModal;