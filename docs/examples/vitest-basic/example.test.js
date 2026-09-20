import { cft } from "console-fail-test";
import { it } from "vitest";

cft();

it("passes when the console is not called", () => {
	// Uncomment this line to make the test fail:
	// console.log("Whoops!");
});
