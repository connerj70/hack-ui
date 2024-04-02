// import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemType } from "@/types/itemTypes";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

export const columns = (toast: any, navigate: any): ColumnDef<ItemType>[] => [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "public",
    header: "Public Key",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div>
          <Badge>{item.public}</Badge>
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;

      const handleDemoCopy = () => {
        navigator.clipboard.writeText(
          `${import.meta.env.VITE_BROWSER_URL}/events/create?itemSecret=${
            item.secretKey
          }`
        );

        toast({
          title: "NFC Address copied",
          description: item.description,
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDemoCopy}>
                Copy NFC Demo Address
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  onClick={() =>
                    navigate(`/events/create?itemSecret=${item.secretKey}`)
                  }
                >
                  Scan Item
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a
                  href={`https://solana.fm/address/${item.public}/tokens?cluster=devnet-solana`} // Make sure respUrl is stored in the component state
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
