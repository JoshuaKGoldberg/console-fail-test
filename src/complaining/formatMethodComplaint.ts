import { MethodCall } from "../spies/spyTypes";
import { formatComplaintCall } from "./formatComplaintCall";

const lineThreshold = 3;

const formatComplaintLineWithIndex = (call: MethodCall, i: number) =>
  `${i}: ${formatComplaintCall(call)}`;

export const formatMethodComplaint = ([methodName, calls]: [keyof Console, MethodCall[]]) => {
  const summary = `  * ${methodName} (${calls.length} call${calls.length === 1 ? "" : "s"})`;

  const lines = calls
    .slice(0, Math.min(calls.length, lineThreshold))
    .map(formatComplaintLineWithIndex);

  if (calls.length > lineThreshold) {
    lines.push(`...${calls.length - lineThreshold} more`);
  }

  return `${summary}\n${lines.map((line) => `    > Call ${line}`).join("\n")}`;
};
