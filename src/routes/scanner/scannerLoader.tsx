import { GetScannerResponseType, ScannerType } from "@/types/scannerTypes";
import { User } from "firebase/auth";

export async function scannerLoader(currentUser: User): Promise<ScannerType[]> {
  const resp = await fetch(`${import.meta.env.VITE_API_URL}/scanner/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser.getIdToken()}`,
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

  return body.scanners.map((scanner: GetScannerResponseType) => {
    return {
      secretKey: scanner.metadata?.additionalMetadata?.[0]?.[1] ?? "",
      description: scanner.metadata?.additionalMetadata?.[1]?.[1] ?? "",
    };
  });
}
