import { FC, useState, useEffect, useMemo } from 'react'
import { KTCard } from '../../../../../_metronic/helpers'
import { ConvertedLeadsTable } from './components/ConvertedLeadsTable'
import { ConvertedLeadsFilter } from './components/ConvertedLeadsFilter'
import { ConvertedLead, ConvertedLeadFilters, SortField, SortDirection } from './core/types/lead'
import { convertedLeadService } from './core/services/leadService'
import { useLeads } from '../../leads/allleads/core/LeadsContext'
import { string } from 'yup'

const ConvertedLeadPage: FC = () => {
    const [convertedLeads, setConvertedLeads] = useState<ConvertedLead[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<ConvertedLeadFilters>({
        team: 'all',
        user: 'all',
        campaign: 'all',
        search: '',
        page: 1,
        per_page: 10
    })
    const [sortConfig, setSortConfig] = useState<{
        field: SortField
        direction: SortDirection
    } | null>(null)

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await convertedLeadService.getConvertedLeads(filters)
                if (response.result) {
                    setConvertedLeads(response.data)
                }
            } catch (error) {
                console.error('Error fetching converted leads:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [filters])

    // Handle sorting
    const handleSort = (field: SortField) => {
        setSortConfig((current) => {
            if (current?.field === field) {
                return {
                    field,
                    direction: current.direction === 'asc' ? 'desc' : 'asc',
                }
            }
            return { field, direction: 'asc' }
        })
    }

    // Sort leads based on sortConfig with proper null handling
    const sortedLeads = useMemo(() => {
        if (!sortConfig) return convertedLeads

        return [...convertedLeads].sort((a, b) => {
            const aValue = a[sortConfig.field]
            const bValue = b[sortConfig.field]

            // Handle null values - treat null as empty string for sorting
            const safeAValue = aValue === null ? '' : String(aValue)
            const safeBValue = bValue === null ? '' : String(bValue)

            if (safeAValue < safeBValue) {
                return sortConfig.direction === 'asc' ? -1 : 1
            }
            if (safeAValue > safeBValue) {
                return sortConfig.direction === 'asc' ? 1 : -1
            }
            return 0
        })
    }, [convertedLeads, sortConfig])

    // Handle filter changes
    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
    }

    const handleTeamFilter = (team: string) => {
        setFilters(prev => ({ ...prev, team, page: 1 }))
    }

    const handleUserFilter = (user: string) => {
        setFilters(prev => ({ ...prev, user, page: 1 }))
    }

    const handleCampaignFilter = (campaign: string) => {
        setFilters(prev => ({ ...prev, campaign, page: 1 }))
    }

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }))
    }

    const handlePerPageChange = (perPage: number) => {
        setFilters(prev => ({ ...prev, per_page: perPage, page: 1 }))
    }


    const { dropdowns } = useLeads();
    // Define your filter options (you can fetch these from API or define statically)
    const teamOptions = [
        ...dropdowns.teams.map((team) => (
            { value: String(team.tmid), label: team.teamname }
        ))
        // Add more teams as needed
    ]

    const userOptions = [
        ...dropdowns.users.map((user) => (
            { value: String(user.usermid), label: user.username }
        ))
        // Add more users as needed
    ]

    const campaignOptions = [
        ...dropdowns.campaigns.map((campaign) => (
            { value: String(campaign.id), label: campaign.name }
        ))
    ]

    return (
        <>
            <div className='row g-5 g-xl-8'>
                <div className='col-xl-12'>
                    <KTCard>
                        <div className='card-header border-0 pt-6'>
                            <div className='card-title'>
                                <h3 className='fw-bold m-0'>Converted to client</h3>
                            </div>

                            <div className='card-toolbar'>
                                <div className='d-flex align-items-center gap-4'>
                                    <ConvertedLeadsFilter
                                        selectedTeam={filters.team}
                                        selectedUser={filters.user}
                                        selectedCampaign={filters.campaign}
                                        onTeamChange={handleTeamFilter}
                                        onUserChange={handleUserFilter}
                                        onCampaignChange={handleCampaignFilter}
                                        teams={teamOptions}
                                        users={userOptions}
                                        campaigns={campaignOptions}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='card-body py-4'>
                            <ConvertedLeadsTable
                                leads={sortedLeads}
                                loading={loading}
                                pagination={{
                                    page: filters.page || 1,
                                    perPage: filters.per_page || 10,
                                    total: convertedLeads.length
                                }}
                                totalRecords={convertedLeads.length}
                                onPageChange={handlePageChange}
                                onPerPageChange={handlePerPageChange}
                                sortConfig={sortConfig}
                                onSort={handleSort}
                                onSearch={handleSearch}
                            />
                        </div>
                    </KTCard>
                </div>
            </div>
        </>
    )
}

export { ConvertedLeadPage }