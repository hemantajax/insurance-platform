'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Button, cn } from '@org/design-system';

import { BrandIcon } from '../icons/nav-icons';

export interface SidebarBrandProps {
  title?: string;
  version?: string;
  collapsed?: boolean;
  toggle?: React.ReactNode;
  className?: string;
}

export function SidebarBrand({
  title = 'Dashboard',
  version = 'v.01',
  collapsed = false,
  toggle,
  className,
}: SidebarBrandProps) {
  return (
    <div
      className={cn(
        'relative shrink-0 pt-9',
        collapsed ? 'px-3' : 'px-7',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center',
          collapsed ? 'justify-center' : 'justify-between gap-3'
        )}
      >
        <div
          className={cn(
            'flex min-w-0 items-center',
            collapsed ? 'justify-center' : 'gap-3'
          )}
        >
          <BrandIcon
            className={cn(
              'shrink-0 text-foreground',
              collapsed ? 'h-9 w-9' : 'h-9 w-9'
            )}
          />
          <span
            className={cn(
              'sidebar-brand-text truncate text-[26px] font-semibold tracking-tight text-foreground',
              collapsed && 'hidden'
            )}
          >
            {title}
          </span>
        </div>
        {!collapsed ? (
          <div className="flex shrink-0 items-center gap-2">
            <span className="sidebar-brand-text text-xs text-muted-foreground">
              {version}
            </span>
            {toggle}
          </div>
        ) : null}
      </div>
      {collapsed && toggle ? (
        <div className="mt-3 flex justify-center">{toggle}</div>
      ) : null}
    </div>
  );
}

export interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  hasSubmenu?: boolean;
  href?: string;
  onClick?: () => void;
  onNavigate?: () => void;
  className?: string;
}

export function SidebarNavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  hasSubmenu = false,
  href,
  onClick,
  onNavigate,
  className,
}: SidebarNavItemProps) {
  const classes = cn(
    'h-11 shrink-0 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-active hover:text-primary',
    collapsed
      ? 'mx-auto w-11 min-w-11 max-w-11 justify-center gap-0 px-0'
      : 'w-full min-w-0 justify-start gap-3 px-3',
    active && 'bg-sidebar-active text-primary hover:bg-sidebar-active',
    className
  );

  const content = (
    <>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </span>
      <span
        className={cn(
          'sidebar-nav-label min-w-0 flex-1 truncate text-left',
          collapsed && 'hidden'
        )}
      >
        {label}
      </span>
      {hasSubmenu && !collapsed ? (
        <ChevronRight className="sidebar-nav-label h-4 w-4 shrink-0 opacity-60" />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Button
        type="button"
        variant="ghost"
        asChild
        className={classes}
        title={collapsed ? label : undefined}
      >
        <Link
          href={href}
          aria-label={collapsed ? label : undefined}
          onClick={onNavigate}
          prefetch
        >
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={classes}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
    >
      {content}
    </Button>
  );
}

export interface SidebarUpgradeCardProps {
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SidebarUpgradeCard({
  title = 'Upgrade to PRO to get access all Features!',
  actionLabel = 'Get Pro Now!',
  onAction,
  className,
}: SidebarUpgradeCardProps) {
  return (
    <div
      className={cn(
        'mx-7 rounded-[20px] bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center',
        className
      )}
    >
      <p className="text-sm font-medium leading-snug text-foreground">{title}</p>
      <Button type="button" className="mt-5 w-full rounded-lg" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

export interface SidebarUserProfileProps {
  name: string;
  role: string;
  avatarFallback?: string;
  collapsed?: boolean;
  className?: string;
}

export function SidebarUserProfile({
  name,
  role,
  avatarFallback,
  collapsed = false,
  className,
}: SidebarUserProfileProps) {
  const initials =
    avatarFallback ?? name.split(' ').map((part) => part[0]).join('').slice(0, 2);

  return (
    <div
      className={cn(
        'flex shrink-0 items-center border-t border-border py-6',
        collapsed ? 'justify-center px-3' : 'gap-3 px-7',
        className
      )}
      title={collapsed ? `${name} — ${role}` : undefined}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
        {initials}
      </div>
      <div
        className={cn('sidebar-user-text min-w-0 flex-1', collapsed && 'hidden')}
      >
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{role}</p>
      </div>
      <ChevronRight
        className={cn(
          'sidebar-user-text h-5 w-5 shrink-0 rotate-90 text-muted-foreground',
          collapsed && 'hidden'
        )}
      />
    </div>
  );
}

export interface SidebarProps {
  brand?: React.ReactNode;
  navigation?: React.ReactNode;
  upgrade?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({
  brand,
  navigation,
  upgrade,
  footer,
  collapsed = false,
  className,
}: SidebarProps) {
  const [widthTransitionEnabled, setWidthTransitionEnabled] = React.useState(false);

  React.useEffect(() => {
    setWidthTransitionEnabled(true);
  }, []);

  return (
    <aside
      data-collapsed={collapsed ? 'true' : 'false'}
      className={cn(
        'flex shrink-0 flex-col overflow-x-hidden overflow-y-auto border-r border-border bg-sidebar',
        collapsed ? 'w-[90px]' : 'w-[306px]',
        widthTransitionEnabled && 'transition-[width] duration-200',
        '[&_[data-sidebar-label]]:truncate',
        className
      )}
    >
      {brand}
      <nav
        className={cn(
          'mt-10 flex w-full min-w-0 flex-1 flex-col gap-1 overflow-hidden',
          collapsed ? 'items-center px-2' : 'px-4'
        )}
      >
        {navigation}
      </nav>
      {upgrade ? <div className="mb-6">{upgrade}</div> : null}
      {footer}
    </aside>
  );
}
