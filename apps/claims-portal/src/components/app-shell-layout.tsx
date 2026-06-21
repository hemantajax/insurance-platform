'use client';

import {
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { PortalShell, type PortalNavItem } from '@org/layout';
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@org/design-system';

import { useAuth } from '../lib/auth';
import { isCrmLayoutRoute } from '../lib/crm-layout';

const navItems: Omit<PortalNavItem, 'active'>[] = [
  { icon: <LayoutDashboard />, label: 'Dashboard', href: '/dashboard' },
  { icon: <FileText />, label: 'Claims', href: '/claims' },
  { icon: <Users />, label: 'Customers', href: '/customers' },
  { icon: <Settings />, label: 'Settings', href: '/settings' },
];

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isNavActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navigation: PortalNavItem[] = navItems.map((item) => ({
    ...item,
    active: isNavActive(item.href),
  }));

  const isCrmLayout = isCrmLayoutRoute(pathname);

  const initials =
    user?.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2) ?? 'U';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <PortalShell
      navigation={navigation}
      showHeader={!isCrmLayout}
      showBreadcrumb={!isCrmLayout}
      contentClassName={isCrmLayout ? 'px-0 pb-0' : undefined}
      profile={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" className="h-8 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm lg:inline">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>{user?.role.replace('_', ' ')}</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      {children}
    </PortalShell>
  );
}
