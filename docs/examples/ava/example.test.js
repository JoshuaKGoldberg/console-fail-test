import test from "ava";
import { cft } from "console-fail-test";

cft({ testFramework: test });

test("passes when the console is not called", (t) => {
	// Uncomment this line to make the test fail:
	// console.log("Whoops!");
	t.pass();
});
