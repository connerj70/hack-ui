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

const formSchema = z.object({
  description: z.string(),
});

export default function CreateScanner() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scannerSecret, setScannerSecret] = useState("");
  const { currentUser } = useAuth();

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

      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/scanner/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            description: values.description,
          }),
        }
      );

      if (!resp.ok) {
        if (resp.status === 403) {
          // Redirect the user to the login page with a redirect back to the current page after login
          navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
        } else {
          toast({
            title: "Error creating scnanner (check if you have enough Sui in your wallet)",
            description: "An error occurred while creating your scanner",
          });
        }
        return;
      }

      const respBody = await resp.json();

      setScannerSecret(respBody.scanner);
      setOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast({
          title: "Error creating scanner (check if you have enough Sui in your wallet)",
          description: errorMessage,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setOpen(false);
    navigate("/scanners");
  }

  return (
    <>
      <div className="lg:p-8 p-4 pt-10">
        <AlertDialog open={open}>
          <AlertDialogContent style={{ textAlign: "center" }}>
            <AlertDialogHeader>
              <AlertDialogTitle>Scanner secret</AlertDialogTitle>
              <AlertDialogDescription>
                Save your scanner secret key
              </AlertDialogDescription>
              <Textarea className="pt-8 py-4" value={scannerSecret} />
            </AlertDialogHeader>
            <AlertDialogFooter style={{ justifyContent: "center" }}>
              <AlertDialogAction
                onClick={handleClose}
                style={{ textAlign: "center" }}
              >
                I've saved my secret key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create New Scanner
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
        </div>
      </div>
      <Toaster />
    </>
  );
}
