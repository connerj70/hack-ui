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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/useAuth";
import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUI_VIEW_OBJECT_URL, SUI_VIEW_TX_URL, UploadedBlob } from "../Scan";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PDFViewer from "@/components/walrus/WalrusPDFViewer";

const formSchema = z.object({
  description: z.string(),
});

export default function CreateItem() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [itemSecret, setItemSecret] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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

      const jwt = await currentUser.getIdToken();

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/item/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          description: values.description,
          blodId: uploadedBlob?.blobId,
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

  return (
    <>
      <div className="lg:p-8 p-4 pt-10">
        <AlertDialog open={open}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Item secret</AlertDialogTitle>
              <AlertDialogDescription>
                Save your item secret key
              </AlertDialogDescription>
              <div className="flex flex-col items-center py-8">
                <QRCode value={itemSecret} />
              </div>
              <Textarea className="pt-8 py-4" defaultValue={itemSecret} />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleClose}>
                I've saved my secret key
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
            <Card className="w-84">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Upload Bill of Lading
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
              </CardContent>
            </Card>
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
