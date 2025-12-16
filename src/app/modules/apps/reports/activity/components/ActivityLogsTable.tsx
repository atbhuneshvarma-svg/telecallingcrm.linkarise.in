import React, { useState, useMemo } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ActivityLog } from '../core/_models';
import { useThemeMode } from '../../../../../../_metronic/partials';

interface ActivityLogsTableProps {
  logs: ActivityLog[];
  loading: boolean;
  currentPage: number;
  perPage: number;
}

export const ActivityLogsTable: React.FC<ActivityLogsTableProps> = ({
  logs,
  loading,
  currentPage,
  perPage,
}) => {
  const { mode } = useThemeMode(); // get current theme mode
  const isDark = mode === 'dark'
  const [sortField, setSortField] = useState<keyof ActivityLog>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const getActionBadgeClass = (action: string) => {
     if (action === 'Add') {      
       action = 'Create'
    }
    switch (action) {
      case 'Login':
        return 'bg-success text-white px-2 badge';
      case 'Edit':
        return 'bg-warning text-dark px-2 badge';
      case 'Create':
        return 'bg-info text-white px-2 badge';
      case 'Delete':
        return 'bg-danger text-white px-2 badge';
      default:
        return 'bg-secondary text-white px-2 rounded';
    }
   
  };



  const sortedLogs = useMemo(() => {
    if (!logs.length) return [];
    return [...logs].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [logs, sortField, sortDirection]);

  const columns: TableColumn<ActivityLog>[] = [

    {
      name: '#',
      width: '70px',
      cell: (_, index) => (currentPage - 1) * perPage + index + 1,
    },
    {
      name: 'Module',
      selector: row => row.module,
      sortable: true,
      cell: row => <span className=" fw-bold fs-7">{row.module}</span>,
    },
    {
      name: 'Action',
      selector: row => row.action,
      sortable: true,
      cell: row => <span className={getActionBadgeClass(row.action)}>{row.action} </span>
      ,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: 'IP Address',
      selector: row => row.ip_address,
      sortable: true,
      cell: row => <code>{row.ip_address}</code>,
    },
    {
      name: 'Created At',
      selector: row => row.created_at,
      sortable: true,
      cell: row => formatDate(row.created_at),
    },
  ];

  // Skeleton rows
  const skeletonRows: ActivityLog[] = Array.from({ length: 10 }).map((_, i) => ({
    logmid: i,
    cmpmid: 0,
    usermid: 0,
    record_id: 0,
    module: '',
    action: '',
    description: '',
    ip_address: '',
    created_at: '',
  }));

  return (
    <DataTable
      columns={columns}
      data={loading ? skeletonRows : sortedLogs}
      highlightOnHover
      pointerOnHover
      striped
      responsive
      noHeader
      // Theme integration
      customStyles={{
        table: {
          style: {
            backgroundColor: mode === 'dark' ? '#1e1e2f' : undefined,
          },
        },
        headCells: {
          style: {
            fontSize:'1.2em',
            fontWeight: '700', // 👈 makes header bold
            backgroundColor: mode === 'dark' ? '#2a2a3d' : '#f8f9fa',
            color: mode === 'dark' ? '#fff' : undefined,
          },
        },
        cells: {
          style: {
            backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
            color: mode === 'dark' ? '#fff' : undefined,
          },
        },
      }}
      progressPending={loading}
      progressComponent={
        <div className="text-center py-4">
          <div className="placeholder-wave w-100">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="placeholder col-12 mb-2"
                style={{ height: '20px', borderRadius: '4px', backgroundColor: mode === 'dark' ? '#444' : '#e0e0e0' }}
              />
            ))}
          </div>
        </div>
      }
    />
  );
};
