/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenRefresher = () => {
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the refresh token from localStorage
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      // If no refresh token exists, redirect to the login/register page
      navigate('/Login');
      return;
    }

    // Call your backend refresh endpoint
    fetch('/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Your backend likely expects a JSON object with a key like "refresh"
      body: JSON.stringify({ refresh: refreshToken })
    })

      .then(data => {
        // Assuming your response returns an object with a new access token
        // Optionally, update the refresh token if your backend sends one
        if (data.access) {
          localStorage.setItem('accessToken', data.access);
          if (data.refresh) {
            localStorage.setItem('refreshToken', data.refresh);
          }
          setAccessToken(data.access);
        }
      })
      .catch(error => {
        console.error('Error refreshing token:', error);
        // On failure, you might redirect to the login page
        navigate('/register');
      });
  }, [navigate]);

  return (
    <div>
      {accessToken ? (
        <p>Access token refreshed and stored.</p>
      ) : (
        <p>Refreshing token...</p>
      )}
    </div>
  );
};

export default TokenRefresher;
*/