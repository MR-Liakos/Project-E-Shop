import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <GoogleOAuthProvider clientId="65488665454-2lhcof6drcr2iahmlb6iklhfhfi0kgtg.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </HashRouter>
  </StrictMode>
)
