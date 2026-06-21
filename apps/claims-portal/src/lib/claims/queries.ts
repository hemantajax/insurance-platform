'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteClaim,
  fetchClaim,
  fetchClaims,
  updateClaim,
  type Claim,
  type ClaimsListParams,
  type ClaimsListResponse,
} from '@org/shared';

export const claimsQueryKey = (params: ClaimsListParams) => ['claims', params] as const;

export function useClaimsQuery(params: ClaimsListParams) {
  return useQuery({
    queryKey: claimsQueryKey(params),
    queryFn: () => fetchClaims(params),
    placeholderData: (previous) => previous,
  });
}

export function useClaimQuery(id: string | null) {
  return useQuery({
    queryKey: ['claim', id],
    queryFn: () => fetchClaim(id!),
    enabled: Boolean(id),
  });
}

export function useDeleteClaimMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClaim(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
}

export function useUpdateClaimMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Pick<Claim, 'status' | 'assignee' | 'assigneeId'>>;
    }) => updateClaim(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
}

export function useAssignClaimMutation() {
  return useUpdateClaimMutation();
}

export type { ClaimsListParams, ClaimsListResponse };
