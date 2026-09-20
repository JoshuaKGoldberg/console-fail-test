import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			exclude: ["lib"],
			include: ["src"],
			reporter: ["html", "lcov"],
		},
		exclude: ["docs/examples", "lib", "node_modules"],
	},
});
