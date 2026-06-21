'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { ClaimsGrid } from '@org/data-grid';
import type { ClaimStatus, ClaimsListParams } from '@org/shared';
import { PERMISSIONS } from '@org/shared';

import { CrmPageLayout } from '../../../components/crm-page-layout';
import { usePermission } from '../../../lib/auth';
import {
  useAssignClaimMutation,
  useClaimsQuery,
  useDeleteClaimMutation,
} from '../../../lib/claims';

function parseParams(searchParams: URLSearchParams): ClaimsListParams {
  return {
    page: Number(searchParams.get('page') ?? '1') || 1,
    pageSize: Number(searchParams.get('pageSize') ?? '50') || 50,
    sort: searchParams.get('sort') ?? undefined,
    order: (searchParams.get('order') as 'asc' | 'desc' | null) ?? undefined,
    status: (searchParams.get('status') as ClaimStatus | null) ?? undefined,
    assignee: searchParams.get('assignee') ?? undefined,
    q: searchParams.get('q') ?? undefined,
  };
}

export default function ClaimsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = React.useMemo(
    () => parseParams(searchParams),
    [searchParams]
  );

  const { data, isLoading, isError } = useClaimsQuery(params);
  const deleteMutation = useDeleteClaimMutation();
  const assignMutation = useAssignClaimMutation();

  const canEdit = usePermission(PERMISSIONS.CLAIM_EDIT);
  const canDelete = usePermission(PERMISSIONS.CLAIM_DELETE);
  const canAssign = usePermission(PERMISSIONS.CLAIM_ASSIGN);

  const updateParams = React.useCallback(
    (patch: Partial<ClaimsListParams>) => {
      const next = new URLSearchParams(searchParams.toString());
      const merged = { ...params, ...patch };
      for (const [key, value] of Object.entries(merged)) {
        if (value === undefined || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      router.replace(`/claims?${next.toString()}`);
    },
    [params, router, searchParams]
  );

  return (
    <CrmPageLayout title="All Claims" searchPlaceholder="Search claims">
      <ClaimsGrid
        data={data?.data ?? []}
        total={data?.total ?? 0}
        isLoading={isLoading}
        isError={isError}
        params={params}
        onParamsChange={updateParams}
        canEdit={canEdit}
        canDelete={canDelete}
        canAssign={canAssign}
        onDelete={async (id) => {
          try {
            await deleteMutation.mutateAsync(id);
            toast.success('Claim deleted');
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Delete failed');
          }
        }}
        onAssign={async (id, assigneeId, assigneeName) => {
          try {
            await assignMutation.mutateAsync({
              id,
              data: { assigneeId, assignee: assigneeName },
            });
            toast.success('Claim assigned');
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Assign failed');
          }
        }}
        onClaimSelect={(claimId) => router.push(`/claims/${claimId}`)}
      />
    </CrmPageLayout>
  );
}
