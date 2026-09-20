import Lab from "@hapi/lab";
import { cft } from "console-fail-test";

export const lab = Lab.script();

cft({ testFramework: lab });

lab.test("passes when the console is not called", () => {
	// Uncomment this line to make the test fail:
	// console.log("Whoops!");
});
