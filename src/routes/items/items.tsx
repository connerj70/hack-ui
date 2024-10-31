// src/components/Items.tsx

"use client"; // Ensure this is at the top if using Next.js or similar frameworks

import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/components/ui/use-toast";
import MapComponent from "@/components/MapComponent";
import { getItemColumns } from "./itemColumns";
import { Progress } from "@/components/ui/progress"; // Importing Progress

// Define the structure of each item
interface ItemType {
  description: string;
  id: {
    id: string;
  };
  itemAddress: string;
  name: string;
  url: string;
}

export default function Items() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [items, setItems] = useState<ItemType[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [progress, setProgress] = useState(0); // Progress state

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true); // Start loading
      setProgress(0); // Initialize progress

      // Increment progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 200); // Increment every 200ms

      try {
        if (!currentUser) {
          return;
        }

        const jwt = await currentUser.getIdToken();

        const resp = await fetch(`${import.meta.env.VITE_API_URL}/item/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!resp.ok) {
          throw new Error(`Failed to fetch items: ${resp.statusText}`);
        }

        const body = await resp.json();

        console.log("Fetched items:", body); // Debugging line

        // Safeguard: Ensure body is an array
        if (Array.isArray(body)) {
          setItems(body);
        } else {
          throw new Error("Invalid data format: 'items' is not an array.");
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        toast({
          title: "Error",
          description: "Failed to fetch items.",
          variant: "destructive",
        });
      } finally {
        clearInterval(progressInterval); // Stop incrementing
        setProgress(100); // Complete progress
        // Optional: Reset loading state after a short delay to show 100%
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0); // Reset progress for future loads
        }, 500); // 500ms delay
      }
    };

    fetchItems();
  }, [currentUser, toast]);

  // Define the custom global filter function
  const customGlobalFilter: FilterFn<ItemType> = (row, filterValue) => {
    if (!filterValue) return true;

    const lowercasedFilter = filterValue.toLowerCase();
    const { name = "", description = "" } = row.original;

    return (
      name.toLowerCase().includes(lowercasedFilter) ||
      description.toLowerCase().includes(lowercasedFilter)
    );
  };

  const [globalFilter, setGlobalFilter] = useState("");

  // Import columns from columns.ts
  const columnsDefinition = useMemo(
    () => getItemColumns(toast, navigate, currentUser),
    [toast, navigate, currentUser]
  );

  const table = useReactTable<ItemType>({
    data: items,
    columns: columnsDefinition,
    filterFns: {
      customGlobalFilter, // Registering the custom filter function
    },
    // globalFilterFn: "customGlobalFilter", // Assigning the custom filter function for global filtering

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define the layout for the map based on isMobile
  const memoizedMap = useMemo(() => {
    const width = isMobile ? "100vw" : "50vw";
    const height = isMobile ? "40vh" : "100vh";
    return <MapComponent width={width} height={height} />;
  }, [items, isMobile]);

  return (
    <>
      <div
        className={isMobile ? "flex flex-col w-full" : "flex flex-row w-full"}
      >
        {memoizedMap}
        <div className="flex flex-col w-full md:w-1/2 max-w-4xl mx-auto md:px-4 lg:px-8 pt-10 overflow-auto">
          {/* Progress Bar */}

          <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight pl-4">Items</h2>
              <div className="flex items-center space-x-2 pr-4">
                <Button onClick={() => navigate("/items/create")}>
                  Create Item
                </Button>
              </div>
            </div>

            <div className="flex items-center py-4">
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Type to search..."
                className="max-w-sm"
              />
            </div>

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
                      colSpan={columnsDefinition?.length || 1}
                      className="h-24 text-center"
                    >
                      {isLoading ? (
                        <div className="mb-4">
                          <Progress value={progress} className="h-2 w-full" />
                        </div>
                      ) : (
                        <p>No Items. Click the "Create Item" button (ensure
                          you have enough SUI).</p>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-end space-x-2 py-4 pr-4">
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
        </div>
      </div>
      <Toaster />
    </>
  );
}
