import { globIterate } from "glob";
import fs from "node:fs/promises";

for await (const entry of globIterate("lib/cjs/**/*.cjs")) {
	await fs.writeFile(
		entry,
		(await fs.readFile(entry))
			.toString()
			.replaceAll(/require\("(.+)\.js"\);/g, 'require("$1.cjs");'),
	);
}
