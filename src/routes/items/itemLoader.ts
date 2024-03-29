import { ItemType, ItemTypeRes } from "@/types/itemTypes";
import { User } from "firebase/auth";

export async function itemLoader(currentUser: User): Promise<ItemType[]> {

  const jwt = await currentUser.getIdToken();
  const resp = await fetch(`${import.meta.env.VITE_API_URL}/item/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!resp.ok) {
    if (resp.status === 403) {
      // Redirect the user to the login page with a redirect back to the current page after login
      throw new Error("403 Forbidden");
    }
    return [];
  }

  const body = await resp.json();
  return body.items.map((item: ItemTypeRes) => ({
    secretKey: item.metadata?.additionalMetadata?.[0]?.[1] ?? "",
    description: item.metadata?.additionalMetadata?.[1]?.[1] ?? "",
  }));
}
