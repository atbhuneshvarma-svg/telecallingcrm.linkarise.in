import React from 'react';

const LeadSummaryHeader: React.FC = () => {
  return (
    <div className="mb-4">
      <h1 className="h2 mb-1" style={{ 
        color: '#2c3e50', 
        fontWeight: '600',
        fontSize: '1.75rem'
      }}>
        Total Lead Summary
      </h1>
      <div className="border-top mt-3"></div>
    </div>
  );
};

export default LeadSummaryHeader;