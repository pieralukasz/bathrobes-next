import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    env: {
      NODE_ENV: "test",
    },
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
