// src/components/ScannerColumns.tsx

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

interface ScannerType {
  description: string;
  id: {
    id: string;
  };
  scannerAddress: string;
  name: string;
  url: string;
}

export const columns = (
  handleSelectScanner: (scanner: ScannerType) => void
): ColumnDef<ScannerType>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const scanner = row.original;

      return (
        <div className="flex items-center">
          <div className="text-sm font-medium leading-none break-words">
            {scanner.name}
            {scanner.selected && <span className="text-green-500 pl-2">✓</span>}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "scannerAddress",
    header: "Scanner Address",
    cell: ({ row }) => {
      const scanner = row.original;
      return (
        <div className="text-sm text-gray-700 whitespace-normal break-all">
          {scanner.scannerAddress}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const scanner = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                aria-label="Open actions menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="text-lg">Actions</div>
                <a
                  href={`https://explorer.sui.io/address/${scanner.id.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs hover:underline pr-8"
                >
                  View Details
                </a>
                <Button
                  className="text-xs mt-2"
                  onClick={() => handleSelectScanner(scanner)}
                >
                  Select
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(scanner.scannerAddress)
                }
              >
                Copy Scanner Address
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
