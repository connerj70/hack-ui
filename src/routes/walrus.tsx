// src/App.tsx
import React, { useState, FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PDFViewer from "@/components/walrus/WalrusPDFViewer";
import { Loader2 } from "lucide-react";

const SUI_NETWORK = "testnet";
const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

// Define the structure of the uploaded blob information
interface UploadedBlob {
  status: string;
  blobId: string;
  endEpoch: number;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  mediaType: string;
}

const Walrus: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedBlob, setUploadedBlob] = useState<UploadedBlob | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const storageInfo = await storeBlob();
      if (storageInfo) {
        setUploadedBlob(storageInfo);
        // Optionally, reset the file input
        setFile(null);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.message || "Something went wrong when storing the blob."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const storeBlob = async (): Promise<UploadedBlob> => {
    if (!file) {
      throw new Error("No file selected.");
    }

    if (file.size > 10_000_000) {
      throw new Error("File size should be less than 10MB.");
    }

    if (!file.type.startsWith("application/pdf")) {
      throw new Error("Invalid file type. Only PDFs are allowed.");
    }

    const basePublisherUrl = "https://publisher.walrus-testnet.walrus.space";
    const numEpochs = 1;

    const response = await fetch(
      `${basePublisherUrl}/v1/store?epochs=${numEpochs}`,
      {
        method: "PUT",
        body: file,
      }
    );

    if (response.status === 200) {
      const storageInfo = await response.json();
      console.log("Storage Info:", storageInfo);

      if (storageInfo.alreadyCertified) {
        return {
          status: "Already certified",
          blobId: storageInfo.alreadyCertified.blobId,
          endEpoch: storageInfo.alreadyCertified.endEpoch,
          suiRefType: "Previous Sui Certified Event",
          suiRef: storageInfo.alreadyCertified.eventOrObject.Event.txDigest,
          suiBaseUrl: SUI_VIEW_TX_URL,
          mediaType: file.type,
        };
      } else if (storageInfo.newlyCreated) {
        return {
          status: "Newly created",
          blobId: storageInfo.newlyCreated.blobObject.blobId,
          endEpoch: storageInfo.newlyCreated.blobObject.storage.endEpoch,
          suiRefType: "Associated Sui Object",
          suiRef: storageInfo.newlyCreated.blobObject.id,
          suiBaseUrl: SUI_VIEW_OBJECT_URL,
          mediaType: file.type,
        };
      } else {
        throw new Error("Unhandled successful response!");
      }
    } else {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Something went wrong when storing the blob!"
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Upload File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <fieldset disabled={isUploading}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="file-input"
                        className="block text-sm font-medium mb-2"
                      >
                        Choose a PDF File
                      </label>
                      <Input
                        id="file-input"
                        type="file"
                        accept="application/pdf"
                        className="cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                          }
                        }}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center"
                      disabled={isUploading}
                    >
                      {isUploading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </fieldset>
              </form>

              {errorMessage && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Uploaded Files Section */}
        {uploadedBlob && (
          <div className="lg:col-span-5">
            <PDFViewer blob={uploadedBlob} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Walrus;
