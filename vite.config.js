import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative, which is what GitHub Pages needs
// when the site is served from https://<user>.github.io/<repo>/.
// Routing uses HashRouter so no server-side rewrites are required.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port: 5173,
    open: true,
  },
})
