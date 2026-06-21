'use client';

import * as React from 'react';
import {
  BadgePercent,
  HelpCircle,
  LayoutDashboard,
  Monitor,
  Package,
  Users,
  Wallet,
} from 'lucide-react';

import {
  AppShell,
  DataTableCard,
  PageHeader,
  PaginationControls,
  Sidebar,
  SidebarBrand,
  SidebarNavItem,
  SidebarUpgradeCard,
  SidebarUserProfile,
  StatCard,
  StatsRow,
  StatusBadge,
  TableToolbar,
} from '@org/layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@org/design-system';

const customers = [
  {
    name: 'Jane Cooper',
    company: 'Microsoft',
    phone: '(225) 555-0118',
    email: 'jane@microsoft.com',
    country: 'United States',
    status: 'active' as const,
  },
  {
    name: 'Floyd Miles',
    company: 'Yahoo',
    phone: '(205) 555-0100',
    email: 'floyd@yahoo.com',
    country: 'Kiribati',
    status: 'inactive' as const,
  },
  {
    name: 'Ronald Richards',
    company: 'Adobe',
    phone: '(302) 555-0107',
    email: 'ronald@adobe.com',
    country: 'Israel',
    status: 'inactive' as const,
  },
  {
    name: 'Marvin McKinney',
    company: 'Tesla',
    phone: '(252) 555-0126',
    email: 'marvin@tesla.com',
    country: 'Iran',
    status: 'active' as const,
  },
  {
    name: 'Jerome Bell',
    company: 'Google',
    phone: '(629) 555-0129',
    email: 'jerome@google.com',
    country: 'Réunion',
    status: 'active' as const,
  },
  {
    name: 'Kathryn Murphy',
    company: 'Microsoft',
    phone: '(406) 555-0120',
    email: 'kathryn@microsoft.com',
    country: 'Curaçao',
    status: 'active' as const,
  },
  {
    name: 'Jacob Jones',
    company: 'Yahoo',
    phone: '(208) 555-0112',
    email: 'jacob@yahoo.com',
    country: 'Brazil',
    status: 'active' as const,
  },
  {
    name: 'Kristin Watson',
    company: 'Facebook',
    phone: '(704) 555-0127',
    email: 'kristin@facebook.com',
    country: 'Åland Islands',
    status: 'inactive' as const,
  },
];

const navItems = [
  { icon: <LayoutDashboard />, label: 'Dashboard' },
  { icon: <Package />, label: 'Product', hasSubmenu: true },
  { icon: <Users />, label: 'Customers', hasSubmenu: true, active: true },
  { icon: <Wallet />, label: 'Income', hasSubmenu: true },
  { icon: <BadgePercent />, label: 'Promote', hasSubmenu: true },
  { icon: <HelpCircle />, label: 'Help', hasSubmenu: true },
];

export function CrmDashboardDemo() {
  const [page, setPage] = React.useState(1);
  const [tableSearch, setTableSearch] = React.useState('');
  const [sort, setSort] = React.useState('newest');

  const filtered = customers.filter((row) => {
    const query = tableSearch.toLowerCase();
    if (!query) return true;
    return (
      row.name.toLowerCase().includes(query) ||
      row.company.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query)
    );
  });

  return (
    <AppShell
      sidebar={
        <Sidebar
          brand={<SidebarBrand title="Dashboard" version="v.01" />}
          navigation={navItems.map((item) => (
            <SidebarNavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={item.active}
              hasSubmenu={item.hasSubmenu}
            />
          ))}
          upgrade={<SidebarUpgradeCard />}
          footer={
            <SidebarUserProfile name="Evano" role="Project Manager" />
          }
        />
      }
    >
      <PageHeader title="Hello Evano 👋🏼," searchPlaceholder="Search" />

      <div className="flex flex-1 flex-col gap-6 px-8 pb-8 pt-6">
        <StatsRow>
          <StatCard
            label="Total Customers"
            value="5,423"
            trend="16% this month"
            icon={<Users className="h-10 w-10" />}
          />
          <StatCard
            label="Members"
            value="1,893"
            trend="1% this month"
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

        <DataTableCard
          title="All Customers"
          subtitle="Active Members"
          toolbar={
            <TableToolbar
              searchValue={tableSearch}
              onSearchChange={setTableSearch}
              sortValue={sort}
              onSortChange={setSort}
            />
          }
          footer="Showing data 1 to 8 of 256K entries"
          pagination={
            <PaginationControls
              page={page}
              totalPages={40}
              onPageChange={setPage}
            />
          }
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Customer Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.email}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableCard>
      </div>
    </AppShell>
  );
}
