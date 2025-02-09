import axios from 'axios';

export const BASE_URL = "http://127.0.0.1:8000/";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,  // Ensures cookies are sent
});

// Attach token to each request
api.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response.status === 401) {
            try {
                const refreshToken = JSON.parse(localStorage.getItem('authTokens')).refresh;
                const refreshResponse = await api.post('token/refresh/', { refresh: refreshToken });

                localStorage.setItem('authTokens', JSON.stringify(refreshResponse.data));
                error.config.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
                return api(error.config);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                localStorage.removeItem('authTokens');
                window.location.href = "/login"; // Redirect to login
            }
        }
        return Promise.reject(error);
    }
);  export default api;
