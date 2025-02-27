import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "./api";

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isLoggedInLocal = localStorage.getItem("loggedIn");

      // Check if the user is logged in via localStorage
      if (isLoggedInLocal !== "true") {
        setAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // If loggedIn exists, verify with the backend
      try {
        await api.get(`api/authenticated/`);
        setAuthenticated(true);
      } catch (err) {
        // Handle 401 and other errors
        if (err.response?.status === 401) {
          localStorage.removeItem("loggedIn"); // Clear invalid session
        }
        setAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/LovedAuth" replace />;
};

export default PrivateRoute;