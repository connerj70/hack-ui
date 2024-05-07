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
import { Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@firebase/auth";
import { useState } from "react";

export const columns = (
  toast: any,
  navigate: any,
  currentUser: User | null
): ColumnDef<ItemType>[] => [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const item = row.original;
      row.id = item.public;

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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [isLoading, setIsLoading] = useState(false);
      const item = row.original;

      async function handleDelete(mint: string, tokenAccount: string) {
        if (!currentUser) return;
        setIsLoading(true); // Start loading
        try {
          const jwt = await currentUser.getIdToken();
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/item/${mint}/${tokenAccount}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          console.log("Delete successful:", result);
          toast({
            title: "Delete Successful",
            description: "The item has been successfully deleted.",
          });
          window.location.reload();
        } catch (error) {
          console.error("Error during deletion:", error);
          toast({
            title: "Delete Failed",
            description: "Failed to delete the item.",
          });
        } finally {
          setIsLoading(false); // End loading
        }
      }

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isLoading ? (
                <Button variant="ghost" className="h-8 w-8 p-0" disabled>
                  <span className="sr-only">Open menu</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
              ) : (
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <p className="text-lg">Actions</p>

                <a
                  href={`https://explorer.solana.com/address/${item.public}/tokens?cluster=devnet`} // Make sure respUrl is stored in the component state
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs hover:underline pr-8"
                >
                  View Details
                </a>
                <Button
                  onClick={() =>
                    navigate(`/events/create?itemSecret=${item.secret}`)
                  }
                  className="text-xs px-2 py-0" // Adjust font size and padding
                >
                  Scan Item
                </Button>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(item.mint, item.tokenAccount)}
              >
                <div className="text-red-500">Delete Item</div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate(`/items/${item.public}`)}
              >
                Shipping Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
