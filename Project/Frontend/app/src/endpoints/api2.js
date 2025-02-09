import axios from 'axios';

export const BASE_URL = "http://127.0.0.1:8000/";

const api2 = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,  // Ensures cookies are sent
});

export default api2;