'use client';

import { useQuery } from '@tanstack/react-query';

import {
  fetchCustomers,
  type CustomersListParams,
  type CustomersListResponse,
} from '@org/shared';

export const customersQueryKey = (params: CustomersListParams) =>
  ['customers', params] as const;

export function useCustomersQuery(params: CustomersListParams) {
  return useQuery({
    queryKey: customersQueryKey(params),
    queryFn: () => fetchCustomers(params),
    placeholderData: (previous) => previous,
  });
}

export type { CustomersListParams, CustomersListResponse };
