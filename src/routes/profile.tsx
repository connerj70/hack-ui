import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/useAuth";

export default function Profile() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // You can render something else or return null
    return <div>Loading user data...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Profile Info</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled
                  id="email"
                  placeholder="email"
                  value={currentUser.email || "No email"}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="publicKey">Public Key</Label>
                <Input
                  disabled
                  id="publicKey"
                  placeholder="publicKey"
                  value={currentUser.displayName || "No display name"}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
}
