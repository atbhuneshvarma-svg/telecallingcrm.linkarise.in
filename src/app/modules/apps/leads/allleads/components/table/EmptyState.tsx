import React from 'react';

interface EmptyStateProps {
  loading: boolean;
  displayLeads: any[];
  localSearchTerm: string;
  onSearchClear: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  loading,
  displayLeads,
  localSearchTerm,
  onSearchClear
}) => {
  if (loading || displayLeads.length > 0) return null;

  return (
    <div className="text-center py-8">
      <div className="mb-4">
        <i className="bi bi-inbox display-1 text-muted opacity-50"></i>
      </div>
      <h5 className="text-muted mb-2">
        {localSearchTerm ? 'No matching leads found' : 'No leads available'}
      </h5>
      <p className="text-muted mb-4">
        {localSearchTerm 
          ? 'Try adjusting your search terms or filters' 
          : 'Get started by adding your first lead'
        }
      </p>
      {localSearchTerm && (
        <button 
          className="btn btn-primary"
          onClick={onSearchClear}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Clear Search
        </button>
      )}
    </div>
  );
};