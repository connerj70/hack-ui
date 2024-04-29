import { useSearchParams } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";

const formSchema = z.object({
  scannerSecret: z.string().min(1, {
    message: "scanner secret cannot be empty.",
  }),
  itemSecret: z.string().min(1, {
    message: "item secret cannot be empty.",
  }),
  message: z.string().min(1, {
    message: "message cannot be empty.",
  }),
});

export default function CreateEvent() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const itemSecret = searchParams.get("itemSecret");
  const { currentUser, selectedScanner, location, setLocation } = useAuth();
  const [scanned, setScanned] = useState(false);
  const [respUrl, setRespUrl] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scannerSecret: selectedScanner?.secretKey || "",
      itemSecret: itemSecret || "",
      message: location || "",
    },
  });

  function useLocation() {
    useEffect(() => {
      if (!navigator.geolocation) {
        toast({
          title: "Geolocation Not Supported",
          description: "Your browser does not support Geolocation",
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locText = `${latitude}, ${longitude}`;
          setLocation(locText);

          if (form.getValues("message") !== "") {
            return;
          }
          form.setValue("message", locText);
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to fetch location",
          });
        }
      );
    }, [form, toast]);
  }

  useLocation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      if (!currentUser || scanned) {
        return;
      }

      setLocation(values.message);

      const jwt = await currentUser.getIdToken();

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/event/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          scannerSecret: values.scannerSecret,
          itemSecret: values.itemSecret,
          message: values.message,
        }),
      });

      if (!resp.ok) {
        toast({
          title:
            "Error creating event (check if you have enough SOL in your wallet)",
          description: "An error occurred while creating your item",
        });

        return;
      }

      let respUrl = await resp.text();
      // Remove any unwanted quotation marks that might be surrounding the URL
      respUrl = respUrl.replace(/^"(.*)"$/, "$1");

      setRespUrl(respUrl);
      setScanned(true);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast({
          title:
            "Error creating event (check if you have enough SOL in your wallet)",
          description: errorMessage,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="lg:p-8 p-4 pt-10">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create New Scan
            </h1>
          </div>

          {!scanned ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="scannerSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scanner Secret</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="itemSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Secret</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.isValid}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center">
              {/* Placeholder for checkmark animation */}
              <div className="text-green-500">✓ Scan Successful</div>
              {/* Display the link */}
              <a
                href={respUrl} // Make sure respUrl is stored in the component state
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline center"
              >
                View Scan (devnet)
              </a>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}
