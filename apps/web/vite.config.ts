import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const rulesSrc = path.resolve(import.meta.dirname, "../../packages/rules/src");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(import.meta.dirname, "./src") },
      { find: /^#rules\//, replacement: `${rulesSrc}/` },
    ],
  },
});
