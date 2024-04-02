import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
// import { ItemType } from "@/types/scannerTypes";
import { Button } from "@/components/ui/button";
// import { CalendarDateRangePicker } from "@/components/dateRangePicker";
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
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
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
import { ItemType, ItemTypeRes } from "@/types/itemTypes";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/components/ui/use-toast";

export default function Items() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  // const [loadingReport, setLoadingReport] = useState(false);
  // const items = useLoaderData() as ItemType[];
  // const items =  itemLoader();
  // const [loadingReport] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(13);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      setLoadingData(true);
      try {
        // Assuming currentUser comes from your authentication context
        // and it might be null initially until the auth state is resolved.
        if (!currentUser) {
          console.log("No current user. Skipping fetch.");
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

        const userItems = await body?.items.map((item: ItemTypeRes) => {
          return {
            secretKey: item.metadata?.additionalMetadata?.[0]?.[1] ?? "",
            description: item.metadata?.additionalMetadata?.[1]?.[1] ?? "",
            public: item.metadata?.additionalMetadata?.[2]?.[1] ?? "",
          };
        });
        setItems(userItems);
        setLoadingData(false);
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchItems(); // Correctly call fetchItems here
  }, [currentUser]); // Add currentUser to the dependency array if it's expected to change over time

  const table = useReactTable({
    data: items,
    columns: columns(toast, navigate),
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
            <h2 className="text-3xl font-bold tracking-tight">Items</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate("/items/create")}>
                Create Item
              </Button>
            </div>
          </div>
         
          {/* <div className="rounded-md border"> */}
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
                        <p>No Items Click add Item to Create Pallet Tag</p>
                      ) : (
                        <Progress value={progress} className="w-[60%]" />
                      )}
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
      {/* </div> */}
    </>
  );
}
