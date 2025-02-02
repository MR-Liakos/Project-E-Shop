import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/';


const LOGOUT_URL = `${BASE_URL}logout/`;

const AUTHENTICATED_URL = `${BASE_URL}authenticated/`;

axios.defaults.withCredentials = true; // Ensure cookies are included in all requests



// Logout function
export const logout = async () => {
  try {
    const response = await axios.post(LOGOUT_URL);
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    return null;
  }
};



// Check if user is authenticated
export const authenticated_user = async () => {
  try {
    const response = await axios.get(AUTHENTICATED_URL);
    return response.data;
  } catch (error) {
    console.error("Authentication check failed:", error.response?.data || error.message);
    return null;
  }
};
