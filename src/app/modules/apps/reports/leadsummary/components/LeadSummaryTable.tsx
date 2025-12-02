import React from 'react';
import { Table } from 'react-bootstrap';
import { LeadSummaryData } from '../core/types';

interface LeadSummaryTableProps {
  data: LeadSummaryData[];
  loading: boolean;
}

const LeadSummaryTable: React.FC<LeadSummaryTableProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading lead summary...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No lead summary data available</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="mb-0">
        <thead className="table-light">
          <tr>
            <th>User</th>
            <th className="text-center">Total Leads</th>
            <th className="text-center">Fresh Leads</th>
            <th className="text-center">Followup</th>
            <th className="text-center">Interested</th>
            <th className="text-center">Converted</th>
            <th className="text-center">Not Interested</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.user}</td>
              <td className="text-center">{item.total_lead.toLocaleString()}</td>
              <td className="text-center">{item.fresh.toLocaleString()}</td>
              <td className="text-center">{item.followup.toLocaleString()}</td>
              <td className="text-center">{item.interested.toLocaleString()}</td>
              <td className="text-center">{item.converted.toLocaleString()}</td>
              <td className="text-center">{item.not_interested.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default LeadSummaryTable;