import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { columns } from "./itemColumns";
import { ItemType } from "@/types/itemTypes";

import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/components/ui/use-toast";
import MapComponent from "@/components/MapComponent";

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

        const jwt = await currentUser.getIdToken(); // Ensure currentUser is not null before calling this

        const resp = await fetch(`${import.meta.env.VITE_API_URL}/item/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!resp.ok) {
          // Handle HTTP errors here, for example:
          throw new Error(`Failed to fetch items: ${resp.statusText}`);
        }

        const body = await resp.json();

        setItems(body.items);
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchItems(); // Correctly call fetchItems here
  }, [currentUser]); // Add currentUser to the dependency array if it's expected to change over time

  function globalFilterFn(
    row: Row<ItemType>,
    _columnIds: string,
    filterValue: string
  ): boolean {
    // If filterValue is empty, return true for all rows
    if (!filterValue) return true;

    const lowercasedFilterValue = filterValue.toLowerCase();
    // Determine if the row should be included based on your filter criteria
    const matchesPublic = row.original.public
      .toLowerCase()
      .includes(lowercasedFilterValue);
    const matchesDescription = row.original.description
      .toLowerCase()
      .includes(lowercasedFilterValue);

    // Return true if either condition is met, false otherwise
    return matchesPublic || matchesDescription;
  }

  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: items,
    columns: columns(toast, navigate, currentUser),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn,
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

  const memoizedMap = useMemo(() => {
    return items && items.length > 0 ? (
      <MapComponent data={items} />
    ) : (
      <div
        id="map"
        style={{ width: "100vw", height: "40vh" }}
        className="w-full bg-gray-200"
      />
    );
  }, [items]);

  return (
    <>
      <div>{memoizedMap}</div>

      <div className="flex flex-col mx-auto max-w-4xl md:px-4 lg:px-8 pt-10">
        <div className="flex-1 space-y-4  pt-6">
          <div className="flex items-center justify-between space-y-2">
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
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    <p>
                      No Items. Click "Create Item" Button to Create Pallet Tag
                      (check if user has sol)
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4 pr-4">
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
      <Toaster />
    </>
  );
}
