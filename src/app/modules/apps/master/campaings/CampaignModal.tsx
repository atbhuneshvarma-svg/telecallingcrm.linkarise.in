import React, { useEffect } from 'react';

interface CampaignModalProps {
  show: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  campaignName: string;
  setCampaignName: (value: string) => void;
  campaignDate: string;
  setCampaignDate: (value: string) => void;
  onSubmit: () => void;
}

const CampaignModal: React.FC<CampaignModalProps> = ({
  show,
  onClose,
  mode,
  campaignName,
  setCampaignName,
  campaignDate,
  setCampaignDate,
  onSubmit
}) => {
  const title = mode === 'add' ? 'Create New Campaign' : 'Edit Campaign';
  const buttonLabel = mode === 'add' ? 'Create Campaign' : 'Update Campaign';
  const icon = mode === 'add' ? 'bi-plus-circle' : 'bi-pencil-square';

  const isFormValid = campaignName.trim() && campaignDate.trim();
  // ✅ Set default date to today when creating a new campaign
  useEffect(() => {
    if (mode === 'add' && !campaignDate) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      setCampaignDate(today);
    }
  }, [mode, campaignDate, setCampaignDate]);

  return (
    <div
      className={`modal fade ${show ? 'show d-block' : ''}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-megaphone me-2"></i>
              {title}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Campaign Name */}
            <div className="mb-3">
              <label htmlFor="campaignName" className="form-label">
                Campaign Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name..."
              />
            </div>

            {/* Campaign Date */}
            <div className="mb-3">
              <label htmlFor="campaignDate" className="form-label">
                Campaign Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control form-control-lg"
                id="campaignDate"
                value={campaignDate}
                onChange={(e) => setCampaignDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              <i className="bi bi-x-circle me-1"></i> Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSubmit}
              disabled={!isFormValid}
            >
              <i className={`bi ${icon} me-1`}></i> {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;
