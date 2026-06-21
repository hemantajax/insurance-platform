'use client';

import { Suspense } from 'react';

import { PageLoader } from '@org/layout';

import ClaimsPageContent from './claims-page';

export default function ClaimsPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading claims…" />}>
      <ClaimsPageContent />
    </Suspense>
  );
}
