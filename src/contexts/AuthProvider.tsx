import { createContext, ReactNode, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase-config"; // Ensure this is correctly pointing to your Firebase configuration

export interface ScannerInfo {
  description: string;
  secretKey: string;
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  selectedScanner: ScannerInfo | null;
  setSelectedScanner: (scanner: ScannerInfo | null) => void;
  location: string;
  setLocation: (location: string) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const SCANNER_STORAGE_KEY = "selectedScanner";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Initialize selectedScanner from localStorage
  const [selectedScanner, setSelectedScanner] = useState<ScannerInfo | null>(
    () => {
      const storedScanner = localStorage.getItem(SCANNER_STORAGE_KEY);
      return storedScanner ? JSON.parse(storedScanner) : null;
    }
  );
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const handleSetSelectedScanner = (scanner: ScannerInfo | null) => {
    setSelectedScanner(scanner);
    localStorage.setItem(SCANNER_STORAGE_KEY, JSON.stringify(scanner));
  };

  const value = {
    currentUser,
    setCurrentUser,
    login,
    logout,
    selectedScanner,
    setSelectedScanner: handleSetSelectedScanner,
    location,
    setLocation,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
