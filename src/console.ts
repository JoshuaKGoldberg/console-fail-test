export const consoleMethodNames = (Object.keys(console) as (keyof Console)[]).filter(
    (methodName) => typeof console[methodName] === "function",
);
