import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { DeviceType } from "@/types/device";

import { Button, buttonVariants } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dateRangePicker";
import {
  ColumnDef,
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
import { MoreHorizontal, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";

export async function loader(): Promise<DeviceType[]> {
  return [
    {
      id: "m5gr84i9",
      name: "Sensor 1",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "3u1reuv4",
      name: "Sensor 2",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "derv1ws0",
      name: "Sensor 3",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "5kma53ae",
      name: "Sensor 4",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "bhqecj4p",
      name: "Sensor 5",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "bhqecj4p",
      name: "Sensor 5",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "bhqecj4p",
      name: "Sensor 5",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "bhqecj4p",
      name: "Sensor 5",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "bhqecj4p",
      name: "Sensor 5",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "bhqecj4p",
      name: "Sensor 5",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
    {
      id: "bhqecj4p",
      name: "Sensor 5",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      createdAt: "2021-08-01T00:00:00Z",
      status: "active",
    },
  ];
}

export const columns: ColumnDef<DeviceType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "publicKey",
    header: "Public Key",
  },
  {
    accessorKey: "coordinates",
    header: () => <div>Coordinates</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Created At</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const device = row.original;

      return (
        <div className="flex justify-end">
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
                onClick={() => navigator.clipboard.writeText(device.id)}
              >
                Copy device ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to={`/devices/${device.id}`}>
                <DropdownMenuItem>View details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>View events</DropdownMenuItem>
              <DropdownMenuItem>Deactivate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function Devices() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const navigate = useNavigate()

  // const devices = useLoaderData()

  const generateFakeDevices = (count = 10): DeviceType[] => {
    const types = ["Laptop", "Phone", "Tablet", "Desktop"];
    const statuses = ["Active", "Inactive", "Maintenance"];

    return Array.from({ length: count }, (_, index) => ({
      id: (index + 1).toString(), // Convert id to string
      name: `Device ${index + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      // Convert coordinates to a string representation
      coordinates: `Lat: ${Math.random() * 180 - 90}, Lng: ${
        Math.random() * 360 - 180
      }`,
      publicKey: `publicKey${index + 1}`, // Example publicKey
      createdAt: new Date().toISOString(), // Current timestamp in ISO format
      // imageUrl is optional, add if necessary
    }));
  };

  useEffect(() => {
    // Generate 10 fake devices with the required properties
    setDevices(generateFakeDevices(10))
  }, [])



  const table = useReactTable({
    data: devices,
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

  async function newDeviceSetup() {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/solana/key`);

      if (!resp.ok) {
        console.error("Failed to create new device");
        return;
      }

      const data = await resp.json();
      const privateKey = data.privateKey

      navigate(`/devices/create/${privateKey}`)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType })
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  async function downloadReport(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setLoadingReport(true);
    try {
      e.preventDefault()
      // Headers for each column
      let headers = ['Id,Name,Coordinates,PublicKey, CreatedAt, Status']
      let devicesCsv = devices.reduce((acc, device: any) => {
        const { id, name, coordinates, publicKey, createdAt, status } = device 
        acc.push([id, name, coordinates, publicKey, createdAt, status].join(','))
        return acc
      }, [])
      downloadFile({
        data: [...headers, ...devicesCsv].join('\n'),
        fileName: 'devices.csv',
        fileType: 'text/csv',
      })
    } catch (error) {

    } finally {
      setLoadingReport(false)
    }
  }

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Devices</h2>
            <div className="flex items-center space-x-2">
              <Button disabled={loading} onClick={newDeviceSetup}>
                <Plus className="mr-2 h-4 w-4" /> Create Device
              </Button>
            </div>
          </div>
          <div className="flex-col md:flex items-center justify-end md:space-x-2 space-y-2 md:space-y-0">
            <CalendarDateRangePicker />
            <Button disabled={loadingReport} onClick={downloadReport} variant="secondary">Download</Button>
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
