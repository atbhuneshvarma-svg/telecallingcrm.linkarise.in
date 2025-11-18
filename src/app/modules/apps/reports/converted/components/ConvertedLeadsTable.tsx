import { FC, useState } from 'react'
import { ConvertedLead, SortField, SortDirection } from '../core/types/lead'
import { Pagination } from './Pagination'
import { SearchInput } from './SearchInput'

interface Props {
    leads: ConvertedLead[]
    loading: boolean
    pagination: {
        page: number
        perPage: number
        total: number
    }
    totalRecords: number
    onPageChange: (page: number) => void
    onPerPageChange: (perPage: number) => void
    sortConfig: {
        field: SortField
        direction: SortDirection
    } | null
    onSort: (field: SortField) => void
    onSearch: (searchTerm: string) => void // Add search handler prop
}

const ConvertedLeadsTable: FC<Props> = ({
    leads,
    loading,
    pagination,
    totalRecords,
    onPageChange,
    onPerPageChange,
    sortConfig,
    onSort,
    onSearch
}) => {
    const getSortIcon = (field: SortField) => {
        if (!sortConfig || sortConfig.field !== field) {
            return '↕️'
        }
        return sortConfig.direction === 'asc' ? '↑' : '↓'
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="text-muted mt-3">Loading converted leads...</div>
            </div>
        )
    }

    if (leads.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-muted">No converted leads found</div>
                <div className="text-muted fs-8 mt-1">Try adjusting your search or filters</div>
            </div>
        )
    }

    return (
        <>
            {/* Search and entries selector in same row */}
            <div className='d-flex justify-content-between align-items-center mb-4'>
                {/* Show entries selector - Left side */}
                <div className='d-flex align-items-center'>
                    <span className='text-muted me-2'>Show</span>
                    <select
                        className='form-select form-select-sm w-auto'
                        value={pagination.perPage}
                        onChange={(e) => onPerPageChange(Number(e.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className='text-muted ms-2'>entries</span>
                </div>

                {/* Search Input - Right side */}
                <SearchInput onSearch={onSearch} placeholder="Search in table..." />
            </div>

            {/* Table */}
            <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                    <thead>
                        <tr className='fw-bold text-muted bg-light'>
                            <th
                                className='min-w-50px cursor-pointer'
                                onClick={() => onSort('leadmid')}
                            >
                                <div className='d-flex align-items-center'>
                                    <span>Sr.No</span>
                                    <span className='ms-1 fs-8'>{getSortIcon('leadmid')}</span>
                                </div>
                            </th>
                            <th
                                className='min-w-150px cursor-pointer'
                                onClick={() => onSort('leadname')}
                            >
                                <div className='d-flex align-items-center'>
                                    <span>Name</span>
                                    <span className='ms-1 fs-8'>{getSortIcon('leadname')}</span>
                                </div>
                            </th>
                            <th
                                className='min-w-100px cursor-pointer'
                                onClick={() => onSort('username')}
                            >
                                <div className='d-flex align-items-center'>
                                    <span>User</span>
                                    <span className='ms-1 fs-8'>{getSortIcon('username')}</span>
                                </div>
                            </th>
                            <th
                                className='min-w-100px cursor-pointer'
                                onClick={() => onSort('campaignname')}
                            >
                                <div className='d-flex align-items-center'>
                                    <span>Campaign</span>
                                    <span className='ms-1 fs-8'>{getSortIcon('campaignname')}</span>
                                </div>
                            </th>
                            <th
                                className='min-w-100px cursor-pointer'
                                onClick={() => onSort('phone')}
                            >
                                <div className='d-flex align-items-center'>
                                    <span>Phone</span>
                                    <span className='ms-1 fs-8'>{getSortIcon('phone')}</span>
                                </div>
                            </th>
                            <th className='min-w-150px'>Email</th>
                            <th className='min-w-150px'>Status</th>
                            <th className='min-w-100px'>Detail</th>
                            <th className='min-w-100px'>Remarks</th>
                            <th className='min-w-150px'>Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead, index) => (
                            <tr key={lead.leadmid}>
                                <td className='text-dark fw-bold'>{(pagination.page - 1) * pagination.perPage + index + 1}</td>
                                <td>
                                    <div className='text-dark fw-bold'>{lead.leadname}</div>
                                </td>
                                <td>
                                    <span className='text-dark'>{lead.username}</span>
                                </td>
                                <td>
                                    <span className='text-dark'>{lead.campaignname}</span>
                                </td>
                                <td>
                                    <div className='text-dark fw-bold'>{lead.phone}</div>
                                </td>
                                <td>
                                    {lead.email || <span className='text-muted'>-</span>}
                                </td>
                                <td>
                                    <span className='badge badge-light-success'>{lead.statusname}</span>
                                </td>
                                <td>
                                    {lead.detail || <span className='text-muted'>-</span>}
                                </td>
                                <td>
                                    <span className='text-dark'>{lead.leadremarks}</span>
                                </td>
                                <td>
                                    <span className='text-dark'>{lead.activity}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Component - Removed onPerPageChange prop */}
            <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(totalRecords / pagination.perPage)}
                totalRecords={totalRecords}
                perPage={pagination.perPage}
                onPageChange={onPageChange}
                isLoading={loading}
            />
        </>
    )
}

export { ConvertedLeadsTable }