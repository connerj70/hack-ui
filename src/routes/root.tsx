import { Toaster } from "@/components/ui/toaster"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function Root() {
  return (
    <>
      <Link
        to="/signup"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Sign Up
      </Link>
      <div className="flex flex-col w-100 h-screen justify-center items-center">
        <h1 className="text-4xl font-extrabold">POMERENE</h1>
        <h2 className="text-xl mt-4">A smart network for international trade</h2>
      </div>
      <Toaster />
    </>
  );
}
