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

type SetSelectedScannerFunc = (scanner: ScannerInfo | null) => void;

export const columns = (
  setSelectedScanner: SetSelectedScannerFunc,
  toast: any
): ColumnDef<ScannerType>[] => [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const scanner = row.original;

      return (
        <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium leading-none break-words flex">
              {scanner.description}
              {scanner.selected ? <div className="text-green-500 pl-2">✓</div> : ""}
            </p>
            <p
              className="text-xs leading-none text-muted-foreground break-words whitespace-normal"
              style={{ overflowWrap: "anywhere" }}
            >
              {scanner.public}
            </p>
        </div>
      );
    },
  },

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
              <DropdownMenuLabel>
                <p className="text-lg">Actions</p>

                <a
                  href={`https://explorer.solana.com/address/${scanner.public}/tokens?cluster=devnet`} // Make sure respUrl is stored in the component state
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs hover:underline pr-8"
                >
                  View Details
                </a>
                <Button
                  className="text-xs"
                  onClick={handleSelectScanner}
                >
                  Select
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(scanner.public)}
              >
                Copy Public key
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
