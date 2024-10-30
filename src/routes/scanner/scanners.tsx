// src/components/Scanners.tsx

import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
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
import { columns } from "./ScannerColumns";
import { useAuth } from "@/contexts/useAuth";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import MapComponent from "@/components/MapComponent";
import { ScannerType } from "@/types/itemTypes";

export default function Scanners() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [scanners, setScanners] = useState<ScannerType[]>([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(13);
  const { setSelectedScanner, selectedScanner } = useAuth();
  const { toast } = useToast();
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchScanners = async () => {
      try {
        setLoadingData(true);
        const jwt = await currentUser?.getIdToken();

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

        if (!resp.ok) {
          if (resp.status === 403) {
            // Handle 403 Forbidden
            toast({
              title: "Access Denied",
              description: "You do not have permission to view scanners.",
              variant: "destructive",
            });
            throw new Error("403 Forbidden");
          }
          console.error("Failed to fetch user scanners");
          toast({
            title: "Error",
            description: "Failed to fetch scanners.",
            variant: "destructive",
          });
          return;
        }

        const body = await resp.json();

        if (!body.success) {
          toast({
            title: "Error",
            description: "Failed to fetch scanners.",
            variant: "destructive",
          });
          return;
        }

        const scannerItems: ScannerType[] = body.scanners.map(
          (scanner: ScannerType) => ({
            ...scanner,
            selected: selectedScanner?.secretKey === scanner.scannerAddress,
          })
        );

        setScanners(scannerItems);
        setLoadingData(false);
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
        setLoadingData(false);
      }
    };

    if (currentUser) {
      fetchScanners();
    }
  }, [currentUser, selectedScanner, toast]);

  function globalFilterFn(
    row: Row<ScannerType>,
    _columnIds: string[],
    filterValue: string
  ): boolean {
    if (!filterValue) return true;

    const lowercasedFilterValue = filterValue.toLowerCase();
    const matchesName = row.original.name
      .toLowerCase()
      .includes(lowercasedFilterValue);
    const matchesDescription = row.original.description
      .toLowerCase()
      .includes(lowercasedFilterValue);
    const matchesScannerAddress = row.original.scannerAddress
      .toLowerCase()
      .includes(lowercasedFilterValue);

    return matchesName || matchesDescription || matchesScannerAddress;
  }

  const [globalFilter, setGlobalFilter] = useState("");

  const handleSelectScanner = (scanner: ScannerType) => {
    setSelectedScanner({
      description: scanner.description,
      secretKey: scanner.scannerAddress,
    });

    toast({
      title: "Scanner selected",
      description: scanner.description,
    });
  };

  const table = useReactTable({
    data: scanners,
    columns: useMemo(() => columns(handleSelectScanner), [handleSelectScanner]),
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
      globalFilter: globalFilter,
    },
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    return <MapComponent data={scanners} width={width} height={height} />;
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
                      colSpan={columns(handleSelectScanner)?.length || 1}
                      className="h-24 text-center"
                    >
                      {!loadingData ? (
                        <p>
                          No Scanners. Click "Create Scanner" Button (check if
                          you have enough Sui)
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
