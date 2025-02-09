import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "./api";

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await api.get(`api/authenticated/`);
        setAuthenticated(true);
        console.log(response.data);

      } catch (err) {
        if (error.response?.status === 401) {
          // Let the interceptor handle login redirect
          return;
        }
        console.error("Authentication check failed:", err.message);
        setAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    // Return a loading spinner or placeholder while checking auth status
    return <div>Loading...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

