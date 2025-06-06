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
import { ChevronDown, Download, Search, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { exportToCSV } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "./scroll-area";

interface DataTableProps<TData extends Record<string, any>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  searchableColumns?: string[];
  filterableColumns?: {
    id: string;
    title: string;
    options: { value: string; label: string }[];
  }[];
  dateRangeColumn?: string;
  isLoading?: boolean;
}
export function DataTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
  emptyMessage = "No results found",
  searchableColumns = [],
  filterableColumns = [],
  dateRangeColumn,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilter(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Memoize the filtered data to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    if (dateRangeColumn && dateRange?.from && dateRange?.to) {
      return data?.filter((item: any) => {
        const dateValue = item[dateRangeColumn];
        if (!dateValue) return false;

        const itemDate = new Date(dateValue);
        const fromDate = new Date(dateRange?.from!);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = new Date(dateRange?.to!);
        toDate.setHours(23, 59, 59, 999); // Include entire end day

        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
    return data;
  }, [data, dateRange, dateRangeColumn]);
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();

      // Safely get object values
      const rowValues = Object.values(row.original as Record<string, any>);

      return rowValues.some((value) => {
        if (value === null || value === undefined) return false;

        const stringValue =
          typeof value === "object"
            ? JSON.stringify(value).toLowerCase()
            : String(value).toLowerCase();

        return stringValue.includes(search);
      });
    },
    filterFns: {
      includesString: (row, columnId, filterValue) => {
        const value = row.getValue(columnId);
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      },
    },
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

  useEffect(() => {
    clearFilters();
  }, []);
  const clearFilters = () => {
    setColumnFilters([]);
    setDateRange(undefined);
    setGlobalFilter("");
    setSearchValue("");
  };

  const hasFilters = columnFilters.length > 0 || dateRange || globalFilter;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        {/* Global search */}
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all columns..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 max-w-md"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchValue("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div> */}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9 max-w-md"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchValue("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {/* Column-specific search inputs */}
            {/* {searchableColumns.map((columnId) => {
              const column = table.getColumn(columnId);
              if (!column) return null;

              return (
                <div key={columnId} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Filter ${columnId}...`}
                    value={(column.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                      column.setFilterValue(event.target.value)
                    }
                    className="pl-9 max-w-xs"
                  />
                </div>
              );
            })} */}

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
                initialDateFrom={
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
                initialDateTo={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
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
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-muted-foreground ml-auto"
          >
            Clear filters
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Table */}
      <ScrollArea orientation="horizontal" className="pb-4">
        <div className="rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn({
                          "w-[100px]": header.getSize() === 100,
                        })}
                      >
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
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
      </ScrollArea>
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} row(s)
        </div>
        <div className="flex items-center space-x-2">
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
    </div>
  );
}
