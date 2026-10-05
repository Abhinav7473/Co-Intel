import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": "/src" },
  },
  server: {
    // The browser only ever talks to nginx on :8088, so HMR must too.
    hmr: { clientPort: 8088 },
    allowedHosts: ["localhost", "127.0.0.1"],
  },
  build: {
    target: "es2023",
    sourcemap: false,
    // Never inline assets as data: URIs — the prod CSP only allows fonts from 'self'.
    assetsInlineLimit: 0,
  },
});
