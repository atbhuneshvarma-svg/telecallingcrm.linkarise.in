import { useState } from 'react';
import { leadTransferApi } from '../core/_request';
import { TransferRequest, TransferResponse } from '../core/types';

export const useTransferLead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transferLeads = async (request: TransferRequest): Promise<TransferResponse> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Transferring leads:', request);
      
      // Use the API function from _request.ts
      const result = await leadTransferApi.transferLeads(request);
      
      console.log('✅ Transfer successful:', result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Transfer failed';
      setError(errorMessage);
      console.error('❌ Transfer error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    transferLeads,
    loading,
    error,
  };
};