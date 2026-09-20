import { cft } from "console-fail-test";
import nodeTest from "node:test";

cft({ testFramework: nodeTest });

nodeTest("passes when the console is not called", () => {
	// Uncomment this line to make the test fail:
	// console.log("Whoops!");
});
