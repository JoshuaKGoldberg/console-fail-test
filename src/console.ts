const isValidMemberName = (methodName: string) => !methodName.startsWith("_") && methodName[0].toLowerCase() === methodName[0];

export const consoleMethodNames = (Object.keys(console) as (keyof Console)[])
    .filter((methodName) => isValidMemberName(methodName) && typeof console[methodName] === "function")
    .sort();
