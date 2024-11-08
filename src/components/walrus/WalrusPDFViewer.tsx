// src/components/walrus/WalrusPDFViewer.tsx
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface UploadedBlobProps {
  blob: UploadedBlob;
}

interface UploadedBlob {
  status: string;
  blobId: string;
  endEpoch: number;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  mediaType: string;
}

const PDFViewer: React.FC<UploadedBlobProps> = ({ blob }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  console.log("blob ---", blob);
  console.log(
    `https://aggregator.walrus-testnet.walrus.space/v1/${blob.blobId}`
  );

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handlePrevious = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    if (numPages) {
      setPageNumber((prev) => Math.min(prev + 1, numPages));
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Uploaded File:</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-full flex justify-center mb-4">
          <Document
            file={`https://aggregator.walrus-testnet.walrus.space/v1/${blob.blobId}`}
            onLoadSuccess={onDocumentLoadSuccess}
            className="w-full"
          >
            <Page
              pageNumber={pageNumber}
              scale={window.innerWidth < 768 ? 0.6 : 1} // Adjust scale as needed
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
        {numPages && (
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={pageNumber <= 1}
            >
              Previous
            </Button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={pageNumber >= numPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFViewer;
