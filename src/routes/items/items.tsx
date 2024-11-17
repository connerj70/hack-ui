// src/components/Items.tsx

"use client"; // Ensure client-side rendering

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Progress } from "@/components/ui/progress";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// Import the modified QrCodeDialog
import QrCodeDialog from "@/components/QrCodeDialog";
import PDFViewer from "@/components/walrus/WalrusPDFViewer";

// Define the structure of each item
interface ItemType {
  description: string;
  id: {
    id: string;
  };
  itemAddress: string;
  name: string;
  url: string;
  blob_id: string;
  qr: string;
}

export default function Items() {
  // State variables
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [data, setData] = useState<ItemType[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [progress, setProgress] = useState(0); // Progress state
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // State variables for QR Code Dialog
  const [qrData, setQrData] = useState<string | null>(null);
  const [qrName, setQrName] = useState<string | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState<boolean>(false);

  // State variables for PDF Viewer Dialog
  const [pdfOpen, setPdfOpen] = useState<boolean>(false);
  const [selectedBlobId, setSelectedBlobId] = useState<string | null>(null);

  // Define a global filter function
  const customGlobalFilter: FilterFn<ItemType> = useMemo(
    () => (row, filterValue) => {
      if (!filterValue || filterValue.trim() === "") return true;

      const lowercasedFilter = filterValue.toLowerCase().trim();
      const { name = "", description = "" } = row.original;
      const lowercasedName = name.toLowerCase();
      const lowercasedDescription = description.toLowerCase();

      return (
        lowercasedName.includes(lowercasedFilter) ||
        lowercasedDescription.includes(lowercasedFilter)
      );
    },
    []
  );

  // Define columns inside the component to access delete handler
  const columns = useMemo<ColumnDef<ItemType, any>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("description")}</div>,
      },
      {
        accessorKey: "timestampMs",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const timestamp = row.getValue("timestampMs");

          // Convert timestamp to readable date
          const formatDate = (ms:any) => {
            const date = new Date(Number(ms));
            return date.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
          };

          return (
            <div className="whitespace-nowrap">{formatDate(timestamp)}</div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
          const item = row.original;

          // Delete item handler
          const handleDelete = async () => {
            const confirmDelete = window.confirm(
              "Are you sure you want to delete this item?"
            );
            if (!confirmDelete) return;

            try {
              if (!currentUser) {
                toast({
                  title: "Error",
                  description: "User not authenticated.",
                  variant: "destructive",
                });
                return;
              }

              const jwt = await currentUser.getIdToken();
              const response = await fetch(
                `${import.meta.env.VITE_API_URL}/item/${item.id.id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                  },
                }
              );

              if (!response.ok) {
                throw new Error(
                  `Failed to delete item: ${response.statusText}`
                );
              }

              // Remove the deleted item from the data
              setData((prevData) =>
                prevData.filter((e) => e.id.id !== item.id.id)
              );

              toast({
                title: "Success",
                description: "Item deleted successfully.",
                variant: "default",
              });
            } catch (error) {
              console.error("Failed to delete item:", error);
              toast({
                title: "Error",
                description: "Failed to delete item.",
                variant: "destructive",
              });
            }
          };

          // Handle QR Code action
          const handleQR = async (item: ItemType) => {
            try {
              const jwt = await currentUser?.getIdToken();

              const resp = await fetch(
                `${import.meta.env.VITE_API_URL}/item/qr/${item.id.id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                  },
                }
              );

              if (!resp.ok) {
                throw new Error(`Failed to fetch QR data: ${resp.statusText}`);
              }

              const body = await resp.json();

              const qrData = body;

              if (qrData) {
                setQrData(qrData.item);
                setQrName(item.name);
                setIsQrDialogOpen(true);
              } else {
                throw new Error("No QR data received.");
              }
            } catch (error) {
              console.error("Error fetching QR data:", error);
              toast({
                title: "Error",
                description: "Failed to fetch QR data.",
                variant: "destructive",
              });
            }
          };

          // Handle View PDF action
          const handleViewPDF = () => {
            setSelectedBlobId(item.blob_id); // Assuming 'url' is blobId
            setPdfOpen(true);
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions:</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <a
                    href={`https://suiscan.xyz/devnet/object/${item.id.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full" // Ensures the link fills the DropdownMenuItem
                  >
                    View Item on SuiScan
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/items/${item.itemAddress}`)}
                >
                  View Item History
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleQR(item)}>
                  View QR Code
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleViewPDF}>
                  View PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete}>
                  Delete Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [currentUser, navigate, toast]
  );

  // Fetch items on component mount
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

        // Safeguard: Ensure body is an array
        if (Array.isArray(body)) {
          setData(body);
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

  // Initialize React Table
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter, // Set the global filter
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    globalFilterFn: customGlobalFilter,
    filterFns: {
      customGlobalFilter,
    },
  });

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <ResizablePanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="min-h-screen w-full rounded-lg"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <MapComponent width={"100vw"} height={"100vh"} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50}>
          <div className="flex flex-col w-full mx-auto px-4 pt-10 h-full overflow-auto">
            <div className="flex-1 space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Items</h2>
                <div className="flex items-center space-x-2">
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
                  {table.getRowModel().rows.length ? (
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
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {isLoading ? (
                          <div className="mb-4">
                            <Progress value={progress} className="h-2 w-full" />
                          </div>
                        ) : (
                          <p>No Items. Click the "Create Item" button.</p>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-end space-x-2 py-4">
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
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Render the QrCodeDialog */}
      {qrData && (
        <QrCodeDialog
          qrData={qrData}
          open={isQrDialogOpen}
          onOpenChange={setIsQrDialogOpen}
          dialogTitle="Item QR Code"
          dialogDescription="Scan this QR code to record the item."
          name={qrName!}
        />
      )}

      {/* Render the PDFViewer Dialog */}
      {selectedBlobId && (
        <AlertDialog open={pdfOpen} onOpenChange={setPdfOpen}>
          <AlertDialogContent className="w-full max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>View PDF</AlertDialogTitle>

              <PDFViewer blobId={selectedBlobId} />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Toaster />
    </>
  );
}
