import { test } from "@playwright/test";
import { cft } from "console-fail-test";

cft({ testFramework: test });

test("passes when the console is not called", () => {
	// Uncomment this line to make the test fail:
	// console.log("Whoops!");
});
