"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  FilterFn,
  Column,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Download } from "lucide-react";
import { useState, useMemo } from "react";
import { exportToCSV } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  filterableColumns?: {
    id: string;
    title: string;
    options: { value: string; label: string }[];
  }[];
  searchableColumns?: string[];
  dateRangeColumn?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No results found",
  filterableColumns = [],
  searchableColumns = [],
  dateRangeColumn,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Memoize the filtered data to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    if (!dateRangeColumn || !dateRange?.from || !dateRange?.to) {
      return data;
    }

    return data.filter((item: any) => {
      const dateValue = item[dateRangeColumn];
      if (!dateValue) return false;

      const itemDate = new Date(dateValue);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  }, [data, dateRange, dateRangeColumn]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: process.env.NODE_ENV === "development",
    debugHeaders: process.env.NODE_ENV === "development",
    debugColumns: process.env.NODE_ENV === "development",
  });

  const handleExport = () => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter((column) => column.getIsVisible());

    const headers = visibleColumns.map((column) => {
      const columnDef = column.columnDef as ColumnDef<TData>;
      return typeof columnDef.header === "string"
        ? columnDef.header
        : column.id;
    });

    const rows = table.getRowModel().rows.map((row) => {
      return visibleColumns.map((column) => {
        const cellValue = row.getValue(column.id);
        return typeof cellValue === "object"
          ? JSON.stringify(cellValue)
          : String(cellValue);
      });
    });

    exportToCSV([headers, ...rows], "data-export");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
          {/* Search inputs for searchable columns */}
          {searchableColumns.map((columnId) => {
            const column = table.getColumn(columnId);
            if (!column) return null;

            return (
              <Input
                key={columnId}
                placeholder={`Filter by ${columnId}...`}
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className="max-w-xs"
              />
            );
          })}

          {/* Filterable columns dropdowns */}
          {filterableColumns.map((filter) => {
            const column = table.getColumn(filter.id);
            if (!column) return null;

            return (
              <Select
                key={filter.id}
                value={(column.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => {
                  if (value === "all") {
                    column.setFilterValue(undefined);
                  } else {
                    column.setFilterValue(value);
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`Filter by ${filter.title}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.title}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}

          {/* Date range picker if dateRangeColumn is provided */}
          {dateRangeColumn && (
            <DateRangePicker
              onUpdate={(values) => setDateRange(values.range)}
              initialDateFrom={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
              align="start"
              showCompare={false}
            />
          )}
        </div>

        {/* Column visibility and export */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
