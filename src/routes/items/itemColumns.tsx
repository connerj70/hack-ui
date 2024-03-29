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

export const columns = (toast: any): ColumnDef<ItemType>[] => [
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
    accessorKey: "secretKey",
    header: "Secret Key",
    cell: ({ row }) => {
      const item = row.original;
      const displayKey = `${item.secretKey.slice(0, 15)}...`; // Truncate the key for display

      return (
        <div
          title={item.secretKey} // Show full key on hover
          className="text-ellipsis overflow-hidden"
          style={{
            maxWidth: "150px", // Limit the width of the cell
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {displayKey}
          {/* You can also add a button or icon here to click and copy or view the full key */}
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
        // Assuming `useScannerContext` is your custom hook to access the scanner context

        navigator.clipboard.writeText(
          `${import.meta.env.VITE_BROWSER_URL}/events/create?itemSecret=${item.secretKey}`
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.secretKey)}
              >
                Copy item ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDemoCopy}>
                Copy Demo Address
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <Link to={`/items/${item.id}`}>
                  <DropdownMenuItem>View details</DropdownMenuItem>
                </Link> */}
              <DropdownMenuItem>View events</DropdownMenuItem>
              <DropdownMenuItem>Deactivate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
