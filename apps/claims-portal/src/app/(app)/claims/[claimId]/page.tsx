'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@org/design-system';
import { EmptyState } from '@org/layout';

import { CrmPageLayout } from '../../../../components/crm-page-layout';
import { useClaimQuery } from '../../../../lib/claims';

export default function ClaimWorkspacePage() {
  const params = useParams<{ claimId: string }>();
  const router = useRouter();
  const { data: claim, isLoading } = useClaimQuery(params.claimId);

  return (
    <CrmPageLayout
      title={isLoading ? 'Loading claim…' : (claim?.claimNumber ?? 'Claim')}
      headerActions={
        <Button type="button" variant="outline" onClick={() => router.push('/claims')}>
          Back to grid
        </Button>
      }
    >
      <EmptyState
        title="Document workspace"
        description="PDF viewer and document tools will be implemented in the document-workspace feature."
      />
    </CrmPageLayout>
  );
}
