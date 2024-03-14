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
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const formSchema = z.object({
  deviceKey: z.string(),
  name: z.string(),
  companyName: z.string(),
  location: z.string(),
  timeStamp: z.string(),
});

export default function CreateDevice() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { deviceKey } = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceKey: deviceKey,
      name: "",
      companyName: "",
      location: "",
      timeStamp: new Date().toISOString(),
    },
  });

  useEffect(() => {
    // Set the current timestamp
    form.setValue("timeStamp", new Date().toISOString());

    // Attempt to get the current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue("location", `Lat: ${latitude}, Long: ${longitude}`);
      },
      (error) => {
        console.error(error);
        toast({
          title: "Location Error",
          description: "Unable to retrieve your location",
        });
      }
    );
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      const user = Cookies.get("user");

      const parsedUser = JSON.parse(user!);

      const metadata: [string, string][] = [
        ["location", values.location],
        ["timeStamp", values.timeStamp],
      ];

      console.log(
        "values: ",
        JSON.stringify({
          mintSecretKey: values.deviceKey,
          name: values.name,
          symbol: values.companyName,
          additionalMetadata: metadata,
        })
      );
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/device/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedUser.stsTokenManager.accessToken}`,
          },
          body: JSON.stringify({
            mintSecretKey: values.deviceKey,
            name: values.name,
            symbol: values.companyName,
            additionalMetadata: metadata,
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
            description: "An error occurred while creating your device",
          });
        }
        return;
      }

      navigate("/devices");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast({
          title: "Error creating device",
          description: errorMessage,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create New Device
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="deviceKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeStamp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Stamp</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
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
