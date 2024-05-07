import { TransactionData } from "@/types/itemTypes";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<TransactionData>[] => [
  {
    accessorKey: "blockTime", // Assuming blockTime should be used for sorting/filtering if needed
    header: "Description",
    cell: ({ row }) => {
      const item = row.original;
      let itemKey, scannerKey, lat, lng;

      const matchResults = item.memo.match(/[\w.:-]+/g);
      if (matchResults && matchResults.length >= 4) {
        [, itemKey, scannerKey, lat, lng] = matchResults; // Extract details from the memo
      } else {
        itemKey = "No Item Key";
        scannerKey = "No Scanner Key";
        lat = "No Latitude";
        lng = "No Longitude";
      }

      return (
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium leading-none break-words">
            {item && item.blockTime
              ? `${new Date(
                  item.blockTime * 1000
                ).toLocaleString()} (${lat}, ${lng})`
              : "Loading..."}
          </p>
          <a
            href={`https://explorer.solana.com/tx/${item.signature}?cluster=devnet`} // Make sure respUrl is stored in the component state
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline center"
          >{`view`}</a>
          <p
            className="text-xs leading-none text-muted-foreground break-words whitespace-normal"
            style={{ overflowWrap: "anywhere" }}
          >
            {`Item Key: ${itemKey}`}
          </p>
          <p
            className="text-xs leading-none text-muted-foreground break-words whitespace-normal"
            style={{ overflowWrap: "anywhere" }}
          >
            {`Scanner Key: ${scannerKey}`}
          </p>
        </div>
      );
    },
  },
];
