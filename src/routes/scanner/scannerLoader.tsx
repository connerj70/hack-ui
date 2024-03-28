import { GetScannerResponseType, ScannerType } from "@/types/scannerTypes";
import Cookies from "js-cookie";

export async function scannerLoader(): Promise<ScannerType[]> {
  const user = Cookies.get("user");

  const parsedUser = JSON.parse(user!);

  const resp = await fetch(`${import.meta.env.VITE_API_URL}/scanner/user`, {
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
    console.error("Failed to fetch user accounts");
    return [];
  }

  const body = await resp.json();

  console.log("body: ", body);

  return body.scanners.map((scanner: GetScannerResponseType) => {
    return {
      secretKey: scanner.metadata.additionalMetadata[0][1],
      mint: scanner.mint,
    };
  });
}
