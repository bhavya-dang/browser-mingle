import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      disableAutoLaunch: false,
      additionalInputs: ["index.html"],
    }),
  ],
});
