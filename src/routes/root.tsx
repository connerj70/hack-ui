import { Outlet, Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"

export default function Root() {
  return (
    <>
      <div id="detail" className="h-screen">
        <Outlet />
      </div>
      <Toaster />
    </>
  );
}
