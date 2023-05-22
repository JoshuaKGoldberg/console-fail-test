import { SpyCallArgs, SpyFactory, SpyFactoryGetter } from "./spyTypes.js";

declare interface Jest {
	fn(implementation: Function): void;
}

declare const jest: Jest | undefined;

const isJestModule = (spyLibrary: unknown): spyLibrary is Jest => {
	return (
		typeof spyLibrary === "object" &&
		typeof (spyLibrary as Partial<Jest>).fn === "function"
	);
};

const createJestSpyFactory = (spyLibrary: Jest): SpyFactory => {
	return (container: any, methodName: string) => {
		const methodCalls: SpyCallArgs[] = [];
		const originalMethod = container[methodName];

		const methodSpy = function (this: unknown, ...args: SpyCallArgs) {
			methodCalls.push(args);
			return originalMethod.apply(this, args);
		};

		container[methodName] = spyLibrary.fn(methodSpy);

		return {
			getCalls: () => methodCalls,
			restore: () => {
				container[methodName] = originalMethod;
			},
		};
	};
};

export const selectJestSpyFactory: SpyFactoryGetter = ({ spyLibrary }) => {
	if (isJestModule(spyLibrary)) {
		return createJestSpyFactory(spyLibrary);
	}

	if (typeof jest !== "undefined" && isJestModule(jest)) {
		return createJestSpyFactory(jest);
	}

	return undefined;
};
