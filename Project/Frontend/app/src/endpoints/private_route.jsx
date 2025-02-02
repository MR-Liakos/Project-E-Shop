import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a loading screen while checking authentication
  if (loading) {
    return (
      <div>

      </div>
    );
  }

  // Redirect to login if the user is not authenticated
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
