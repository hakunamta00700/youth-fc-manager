"use client";

import { useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string) => void;
  sortField?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onSelect?: (rows: T[]) => void;
  selectedRows?: T[];
  className?: string;
}

function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onSort,
  sortField,
  sortDir,
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onSelect,
  selectedRows = [],
  className,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const isAllSelected =
    data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < data.length;

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelect?.([]);
    } else {
      onSelect?.([...data]);
    }
  }, [isAllSelected, data, onSelect]);

  const handleSelectRow = useCallback(
    (row: T) => {
      const isSelected = selectedRows.some((r) => r.id === row.id);
      if (isSelected) {
        onSelect?.(selectedRows.filter((r) => r.id !== row.id));
      } else {
        onSelect?.([...selectedRows, row]);
      }
    },
    [selectedRows, onSelect],
  );

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {onSelect && (
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500",
                    col.sortable && "cursor-pointer select-none hover:text-gray-700",
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortField === col.key && (
                      <span className="inline-flex flex-col">
                        <ChevronUp
                          className={cn(
                            "h-3 w-3",
                            sortDir === "asc"
                              ? "text-blue-600"
                              : "text-gray-300",
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 -mt-1",
                            sortDir === "desc"
                              ? "text-blue-600"
                              : "text-gray-300",
                          )}
                        />
                      </span>
                    )}
                    {col.sortable && sortField !== col.key && (
                      <span className="inline-flex flex-col opacity-0 group-hover:opacity-50">
                        <ChevronUp className="h-3 w-3 text-gray-300" />
                        <ChevronDown className="h-3 w-3 -mt-1 text-gray-300" />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelect ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "transition-colors hover:bg-gray-50",
                    selectedRows.some((r) => r.id === row.id) && "bg-blue-50",
                  )}
                >
                  {onSelect && (
                    <td className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.some((r) => r.id === row.id)}
                        onChange={() => handleSelectRow(row)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="whitespace-nowrap px-4 py-3 text-sm text-gray-700"
                    >
                      {col.render
                        ? col.render(row)
                        : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && onPageChange && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
          <p className="text-sm text-gray-500">
            전체 <span className="font-medium">{total}</span>개 중{" "}
            <span className="font-medium">
              {(page - 1) * pageSize + 1}
            </span>
            {" - "}
            <span className="font-medium">
              {Math.min(page * pageSize, total)}
            </span>
            개
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors",
                page <= 1
                  ? "cursor-not-allowed text-gray-300"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-sm text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p as number)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                    p === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                  )}
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors",
                page >= totalPages
                  ? "cursor-not-allowed text-gray-300"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };
export default DataTable;
