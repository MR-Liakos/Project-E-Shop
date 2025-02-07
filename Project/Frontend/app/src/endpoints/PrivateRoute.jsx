import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Try to get the access token from localStorage
      let accessToken = localStorage.getItem('accessToken');
      
      // If no access token exists, attempt to refresh it using the refresh token
      if (!accessToken) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const response = await fetch('/token/refresh/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh: refreshToken }),
            });
            if (!response.ok) {
              throw new Error('Refresh token failed');
            }
            const data = await response.json();
            if (data.access) {
              // Save new tokens into localStorage
              localStorage.setItem('accessToken', data.access);
              if (data.refresh) {
                localStorage.setItem('refreshToken', data.refresh);
              }
              accessToken = data.access;
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
          }
        }
      }
      
      // Simple check: if accessToken exists, consider the user authenticated.
      // (In a real-world app you might decode the token and verify its expiry.)
      setAuthenticated(!!accessToken);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
