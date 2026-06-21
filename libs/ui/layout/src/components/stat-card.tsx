'use client';

import * as React from 'react';
import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  cn,
} from '@org/design-system';

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
  icon: React.ReactNode;
  avatars?: Array<{ src?: string; fallback: string }>;
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendDirection = 'up',
  icon,
  avatars,
  href,
  className,
}: StatCardProps) {
  const TrendIcon = trendDirection === 'down' ? TrendingDown : TrendingUp;

  const content = (
    <>
      <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-[32px] font-semibold leading-none tracking-tight text-foreground">
          {value}
        </p>
        {trend ? (
          <div
            className={cn(
              'mt-2 flex items-center gap-1 text-xs',
              trendDirection === 'down' ? 'text-destructive' : 'text-success'
            )}
          >
            <TrendIcon className="h-4 w-4" />
            <span>{trend}</span>
          </div>
        ) : null}
        {avatars && avatars.length > 0 ? (
          <div className="mt-2 flex -space-x-2">
            {avatars.map((avatar, index) => (
              <Avatar
                key={`${avatar.fallback}-${index}`}
                className="h-7 w-7 border-2 border-card"
              >
                {avatar.src ? <AvatarImage src={avatar.src} alt="" /> : null}
                <AvatarFallback className="text-[10px]">
                  {avatar.fallback}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );

  const classes = cn(
    'flex min-w-0 flex-1 items-center gap-4 rounded-lg outline-none',
    href &&
      'cursor-pointer transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring',
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} prefetch aria-label={`${label}: ${value}`}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}

export interface StatsRowProps {
  children: React.ReactNode;
  className?: string;
}

export function StatsRow({ children, className }: StatsRowProps) {
  const items = React.Children.toArray(children);

  return (
    <Card className={cn('border-none shadow-sm', className)}>
      <div className="flex flex-col divide-y divide-border lg:flex-row lg:divide-x lg:divide-y-0">
        {items.map((child, index) => (
          <div key={index} className="flex min-w-0 flex-1 items-stretch p-8">
            {child}
          </div>
        ))}
      </div>
    </Card>
  );
}
