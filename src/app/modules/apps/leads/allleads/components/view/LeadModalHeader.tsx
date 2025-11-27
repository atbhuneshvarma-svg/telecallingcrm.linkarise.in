import React from 'react'
import { Button, Badge } from 'react-bootstrap'
import { Lead } from '../../core/_models'

interface LeadModalHeaderProps {
    lead: Lead
    getStatusColor: (statusname: string) => string
    formatDate: (dateString: string | undefined) => string
    onStatusUpdate?: (lead: Lead) => void
    onEdit: (lead: Lead) => void
    loading: boolean
}

const LeadModalHeader: React.FC<LeadModalHeaderProps> = ({
    lead,
    getStatusColor,
    formatDate,
    onStatusUpdate,
    onEdit,
    loading
}) => {
    return (
        <div className="bg-opacity-10 p-4 border-bottom">
            <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                    <h4 className="fw-bold text-dark mb-2">
                        {lead.leadname || 'Unnamed Lead'}
                    </h4>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        <Badge
                            className="rounded-pill px-3 py-2 fs-7"
                        >
                            <i className="bi bi-tag me-1"></i>
                            {lead.statusname || 'No Status'}
                        </Badge>

                        <Badge bg="light" text="dark" className="rounded-pill px-3 py-2 fs-7 border">
                            <i className="bi bi-hash me-1"></i>
                            ID: #{lead.leadmid}
                        </Badge>

                        <Badge bg="light" text="dark" className="rounded-pill px-3 py-2 fs-7 border">
                            <i className="bi bi-calendar me-1"></i>
                            Created: {formatDate(lead.created_at)}
                        </Badge>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onStatusUpdate?.(lead)}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-repeat me-2"></i>
                        Update Status
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onEdit(lead)}
                        disabled={loading}
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Edit Lead
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LeadModalHeader