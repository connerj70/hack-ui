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
  password: z.string()
})

export default function Login() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { updateUser } = useUserContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)
    try {
      console.log("values: ", values)
      console.log("test", process.env.VITE_API_URL)

      const resp = await fetch(`${process.env.VITE_API_URL}/api/v1/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        }),
      })

      if (!resp.ok) {
        toast({
          title: "Error signing in",
          description: "An error occurred while signing in",
        })
        return
      }

      const body = await resp.json()

      updateUser(body.user)
       
      navigate("/dashboard")
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        toast({
          title: "Error logging in",
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
        <Link
          to="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Sign Up
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link to="/" className="flex items-center justify-center">
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
              Pomerene
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
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login
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
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
