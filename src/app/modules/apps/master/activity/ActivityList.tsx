// ActivityList.tsx - React DataTable + Skeleton + Theme + Sorting
import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Activity } from './core/_request';
import { useThemeMode } from '../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider';

interface ActivityListProps {
  activities: Activity[];
  loading?: boolean;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: number) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  loading = false,
  onEditActivity,
  onDeleteActivity,
}) => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
    } else {
      const timeout = setTimeout(() => setShowSkeleton(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const skeletonRows: Activity[] = Array.from({ length: 5 }).map((_, index) => ({
    id: index,
    name: '',
  }));

  const SkeletonCell = () => (
    <div className="placeholder-wave w-100">
      <span
        className="placeholder col-12"
        style={{ height: '20px', display: 'block', borderRadius: '4px' }}
      />
    </div>
  );

  const columns: TableColumn<Activity>[] = [
    {
      name: '#',
      cell: (row) => showSkeleton ? <SkeletonCell /> : activities.indexOf(row) + 1,
      selector: (row) => activities.indexOf(row) + 1,
      width: '60px',
      center: true,
      sortable: true,
    },
    {
      name: 'Activity Name',
      cell: (row) => (showSkeleton ? <SkeletonCell /> : row.name),
      selector: (row) => row.name, // <-- important for sorting
      sortable: true,
      wrap: true,
    },
    {
      name: 'Actions',
      cell: (row) =>
        showSkeleton ? (
          <SkeletonCell />
        ) : (
          <div className="dropdown">
            <button
              className="btn btn-sm btn-light btn-active-light-primary"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Actions <i className="bi bi-chevron-down ms-2"></i>
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={() => onEditActivity(row)}>
                  <i className="bi bi-pencil me-2"></i>Edit
                </button>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={() => onDeleteActivity(row.id)}>
                  <i className="bi bi-trash me-2"></i>Delete
                </button>
              </li>
            </ul>
          </div>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
      center: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
        color: isDark ? '#ccc' : '#333',
        fontWeight: 600,
        fontSize: '14px',
        borderBottom: isDark ? '2px solid #333' : '2px solid #dee2e6',
        padding: '12px 15px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        color: isDark ? '#ccc' : '#333',
        backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
        padding: '12px 15px',
        borderBottom: isDark ? '1px solid #333' : '1px solid #dee2e6',
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={showSkeleton ? skeletonRows : activities}
      customStyles={customStyles}
      striped
      highlightOnHover
      pointerOnHover
      responsive
      noHeader
      defaultSortFieldId={1} // optional: default sort column
    />
  );
};

export default ActivityList;
