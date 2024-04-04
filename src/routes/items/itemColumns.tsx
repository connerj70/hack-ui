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
// import { Badge } from "@/components/ui/badge";

export const columns = (toast: any, navigate: any): ColumnDef<ItemType>[] => [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium leading-none break-words">
            {item.description}
          </p>
          <p
            className="text-xs leading-none text-muted-foreground break-words whitespace-normal"
            style={{ overflowWrap: "anywhere" }}
          >
            {item.public}
          </p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "public",
  //   header: "Public Key",
  //   enableHiding: true,
  //   cell: ({ row }) => {
  //     const item = row.original;

  //     return (
  //       <div>
  //         <Badge>{item.public}</Badge>
  //       </div>
  //     );
  //   },

  // },

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
              <DropdownMenuLabel>
                <p className="text-lg">Actions</p>

                <a
                  href={`https://solana.fm/address/${item.public}/tokens?cluster=devnet-solana`} // Make sure respUrl is stored in the component state
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs hover:underline pr-8"
                >
                  View Details
                </a>
                <Button
                  onClick={() =>
                    navigate(`/events/create?itemSecret=${item.secretKey}`)
                  }
                  className="text-xs px-2 py-0" // Adjust font size and padding
                >
                  Scan Item
                </Button>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.public)}
              >
                Copy Public key
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleDemoCopy}>
                Copy NFC Demo Address
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
