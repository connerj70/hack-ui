"use client";

import React, { useMemo, useCallback } from "react";
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
import { useAuth } from "@/contexts/useAuth";
import useEvents from "./useEvents";
import GraphComponent from "./eventGraph";

export type EventDetails = {
  combinedSignature: string;
  id: {
    id: string;
  };
  itemAddress: string;
  message: string;
  scannerAddress: string;
  url: string;
  lastTransaction: {
    digest: string;
    timestampMs: string;
    checkpoint: string;
  };
};

// SortableHeader Component
const SortableHeader: React.FC<{ column: any; title: string }> = ({
  column,
  title,
}) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="flex items-center"
  >
    {title}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

// Actions Dropdown Component
const ActionsDropdown: React.FC<{
  event: EventDetails;
  onDelete: (event: EventDetails) => void;
}> = ({ event, onDelete }) => {
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
        <DropdownMenuItem>
          <a
            href={`https://suiscan.xyz/devnet/object/${event.id.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full" // Ensures the link fills the DropdownMenuItem
          >
            View Item
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View Event Details</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(event)}>
          Delete Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Custom Hook for defining columns
const useColumns = (
  onDelete: (event: EventDetails) => void
): ColumnDef<EventDetails>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "itemAddress",
        header: ({ column }) => (
          <SortableHeader column={column} title="Item Address" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[200px] break-all text-sm">
            {row.getValue("itemAddress")}
          </div>
        ),
      },
      {
        accessorKey: "scannerAddress",
        header: ({ column }) => (
          <SortableHeader column={column} title="Scanner Address" />
        ),
        cell: ({ row }) => (
          <div className="max-w-[200px] break-all text-sm">
            {row.getValue("scannerAddress")}
          </div>
        ),
      },
      {
        accessorKey: "message",
        header: () => <div className="text-right">Message</div>,
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {row.getValue("message")}
          </div>
        ),
      },
      {
        accessorKey: "lastTransaction.timestampMs",
        header: () => <div className="text-right">Timestamp</div>,
        cell: ({ row }) => {
          const timestampMs = row.original.lastTransaction.timestampMs;
          const date = timestampMs ? new Date(parseInt(timestampMs, 10)) : null;
          const formattedDate = date ? date.toLocaleString() : "N/A";
          return <div className="text-right">{formattedDate}</div>;
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const event = row.original;

          return <ActionsDropdown event={event} onDelete={onDelete} />;
        },
      },
    ],
    [onDelete]
  );
};

export const DataTableDemo: React.FC = () => {
  const { currentUser } = useAuth();
  const { data, deleteEvent } = useEvents(currentUser!);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  // Define a global filter function
  const globalFilterFn: FilterFn<EventDetails> = useMemo(
    () => (row, filterValue) => {
      const value = filterValue.toLowerCase();
      const scannerAddress = row.original.scannerAddress.toLowerCase();
      const itemAddress = row.original.itemAddress.toLowerCase();
      return scannerAddress.includes(value) || itemAddress.includes(value);
    },
    []
  );

  // Handle deletion of an event
  const handleDelete = useCallback(
    async (event: EventDetails) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this event?"
      );
      if (!confirmDelete) return;

      try {
        await deleteEvent(event.id.id);
        // Optionally, you can show a success message here
        alert("Event deleted successfully.");
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Failed to delete event.");
      }
    },
    [deleteEvent]
  );

  // Define columns using custom hook
  const columns = useColumns(handleDelete);

  // Initialize the table instance
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
      globalFilter,
    },
    globalFilterFn,
    filterFns: {
      globalFilterFn,
    },
  });

  return (
    <div className="w-full">
      {/* Ensure 'data' is defined and is an array before passing to GraphComponent */}
      {Array.isArray(data) && <GraphComponent rawData={data} />}
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
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
    </div>
  );
};
