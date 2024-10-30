// Import necessary components and types
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@firebase/auth";
import { useState } from "react";

// Define the structure of each item
interface ItemType {
  description: string;
  id: {
    id: string;
  };
  itemAddress: string;
  name: string;
  url: string;
}

export const columns = (
  toast: any,
  navigate: any,
  currentUser: User | null
): ColumnDef<ItemType>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium leading-none break-words">
            {item.name}
          </p>
        </div>
      );
    },
  },
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
            {item.itemAddress}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: "Image",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <img
          src={item.url}
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      const [isLoading, setIsLoading] = useState(false);

      const handleDelete = async () => {
        if (!currentUser) {
          toast({
            title: "Error",
            description: "You must be logged in to perform this action.",
            variant: "destructive",
          });
          return;
        }

        setIsLoading(true);
        try {
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
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isLoading ? (
                <Button variant="ghost" className="h-8 w-8 p-0" disabled>
                  <span className="sr-only">Loading</span>
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
                  href={`https://suiscan.xyz/devnet/account/${item.itemAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs hover:underline pr-8"
                >
                  View Details
                </a>
                {/* If 'secret' is not available, remove or adjust the following button */}
                {/* <Button
                  onClick={() =>
                    navigate(`/events/create?itemSecret=${item.secret}`)
                  }
                  className="text-xs px-2 py-0"
                >
                  Scan Item
                </Button> */}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete}>
                <div className="text-red-500">Delete Item</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/items/${item.id.id}`)}
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
