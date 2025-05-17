import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useEffect, useState } from "react";

const PrivateRoutes = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verify = async () => {
      if (!isAuthenticated) await checkAuth();
      setLoading(false);
    };
    verify();
  }, [checkAuth, isAuthenticated]);
  if (loading) return <div>Loading </div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;
