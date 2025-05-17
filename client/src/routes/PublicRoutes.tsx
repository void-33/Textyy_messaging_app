import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useState } from "react";

const PublicRoute = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setLoading(false);
    };
    verify();
  }, [checkAuth]);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Navigate to="/chats" replace /> : <Outlet />;
};

export default PublicRoute;
