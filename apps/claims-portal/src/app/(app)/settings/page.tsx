'use client';

import { EmptyState } from '@org/layout';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <EmptyState
      icon={<Settings className="h-6 w-6" />}
      title="Settings"
      description="User preferences and role settings will be configured after auth."
    />
  );
}
