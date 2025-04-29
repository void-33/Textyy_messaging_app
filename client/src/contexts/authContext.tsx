import { createContext, ReactNode, useContext, useState } from "react";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./accessToken";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: () => void;
  logout: () => void;
  checkAuth: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = () => setIsAuthenticated(true);
  const logout = async () => {
    setIsAuthenticated(false);
    try {
      await axios.get("http://localhost:3500/api/auth/logout", {
        withCredentials: true,
      });
      clearAccessToken();
    } catch (err) {
        console.error("Logout Error:",err);
    }finally{
        clearAccessToken();
        navigate("/login");
    }
  };

  const checkAuth = async () => {
    try {
      //this is redundant when token is saved in memory like here but useful when token in saved in localstorage
      const token = getAccessToken();
      //verify token
      if (token) {
        //verify access token
        const res = await axios.get("/api/auth/verifytoken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setIsAuthenticated(true);
          return;
        }
      }

      //refresh access token
      const res = await axios.get("http://localhost:3500/api/auth/newtoken", {
        withCredentials: true,
      });
      if (res.data.success && res.data.accessToken) {
        setAccessToken(res.data.accessToken);
        setIsAuthenticated(true);
        return;
      }
      setIsAuthenticated(false);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("UseAuth must be used within an AuthProvider");
  return context;
};
