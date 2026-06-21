'use client';

import dynamic from 'next/dynamic';

import { PageLoader } from '@org/layout';

const DashboardPageContent = dynamic(() => import('./dashboard-page'), {
  loading: () => <PageLoader label="Loading dashboard…" />,
});

export default function DashboardPage() {
  return <DashboardPageContent />;
}
