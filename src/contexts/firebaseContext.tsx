import { createContext, useContext } from "react";
import { auth } from "../lib/firebase/firebaseConfig"; // Import the auth instance

// Create a context with the Firebase Auth instance
const FirebaseContext = createContext(auth);

// Create a provider component
export const FirebaseProvider = (props: any) => {
  return (
    <FirebaseContext.Provider value={auth}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

// Hook to use Firebase Auth in any component
export const useFirebaseAuth = () => useContext(FirebaseContext);
