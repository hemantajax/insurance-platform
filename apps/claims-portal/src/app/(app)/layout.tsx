export const dynamic = 'force-dynamic';

import { AppShellLayout } from '../../components/app-shell-layout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShellLayout>{children}</AppShellLayout>;
}
