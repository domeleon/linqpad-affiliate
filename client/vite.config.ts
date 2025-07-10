import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/linqpad-affiliate/',
  server: {
    port: 3000,
  },
  build: {
    // Generate external source maps for production builds so they can be used in Chrome DevTools.
    sourcemap: true,
  },
})) 