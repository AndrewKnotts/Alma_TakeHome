import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // If you want globals (no imports in tests), add:
    // globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
