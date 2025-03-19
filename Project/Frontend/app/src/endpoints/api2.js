import axios from 'axios';

export const BASE_URL = "https://mrliakos.pythonanywhere.com/";

const api2 = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,  // Ensures cookies are sent
});

export default api2;