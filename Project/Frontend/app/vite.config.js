import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/~georrets/Eshop/', // Προσθέτει αυτό το base path σε ΟΛΑ τα assets
  server: {
    port: 5173 // Προαιρετικό
  }
})