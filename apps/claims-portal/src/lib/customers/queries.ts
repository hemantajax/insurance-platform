'use client';

import { useQuery } from '@tanstack/react-query';

import {
  fetchCustomer,
  fetchCustomers,
  type CustomersListParams,
  type CustomersListResponse,
} from '@org/shared';

export const customersQueryKey = (params: CustomersListParams) =>
  ['customers', params] as const;

export const customerQueryKey = (id: string | null) => ['customer', id] as const;

export function useCustomersQuery(params: CustomersListParams) {
  return useQuery({
    queryKey: customersQueryKey(params),
    queryFn: () => fetchCustomers(params),
    placeholderData: (previous) => previous,
  });
}

export function useCustomerQuery(id: string | null) {
  return useQuery({
    queryKey: customerQueryKey(id),
    queryFn: ({ signal }) => fetchCustomer(id!, signal),
    enabled: Boolean(id),
  });
}

export type { CustomersListParams, CustomersListResponse };
