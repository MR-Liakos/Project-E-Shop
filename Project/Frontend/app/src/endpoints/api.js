import axios from 'axios';

export const BASE_URL = "https://mrliakos.pythonanywhere.com";
const isLoggedInLocal = localStorage.getItem("loggedIn")
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // Ensures cookies are sent
});
//REQUEST HANDLER
/*
api.interceptors.request.use(
  (config) => {
    const isLoggedIn = localStorage.getItem("loggedIn") 
    
    if (!isLoggedIn) {
      window.location.href = '/LovedAuth';
      return Promise.reject(new Error("User not authenticated"));
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);*/

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 || isLoggedInLocal == false) {
      localStorage.removeItem('loggedIn');
      window.location.href = '/LovedAuth';
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
        //localStorage.setItem('loggedIn', 'true');
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.setItem('loggedIn', 'false');
        window.location.href = '/LovedAuth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
