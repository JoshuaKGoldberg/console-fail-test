import { MethodCall } from "../spies/spyTypes";

const formatComplaintLineArg = (arg: unknown) => {
  return JSON.stringify(arg) || JSON.stringify(`${arg}`);
};

export const formatComplaintCall = (call: Pick<MethodCall, "args">) =>
  call.args.map(formatComplaintLineArg).join(", ");
