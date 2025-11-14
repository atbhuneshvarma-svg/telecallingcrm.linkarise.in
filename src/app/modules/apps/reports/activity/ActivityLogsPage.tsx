import React, { useState, useEffect, useMemo } from 'react';
import { useActivityLogs } from './hooks/useActivityLogs';
import { ActivityLogsFilters, ActivityLog } from './core/_models';
import { ActivityLogsHeader } from './components/ActivityLogsHeader';
import { ActivityLogsTable } from './components/ActivityLogsTable';
import { ActivityLogsPagination } from './components/ActivityLogsPagination';
import { ActivityLogsControls } from './components/ActivityLogsControls';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ActivityLogsPage: React.FC = () => {
  const [allLogs, setAllLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<ActivityLogsFilters>({
    page: 1,
    per_page: 10,
  });

  const { logs, loading, error, refetch } = useActivityLogs(filters);

  // Refresh function
  const handleRefresh = () => {
    refetch();
    toast.info('Refreshing activity logs...', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load activity logs: ${error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [error]);

  // Show success toast when data loads successfully
  useEffect(() => {
    if (logs && !loading && !error) {
      const recordCount = logs.total_records;
      if (recordCount > 0) {
        toast.success(`Loaded ${recordCount} activity logs successfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  }, [logs, loading, error]);

  // Store ALL logs when they are fetched (accumulate data)
  useEffect(() => {
    if (logs?.data) {
      setAllLogs((prevLogs) => {
        // Create a map to avoid duplicates
        const logsMap = new Map(prevLogs.map((log) => [log.logmid, log]));

        // Add new logs to the map
        logs.data.forEach((log) => {
          logsMap.set(log.logmid, log);
        });

        // Convert back to array
        return Array.from(logsMap.values());
      });
    }
  }, [logs?.data]);

  // Filter logs CLIENT-SIDE based on search term
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) {
      return allLogs;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const results = allLogs.filter(
      (log: ActivityLog) =>
        log.action.toLowerCase().includes(searchLower) ||
        log.description.toLowerCase().includes(searchLower) ||
        log.module.toLowerCase().includes(searchLower) ||
        log.ip_address.toLowerCase().includes(searchLower)
    );

    // Show search results toast
    if (searchTerm.trim() && !loading) {
      if (results.length === 0) {
        toast.info('No results found for your search', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.info(`Found ${results.length} results for "${searchTerm}"`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }

    return results;
  }, [allLogs, searchTerm, loading]);

  // Paginate the filtered results
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage, perPage]);

  // Calculate pagination info for filtered results
  const totalRecords = filteredLogs.length;
  const totalPages = Math.ceil(totalRecords / perPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value);
    
    toast.info(`Showing ${newPerPage} entries per page`, {
      position: "top-right",
      autoClose: 2000,
    });
    
    setPerPage(newPerPage);
    setCurrentPage(1);

    // Update server filters only if we need more data
    if (newPerPage > perPage) {
      setFilters({
        page: 1,
        per_page: newPerPage,
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Show page change toast for better UX
    if (page !== currentPage) {
      toast.info(`Navigated to page ${page}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }

    // If we're not searching, fetch from server for new page
    if (!searchTerm.trim()) {
      setFilters({
        page: page,
        per_page: perPage,
      });
    }
  };

  // Load initial data
  useEffect(() => {
    setFilters({
      page: 1,
      per_page: perPage,
    });
    
    // Show loading toast for initial load
    const loadingToast = toast.loading('Loading activity logs...', {
      position: "top-right",
    });
    
    // This is just for the initial load indication
    const timer = setTimeout(() => {
      toast.dismiss(loadingToast);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle empty state with toast
  useEffect(() => {
    if (!loading && logs?.data && logs.data.length === 0 && !searchTerm.trim()) {
      toast.info('No activity logs available', {
        position: "top-right",
        autoClose: 4000,
      });
    }
  }, [logs?.data, loading, searchTerm]);

  return (
    <div className="card">
      <div className="card-body">
        <ActivityLogsHeader
          title="Activity Logs Report"
          subtitle="Track system activities and user actions"
          onRefresh={handleRefresh}
          loading={loading}
        />

        <ActivityLogsControls
          perPage={perPage}
          searchTerm={searchTerm}
          loading={loading}
          onPerPageChange={handlePerPageChange}
          onSearchChange={handleSearchChange}
        />

        <ActivityLogsTable
          logs={searchTerm.trim() ? paginatedLogs : logs?.data || []}
          loading={loading && (searchTerm.trim() ? paginatedLogs.length === 0 : true)}
          currentPage={currentPage}
          perPage={perPage}
        />

        {(totalRecords > 0 || (logs?.total_records || 0) > 0) && (
          <ActivityLogsPagination
            logs={{
              current_page: currentPage,
              per_page: perPage,
              total_records: searchTerm.trim() ? totalRecords : logs?.total_records || 0,
              total_pages: searchTerm.trim() ? totalPages : logs?.total_pages || 0,
            }}
            loading={loading}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export { ActivityLogsPage };