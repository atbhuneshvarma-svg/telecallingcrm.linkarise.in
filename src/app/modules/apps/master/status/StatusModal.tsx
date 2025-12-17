// StatusModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Status } from './core/_request';

interface StatusModalProps {
  show: boolean;
  mode: 'add' | 'edit';
  status: Status;
  onClose: () => void;
  onSave: () => void;
  onStatusChange: (status: Status) => void;
  isLoading?: boolean;
  error?: string | null;
}

const StatusModal: React.FC<StatusModalProps> = ({
  show,
  mode,
  status,
  onClose,
  onSave,
  onStatusChange,
  isLoading = false,
  error = null,
}) => {
  const [localError, setLocalError] = useState<string | null>(null);

  // Stage options
  const stageOptions = [
    { value: '', label: '-- Select Stage --' },
    { value: 'Fresh Lead', label: 'Fresh Lead' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Interested', label: 'Interested' },
    { value: 'Converted', label: 'Converted' },
    { value: 'Not Interested', label: 'Not Interested' }
  ];

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (show) {
      setLocalError(null);
    }
  }, [show]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onStatusChange({ ...status, name: value });
    
    // Clear error when user starts typing
    if (localError && value.trim()) {
      setLocalError(null);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange({ ...status, color: e.target.value });
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange({ ...status, stage: e.target.value });
  };

  const handleSave = () => {
    if (!status.name.trim()) {
      setLocalError('Status name is required');
      return;
    }
    
    if (status.name.length > 50) {
      setLocalError('Status name must be less than 50 characters');
      return;
    }

    if (!status.stage) {
      setLocalError('Stage selection is required');
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

  const isFormValid = status.name.trim() !== '' && 
                     status.name.length <= 50 && 
                     status.stage !== '';

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          <i className={`bi ${mode === 'add' ? 'bi-plus-circle' : 'bi-pencil'} me-2`}></i>
          {mode === 'add' ? 'Add New Status' : 'Edit Status'}
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

        {/* Status Name Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Status Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={status.name}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter status name"
            disabled={isLoading}
            maxLength={50}
          />
          <div className="form-text">
            {status.name.length}/50 characters
          </div>
        </div>

        {/* Stage Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Stage <span className="text-danger">*</span>
          </label>
          <select
            name="stage"
            className="form-select"
            value={status.stage || ''}
            onChange={handleStageChange}
            disabled={isLoading}
            required
          >
            {stageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="form-text">
            Select the stage for this status
          </div>
        </div>

        {/* Status Color Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Status Color</label>
          <div className="d-flex align-items-center gap-3">
            <input
              type="color"
              className="form-control form-control-color"
              value={status.color}
              onChange={handleColorChange}
              title="Choose status color"
              disabled={isLoading}
            />
            <div
              className="color-preview rounded border"
              style={{
                backgroundColor: status.color,
                width: '40px',
                height: '40px',
                border: '2px solid #dee2e6'
              }}
              title={`Selected color: ${status.color}`}
            ></div>
            <div className="flex-grow-1">
              <input
                type="text"
                className="form-control form-control-sm"
                value={status.color}
                onChange={(e) => onStatusChange({ ...status, color: e.target.value })}
                placeholder="#000000"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="form-text">
            Click the color box or enter a hex code
          </div>
        </div>

        {/* Color Presets */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Quick Color Presets</label>
          <div className="d-flex gap-2 flex-wrap">
            {[
              '#0d6efd', '#dc3545', '#198754', '#ffc107', 
              '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'
            ].map((color) => (
              <button
                key={color}
                type="button"
                className="btn btn-sm p-2 rounded"
                style={{
                  backgroundColor: color,
                  width: '30px',
                  height: '30px',
                  border: status.color === color ? '3px solid #000' : '1px solid #dee2e6'
                }}
                onClick={() => onStatusChange({ ...status, color })}
                disabled={isLoading}
                title={`Use ${color}`}
              />
            ))}
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
              {mode === 'add' ? 'Add Status' : 'Update Status'}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusModal;