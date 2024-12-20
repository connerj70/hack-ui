// src/components/ScannerColumns.tsx

import { useState } from "react";
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
import { User } from "firebase/auth";
import { ScannerType } from "@/types/scannerTypes";

// Define the ScannerType interface, including the optional 'selected' property

// Define the props for the ActionsCell component
interface ActionsCellProps {
  scanner: ScannerType;
  setSelectedScanner: (scanner: ScannerType) => void;
  handleDeleteScanner: (id: string) => void;
  currentUser: User | null;
  toast: any;
}

// ActionsCell Component to handle actions like Select and Delete
const ActionsCell: React.FC<ActionsCellProps> = ({
  scanner,
  setSelectedScanner,
  handleDeleteScanner,
  currentUser,
  toast,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the scanner "${scanner.name}"?`
    );
    if (!confirmDelete) return;

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
      const scannerId = scanner?.id?.id; // Use optional chaining

      if (!scannerId) {
        toast({
          title: "Error",
          description: "Invalid scanner ID.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/scanner/${scannerId}`, // Accessing nested id
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: "Access Denied",
            description: "You do not have permission to delete this scanner.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: `Failed to delete the scanner. Status: ${response.status}`,
            variant: "destructive",
          });
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
     
      toast({
        title: "Delete Successful",
        description: "The scanner has been successfully deleted.",
        variant: "success",
      });
      handleDeleteScanner(scannerId); // Update state instead of reloading
    } catch (error) {
      console.error("Error during deletion:", error);
      // Additional error handling can be added here if needed
    } finally {
      setIsLoading(false);
    }
  };

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
              href={`https://suiscan.xyz/devnet/object/${scanner?.id?.id}`} // Accessing nested id
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-xs hover:underline pr-8"
            >
              View Details
            </a>

            <Button
              className="text-xs mt-2"
              onClick={() => setSelectedScanner(scanner)}
            >
              Select
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard
                .writeText(scanner.scannerAddress)
                .then(() => {
                  toast({
                    title: "Copied",
                    description: "Scanner address copied to clipboard.",
                    variant: "success",
                  });
                })
                .catch((err) => {
                  console.error("Failed to copy:", err);
                  toast({
                    title: "Error",
                    description: "Failed to copy scanner address.",
                    variant: "destructive",
                  });
                })
            }
          >
            Copy Scanner Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <div className="text-red-500">Delete Scanner</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isLoading && (
        <span className="ml-2 text-sm text-gray-500">Deleting...</span>
      )}{" "}
      {/* Simple loading indicator */}
    </div>
  );
};

// Main columns definition
export const scannerColumns = (
  setSelectedScanner: (scanner: ScannerType) => void,
  handleDeleteScanner: (id: string) => void,
  currentUser: User | null,
  toast: any,
  selectedScanner: any
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
            {scanner?.id?.id === selectedScanner?.id?.id && (
              <span className="text-green-500 pl-2" aria-label="Selected">
                ✓
              </span>
            )}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const scanner = row.original;
      return (
        <div className="text-sm text-gray-700 whitespace-normal break-all">
          {scanner.description}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions", // Optional: Add a header for actions column
    cell: ({ row }) => {
      const scanner = row.original;

      return (
        <ActionsCell
          scanner={scanner}
          setSelectedScanner={setSelectedScanner}
          handleDeleteScanner={handleDeleteScanner}
          currentUser={currentUser}
          toast={toast}
        />
      );
    },
  },
];
