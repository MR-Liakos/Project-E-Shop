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
      const originalRequest = error.config;
      
      if (error.response?.status === 403) {
          window.location.href = '/login';
          return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
              // Use the api instance here to maintain withCredentials
              const refreshResponse = await api.post('api/token/refresh/');
              const newAccessToken = refreshResponse.data.access;
              
              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return api(originalRequest);
          } catch (refreshError) {
              window.location.href = '/login';
              return Promise.reject(refreshError);
          }
      }

      return Promise.reject(error);
  }
);

export default api;




//OLD NOTES FOR GAY RETS
/*
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
          const refreshResponse = await axios.post('http://127.0.0.1:8000/api/token/refresh/');
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
  
  export default api;*/
