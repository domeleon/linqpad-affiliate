import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // emit relative URLs → works at /, /repo/, or any sub-path
  server: {
    port: 3000,
  },
  build: {
    // Generate external source maps for production builds so they can be used in Chrome DevTools.
    sourcemap: true,
  },
}) 