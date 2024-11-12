// src/components/QrCodeDialog.tsx

import { FC, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";

interface QrCodeDialogProps {
  qrData: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTitle?: string; // Optional prop to customize the dialog title
  dialogDescription?: string; // Optional prop to customize the dialog description
  name: string;
}

const QrCodeDialog: FC<QrCodeDialogProps> = ({
  qrData,
  open,
  onOpenChange,
  dialogTitle = "QR Code",
  dialogDescription = "Here is your QR code:",
  name
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (qrRef.current) {
      const printContent = qrRef.current.innerHTML;
      const printWindow = window.open("", "", "width=600,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print QR Code</title>
              <style>
                body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #fff; /* Ensure a white background */
                }
              </style>
            </head>
            <body>
              <div>${printContent}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center my-4" ref={qrRef}>
          <QRCode value={qrData} size={256} />
        </div>
        <DialogFooter className="flex space-x-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            variant="default"
            type="button"
            onClick={handlePrint}
            aria-label={`Print QR Code ${name}`}
          >
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeDialog;
