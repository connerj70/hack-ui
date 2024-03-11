import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie"

const UserContext = createContext(null as any);

export const UserProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = Cookies.get('user')
    return user ? JSON.parse(user) : null;
  });

  const updateUser = (newUserData: any) => {
    Cookies.set('user', JSON.stringify(newUserData), { expires: 7 })
    setCurrentUser(newUserData); // Update state
  }

  const clearUser = () => {
    Cookies.remove('user')
    setCurrentUser(null)
  }

  return (
    <UserContext.Provider value={{ currentUser, updateUser, clearUser }}>
      { props.children }
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
