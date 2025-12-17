import React, { useEffect, useState } from 'react'
import { leadService } from '../core/leadService'
import Filters from '../components/Filters'
import LeadsTable from '../components/LeadsTable'
import ExportButton from '../components/ExportButton'
import { Lead, Pagination, Filters as FiltersType } from '../core/types'
import { TableColumn } from 'react-data-table-component'

const StageWiseLeadPage = () => {
    const [leads, setLeads] = useState<Lead[]>([])
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        per_page: 10,
        total: 0
    })
    const [filters, setFilters] = useState<FiltersType>({
        campaign: '',
        user: '',
        stage: '',
    })

    const fetchLeads = async (page = 1) => {
        setLoading(true)
        try {
            const data = await leadService.getStageWiseLeads(page)
            setLeads(data.data)
            setFilteredLeads(data.data)
            setPagination({
                page: data.current_page,
                per_page: data.per_page,
                total: data.total
            })
        } catch (err) {
            console.error('Error fetching leads:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeads()
    }, [])

    useEffect(() => {
        const filtered = leads.filter(lead => {
            return (
                (!filters.campaign || lead.campaign === filters.campaign) &&
                (!filters.user || lead.telecaller === filters.user) &&
                (!filters.stage || lead.stage === filters.stage)
            )
        })
        setFilteredLeads(filtered)
    }, [filters, leads])

    const handleResetFilters = () => {
        setFilters({ campaign: '', user: '', stage: '' })
    }

    const columns: TableColumn<Lead>[] = [
        {
            name: 'Sr.No',
            cell: (row, index) => index + 1 + (pagination.page - 1) * pagination.per_page
        },
        { name: 'Campaign', selector: row => row.campaign },
        { name: 'User', selector: row => row.telecaller },
        { name: 'Lead Name', selector: row => row.prospectname },
        { name: 'Mobile', selector: row => row.mobile },
        { name: 'Stage', selector: row => row.stage },
        { name: 'Stage Date', selector: row => row.stagedate },
        { name: 'Added On', selector: row => row.created_at },
    ]

    return (
        <div className="container-fluid p-5">
            <div className="card">
                <div className="card-header">
                    <h1 className="mt-5 fw-bold text-gray-800">Stage Wise Lead</h1>
                </div>

                <div className="card-body">
                    <Filters
                        filters={filters}
                        onFilterChange={setFilters}
                        onReset={handleResetFilters}
                        onFetch={() => fetchLeads(pagination.page)}
                        leads={leads}
                    />

                    <LeadsTable
                        leads={filteredLeads}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={fetchLeads}
                    />


                    <ExportButton
                        data={filteredLeads}
                        pagination={pagination}
                        filename="leads_report"
                        exportType="excel"
                    />
                </div>
            </div>
        </div>
    )
}

export default StageWiseLeadPage