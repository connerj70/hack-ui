import { Outlet } from 'react-router-dom';
import { MainNav } from '@/components/mainNav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/userNav';
import { useAuth } from '@/contexts/useAuth';

const AuthenticatedLayout = () => {
  const { currentUser } = useAuth();

  console.log("currentUser=", currentUser);

  return (
    <div>
      <div className="border-b">
        <div className="flex h-16 items-center px-3">
          <MainNav  />
          {/* Wrap the Search component with a div and apply responsive display utilities */}
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:block">
              <Search />
            </div>
            <UserNav user={currentUser} />
          </div>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default AuthenticatedLayout;
