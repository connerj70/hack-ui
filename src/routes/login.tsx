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
import { useNavigate, Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/contexts/useAuth";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      await login(values.email, values.password);

      navigate("/items");
    } catch (error) {
      console.error(error);
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error logging in",
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-100 h-screen">
      <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          to="/"
          className="lg:hidden absolute left-4 top-4 md:left-8 md:top-8 z-10"
        >
          <img
            src="/white-small.png"
            alt="Pomerene"
            className="rounded-full h-10"
          />
        </Link>
        <Link
          to="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8 hover:bg-green-50"
          )}
        >
          Sign Up
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-green-100" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/white-small.png"
                alt="Pomerene"
                className="rounded-full h-10"
              />
            </Link>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg text-black">A smart network for international trade</p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 pt-20">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={submitting} type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
