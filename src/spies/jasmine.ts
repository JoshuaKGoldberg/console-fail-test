import { SpyCallArgs, SpyFactory, SpyFactoryGetter } from "./spyTypes.js";

declare interface Jasmine {
	createSpy(): Function & any;
}

declare const jasmine: Jasmine | undefined;

const isJasmineModule = (spyLibrary: unknown): spyLibrary is Jasmine => {
	return (
		typeof spyLibrary === "object" &&
		typeof (spyLibrary as Partial<Jasmine>).createSpy === "function"
	);
};

const createJasmineSpyFactory = (spyLibrary: Jasmine): SpyFactory => {
	return (container: any, methodName: string) => {
		const methodCalls: SpyCallArgs[] = [];
		const originalMethod = container[methodName];

		container[methodName] = spyLibrary
			.createSpy()
			.and.callFake(function (this: unknown, ...args: SpyCallArgs) {
				methodCalls.push(args);
				return originalMethod.apply(this, args);
			});

		return {
			getCalls: () => methodCalls,
			restore: () => {
				container[methodName] = originalMethod;
			},
		};
	};
};

export const selectJasmineSpyFactory: SpyFactoryGetter = ({ spyLibrary }) => {
	if (isJasmineModule(spyLibrary)) {
		return createJasmineSpyFactory(spyLibrary);
	}

	if (typeof jasmine !== "undefined" && isJasmineModule(jasmine)) {
		return createJasmineSpyFactory(jasmine);
	}

	return undefined;
};
