import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    exclude: ["lib", "node_modules", "src/**/*.js", "src/*/*.js"],
  },
});
