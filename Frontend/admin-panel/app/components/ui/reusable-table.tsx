"use client";

import React, { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  Loader2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/ui/table";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  id?: string;
  header: ReactNode | ((data: T[]) => ReactNode);
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface ReusableTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  selectedRowKeys?: (string | number)[];
  onSelectRow?: (key: string | number) => void;
  onSelectAll?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAllSelected?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  emptyIcon?: ReactNode;
  isLoading?: boolean;
  pagination?: PaginationConfig;
  className?: string;
  tableClassName?: string;
  rowClassName?: (row: T, isSelected: boolean) => string;
}

export function ReusableTable<T>({
  columns,
  data,
  rowKey,
  selectedRowKeys,
  onSelectRow,
  onSelectAll,
  isAllSelected,
  emptyMessage = "No records found",
  emptySubMessage = "There is no data to display at this time.",
  emptyIcon,
  isLoading = false,
  pagination,
  className,
  tableClassName,
  rowClassName,
}: ReusableTableProps<T>) {
  const hasSelection = Boolean(onSelectRow || onSelectAll);
  const totalColumns = columns.length + (hasSelection ? 1 : 0);

  const startIndex = pagination
    ? (pagination.currentPage - 1) * pagination.pageSize
    : 0;
  const endIndex = pagination
    ? Math.min(startIndex + pagination.pageSize, pagination.totalItems)
    : data.length;

  return (
    <div
      className={cn(
        "rounded-[5px] border border-neutral-300 bg-white overflow-hidden shadow-xs",
        className
      )}
    >
      <Table className={cn("w-full text-left text-sm text-neutral-900 border-collapse", tableClassName)}>
        {/* Table Header */}
        <TableHeader className="border-b border-neutral-300 bg-neutral-100 text-xs uppercase font-semibold tracking-wider text-neutral-700 select-none">
          <TableRow className="border-b border-neutral-300 hover:bg-neutral-100">
            {hasSelection && (
              <TableHead className="w-10 px-4 py-3.5 text-center text-neutral-800">
                <input
                  type="checkbox"
                  checked={
                    isAllSelected !== undefined
                      ? isAllSelected
                      : data.length > 0 &&
                        selectedRowKeys !== undefined &&
                        data.every((item) => selectedRowKeys.includes(rowKey(item)))
                  }
                  onChange={onSelectAll}
                  className="rounded border-neutral-400 bg-white accent-neutral-950 cursor-pointer"
                  aria-label="Select all rows"
                />
              </TableHead>
            )}

            {columns.map((col, idx) => (
              <TableHead
                key={col.id || String(col.accessorKey) || idx}
                className={cn("px-4 py-3.5 text-neutral-800 font-semibold", col.headerClassName)}
              >
                {typeof col.header === "function" ? col.header(data) : col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody className="divide-y divide-neutral-200">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={totalColumns} className="py-16 text-center text-neutral-600">
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <Loader2 className="w-7 h-7 text-neutral-900 animate-spin" />
                  <p className="text-sm font-medium text-neutral-700">Loading stories...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={totalColumns} className="py-12 text-center text-neutral-600">
                <div className="flex flex-col items-center justify-center">
                  {emptyIcon ? (
                    <div className="mb-2 text-neutral-400">{emptyIcon}</div>
                  ) : (
                    <Inbox className="w-8 h-8 mb-2 text-neutral-400" />
                  )}
                  <p className="text-sm font-semibold text-neutral-800">{emptyMessage}</p>
                  {emptySubMessage && (
                    <p className="text-xs text-neutral-500 mt-0.5">{emptySubMessage}</p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const key = rowKey(row);
              const isSelected = Boolean(selectedRowKeys && selectedRowKeys.includes(key));
              const customRowClass = rowClassName ? rowClassName(row, isSelected) : "";

              return (
                <TableRow
                  key={key}
                  className={cn(
                    "border-b border-neutral-200 transition-colors hover:bg-neutral-50",
                    isSelected ? "bg-neutral-100" : "bg-white",
                    customRowClass
                  )}
                >
                  {/* Selection Checkbox */}
                  {hasSelection && (
                    <TableCell className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow && onSelectRow(key)}
                        className="rounded border-neutral-400 bg-white accent-neutral-950 cursor-pointer"
                        aria-label={`Select row ${key}`}
                      />
                    </TableCell>
                  )}

                  {/* Columns */}
                  {columns.map((col, colIdx) => (
                    <TableCell
                      key={col.id || String(col.accessorKey) || colIdx}
                      className={cn("px-4 py-3.5", col.cellClassName)}
                    >
                      {col.cell
                        ? col.cell(row, index)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? "")
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Table Footer / Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-neutral-300 bg-neutral-50 text-xs text-neutral-700">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2 font-medium">
            <span>Rows per page:</span>
            {pagination.onPageSizeChange && (
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  pagination.onPageSizeChange?.(Number(e.target.value));
                  pagination.onPageChange(1);
                }}
                className="rounded border border-neutral-350 bg-white px-2 py-1 text-xs text-neutral-900 font-semibold outline-none cursor-pointer shadow-2xs"
              >
                {(pagination.pageSizeOptions || [5, 10, 20, 50]).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}
            <span className="hidden sm:inline text-neutral-600">
              Showing {pagination.totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of{" "}
              {pagination.totalItems} entries
            </span>
          </div>

          {/* Numbered Pagination Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage <= 1}
              className="border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 disabled:opacity-40 shadow-2xs"
              title="First page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage <= 1}
              className="border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 disabled:opacity-40 shadow-2xs"
              title="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>

            {/* Page number indicators */}
            <div className="px-2 font-mono text-neutral-800 font-semibold">
              Page {pagination.currentPage} of {Math.max(1, pagination.totalPages)}
            </div>

            <Button
              variant="outline"
              size="icon-xs"
              onClick={() =>
                pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))
              }
              disabled={pagination.currentPage >= pagination.totalPages}
              className="border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 disabled:opacity-40 shadow-2xs"
              title="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 disabled:opacity-40 shadow-2xs"
              title="Last page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
