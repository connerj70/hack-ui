import { ItemScan } from "@/types/itemTypes";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<ItemScan>[] => [
  {
    accessorKey: "id", // Assuming blockTime should be used for sorting/filtering if needed
    header: "Scan ID",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="mx-auto max-w-4xl">
          <p
            className="text-xs leading-none text-muted-foreground break-words whitespace-normal"
            style={{ overflowWrap: "anywhere" }}
          >
            {item.id.id}
          </p>
        </div>
      );
    },
  },
];
