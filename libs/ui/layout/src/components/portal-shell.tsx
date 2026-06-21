'use client';

import * as React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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
import { MobileSidebarProvider } from './mobile-sidebar-context';
import {
  CustomersIcon,
  DashboardIcon,
  HelpIcon,
  IncomeIcon,
  ProductIcon,
  PromoteIcon,
} from '../icons/nav-icons';
import {
  Sidebar,
  SidebarBrand,
  SidebarNavItem,
  SidebarUserProfile,
} from './sidebar';

const LG_BREAKPOINT = 1024;
const LG_MEDIA_QUERY = `(min-width: ${LG_BREAKPOINT}px)`;

function subscribeToLargeScreen(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(LG_MEDIA_QUERY);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getLargeScreenSnapshot() {
  return window.matchMedia(LG_MEDIA_QUERY).matches;
}

function getLargeScreenServerSnapshot() {
  return true;
}

function useIsLargeScreen(): boolean {
  return React.useSyncExternalStore(
    subscribeToLargeScreen,
    getLargeScreenSnapshot,
    getLargeScreenServerSnapshot
  );
}

export interface PortalNavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

export interface PortalShellSidebarUser {
  name: string;
  role: string;
  avatarFallback?: string;
}

export interface PortalShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  profile?: React.ReactNode;
  sidebarUser?: PortalShellSidebarUser;
  onSignOut?: () => void;
  navigation?: PortalNavItem[];
  showHeader?: boolean;
  showBreadcrumb?: boolean;
  contentClassName?: string;
  className?: string;
}

const defaultNavItems: PortalNavItem[] = [
  { icon: <DashboardIcon />, label: 'Dashboard', href: '/dashboard' },
  { icon: <ProductIcon />, label: 'Product', href: '/product' },
  { icon: <CustomersIcon />, label: 'Customers', href: '/customers' },
  { icon: <IncomeIcon />, label: 'Income', href: '/income' },
  { icon: <PromoteIcon />, label: 'Promote', href: '/promote' },
  { icon: <HelpIcon />, label: 'Help', href: '/help' },
];

export function PortalShell({
  children,
  breadcrumbs = [{ label: 'Dashboard' }],
  profile,
  sidebarUser,
  onSignOut,
  navigation = defaultNavItems,
  showHeader = true,
  showBreadcrumb = true,
  contentClassName,
  className,
}: PortalShellProps) {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const toggleMobileSidebar = useUiStore((state) => state.toggleMobileSidebar);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const isLargeScreen = useIsLargeScreen();

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.innerWidth < LG_BREAKPOINT) {
      setSidebarOpen(false);
    }

    let lastWidth = window.innerWidth;

    const closeOnMobileWidthChange = () => {
      const width = window.innerWidth;
      if (width !== lastWidth && width < LG_BREAKPOINT) {
        setSidebarOpen(false);
      }
      lastWidth = width;
    };

    window.addEventListener('resize', closeOnMobileWidthChange);
    return () => window.removeEventListener('resize', closeOnMobileWidthChange);
  }, [setSidebarOpen]);

  const isCollapsed = isLargeScreen && sidebarCollapsed;

  const handleNavNavigate = () => {
    setSidebarOpen(false);
  };

  const collapseToggle = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="hidden h-8 w-8 shrink-0 lg:inline-flex"
      onClick={toggleSidebar}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsed ? (
        <PanelLeftOpen className="h-5 w-5" />
      ) : (
        <PanelLeftClose className="h-5 w-5" />
      )}
    </Button>
  );

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
            collapsed={isCollapsed}
            className={cn(
              'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:transition-transform max-lg:duration-200',
              sidebarOpen
                ? 'z-50 max-lg:translate-x-0 max-lg:pointer-events-auto'
                : 'z-50 max-lg:-translate-x-full max-lg:pointer-events-none',
              'lg:relative lg:z-auto lg:translate-x-0 lg:pointer-events-auto'
            )}
            brand={
              <SidebarBrand
                title="ABC Insurance"
                version="Claims"
                collapsed={isCollapsed}
                toggle={collapseToggle}
              />
            }
            navigation={navigation.map((item) => (
              <SidebarNavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={item.active}
                collapsed={isCollapsed}
                onNavigate={handleNavNavigate}
              />
            ))}
            footer={
              <SidebarUserProfile
                name={sidebarUser?.name ?? 'Claims Processor'}
                role={sidebarUser?.role ?? 'Placeholder user'}
                avatarFallback={sidebarUser?.avatarFallback}
                collapsed={isCollapsed}
                onSignOut={onSignOut}
              />
            }
          />
        </>
      }
    >
      {showHeader ? (
        <Header
          title="ABC Insurance"
          onMenuClick={toggleMobileSidebar}
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
        <MobileSidebarProvider value={{ toggleMobileSidebar }}>
          <div
            className={cn(
              'flex flex-1 flex-col overflow-auto px-4 pb-6 lg:px-6',
              contentClassName
            )}
          >
            {children}
          </div>
        </MobileSidebarProvider>
      </ErrorBoundary>
    </AppShell>
  );
}
