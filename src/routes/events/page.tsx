"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/useAuth";

export type EventDetails = {
  combinedSignature: string;
  id: {
    id: string;
  };
  itemAddress: string;
  itemBytes: string;
  message: string;
  name: string;
  scannerAddress: string;
  url: string;
};

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [data, setData] = React.useState<EventDetails[]>([]);
  const { currentUser } = useAuth();

  // Define a global filter function
  const globalFilterFn: FilterFn<EventDetails> = useMemo(
    () => (row, columnIds, filterValue) => {
      const value = filterValue.toLowerCase();
      const scannerAddress = row.original.scannerAddress.toLowerCase();
      const itemAddress = row.original.itemAddress.toLowerCase();
      return scannerAddress.includes(value) || itemAddress.includes(value);
    },
    []
  );

  // Define columns inside the component to access delete handler
  const columns = useMemo<ColumnDef<EventDetails>[]>(
    () => [
      {
        accessorKey: "itemAddress",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Item Address
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("itemAddress")}</div>
        ),
      },
      {
        accessorKey: "scannerAddress",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Scanner Address
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("scannerAddress")}</div>
        ),
      },
      {
        accessorKey: "message",
        header: () => <div className="text-right">Message</div>,
        cell: ({ row }) => {
          return (
            <div className="text-right font-medium">
              {row.getValue("message")}
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const event = row.original;

          // Delete event handler
          const handleDelete = async () => {
            const confirmDelete = window.confirm(
              "Are you sure you want to delete this event?"
            );
            if (!confirmDelete) return;

            try {
              if (!currentUser) {
                alert("User not authenticated.");
                return;
              }

              const jwt = await currentUser.getIdToken();
              const response = await fetch(
                `${import.meta.env.VITE_API_URL}/event/events/${event.id.id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                  },
                }
              );

              console.log("tet ", response.json()); // Remove the deleted event from the data
              setData((prevData) =>
                prevData.filter((e) => e.id.id !== event.id.id)
              );
            } catch (error) {
              console.error("Failed to delete event:", error);
              alert("Failed to delete event.");
            }
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(event.id.id)}
                >
                  Copy Event ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Event Details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete}>
                  Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [currentUser]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) {
          return;
        }
        const jwt = await currentUser.getIdToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/event/events`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        alert("Failed to fetch events.");
      }
    };
    fetchData();
  }, [currentUser]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter, // Use globalFilter state
    },
    globalFilterFn, // Define the global filter function
    filterFns: {
      globalFilterFn,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 space-x-4">
        {/* Global Filter Input */}
        <Input
          placeholder="Filter Scanner or Item Address..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
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
