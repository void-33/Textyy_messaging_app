import { createContext, ReactNode, useContext, useState } from "react";
import { getAccessToken, setAccessToken } from "../utilities/accessToken";
import axios from "axios";

interface AuthContextType {
    isAuthenticated: boolean,
    login: () => void,
    logout: () => void,
    checkAuth:() => void,
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    const checkAuth = async () => {
        try {
            //this is redundant when token is saved in memory like here but useful when token in saved in localstorage
            const token = getAccessToken();
            //verify token
            if (token) {
                //verify access token
                const res = await axios.get('/api/auth/verifytoken', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (res.data.success == true) {
                    setIsAuthenticated(true);
                    return;
                }
            }
            //refresh access token 
            const res = await axios.get('http://localhost:3500/api/auth/newtoken', {
                withCredentials: true,
            });
            setAccessToken(res.data.accessToken);
            if (res.data.success == true) {
                setIsAuthenticated(true);
                return;
            }
            setIsAuthenticated(false);
        } catch (err) {
            setIsAuthenticated(false);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('UseAuth must be used within an AuthProvider');
    return context;
}