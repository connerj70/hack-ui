import { ItemType, ItemTypeRes } from "@/types/itemTypes";
import Cookies from "js-cookie";

export async function itemLoader(): Promise<ItemType[]> {
  const user = Cookies.get("user");
  const parsedUser = JSON.parse(user!);
  const resp = await fetch(`${import.meta.env.VITE_API_URL}/item/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${parsedUser.stsTokenManager.accessToken}`,
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
    description: item.metadata.additionalMetadata[0][1],
    mint: item.mint,
  }));
}
