'use client';

import * as React from 'react';

import { PageHeader } from '@org/layout';
import { useUiStore } from '@org/shared';

export interface CrmPageLayoutProps {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function CrmPageLayout({
  title,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  headerActions,
  children,
}: CrmPageLayoutProps) {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <>
      <PageHeader
        title={title}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onMenuClick={toggleSidebar}
        actions={headerActions}
      />
      <div className="flex flex-1 flex-col gap-6 px-8 pb-8 pt-6">{children}</div>
    </>
  );
}
