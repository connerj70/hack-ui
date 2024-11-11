import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/useAuth";
import QRCode from "react-qr-code";

import { SUI_VIEW_OBJECT_URL, SUI_VIEW_TX_URL, UploadedBlob } from "../Scan";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PDFViewer from "@/components/walrus/WalrusPDFViewer";
import { CopyIcon, DownloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  description: z.string(),
});

export default function CreateItem() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [itemSecret, setItemSecret] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedBlob, setUploadedBlob] = useState<UploadedBlob | null>(null);
  const [des, setDescription] = useState("");

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
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong when storing the blob.");
      }
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      if (!currentUser) {
        return;
      }

      setDescription(values.description);
      const jwt = await currentUser.getIdToken();

      console.log("blob id ===", uploadedBlob?.blobId);

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/item/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          description: values.description,
          blobId: uploadedBlob?.blobId,
        }),
      });

      if (!resp.ok) {
        if (resp.status === 403) {
          // Redirect the user to the login page with a redirect back to the current page after login
          navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
        } else {
          toast({
            title:
              "Error creating item (check if you have enough Sui in your wallet)",
            description: "An error occurred while creating your item",
          });
        }
        return;
      }

      const respBody = await resp.json();

      console.log(respBody);

      setItemSecret(respBody.item);
      setOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast({
          title:
            "Error creating item (check if you have enough Sui in your wallet)",
          description: errorMessage,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setOpen(false);
    navigate("/items");
  }

  const handleDownload = () => {
    const content = `Your Item Secret Key:\n${itemSecret}\n\nVisit: https://www.pomerene.net/`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `item-secret-${des}.txt`;
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const content = `Your Item Secret Key:\n${itemSecret}\n\nVisit: https://www.pomerene.net/`;
    navigator.clipboard
      .writeText(content)
      .then(() => {
        // Optionally, you can show a success message or toast here
        alert("Secret key copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <div className="lg:p-8 p-4 pt-10">
        <AlertDialog open={isOpen} onOpenChange={handleClose}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Item Secret</AlertDialogTitle>
              <AlertDialogDescription>
                Please save your item secret key. You can download it or copy it
                to your clipboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col items-center py-8">
              <QRCode value={itemSecret} size={200} />
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                variant={"ghost"}
                onClick={handleCopy}
                className="flex items-center"
              >
                <CopyIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                Copy to Clipboard
              </Button>
              <Button variant={"ghost"} onClick={handleDownload} className="flex items-center">
                <DownloadIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                Download Secret
              </Button>
            </div>
            <AlertDialogFooter className="mt-6">
              <AlertDialogAction onClick={handleClose}>
                I've Saved My Secret Key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create New Item
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={submitting} type="submit" className="w-full">
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create
              </Button>
            </form>
          </Form>

          {/* file upload */}
          <div className="flex flex-col items-center py-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <fieldset disabled={isUploading}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="file-input"
                      className="block text-sm font-medium mb-2"
                    >
                      Choose a Bill of Lading (PDF File)
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

            {uploadedBlob && (
              <div className="pt-10">
                <PDFViewer blob={uploadedBlob} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
