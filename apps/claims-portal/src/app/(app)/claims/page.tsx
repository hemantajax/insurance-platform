'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { PageLoader } from '@org/layout';

const ClaimsPageContent = dynamic(() => import('./claims-page'), {
  loading: () => <PageLoader label="Loading claims…" />,
});

export default function ClaimsPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading claims…" />}>
      <ClaimsPageContent />
    </Suspense>
  );
}
