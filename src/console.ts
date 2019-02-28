export const consoleMethodNames = (Object.keys(console) as (keyof Console)[])
    .filter((methodName) => !methodName.startsWith("_") && typeof console[methodName] === "function")
    .sort();
