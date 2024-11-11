import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const location = useLocation();
  

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link to="/" className="flex items-center ">
        <img
          src="/white-small.png"
          alt="Pomerene"
          className="rounded-full h-10"
        />
      </Link>
      <Link
        to="/items"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === "/items"
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        Items
      </Link>
      <Link
        to="/scanners"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === "/scanners"
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        Scanners
      </Link>

      <Link
        to="/events"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === "/events"
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        Events
      </Link>

      <Link
        to="/scan"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === "/qr-scanner"
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        QR-Scan
      </Link>
    </nav>
  );
}
