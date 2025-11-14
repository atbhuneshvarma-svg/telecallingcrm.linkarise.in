import React, { useState, useMemo } from 'react';
import { ActivityLog } from '../core/_models';

interface ActivityLogsTableProps {
  logs: ActivityLog[];
  loading: boolean;
  currentPage: number;
  perPage: number;
}

type SortField = 'logmid' | 'module' | 'action' | 'description' | 'ip_address' | 'created_at';
type SortDirection = 'asc' | 'desc';

export const ActivityLogsTable: React.FC<ActivityLogsTableProps> = ({ 
  logs, 
  loading, 
  currentPage, 
  perPage 
}) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'Login':
        return 'bg-success';
      case 'Edit':
        return 'bg-warning';
      case 'Create':
        return 'bg-info';
      case 'Delete':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  // Sort logs based on selected field and direction
  const sortedLogs = useMemo(() => {
    if (!logs.length) return [];

    return [...logs].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date sorting
      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting (case insensitive)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [logs, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return '↕️'; // Neutral icon
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading && logs.length === 0) {
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th className="text-center">Sr. No</th>
              <th>Module</th>
              <th>Action</th>
              <th>Description</th>
              <th>IP Address</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (!loading && logs.length === 0) {
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th className="text-center">Sr. No</th>
              <th>Module</th>
              <th>Action</th>
              <th>Description</th>
              <th>IP Address</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-4">
                <div className="text-muted">No activity logs found</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th className="text-center">Sr. No</th>
            <th 
              className="cursor-pointer"
              onClick={() => handleSort('module')}
            >
              <div className="d-flex align-items-center gap-1">
                Module
                <span className="sort-icon">{getSortIcon('module')}</span>
              </div>
            </th>
            <th 
              className="cursor-pointer"
              onClick={() => handleSort('action')}
            >
              <div className="d-flex align-items-center gap-1">
                Action
                <span className="sort-icon">{getSortIcon('action')}</span>
              </div>
            </th>
            <th 
              className="cursor-pointer"
              onClick={() => handleSort('description')}
            >
              <div className="d-flex align-items-center gap-1">
                Description
                <span className="sort-icon">{getSortIcon('description')}</span>
              </div>
            </th>
            <th 
              className="cursor-pointer"
              onClick={() => handleSort('ip_address')}
            >
              <div className="d-flex align-items-center gap-1">
                IP Address
                <span className="sort-icon">{getSortIcon('ip_address')}</span>
              </div>
            </th>
            <th 
              className="cursor-pointer"
              onClick={() => handleSort('created_at')}
            >
              <div className="d-flex align-items-center gap-1">
                Created At
                <span className="sort-icon">{getSortIcon('created_at')}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedLogs.map((log, index) => (
            <tr key={log.logmid}>
              <td className="text-center">{(currentPage - 1) * perPage + index + 1}</td>
              <td>
                <span className="badge bg-primary">{log.module}</span>
              </td>
              <td>
                <span className={`badge ${getActionBadgeClass(log.action)}`}>
                  {log.action}
                </span>
              </td>
              <td>{log.description}</td>
              <td>
                <code>{log.ip_address}</code>
              </td>
              <td>{formatDate(log.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};