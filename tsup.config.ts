import { defineConfig } from "tsup";

const configEntryBase = {
	bundle: false,
	clean: true,
	dts: true,
	entry: ["src/**/*.ts", "!src/**/*.test.*"],
	sourcemap: true,
};

export default defineConfig([
	{
		...configEntryBase,
		format: "cjs",
		outDir: "lib/cjs",
		outExtension: () => ({ dts: ".d.ts", js: ".cjs" }),
	},
	{
		...configEntryBase,
		format: "esm",
		outDir: "lib/esm",
	},
]);
