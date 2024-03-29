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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

const formSchema = z.object({
  scannerSecret: z.string(),
  itemSecret: z.string(),
  message: z.string(),
});

export default function CreateEvent() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const itemSecret = searchParams.get("itemSecret");
  const { currentUser, selectedScanner } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scannerSecret: selectedScanner?.secretKey || "",
      itemSecret: itemSecret || "",
      message: "HACKER HOUSE DEMO",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      if (!currentUser) {
        console.log("No current user. Skipping fetch.");
        return;
      }

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
          title: "Error creating item",
          description: "An error occurred while creating your item",
        });

        return;
      }

      let respUrl = await resp.text();
      // Remove any unwanted quotation marks that might be surrounding the URL
      respUrl = respUrl.replace(/^"(.*)"$/, "$1");
      console.log("Cleaned URL: ", respUrl);

      window.open(respUrl);
      navigate("/events");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast({
          title: "Error creating item",
          description: errorMessage,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="lg:p-8 p-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create New Scan
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="scannerSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scanner Secret</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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

              <Button disabled={submitting} type="submit" className="w-full">
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Toaster />
    </>
  );
}
