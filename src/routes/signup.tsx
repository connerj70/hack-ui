import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { useUserContext } from "@/contexts/userContext"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  passwordConfirm: z.string().min(8)
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

export default function Signup() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { updateUser } = useUserContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)
    try {
      const userCreateResp = await fetch(`${import.meta.env.VITE_API_URL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        }),
      })

      if (!userCreateResp.ok) {
        toast({
          title: "Error creating account",
          description: "An error occurred while creating your account",
        })
        return
      }

      const userLoginResp = await fetch(`${import.meta.env.VITE_API_URL}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        }),
      })

      if (!userLoginResp.ok) {
        toast({
          title: "Error signing in",
          description: "An error occurred while signing in",
        })
        return
      }

      const userLoginBody = await userLoginResp.json()

      updateUser(userLoginBody.user)
        
      navigate("/dashboard")
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        toast({
          title: "Error creating account",
          description: errorMessage,
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-100 h-screen">
      <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
<<<<<<< Updated upstream
        <Link
          to="/"
          className="absolute left-4 top-4 md:left-8 md:top-8 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
=======
        <Link to="/" className="lg:hidden absolute left-4 top-4 md:left-8 md:top-8 z-10">
          <img src="/white-small.png" alt="Pomerene" className="rounded-full h-10" />
>>>>>>> Stashed changes
        </Link>
        <Link
          to="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link to="/" className="flex items-center justify-center">
              <img src="/yellow-black-small.png" alt="Pomerene" className="rounded-full h-10" />
            </Link>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                A smart network for international trade
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 pt-20">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Confirm</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={submitting} type="submit" className="w-full">
                  { submitting ? 
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    :
                    null
                  }
                  Submit
                </Button>
              </form>
            </Form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
