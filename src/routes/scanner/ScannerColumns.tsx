import { MoreHorizontal } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ScannerType } from "@/types/scannerTypes";
import { Button } from "@/components/ui/button";
import { ScannerInfo } from "@/contexts/AuthProvider";
import { Badge } from "@/components/ui/badge";

type SetSelectedScannerFunc = (scanner: ScannerInfo | null) => void;

export const columns = (
  setSelectedScanner: SetSelectedScannerFunc,
  toast: any
): ColumnDef<ScannerType>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "public",
    header: "Public",
    cell: ({ row }) => {
      const scanner = row.original;

      return (
        <div>
          <Badge>{scanner.public}</Badge>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "secretKey",
  //   header: "Secret Key",
  //   cell: ({ row }) => {
  //     const scanner = row.original;
  //     const displayKey = `${scanner.secretKey.slice(0, 15)}...`; // Truncate the key for display

  //     return (
  //       <div
  //         title={scanner.secretKey} // Show full key on hover
  //         className="text-ellipsis overflow-hidden"
  //         style={{
  //           maxWidth: "150px", // Limit the width of the cell
  //           whiteSpace: "nowrap",
  //           overflow: "hidden",
  //           textOverflow: "ellipsis",
  //         }}
  //       >
  //         {displayKey}
  //         {/* You can also add a button or icon here to click and copy or view the full key */}
  //       </div>
  //     );
  //   },
  // },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const scanner = row.original;

      const handleSelectScanner = () => {
        // Assuming `useScannerContext` is your custom hook to access the scanner context

        setSelectedScanner({
          description: scanner.description,
          secretKey: scanner.secretKey,
        });

        toast({
          title: "Scanner selected",
          description: scanner.description,
        });
      };

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
                onClick={() => navigator.clipboard.writeText(scanner.public)}
              >
                Copy Public key
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button onClick={handleSelectScanner}>
                  Select This Scanner
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a
                  href={`https://solana.fm/address/${scanner.public}/tokens?cluster=devnet-solana`} // Make sure respUrl is stored in the component state
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
