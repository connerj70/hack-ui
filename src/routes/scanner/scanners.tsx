// src/components/Scanners.tsx

import { useEffect, useMemo, useState, FC, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { scannerColumns as getScannerColumns } from "./ScannerColumns";
import { ScannerType } from "@/types/scannerTypes";
import MapComponentScanner from "@/components/MapComponentScanner";

const Scanners: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [scanners, setScanners] = useState<ScannerType[]>([]);
  const navigate = useNavigate();
  const { currentUser, setSelectedScanner, selectedScanner } = useAuth();
  const { toast } = useToast();
  const [loadingData, setLoadingData] = useState(true);
  const [progress, setProgress] = useState(13);

  // Handle progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  // Function to handle deletion of a scanner
  const handleDeleteScanner = useCallback(
    (deletedScannerId: string) => {
      setScanners((prevScanners) =>
        prevScanners.filter((scanner) => scanner.id.id !== deletedScannerId)
      );
      // If the deleted scanner was selected, deselect it
      if (selectedScanner && selectedScanner.id.id === deletedScannerId) {
        setSelectedScanner(null);
      }
    },
    [setScanners, setSelectedScanner, selectedScanner]
  );

  // Fetch scanners from the API
  useEffect(() => {
    const fetchScanners = async () => {
      try {
        setLoadingData(true);
        const jwt = await currentUser?.getIdToken();

        if (!jwt) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to view scanners.",
          });
          setLoadingData(false);
          return;
        }

        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/scanner/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (resp.status === 304) {
          setLoadingData(false);
          return;
        }

        const body = await resp.json();

        if (!body.success) {
          toast({
            title: "Error",
            description: body.message || "Failed to fetch scanners.",
          });
          setLoadingData(false);
          return;
        }

        if (!Array.isArray(body.scanners)) {
          toast({
            title: "Error",
            description: "Invalid data format received.",
          });
          setLoadingData(false);
          return;
        }

        setScanners(body.scanners);
        setLoadingData(false);
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        toast({
          title: "Error",
          description: JSON.stringify(error),
        });
        setLoadingData(false);
      }
    };

    if (currentUser) {
      fetchScanners();
    } else {
      setScanners([]);
      setLoadingData(false);
    }
  }, [currentUser, selectedScanner, toast]);

  // Global filter state
  const [globalFilter, setGlobalFilter] = useState("");

  // Initialize the table with the necessary configurations and column definitions
  const table = useReactTable({
    data: scanners,
    columns: getScannerColumns(
      setSelectedScanner,
      handleDeleteScanner,
      currentUser,
      toast,
      selectedScanner
    ), // Invoke the function with required parameters
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
      globalFilter: globalFilter,
    },
  });

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define the layout for the map based on isMobile
  const memoizedMap = useMemo(() => {
    // Assuming MapComponent accepts width and height as strings with units
    const width = isMobile ? "100vw" : "50vw";
    const height = isMobile ? "40vh" : "100vh";
    return <MapComponentScanner width={width} height={height} />;
  }, [scanners, isMobile]);

  return (
    <>
      <div
        className={isMobile ? "flex flex-col w-full" : "flex flex-row w-full"}
      >
        {memoizedMap}
        <div className="flex flex-col w-full md:w-1/2 max-w-4xl mx-auto md:px-4 lg:px-8 pt-10 overflow-auto">
          <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight pl-4">
                Scanners
              </h2>
              <div className="flex items-center space-x-2 pr-4">
                <Button onClick={() => navigate("/scanners/create")}>
                  Create Scanner
                </Button>
              </div>
            </div>

            <div className="flex items-center py-4">
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Type to search..."
                className="max-w-sm"
                aria-label="Search Scanners"
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
                      colSpan={
                        getScannerColumns(
                          setSelectedScanner,
                          handleDeleteScanner,
                          currentUser,
                          toast,
                          selectedScanner
                        ).length || 1
                      }
                      className="h-24 text-center"
                    >
                      {!loadingData ? (
                        <p>
                          No Scanners. Click the "Create Scanner" button (ensure
                          you have enough SUI).
                        </p>
                      ) : (
                        <Progress value={progress} className="h-2 w-full" />
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
};

export default Scanners;
