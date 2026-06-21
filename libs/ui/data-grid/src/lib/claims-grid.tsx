'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@org/design-system';
import type { Claim, ClaimStatus, ClaimsListParams } from '@org/shared';

import { EmptyState } from '@org/layout';

const ASSIGNEES = [
  { id: 'user-processor-1', name: 'Alex Processor' },
  { id: 'user-processor-2', name: 'Casey Morgan' },
  { id: 'user-processor-3', name: 'Riley Chen' },
  { id: 'user-supervisor-1', name: 'Sam Supervisor' },
];

const STATUS_OPTIONS: ClaimStatus[] = ['open', 'pending', 'approved', 'denied'];

const COLUMN_STORAGE_KEY = 'claims-grid-columns';

export interface ClaimsGridProps {
  data: Claim[];
  total: number;
  isLoading?: boolean;
  isError?: boolean;
  params: ClaimsListParams;
  onParamsChange: (params: Partial<ClaimsListParams>) => void;
  onDelete?: (id: string) => Promise<void>;
  onAssign?: (id: string, assigneeId: string, assigneeName: string) => Promise<void>;
  onClaimSelect?: (claimId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canAssign?: boolean;
}

function StatusBadge({ status }: { status: ClaimStatus }) {
  const variant =
    status === 'approved'
      ? 'default'
      : status === 'denied'
        ? 'destructive'
        : 'secondary';
  return <Badge variant={variant}>{status}</Badge>;
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function ClaimsGrid({
  data,
  total,
  isLoading,
  isError,
  params,
  onParamsChange,
  onDelete,
  onAssign,
  onClaimSelect,
  canEdit = false,
  canDelete = false,
  canAssign = false,
}: ClaimsGridProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = React.useState(params.q ?? '');
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [assignClaim, setAssignClaim] = React.useState<Claim | null>(null);
  const [assigneeId, setAssigneeId] = React.useState('');
  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({
    claimNumber: true,
    status: true,
    assignee: true,
    claimantName: true,
    amount: true,
    submittedAt: true,
    actions: true,
  });

  React.useEffect(() => {
    const stored = localStorage.getItem(COLUMN_STORAGE_KEY);
    if (stored) {
      setVisibleColumns(JSON.parse(stored) as Record<string, boolean>);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  React.useEffect(() => {
    if ((params.q ?? '') !== debouncedSearch) {
      onParamsChange({ q: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch, onParamsChange, params.q]);

  const sorting = React.useMemo<SortingState>(
    () =>
      params.sort
        ? [{ id: params.sort, desc: params.order !== 'asc' }]
        : [{ id: 'submittedAt', desc: true }],
    [params.sort, params.order]
  );

  const columns = React.useMemo<ColumnDef<Claim>[]>(() => {
    const base: ColumnDef<Claim>[] = [
      {
        id: 'claimNumber',
        accessorKey: 'claimNumber',
        header: 'Claim #',
        cell: ({ row }) => (
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onClaimSelect?.(row.original.id)}
          >
            {row.original.claimNumber}
          </button>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'assignee',
        accessorKey: 'assignee',
        header: 'Assignee',
      },
      {
        id: 'claimantName',
        accessorKey: 'claimantName',
        header: 'Claimant',
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) =>
          row.original.amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
      },
      {
        id: 'submittedAt',
        accessorKey: 'submittedAt',
        header: 'Submitted',
        cell: ({ row }) => new Date(row.original.submittedAt).toLocaleDateString(),
      },
    ];

    if (canEdit || canDelete || canAssign) {
      base.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-1">
            {canEdit ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onClaimSelect?.(row.original.id)}
              >
                Edit
              </Button>
            ) : null}
            {canAssign ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAssignClaim(row.original);
                  setAssigneeId(row.original.assigneeId);
                }}
              >
                Assign
              </Button>
            ) : null}
            {canDelete ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setDeleteId(row.original.id)}
              >
                Delete
              </Button>
            ) : null}
          </div>
        ),
      });
    }

    return base.filter((column) => visibleColumns[column.id!] !== false);
  }, [canAssign, canDelete, canEdit, onClaimSelect, visibleColumns]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      const first = next[0];
      if (!first) {
        onParamsChange({ sort: undefined, order: undefined, page: 1 });
        return;
      }
      onParamsChange({
        sort: first.id,
        order: first.desc ? 'desc' : 'asc',
        page: 1,
      });
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  const rows = table.getRowModel().rows;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 8,
  });

  const totalPages = Math.max(1, Math.ceil(total / (params.pageSize ?? 50)));

  if (isError) {
    return (
      <EmptyState
        title="Failed to load claims"
        description="Check your connection and try again."
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Search</label>
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput((event.target as HTMLInputElement).value)}
            placeholder="Claim #, assignee, claimant…"
          />
        </div>
        <div className="w-40">
          <label className="mb-1 block text-xs text-muted-foreground">Status</label>
          <Select
            value={params.status ?? 'all'}
            onValueChange={(value) =>
              onParamsChange({
                status: value === 'all' ? undefined : (value as ClaimStatus),
                page: 1,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <label className="mb-1 block text-xs text-muted-foreground">Assignee</label>
          <Select
            value={params.assignee ?? 'all'}
            onValueChange={(value) =>
              onParamsChange({
                assignee: value === 'all' ? undefined : value,
                page: 1,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {ASSIGNEES.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSearchInput('');
            onParamsChange({
              q: undefined,
              status: undefined,
              assignee: undefined,
              sort: undefined,
              order: undefined,
              page: 1,
            });
          }}
        >
          Reset
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.keys(visibleColumns).map((columnId) => (
              <DropdownMenuCheckboxItem
                key={columnId}
                checked={visibleColumns[columnId]}
                onCheckedChange={(checked) =>
                  setVisibleColumns((current) => ({
                    ...current,
                    [columnId]: Boolean(checked),
                  }))
                }
              >
                {columnId}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border border-border">
        <div ref={parentRef} className="max-h-[560px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        header.column.getCanSort() && 'cursor-pointer select-none'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    No claims match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {virtualizer.getVirtualItems().length > 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        style={{ height: virtualizer.getVirtualItems()[0]?.start ?? 0 }}
                      />
                    </TableRow>
                  ) : null}
                  {virtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    if (!row) {
                      return null;
                    }
                    return (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onClaimSelect?.(row.original.id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            onClick={(event) => {
                              if (cell.column.id === 'actions') {
                                event.stopPropagation();
                              }
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                  {virtualizer.getVirtualItems().length > 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        style={{
                          height:
                            virtualizer.getTotalSize() -
                            (virtualizer.getVirtualItems().at(-1)?.end ?? 0),
                        }}
                      />
                    </TableRow>
                  ) : null}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing page {params.page ?? 1} of {totalPages.toLocaleString()} ({total.toLocaleString()}{' '}
          claims)
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={(params.page ?? 1) <= 1 || isLoading}
            onClick={() => onParamsChange({ page: (params.page ?? 1) - 1 })}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={(params.page ?? 1) >= totalPages || isLoading}
            onClick={() => onParamsChange({ page: (params.page ?? 1) + 1 })}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete claim?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                if (deleteId && onDelete) {
                  await onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(assignClaim)} onOpenChange={() => setAssignClaim(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign claim</DialogTitle>
          </DialogHeader>
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {ASSIGNEES.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAssignClaim(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (assignClaim && onAssign) {
                  const assignee = ASSIGNEES.find((item) => item.id === assigneeId);
                  if (assignee) {
                    await onAssign(assignClaim.id, assignee.id, assignee.name);
                    setAssignClaim(null);
                  }
                }
              }}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}