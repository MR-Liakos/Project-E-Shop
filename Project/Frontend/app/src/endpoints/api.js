import axios from 'axios';
import Cookies from 'js-cookie';

export const BASE_URL = "http://127.0.0.1:8000/";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,  // Ensures cookies are sent
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 403) {
        // Redirect to login if forbidden
        window.location.href = '/login';
        return Promise.reject(error);
      }
  
      if (error.response && error.response.status === 401) {
        // If the request is already retried, avoid infinite loops
        if (error.config._retry) {
          // Redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
  
        error.config._retry = true;
  
        try {
          // Attempt to refresh the token using the refresh_token cookie
          const refreshResponse = await api.post('token/refresh/');
          const newAccessToken = refreshResponse.data.access;
  
          // Retry the original request with the new access token
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(error.config);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
  
      // For other errors, just reject the promise
      return Promise.reject(error);
    }
  );
  
  export default api;
/*
api.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response && error.response.status === 403) {
            // Clear any stored tokens if needed
            localStorage.removeItem('authTokens');
            // Redirect to login
            window.location.href = '/login';
            return Promise.reject(error);
          }
      // Check for a 401 error response indicating the token might be invalid
      if (error.response && error.response.status === 401) {
        // Retrieve stored auth tokens (assuming you store both access and refresh tokens)
        const storedTokens = localStorage.getItem('authTokens');
        if (!storedTokens) {
          // No token present – redirect to login immediately
          window.location.href = '/login';
          return Promise.reject(error);
        }
        const authTokens = JSON.parse(storedTokens);
  
        // If you already attempted a refresh, avoid infinite loops
        if (error.config._retry) {
          // Token refresh already attempted; clear tokens and redirect
          localStorage.removeItem('authTokens');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        error.config._retry = true;
  
        try {
          // Try refreshing the token using the stored refresh token
          const refreshResponse = await api.post('token/refresh/', { refresh: authTokens.refresh });
          // Save the new tokens
          localStorage.setItem('authTokens', JSON.stringify(refreshResponse.data));
          // Update the original request's Authorization header with the new access token
          error.config.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
          // Retry the original request with the new token
          return api(error.config);
        } catch (refreshError) {
          // Refresh failed: clear stored tokens and redirect to login
          localStorage.removeItem('authTokens');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      // For any other error, just reject it
      return Promise.reject(error);
    }
  );export default api;
  
*/

