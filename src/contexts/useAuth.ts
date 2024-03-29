import { useContext } from "react";
import { AuthContext } from "./AuthProvider"; // This import is now valid

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
