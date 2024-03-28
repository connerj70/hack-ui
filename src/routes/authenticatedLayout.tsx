import { Outlet } from 'react-router-dom';
import { MainNav } from '@/components/mainNav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/userNav';
import { useAuth } from '@/contexts/useAuth';


const AuthenticatedLayout = () => {
  
  const { currentUser } = useAuth()

  return (
    <div>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav user={currentUser} />
          </div>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
      <footer>

      </footer>
    </div>
  );
};

export default AuthenticatedLayout;
