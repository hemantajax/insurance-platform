'use client';

import * as React from 'react';
import { ChevronRight, Settings2 } from 'lucide-react';

import { Button, cn } from '@org/design-system';

export interface SidebarBrandProps {
  title?: string;
  version?: string;
  className?: string;
}

export function SidebarBrand({
  title = 'Dashboard',
  version = 'v.01',
  className,
}: SidebarBrandProps) {
  return (
    <div className={cn('flex items-center justify-between px-7 pt-9', className)}>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Settings2 className="h-5 w-5" />
        </div>
        <span className="text-[26px] font-semibold tracking-tight text-foreground">
          {title}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">{version}</span>
    </div>
  );
}

export interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function SidebarNavItem({
  icon,
  label,
  active = false,
  hasSubmenu = false,
  href,
  onClick,
  className,
}: SidebarNavItemProps) {
  const classes = cn(
    'h-11 w-full justify-start gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-sidebar-active hover:text-primary',
    active && 'bg-sidebar-active text-primary hover:bg-sidebar-active',
    className
  );

  const content = (
    <>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {hasSubmenu ? (
        <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Button type="button" variant="ghost" asChild className={classes}>
        <a href={href}>{content}</a>
      </Button>
    );
  }

  return (
    <Button type="button" variant="ghost" onClick={onClick} className={classes}>
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
  className?: string;
}

export function SidebarUserProfile({
  name,
  role,
  avatarFallback,
  className,
}: SidebarUserProfileProps) {
  const initials =
    avatarFallback ?? name.split(' ').map((part) => part[0]).join('').slice(0, 2);

  return (
    <div
      className={cn(
        'flex items-center gap-3 border-t border-border px-7 py-6',
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{role}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 rotate-90 text-muted-foreground" />
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
  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200',
        collapsed ? 'w-[102px]' : 'w-[306px]',
        className
      )}
    >
      {brand}
      <nav className="mt-10 flex flex-1 flex-col gap-1 px-4">{navigation}</nav>
      {upgrade ? <div className="mb-6">{upgrade}</div> : null}
      {footer}
    </aside>
  );
}
