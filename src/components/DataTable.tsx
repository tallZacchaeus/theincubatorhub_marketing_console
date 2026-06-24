import { useState, type ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface OffsetPagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
  /** Called with the new offset when the user pages. */
  onPageChange: (offset: number) => void;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  loading?: boolean;
  /** Shown when not loading and there are no rows (e.g. an <EmptyState/>). */
  empty?: ReactNode;
  pagination?: OffsetPagination;
  /** Skeleton row count while loading. */
  skeletonRows?: number;
}

/*
 * Reusable TanStack-Table wrapper styled like the main app's admin tables:
 * uppercase gray-400 header, hairline row borders, text-sm body, inside a
 * rounded-2xl card. Supports client-side sorting, a skeleton loading state, an
 * empty slot, and simple offset pagination (matching the console's
 * limit/offset/has_more/total semantics).
 */
export default function DataTable<TData>({
  columns,
  data,
  loading = false,
  empty,
  pagination,
  skeletonRows = 6,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const showEmpty = !loading && data.length === 0;

  // Pagination display math (1-based, clamped to total).
  const from = pagination && pagination.total > 0 ? pagination.offset + 1 : 0;
  const to = pagination ? Math.min(pagination.offset + data.length, pagination.total) : 0;
  const canPrev = pagination ? pagination.offset > 0 : false;
  const canNext = pagination ? pagination.hasMore : false;

  if (showEmpty && empty) {
    return <>{empty}</>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400"
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : sorted === 'desc' ? (
                            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: skeletonRows }).map((_, r) => (
                  <tr key={`sk-${r}`} className="border-b border-gray-100 last:border-0">
                    {columns.map((_col, c) => (
                      <td key={`sk-${r}-${c}`} className="px-6 py-4">
                        <Skeleton className="h-4 w-full max-w-[12rem]" />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50/60"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}

            {showEmpty && !empty && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
          <span className="tabular-nums">
            {pagination.total === 0 ? '0 of 0' : `${from}–${to} of ${pagination.total}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                canPrev ? 'text-gray-700 hover:bg-gray-50' : 'cursor-not-allowed text-gray-300',
              )}
              disabled={!canPrev}
              onClick={() =>
                pagination.onPageChange(Math.max(0, pagination.offset - pagination.limit))
              }
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Prev
            </button>
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                canNext ? 'text-gray-700 hover:bg-gray-50' : 'cursor-not-allowed text-gray-300',
              )}
              disabled={!canNext}
              onClick={() => pagination.onPageChange(pagination.offset + pagination.limit)}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
