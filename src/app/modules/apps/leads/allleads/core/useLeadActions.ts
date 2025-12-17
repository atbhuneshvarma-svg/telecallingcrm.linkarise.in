import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { leadApi } from './_request';
import { Lead, CreateLeadRequest, LeadApiResponse, UpdateLeadRequest } from './_models';

export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: (filters: any) => [...leadKeys.lists(), { filters }] as const,
  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: number) => [...leadKeys.details(), id] as const,
};

interface UseLeadsParams {
  page?: number;
  perPage?: number;
  team?: string;
  status?: string;
  campaign?: string | number;
  user?: string | number;
}

export const useLeadActions = () => {
  const queryClient = useQueryClient();

  const createLeadMutation = useMutation({
    mutationFn: (leadData: CreateLeadRequest) => leadApi.createLead(leadData),
    onSuccess: (result) => {
      if (result) {
        queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      }
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeadRequest }) =>
      leadApi.updateLead(id, data),
    onSuccess: (result, variables) => {
      if (result.result) {
        queryClient.setQueryData(leadKeys.detail(variables.id), (old: Lead | undefined) =>
          old ? { ...old, ...variables.data } : undefined
        );
        queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      }
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: number) => leadApi.deleteLead(id),
    onSuccess: (result, deletedId) => {
      if (result.result) {
        queryClient.removeQueries({ queryKey: leadKeys.detail(deletedId) });
        queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      }
    },
  });

  const deleteLeadsMutation = useMutation({
    mutationFn: (leadIds: number[]) => leadApi.deleteLeads(leadIds),
    onSuccess: (result) => {
      if (result.result) {
        queryClient.invalidateQueries({ queryKey: leadKeys.all });
      }
    },
  });

  return {
    createLead: createLeadMutation.mutateAsync,
    updateLead: updateLeadMutation.mutateAsync,
    deleteLead: deleteLeadMutation.mutateAsync,
    deleteLeads: deleteLeadsMutation.mutateAsync,

    isCreating: createLeadMutation.isPending,
    isUpdating: updateLeadMutation.isPending,
    isDeleting: deleteLeadMutation.isPending,
    isDeletingMultiple: deleteLeadsMutation.isPending,

    createError: createLeadMutation.error,
    updateError: updateLeadMutation.error,
    deleteError: deleteLeadMutation.error,
    deleteMultipleError: deleteLeadsMutation.error,

    isCreateSuccess: createLeadMutation.isSuccess,
    isUpdateSuccess: updateLeadMutation.isSuccess,
    isDeleteSuccess: deleteLeadMutation.isSuccess,
  };
};

export const useLeads = (params: UseLeadsParams = {}) => {
  const { page = 1, perPage = 10, team = '', status = '', campaign = '', user = '' } = params;

  return useQuery({
    queryKey: leadKeys.list({ page, perPage, team, status, campaign, user }),
    queryFn: () =>
      leadApi.getLeadsPaginated({
        page,
        per_page: perPage,
        team_filter: team || undefined, // Changed from 'team' to 'team_filter'
        user_filter: user ? String(user) : undefined,
        campaign_filter: campaign ? String(campaign) : undefined,
        status_filter: status || undefined,
      }),
    select: (data: LeadApiResponse) => ({
      ...data,
      data: data.data.map((lead) => ({ ...lead, isSelected: false })),
    }),
    staleTime: 2 * 60 * 1000,
  });
};

export const useAllLeads = () => {
  return useQuery({
    queryKey: [...leadKeys.lists(), 'all'],
    queryFn: async () => {
      const data = await leadApi.getLeadsForAllocation();
      return data.map((lead) => ({ ...lead, isSelected: false }));
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useLead = (leadId: number) => {
  return useQuery({
    queryKey: leadKeys.detail(leadId),
    queryFn: () => leadApi.getLead(leadId),
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000,
  });
};