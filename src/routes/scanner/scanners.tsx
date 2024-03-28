import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dateRangePicker";
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
// import { Plus } from "lucide-react";
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
import { GetScannerResponseType, ScannerType } from "@/types/scannerTypes";

export default function Scanners() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loadingReport] = useState(false);
  const [scanners, setScanners] = useState<ScannerType[]>([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  console.log("currentUser", currentUser);

  useEffect(() => {
    const fetchScanners = async () => {
      try {
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
            // Redirect the user to the login page with a redirect back to the current page after login
            throw new Error("403 Forbidden");
          }
          console.error("Failed to fetch user accounts");
          return [];
        }

        const body = await resp.json();

        const scannerItems = body.scanners.map(
          (scanner: GetScannerResponseType) => {
            return {
              secretKey: scanner.metadata?.additionalMetadata?.[0]?.[1] ?? "",
              description: scanner.metadata?.additionalMetadata?.[1]?.[1] ?? "",
            };
          }
        );
        setScanners(scannerItems);
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchScanners();
  }, [currentUser]);

  const table = useReactTable({
    data: scanners,
    columns,
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
    },
  });

  // async function newDeviceSetup() {
  //   setLoading(true);
  //   try {
  //     const resp = await fetch(`${import.meta.env.VITE_API_URL}/solana/key`);

  //     if (!resp.ok) {
  //       console.error("Failed to create new device");
  //       return;
  //     }

  //     const data = await resp.json();
  //     const privateKey = data.privateKey;

  //     navigate(`/devices/create/${privateKey}`);
  //   } catch (error) {
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // const downloadFile = ({ data, fileName, fileType }) => {
  //   const blob = new Blob([data], { type: fileType })
  //   const a = document.createElement('a')
  //   a.download = fileName
  //   a.href = window.URL.createObjectURL(blob)
  //   const clickEvt = new MouseEvent('click', {
  //     view: window,
  //     bubbles: true,
  //     cancelable: true,
  //   })
  //   a.dispatchEvent(clickEvt)
  //   a.remove()
  // }

  // async function downloadReport(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  //   setLoadingReport(true);
  //   try {
  //     e.preventDefault()
  //     // Headers for each column
  //     let headers = ['Id,Name,Coordinates,PublicKey, CreatedAt, Status']
  //     let devicesCsv = devices.reduce((acc, device: any) => {
  //       const { id, name, coordinates, publicKey, createdAt, status } = device
  //       acc.push([id, name, coordinates, publicKey, createdAt, status].join(','))
  //       return acc
  //     }, [])
  //     downloadFile({
  //       data: [...headers, ...devicesCsv].join('\n'),
  //       fileName: 'devices.csv',
  //       fileType: 'text/csv',
  //     })
  //   } catch (error) {

  //   } finally {
  //     setLoadingReport(false)
  //   }
  // }

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Scanners</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate("/scanners/create")}>
                Create Device
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-end justify-end md:space-x-2 space-y-2 md:space-y-0">
            <CalendarDateRangePicker />
            {/* <Button disabled={loadingReport} onClick={downloadReport} variant="secondary">Download</Button> */}
            <Button disabled={loadingReport} variant="secondary">
              Download
            </Button>
          </div>
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
                      colSpan={columns?.length}
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
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows?.length} of{" "}
              {table.getFilteredRowModel().rows?.length} row(s) selected.
            </div>
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
        <Toaster />
      </div>
    </>
  );
}