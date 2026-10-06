const { createTestCafeHooks } = require("console-fail-test");

module.exports = {
	hooks: {
		test: createTestCafeHooks(),
	},
};
