import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";

const PORT = process.env.VITE_DEV_SERVER_PORT
  ? parseInt(process.env.VITE_DEV_SERVER_PORT)
  : undefined;

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [
    react(),
    ...(
      process.env.SENTRY_DISABLED !== "true" && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
        ? [sentryVitePlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
        })] : []
    ),
  ],
  server: {
    host: true,
    port: PORT,
    allowedHosts: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
      plugins: [
        copy({
          hook: "writeBundle",
          targets: [
            { src: "./manifest.json", dest: "./dist/" },
            { src: "./DESCRIPTION.md", dest: "./dist/" },
            { src: "./SETUP.md", dest: "./dist/" },
            { src: "./icon.svg", dest: "./dist/" },
            { src: "./docs", dest: "./dist/" },
          ],
        }),
      ],
    },
  },
});