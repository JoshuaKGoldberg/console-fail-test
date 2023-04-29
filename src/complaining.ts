import { TestComplaint } from "./environments/testEnvironmentTypes";
import { SpyCallArgs } from "./spies/spyTypes";

const lineThreshold = 3;

const formatMethodComplaint = ([methodName, calls]: [keyof Console, SpyCallArgs[]]) => {
  const summary = `  * ${methodName} (${calls.length} call${calls.length === 1 ? "" : "s"})`;

  const lines = calls
    .slice(0, Math.min(calls.length, lineThreshold))
    .map(formatComplaintLineWithIndex);

  if (calls.length > lineThreshold) {
    lines.push(`...${calls.length - lineThreshold} more`);
  }

  return `${summary}\n${lines.map((line) => `    > Call ${line}`).join("\n")}`;
};

export const formatComplaintLineWithIndex = (call: SpyCallArgs, i: number) =>
  `${i}: ${formatComplaintCall(call)}`;

export const formatComplaintCall = (call: SpyCallArgs) =>
  call.map(formatComplaintLineArg).join(", ");

export const formatComplaintLineArg = (arg: unknown) => {
  return JSON.stringify(arg) || JSON.stringify(`${arg}`);
};

export const createComplaint = (
  methodsWithCalls: [keyof Console, SpyCallArgs[]][],
): TestComplaint => {
  const methodComplaints = methodsWithCalls.map(formatMethodComplaint).join("\n");
  const s = methodsWithCalls.length === 1 ? "" : "s";

  // It looks like something wrote to the console during your test!
  // Put a breakpoint on this line and check the methodsWithCalls variable to see details.
  const error = new Error(
    `Oh no! Your test called the following console method${s}:\n${methodComplaints}`,
  );

  return {
    error,
    methodComplaints: methodsWithCalls.map(([methodName, methodCalls]) => ({
      methodCalls,
      methodName,
    })),
  };
};
