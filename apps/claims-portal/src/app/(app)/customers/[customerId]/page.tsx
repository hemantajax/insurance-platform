'use client';

import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@org/design-system';
import {
  DocumentLoadError,
  DocumentLoadingState,
  DocumentViewer,
  useDocumentLoader,
} from '@org/documents';

import { CrmPageLayout } from '../../../../components/crm-page-layout';
import { useCustomerQuery } from '../../../../lib/customers';

const PHASE_LABEL: Record<string, string> = {
  'loading-metadata': 'Preparing document…',
  'loading-pages': 'Loading document…',
  ready: 'Ready',
  error: 'Failed',
};

export default function CustomerWorkspacePage() {
  const params = useParams<{ customerId: string }>();
  const router = useRouter();

  const customerQuery = useCustomerQuery(params.customerId);
  const customer = customerQuery.data;

  const goBack = React.useCallback(() => router.push('/customers'), [router]);

  const loader = useDocumentLoader(customer?.documentId ?? null, {
    onCancel: goBack,
  });

  const title = customer ? customer.name : 'Opening workspace…';

  let body: React.ReactNode;
  if (customerQuery.isError) {
    body = (
      <DocumentLoadError
        message="We couldn't find this customer."
        onBack={goBack}
        onRetry={() => customerQuery.refetch()}
      />
    );
  } else if (loader.phase === 'error') {
    body = (
      <DocumentLoadError
        message={loader.error}
        onBack={goBack}
        onRetry={loader.retry}
      />
    );
  } else if (loader.phase !== 'ready') {
    body = (
      <DocumentLoadingState
        progress={loader.progress}
        label={PHASE_LABEL[loader.phase] ?? 'Loading…'}
        fileName={loader.metadata?.fileName}
        onCancel={loader.cancel}
      />
    );
  } else if (loader.metadata) {
    body = <DocumentViewer metadata={loader.metadata} />;
  } else {
    body = (
      <DocumentLoadingState
        progress={loader.progress}
        label={PHASE_LABEL[loader.phase] ?? 'Loading…'}
        onCancel={loader.cancel}
      />
    );
  }

  return (
    <CrmPageLayout
      title={title}
      headerActions={
        <Button type="button" variant="outline" onClick={goBack}>
          Back to grid
        </Button>
      }
    >
      {body}
    </CrmPageLayout>
  );
}
