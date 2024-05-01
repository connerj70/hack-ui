import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { columns } from "./itemColumnsTx";
import { TransactionData } from "@/types/itemTypes";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/components/ui/use-toast";
import MapComponentItem from "@/components/MapComponentItem";

export default function ItemInfo() {
  const params = useParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [items, setItems] = useState<TransactionData[]>([]);
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(13);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    console.log(params);
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);
  

  useEffect(() => {
    const fetchDataAndAddMarkers = async () => {
      if (!currentUser) return;
      try {
        const jwt = await currentUser.getIdToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/event/${params.pubKey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const responseData = await response.json();

        console.log("responseData", responseData);
        setData(responseData);
        setItems(responseData);
        setLoadingData(false);
      } catch (error) {
        console.error("Failed to fetch event items:", error);
      }
    };

    fetchDataAndAddMarkers();
  }, [currentUser]);

  // function globalFilterFn(
  //   row: Row<TransactionData>,
  //   _columnIds: string,
  //   filterValue: string
  // ): boolean {
  //   // If filterValue is empty, return true for all rows
  //   if (!filterValue) return true;

  //   const lowercasedFilterValue = filterValue.toLowerCase();
  //   // Determine if the row should be included based on your filter criteria
  //   const matchesPublic = row.original.itemPublic
  //     .toLowerCase()
  //     .includes(lowercasedFilterValue);
  //   const matchesDescription = row.original.description
  //     .toLowerCase()
  //     .includes(lowercasedFilterValue);

  //   // Return true if either condition is met, false otherwise
  //   return matchesPublic || matchesDescription;
  // }

  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: items,
    columns: columns(navigate),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    // globalFilterFn,
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

  return (
    <>
      <div>
        {data ? (
          <MapComponentItem data={data} />
        ) : (
          <div
            id="map"
            style={{ width: "100vw", height: "40vh" }}
            className="w-full bg-gray-200"
          />
        )}
      </div>
      <div className="flex flex-col mx-auto max-w-4xl md:px-4 lg:px-8 pt-10">
        <div className="flex-1 space-y-4  pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight pl-4">History</h2>
            <div className="flex items-center py-4">
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Type to search..."
                className="max-w-sm"
              />
            </div>
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
                    {!loadingData ? (
                      <p>
                        No Items. Click "Create Item" Button to Create Pallet
                        Tag (check if user has sol)
                      </p>
                    ) : (
                      <Progress value={progress} className="w-[60%]" />
                    )}
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
