// src/app/modules/apps/master/source-of-inquiry/SourceOfInquiryModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { SourceOfInquiry } from './core/_request';

interface SourceOfInquiryModalProps {
  show: boolean;
  mode: 'add' | 'edit';
  sourceOfInquiry: SourceOfInquiry;
  onClose: () => void;
  onSave: () => void;
  onSourceOfInquiryChange: (sourceOfInquiry: SourceOfInquiry) => void;
  isLoading?: boolean;
  error?: string | null;
}

const SourceOfInquiryModal: React.FC<SourceOfInquiryModalProps> = ({
  show,
  mode,
  sourceOfInquiry,
  onClose,
  onSave,
  onSourceOfInquiryChange,
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
    onSourceOfInquiryChange({ ...sourceOfInquiry, name: value });
    
    // Clear error when user starts typing
    if (localError && value.trim()) {
      setLocalError(null);
    }
  };

  const handleSave = () => {
    if (!sourceOfInquiry.name.trim()) {
      setLocalError('SourceOfInquiry name is required');
      return;
    }
    
    if (sourceOfInquiry.name.length > 50) {
      setLocalError('SourceOfInquiry name must be less than 50 characters');
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

  const isFormValid = sourceOfInquiry.name.trim() !== '' && sourceOfInquiry.name.length <= 50;

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          <i className={`bi ${mode === 'add' ? 'bi-plus-circle' : 'bi-pencil'} me-2`}></i>
          {mode === 'add' ? 'Add SourceOfInquiry' : 'Edit SourceOfInquiry'}
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

        {/* SourceOfInquiry Name Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            SourceOfInquiry Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={sourceOfInquiry.name}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter sourceoff inquiry name"
            disabled={isLoading}
            maxLength={50}
          />
          <div className="form-text">
            {sourceOfInquiry.name.length}/50 characters
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
              {mode === 'add' ? 'Add SourceOfInquiry' : 'Update SourceOfInquiry'}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SourceOfInquiryModal;