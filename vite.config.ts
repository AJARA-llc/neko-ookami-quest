import { defineConfig } from "vite";

// Fully static, client-only party game. No backend, no env, no analytics.
// Output → dist/ → deploy to Cloudflare Pages (or any static host).
export default defineConfig({
  base: "./",
  build: {
    target: "es2020",
    outDir: "dist",
    assetsInlineLimit: 8192,
  },
});
