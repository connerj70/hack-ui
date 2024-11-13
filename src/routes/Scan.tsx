// src/App.tsx
import React, { useState, FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PDFViewer from "@/components/walrus/WalrusPDFViewer";
import { Loader2 } from "lucide-react";
import QRScanner from "./video";

export const SUI_NETWORK = "testnet";
export const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
export const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

// Define the structure of the uploaded blob information
export interface UploadedBlob {
  status: string;
  blobId: string;
  endEpoch: number;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  mediaType: string;
}

const Scan: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-5">
      <QRScanner />
    </div>
  );
};

export default Scan;
