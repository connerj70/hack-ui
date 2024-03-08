import { redirect } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig"

// Function to check if the user is authenticated
export function requireAuth(props: any) {
  const user = auth.currentUser;

  console.log("user: ", user)

  if (!user) {
    return redirect("/signup");
  }

  return { loader: props.loader, action: props.action };
}

