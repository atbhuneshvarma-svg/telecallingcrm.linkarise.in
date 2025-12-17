import React from 'react';
import { Table } from 'react-bootstrap';
import { LeadSummaryData } from '../core/types';

interface LeadSummaryTableProps {
  data: LeadSummaryData[];
  loading: boolean;
}

const LeadSummaryTable: React.FC<LeadSummaryTableProps> = ({ data, loading }) => {
  // Skeleton cell
  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span
        className="placeholder col-12"
        style={{ height: '20px', display: 'block', borderRadius: '4px' }}
      />
    </div>
  );

  // Skeleton rows (7 columns)
  const skeletonRows = Array.from({ length: 8 }).map((_, index) => (
    <tr key={index}>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i}><SkeletonCell /></td>
      ))}
    </tr>
  ));

  // If loading, show skeleton rows
  if (loading) {
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
          <tbody>{skeletonRows}</tbody>
        </Table>
      </div>
    );
  }

  // Empty state
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
