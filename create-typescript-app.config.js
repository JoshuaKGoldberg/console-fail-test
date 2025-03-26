import {
	blockCTATransitions,
	blockESLint,
	createConfig,
} from "../create-typescript-app/lib/index.js";

export default createConfig({
	refinements: {
		addons: [
			blockESLint({
				rules: [
					{
						entries: { "n/no-unpublished-import": "off" },
					},
					{
						comment: "TODO: Eventually, it'd be nice to enable these...",
						entries: {
							"@typescript-eslint/ban-types": "off",
							"@typescript-eslint/no-confusing-void-expression": "off",
							"@typescript-eslint/no-empty-object-type": "off",
							"@typescript-eslint/no-explicit-any": "off",
							"@typescript-eslint/no-non-null-assertion": "off",
							"@typescript-eslint/no-redundant-type-constituents": "off",
							"@typescript-eslint/no-unsafe-assignment": "off",
							"@typescript-eslint/no-unsafe-call": "off",
							"@typescript-eslint/no-unsafe-function-type": "off",
							"@typescript-eslint/no-unsafe-member-access": "off",
							"@typescript-eslint/no-unsafe-return": "off",
							"@typescript-eslint/restrict-template-expressions": "off",
							"@typescript-eslint/unbound-method": "off",
						},
					},
					{
						comment:
							"TODO: Eventually, update all guides to ESM (if they support it?",
						entries: {
							"@typescript-eslint/no-require-imports": "off",
						},
					},
				],
			}),
		],
		blocks: {
			add: [blockCTATransitions],
		},
	},
});
