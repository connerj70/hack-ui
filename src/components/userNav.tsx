import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { User } from "firebase/auth";

interface UserNavProps {
  user: User | null;
}

export const UserNav: React.FC<UserNavProps> = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [suiBalance, setSuiBalance] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSolanaBalance = async () => {
      try {
        if (!user) {
          return;
        }
        const jwt = await user.getIdToken();
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

        console.log("DATA ", data);
        setSuiBalance(data.balance);
      } catch (error) {
        console.error("Error fetching Solana balance:", error);
        // Optionally, handle the error, e.g., by showing an error message or setting the balance to null
      }
    };

    if (user) {
      fetchSolanaBalance();
    }
  }, [user]);

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
      if (!user) {
        return;
      }
      const jwt = await user.getIdToken(); // Adjust according to how you get the JWT
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

      if (!res.ok) {
        toast({
          title: "Airdrop Failed",
          description: "Try again later",
        });
        return;
      }

      if (res.ok) {
        const sol = await res.json();
        setSuiBalance(sol.sol + suiBalance);
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
            <AvatarImage src={user?.photoURL || ""} alt="avatar" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none break-words">
              {user?.email || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground break-words whitespace-normal">
              {user?.displayName}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Badge>Sui: {suiBalance?.toFixed(2).toString()}</Badge>
            <Button
              variant="outline"
              className="ml-2 text-xs"
              onClick={handleAirdrop}
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Airdrop Sui
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logoutUser}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
