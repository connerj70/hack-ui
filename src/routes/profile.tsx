import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useUserContext} from "@/contexts/userContext"

export default function Profile() {
  const { currentUser } = useUserContext()

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
              <Label htmlFor="name">Email</Label>
              <Input disabled id="email" placeholder="email" value={currentUser.email}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="publicKey">Public Key</Label>
              <Input disabled id="publicKey" placeholder="publicKey" value={currentUser.displayName}/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>
  </div>
  )
}
