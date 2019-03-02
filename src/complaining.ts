import { MethodCall } from "./spies/spyTypes";

const lineThreshold = 3;

const formatMethodComplaint = ([methodName, calls]: [keyof Console, MethodCall[]]) => {
    const summary = `* ${methodName} (${calls.length} call${calls.length === 1 ? "" : "s"})`;

    const lines = calls.slice(0, Math.min(calls.length, lineThreshold)).map(formatLine);

    if (calls.length > lineThreshold) {
        lines.push(`...${calls.length - lineThreshold} more`);
    }

    return `${summary}\n${lines.map((line) => `  > Call ${line}`).join("\n")}`;
};

const formatLine = (call: MethodCall, i: number) => `${i}: ${call.args.map(formatArg)}`;

const formatArg = (arg: unknown) => {
    const text = JSON.stringify(arg);
    const endlineMatch = text.match(/\n|(\\n)/);

    return endlineMatch === null ? text : `${text.substring(0, endlineMatch.index)}...`;
};

export const createComplaint = (methodsWithCalls: [keyof Console, MethodCall[]][]) => {
    const methodComplaints = methodsWithCalls.map(formatMethodComplaint).join("\n");
    const s = methodsWithCalls.length === 1 ? "" : "s";

    // It looks like something wrote to the console during your test!
    // Put a breakpoint on this line and check the methodsWithCalls variable to see details.
    return new Error(`Oh no! Your test called the following console method${s}:\n${methodComplaints}`);
};
