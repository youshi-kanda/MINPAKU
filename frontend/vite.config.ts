import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "minpaku-sales-app-tunnel-kbyvi943.devinapps.com",
      "minpaku-sales-app-tunnel-wu1zkdnr.devinapps.com",
      "minpaku-sales-app-tunnel-3ekpusjf.devinapps.com",
      "minpaku-sales-app-tunnel-v00h1col.devinapps.com",
      "minpaku-sales-app-tunnel-xqe71psj.devinapps.com",
      "localhost",
    ],
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})

