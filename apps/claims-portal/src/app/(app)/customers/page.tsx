'use client';

import dynamic from 'next/dynamic';

import { PageLoader } from '@org/layout';

const CustomersPageContent = dynamic(() => import('./customers-page'), {
  loading: () => <PageLoader label="Loading customers…" />,
});

export default function CustomersPage() {
  return <CustomersPageContent />;
}
