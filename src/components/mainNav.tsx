import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const location = useLocation()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        to="/dashboard"
        className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}
      >
        Dashboard 
      </Link>
      <Link
        to="/devices"
        className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/devices" ? "text-primary" : "text-muted-foreground"}`}
      >
        Devices
      </Link>
    </nav>
  )
}
