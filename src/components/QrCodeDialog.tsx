// src/components/QrCodeDialog.tsx

import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";

interface QrCodeDialogProps {
  qrData: string;
  triggerText?: string; // Optional prop to customize the trigger button text
  dialogTitle?: string; // Optional prop to customize the dialog title
  dialogDescription?: string; // Optional prop to customize the dialog description
}

const QrCodeDialog: FC<QrCodeDialogProps> = ({
  qrData,
  triggerText = "Show QR Code",
  dialogTitle = "QR Code",
  dialogDescription = "Here is your QR code:",
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center my-4">
          <QRCode value={qrData} size={256} />
        </div>
        <DialogFooter>
          <Button variant="secondary" type="button">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeDialog;
