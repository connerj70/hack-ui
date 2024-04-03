import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

export function UserNav(props: any) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [solanaBalance, setSolanaBalance] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
   
    const fetchSolanaBalance = async () => {
      try {
        const jwt = await props.user.getIdToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/balance`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Make sure you are sending the necessary authorization token
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (!response.ok) {
          // If the server response wasn't ok, throw an error
          throw new Error("Failed to fetch Solana balance");
        }

        const data = await response.json();
        setSolanaBalance(data.balance);
      } catch (error) {
        console.error("Error fetching Solana balance:", error);
        // Optionally, handle the error, e.g., by showing an error message or setting the balance to null
      }
    };

    if (props.user) {
      fetchSolanaBalance();
    }
  }, [props.user]);

  async function logoutUser() {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("failed to logout", error);
    }
  }

  const handleAirdrop = async () => {
    setSubmitting(true);
    try {
      const jwt = await props.user.getIdToken(); // Adjust according to how you get the JWT
      const res: Response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/airdrop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      ).catch((error) => {
        throw new Error(error);
      });

      console.log("res=", res);

      if (!res.ok) {
        toast({
          title: "Airdrop Failed",
          description: "Try again later",
        });
        return;
      }

      if (res.ok) {
        const sol = await res.json();
        setSolanaBalance(sol.sol + solanaBalance);
      }
    } catch (error) {
      console.error("Error during airdrop:", error);
      toast({
        title: "Airdrop Failed",
        description: "Try again later",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={props.user?.photoURL} alt="avatar" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none break-words">
              {props.user?.email || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground break-words whitespace-normal">
              {props.user?.displayName}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Badge>Sol: {solanaBalance?.toFixed(2).toString()}</Badge>
            <Button
              variant="outline"
              className="ml-2 text-xs"
              onClick={handleAirdrop}
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Airdrop SOL
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logoutUser}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
