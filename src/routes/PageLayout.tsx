import { Outlet } from "react-router-dom";
import { MainNav } from "@/components/mainNav";

import { UserNav } from "@/components/userNav";
import { useAuth } from "@/contexts/useAuth";

const PageLayout = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <div className="border-b">
        <div className="flex h-16 items-center px-3">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={currentUser} />
          </div>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
      <footer>{/* Footer content */}</footer>
    </div>
  );
};

export default PageLayout;
