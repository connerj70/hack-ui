// src/components/Items.tsx

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
  ColumnDef,
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

  useEffect(() => {
    const fetchItems = async () => {
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

        // Assuming the response structure is { items: ItemType[] }
        setItems(body.items);
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        toast({
          title: "Error",
          description: "Failed to fetch items.",
          variant: "destructive",
        });
      }
    };

    fetchItems();
  }, [currentUser, toast]);

  // Define the custom global filter function
  const customGlobalFilter: FilterFn<ItemType> = (row, filterValue) => {
    if (!filterValue) return true;

    const lowercasedFilter = filterValue.toLowerCase();
    const { name, description } = row.original;

    return (
      name.toLowerCase().includes(lowercasedFilter) ||
      description.toLowerCase().includes(lowercasedFilter)
    );
  };

  const [globalFilter, setGlobalFilter] = useState("");

  // Define the columns
  const columnsDefinition: ColumnDef<ItemType>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="flex items-center">
              <div className="text-sm font-medium leading-none break-words">
                {item.name}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "itemAddress",
        header: "Item Address",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-sm text-gray-700 whitespace-normal break-all">
              {item.itemAddress}
            </div>
          );
        },
      },
      // Add more columns as needed, e.g., description, url, etc.
      // For demonstration, let's add an 'Actions' column
      {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;

          // Define your action components here, similar to ActionsCell in Scanners.tsx
          return (
            <div className="flex justify-end">
              {/* Example action buttons */}
              <Button
                variant="ghost"
                onClick={() => navigate(`/items/${item.id.id}`)}
              >
                View
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(`/items/edit/${item.id.id}`)}
              >
                Edit
              </Button>
            </div>
          );
        },
      },
    ],
    [navigate]
  );

  const table = useReactTable<ItemType>({
    data: items,
    columns: columnsDefinition,
    filterFns: {
      customGlobalFilter, // Registering the custom filter function
    },

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
                      <p>
                        No Items. Click "Create Item" Button to Create an Item.
                      </p>
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
