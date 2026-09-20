import { cft } from "console-fail-test";
import t from "tap";

cft({ testFramework: t });

t.test("passes when the console is not called", (t) => {
	// Uncomment this line to make the test fail:
	// console.log("Whoops!");
	t.end();
});
