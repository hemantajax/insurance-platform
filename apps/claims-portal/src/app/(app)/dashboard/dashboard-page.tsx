'use client';

import { FileText, Monitor, Users } from 'lucide-react';

import { StatCard, StatsRow } from '@org/layout';

import { CrmPageLayout } from '../../../components/crm-page-layout';
import { useAuth } from '../../../lib/auth';

export default function DashboardPageContent() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'Evano';

  return (
    <CrmPageLayout title={`Hello ${firstName} 👋🏼,`} searchPlaceholder="Search">
      <StatsRow>
        <StatCard
          label="Total Claims"
          value="5,423"
          trend="16% this month"
          icon={<FileText className="h-10 w-10" />}
        />
        <StatCard
          label="Open Claims"
          value="1,893"
          trend="1% this month"
          trendDirection="down"
          icon={<Users className="h-10 w-10" />}
        />
        <StatCard
          label="Active Now"
          value="189"
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
    </CrmPageLayout>
  );
}
