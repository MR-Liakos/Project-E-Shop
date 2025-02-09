import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
/*
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
  
    const checkAuth = async () => {
      // Try to get access token from cookies
      let accessToken = getCookie('access_token');
      
      // If no access token exists, attempt to refresh using refresh token cookie
      if (!accessToken) {
        const refreshToken = getCookie('refresh_token');
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
              // Set new tokens in cookies with security attributes
              document.cookie = `access_token=${data.access}; path=/; Secure; SameSite=Strict; max-age=${60 * 60}`; // 1 hour
              if (data.refresh) {
                document.cookie = `refresh_token=${data.refresh}; path=/; Secure; SameSite=Strict; max-age=${60 * 60 * 24 * 7}`; // 1 week
              }
              accessToken = data.access;
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
            // Clear invalid tokens
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }
        }
      }
      
      // Set authentication state based on access token presence
      setAuthenticated(!!accessToken);
      setLoading(false);
    };
  
    checkAuth();
  }, []);*/

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
