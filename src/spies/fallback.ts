import { SpyCallArgs, SpyFactory } from "./spyTypes.js";

export const selectFallbackSpyFactory =
	(): SpyFactory => (container: any, methodName: string) => {
		const methodCalls: SpyCallArgs[] = [];
		const originalMethod = container[methodName];

		const spyMethod = function (this: unknown, ...args: SpyCallArgs) {
			methodCalls.push(args);

			return originalMethod.apply(this, args);
		};

		spyMethod.getCalls = () => methodCalls;

		spyMethod.restore = () => {
			container[methodName] = originalMethod;
		};

		container[methodName] = spyMethod;

		return spyMethod;
	};
