import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LeadAllocation from './LeadAllocation'
import LeadTransfer from '../transfer/Leadtransfer' // Adjust path as needed

const LeadAllocationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LeadAllocation />} />
      <Route path="/transfer" element={<LeadTransfer />} />
    </Routes>
  )
}

export default LeadAllocationRoutes