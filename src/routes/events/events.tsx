import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { columns } from "./EventColumn";
import { eventLoader } from "./eventLoader";
import { SensorEvent } from "@/types/eventTypes";

export default function Events() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loadingReport] = useState(false);

  const [events, setEvents] = useState<SensorEvent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScanners = async () => {
      try {
        const loadedEvents = eventLoader();

        setEvents(loadedEvents);
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchScanners();
  }, [navigate]);

  const table = useReactTable({
    data: events,
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
  //     let itemsCsv = items.reduce((acc, item: any) => {
  //       const { id, name, coordinates, publicKey, createdAt, status } = item
  //       acc.push([id, name, coordinates, publicKey, createdAt, status].join(','))
  //       return acc
  //     }, [])
  //     downloadFile({
  //       data: [...headers, ...itemsCsv].join('\n'),
  //       fileName: 'items.csv',
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
            <h2 className="text-3xl font-bold tracking-tight">Events</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate("/events/create")}>
                Scan Item
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
