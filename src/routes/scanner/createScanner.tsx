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
import Cookies from "js-cookie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  description: z.string(),
});

export default function CreateScanner() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scannerSecret, setScannerSecret] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      const user = Cookies.get("user");

      const parsedUser = JSON.parse(user!);

      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/scanner/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedUser.stsTokenManager.accessToken}`,
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
            title: "Error creating device",
            description: "An error occurred while creating your scanner",
          });
        }
        return;
      }

      const respBody = await resp.json();

      console.log("respBody: ", respBody);

      setScannerSecret(respBody.scanner.scannerSecret);
      setOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast({
          title: "Error creating scanner",
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
      <div className="lg:p-8 p-4">
        <AlertDialog open={open}>
          <AlertDialogContent style={{ textAlign: "center" }}>
            {" "}
            {/* Center text and possibly content */}
            <AlertDialogHeader>
              <AlertDialogTitle style={{ textAlign: "center" }}>
                Scanner secret
              </AlertDialogTitle>
              <AlertDialogDescription
                className="text-wrap"
                style={{ textAlign: "center" }}
              >
                Save your scanner secret key
                <div
                  style={{
                    display: "inline-block",
                    fontWeight: "bold",
                    marginTop: "8px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {scannerSecret && scannerSecret.match(/.{1,40}/g)?.join("\n")}
                </div>
              </AlertDialogDescription>
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
