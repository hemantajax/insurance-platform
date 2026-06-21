'use client';

import * as React from 'react';
import {
  FileText,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
} from 'lucide-react';

import { useUiStore } from '@org/shared';
import {
  Avatar,
  AvatarFallback,
  Button,
  cn,
} from '@org/design-system';

import { AppShell } from './app-shell';
import { Breadcrumb, type BreadcrumbItem } from './breadcrumb';
import { ErrorBoundary } from './error-boundary';
import { Header } from './header';
import {
  Sidebar,
  SidebarBrand,
  SidebarNavItem,
  SidebarUserProfile,
} from './sidebar';

const TABLET_BREAKPOINT = 1024;

export interface PortalNavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

export interface PortalShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  profile?: React.ReactNode;
  navigation?: PortalNavItem[];
  showHeader?: boolean;
  showBreadcrumb?: boolean;
  contentClassName?: string;
  className?: string;
}

const defaultNavItems: PortalNavItem[] = [
  { icon: <LayoutDashboard />, label: 'Dashboard', href: '/dashboard' },
  { icon: <FileText />, label: 'Claims', href: '/claims' },
  { icon: <Users />, label: 'Customers', href: '/customers' },
  { icon: <Settings />, label: 'Settings', href: '/settings' },
];

export function PortalShell({
  children,
  breadcrumbs = [{ label: 'Dashboard' }],
  profile,
  navigation = defaultNavItems,
  showHeader = true,
  showBreadcrumb = true,
  contentClassName,
  className,
}: PortalShellProps) {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const closeOnMobile = () => {
      if (window.innerWidth < TABLET_BREAKPOINT) {
        setSidebarOpen(false);
      }
    };

    closeOnMobile();
    window.addEventListener('resize', closeOnMobile);
    return () => window.removeEventListener('resize', closeOnMobile);
  }, [setSidebarOpen]);

  const collapsed = !sidebarOpen;

  return (
    <AppShell
      className={className}
      sidebar={
        <>
          {sidebarOpen ? (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            />
          ) : null}
          <Sidebar
            collapsed={collapsed}
            className={cn(
              'z-50 transition-transform duration-200 lg:relative lg:translate-x-0',
              sidebarOpen
                ? 'fixed inset-y-0 left-0 translate-x-0'
                : 'fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0'
            )}
            brand={<SidebarBrand title="ABC Insurance" version="Claims" />}
            navigation={
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mb-2 hidden h-9 w-9 lg:inline-flex"
                  onClick={toggleSidebar}
                  aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                  {sidebarOpen ? (
                    <PanelLeftClose className="h-5 w-5" />
                  ) : (
                    <PanelLeftOpen className="h-5 w-5" />
                  )}
                </Button>
                {navigation.map((item) => (
                  <SidebarNavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={item.active}
                  />
                ))}
              </>
            }
            footer={
              <SidebarUserProfile
                name="Claims Processor"
                role="Placeholder user"
              />
            }
          />
        </>
      }
    >
      {showHeader ? (
        <Header
          title="ABC Insurance"
          onMenuClick={toggleSidebar}
          profile={
            profile ?? (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">CP</AvatarFallback>
              </Avatar>
            )
          }
        />
      ) : null}
      {showBreadcrumb ? <Breadcrumb items={breadcrumbs} /> : null}
      <ErrorBoundary>
        <div
          className={cn(
            'flex flex-1 flex-col overflow-auto px-4 pb-6 lg:px-6',
            contentClassName
          )}
        >
          {children}
        </div>
      </ErrorBoundary>
    </AppShell>
  );
}
