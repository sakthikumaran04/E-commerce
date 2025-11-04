import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(null); // null = loading state

  const checkAuth = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/check-auth", { withCredentials: true });
      setIsLogged(true);
    } catch {
      setIsLogged(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
