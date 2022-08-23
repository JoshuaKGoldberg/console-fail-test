import { TestComplaint } from "./environments/testEnvironmentTypes";
import { MethodCall } from "./spies/spyTypes";

const lineThreshold = 3;

const formatMethodComplaint = ([methodName, calls]: [keyof Console, MethodCall[]]) => {
  const summary = `  * ${methodName} (${calls.length} call${calls.length === 1 ? "" : "s"})`;

  const lines = calls
    .slice(0, Math.min(calls.length, lineThreshold))
    .map(formatComplaintLineWithIndex);

  if (calls.length > lineThreshold) {
    lines.push(`...${calls.length - lineThreshold} more`);
  }

  return `${summary}\n${lines.map((line) => `    > Call ${line}`).join("\n")}`;
};

export const formatComplaintLineWithIndex = (call: MethodCall, i: number) =>
  `${i}: ${formatComplaintCall(call)}`;

export const formatComplaintCall = (call: MethodCall) =>
  call.args.map(formatComplaintLineArg).join(", ");

export const formatComplaintLineArg = (arg: unknown) => {
  const text = JSON.stringify(arg) || JSON.stringify(`${arg}`);
  const endlineMatch = text.match(/\n|(\\n)/);

  return endlineMatch === null ? text : `${text.substring(0, endlineMatch.index)}...`;
};

export const createComplaint = (
  methodsWithCalls: [keyof Console, MethodCall[]][],
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
      methodName,
      methodCalls,
    })),
  };
};
