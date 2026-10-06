# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: example.spec.js >> passes when the console is not called
- Location: example.spec.js:6:1

# Error details

```
Error: Oh no! Your test called the following console method:
  * log (1 call)
    > Call 0: "Whoops!"
```

# Test source

```ts
  1  | import { TestComplaint } from "../environments/testEnvironmentTypes.js";
  2  | import { SpyCallArgs } from "../spies/spyTypes.js";
  3  | import { formatMethodComplaint } from "./formatMethodComplaint.js";
  4  |
  5  | export const createComplaint = (
  6  | 	methodsWithCalls: [keyof Console, SpyCallArgs[]][],
  7  | ): TestComplaint => {
  8  | 	const methodComplaints = methodsWithCalls
  9  | 		.map(formatMethodComplaint)
  10 | 		.join("\n");
  11 | 	const s = methodsWithCalls.length === 1 ? "" : "s";
  12 |
  13 | 	// It looks like something wrote to the console during your test!
  14 | 	// Put a breakpoint on this line and check the methodsWithCalls variable to see details.
  15 | 	const error = new Error(
  16 | 		`Oh no! Your test called the following console method${s}:\n${methodComplaints}`,
  17 | 	);
  18 |
  19 | 	return {
> 20 | 		error,
     |   ^ Error: Oh no! Your test called the following console method:
  21 | 		methodComplaints: methodsWithCalls.map(([methodName, methodCalls]) => ({
  22 | 			methodCalls,
  23 | 			methodName,
  24 | 		})),
  25 | 	};
  26 | };
  27 |
```
