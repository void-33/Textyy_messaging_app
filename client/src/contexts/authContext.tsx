import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import useAccessTokenStore from "../stores/accessTokenStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToast from "@/components/ui/Toast";
import useCurrUserState from "@/stores/currUserStore";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const getAccessToken = useAccessTokenStore((state) => state.getAccessToken);
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);
  const clearAccessToken = useAccessTokenStore(
    (state) => state.clearAccessToken
  );

  const setUserId = useCurrUserState((state) => state.setUserId);
  const setUsername = useCurrUserState((state) => state.setUsername);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const login = () => setIsAuthenticated(true);
  const logout = useCallback(async () => {
    try {
      await axios.get("http://localhost:3500/api/auth/logout", {
        withCredentials: true,
      });
    } catch (err) {
      if (err instanceof Error) {
        toast(err.message);
      } else {
        toast("An unknown error occurred");
      }
    } finally {
      navigate("/");
      clearAccessToken();
      setIsAuthenticated(false);
    }
  },[clearAccessToken,navigate,toast])

  const checkAuth = useCallback(async (): Promise<void> => {
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
          setUserId(res.data.user.userId);
          setUsername(res.data.user.username);
          return;
        }
      }

      //refresh access token
      const res = await axios.get("http://localhost:3500/api/auth/newtoken", {
        withCredentials: true,
      });
      if (res.data.success && res.data.accessToken) {
        setAccessToken(res.data.accessToken);
        setUserId(res.data.user.userId);
        setUsername(res.data.user.username);
        setIsAuthenticated(true);
        return;
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  }, [getAccessToken, setAccessToken, setUserId, setUsername]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("UseAuth must be used within an AuthProvider");
  return context;
};
