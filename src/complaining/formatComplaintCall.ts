import { SpyCallArgs } from "../spies/spyTypes";

const formatComplaintLineArg = (arg: unknown) => {
  return JSON.stringify(arg) || JSON.stringify(`${arg}`);
};

export const formatComplaintCall = (call: SpyCallArgs) =>
  call.map(formatComplaintLineArg).join(", ");
