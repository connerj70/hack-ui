import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext(null as any);

export const UserProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      console.log("currentUser: ", user)
      setCurrentUser(user);
      setLoading(false);
    })

    return () => unsubscribe();
  }, [])

  return (
    <UserContext.Provider value={{ currentUser, loading }}>
      {!loading && props.children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
