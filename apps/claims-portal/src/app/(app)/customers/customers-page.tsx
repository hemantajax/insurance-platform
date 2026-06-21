'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Monitor, Users } from 'lucide-react';

import {
  DataTableCard,
  PaginationControls,
  StatCard,
  StatsRow,
  StatusBadge,
  TableToolbar,
} from '@org/layout';
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@org/design-system';
import type { CustomerStatus, CustomersListParams } from '@org/shared';

import { CrmPageLayout } from '../../../components/crm-page-layout';
import { useAuth } from '../../../lib/auth';
import { useCustomersQuery } from '../../../lib/customers';

const PAGE_SIZE = 8;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function parseParams(searchParams: URLSearchParams): CustomersListParams {
  const sort = searchParams.get('sort');
  return {
    page: Number(searchParams.get('page') ?? '1') || 1,
    pageSize: PAGE_SIZE,
    sort:
      sort === 'newest' || sort === 'oldest' || sort === 'name' || sort === 'company'
        ? sort
        : 'newest',
    q: searchParams.get('q') ?? undefined,
    status: (searchParams.get('status') as CustomerStatus | null) ?? undefined,
  };
}

function formatTotal(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`;
  }
  return value.toLocaleString();
}

function formatFooter(page: number, pageSize: number, total: number): string {
  if (total === 0) {
    return 'No entries to show';
  }
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `Showing data ${start.toLocaleString()} to ${end.toLocaleString()} of ${formatTotal(total)} entries`;
}

export default function CustomersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = React.useMemo(() => parseParams(searchParams), [searchParams]);
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'Evano';

  const [searchInput, setSearchInput] = React.useState(params.q ?? '');
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const updateParams = React.useCallback(
    (patch: Partial<CustomersListParams>) => {
      const next = new URLSearchParams(searchParams.toString());
      const merged = { ...params, ...patch };
      for (const [key, value] of Object.entries(merged)) {
        if (value === undefined || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      router.replace(`/customers?${next.toString()}`);
    },
    [params, router, searchParams]
  );

  React.useEffect(() => {
    setSearchInput(params.q ?? '');
  }, [params.q]);

  React.useEffect(() => {
    if ((params.q ?? '') !== debouncedSearch) {
      updateParams({ q: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch, params.q, updateParams]);

  const { data, isLoading, isError, isFetching } = useCustomersQuery(params);

  const page = params.page ?? 1;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const stats = data?.stats;

  return (
    <CrmPageLayout title={`Hello ${firstName} 👋🏼,`} searchPlaceholder="Search">
      <StatsRow>
        <StatCard
          label="Total Customers"
          value={stats ? stats.total.toLocaleString() : '—'}
          trend="16% this month"
          icon={<Users className="h-10 w-10" />}
        />
        <StatCard
          label="Members"
          value={stats ? stats.activeMembers.toLocaleString() : '—'}
          trend="1% this month"
          trendDirection="down"
          icon={<Users className="h-10 w-10" />}
        />
        <StatCard
          label="Active Now"
          value={stats ? String(stats.activeNow) : '—'}
          icon={<Monitor className="h-10 w-10" />}
          avatars={[
            { fallback: 'A' },
            { fallback: 'B' },
            { fallback: 'C' },
            { fallback: 'D' },
            { fallback: 'E' },
          ]}
        />
      </StatsRow>

      <DataTableCard
        title="All Customers"
        subtitle={isFetching && !isLoading ? 'Updating…' : 'Active Members'}
        toolbar={
          <TableToolbar
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            sortValue={params.sort ?? 'newest'}
            onSortChange={(sort) =>
              updateParams({
                sort: sort as CustomersListParams['sort'],
                page: 1,
              })
            }
          />
        }
        footer={formatFooter(page, PAGE_SIZE, total)}
        pagination={
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => updateParams({ page: nextPage })}
          />
        }
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Customer Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Failed to load customers. Try again.
                </TableCell>
              </TableRow>
            ) : (data?.data.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No customers match your search.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DataTableCard>
    </CrmPageLayout>
  );
}
