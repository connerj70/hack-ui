import { Button } from "@/components/ui/button";
import { ItemScan } from "@/types/itemTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

export const columns = (): ColumnDef<ItemScan>[] => [
  {
    accessorKey: "id",
    header: "Scan ID",
    cell: ({ row }) => {
      const item = row.original;

      const truncateMiddle = (str: string, startChars = 6, endChars = 4) => {
        if (str.length <= startChars + endChars) return str;
        return `${str.slice(0, startChars)}...${str.slice(-endChars)}`;
      };

      return (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://suiscan.xyz/devnet/object/${item.id.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  {truncateMiddle(item.id.id)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on SuiScan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "timestampMs",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("timestampMs");

      // Convert timestamp to readable date
      const formatDate = (ms: any) => {
        const date = new Date(Number(ms));
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      return <div className="whitespace-nowrap">{formatDate(timestamp)}</div>;
    },
  },
];
