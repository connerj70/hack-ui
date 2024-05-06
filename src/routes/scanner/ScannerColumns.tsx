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
import { ItemType } from "@/types/itemTypes";
import { Button } from "@/components/ui/button";

export const columns = (handleSelectScanner: any): ColumnDef<ItemType>[] => [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const scanner = row.original;

      return (
        <div className="mx-auto max-w-4xl">
          <div className="text-sm font-medium leading-none break-words flex">
            {scanner.description}
            {scanner.selected ? (
              <span className="text-green-500 pl-2">✓</span>
            ) : (
              ""
            )}
          </div>
          <div
            className="text-xs leading-none text-muted-foreground break-words whitespace-normal"
            style={{ overflowWrap: "anywhere" }}
          >
            {scanner.public}
          </div>
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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="text-lg">Actions</div>
                <a
                  href={`https://explorer.solana.com/address/${scanner.public}/tokens?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs hover:underline pr-8"
                >
                  View Details
                </a>
                <Button
                  className="text-xs"
                  onClick={() => handleSelectScanner(scanner)}
                >
                  Select
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(scanner.public)}
              >
                Copy Public Key
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
