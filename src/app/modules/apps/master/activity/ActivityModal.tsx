// src/app/modules/apps/master/activity/ActivityModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Activity } from './core/_request';

interface ActivityModalProps {
  show: boolean;
  mode: 'add' | 'edit';
  activity: Activity;
  onClose: () => void;
  onSave: () => void;
  onActivityChange: (activity: Activity) => void;
  isLoading?: boolean;
  error?: string | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  show,
  mode,
  activity,
  onClose,
  onSave,
  onActivityChange,
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
    onActivityChange({ ...activity, name: value });
    
    // Clear error when user starts typing
    if (localError && value.trim()) {
      setLocalError(null);
    }
  };

  const handleSave = () => {
    if (!activity.name.trim()) {
      setLocalError('Activity name is required');
      return;
    }
    
    if (activity.name.length > 50) {
      setLocalError('Activity name must be less than 50 characters');
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

  const isFormValid = activity.name.trim() !== '' && activity.name.length <= 50;

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          <i className={`bi ${mode === 'add' ? 'bi-plus-circle' : 'bi-pencil'} me-2`}></i>
          {mode === 'add' ? 'Add Activity' : 'Edit Activity'}
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

        {/* Activity Name Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Activity Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={activity.name}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter activity name"
            disabled={isLoading}
            maxLength={50}
          />
          <div className="form-text">
            {activity.name.length}/50 characters
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
              {mode === 'add' ? 'Add Activity' : 'Update Activity'}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActivityModal;