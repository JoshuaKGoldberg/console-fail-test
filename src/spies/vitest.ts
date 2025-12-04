import { SpyCallArgs, SpyFactory, SpyFactoryGetter } from "./spyTypes.js";

declare interface ViSpy {
	(...args: unknown[]): unknown;
	mock: ViSpyMock;
	mockRestore(): void;
}

declare interface ViSpyMock {
	calls: SpyCallArgs[];
}

declare interface Vitest {
	vi: {
		fn(): ViSpy;
		spyOn(container: unknown, methodName: string): ViSpy;
	};
}

declare const __vitest_index__: undefined | Vitest;

const isVitestModule = (spyLibrary: unknown): spyLibrary is Vitest => {
	return (
		typeof spyLibrary === "object" &&
		!!(spyLibrary as Partial<Vitest>).vi &&
		typeof (spyLibrary as Vitest).vi.spyOn === "function"
	);
};

const createVitestSpyFactory = (spyLibrary: Vitest): SpyFactory => {
	return (container: any, methodName: string) => {
		const originalMethod = container[methodName];
		const spy = spyLibrary.vi.fn();
		container[methodName] = (...args: unknown[]) => spy(...args);

		return {
			getCalls: () => spy.mock.calls,
			restore: () => {
				container[methodName] = originalMethod;
			},
		};
	};
};

export const selectVitestSpyFactory: SpyFactoryGetter = ({ spyLibrary }) => {
	if (isVitestModule(spyLibrary)) {
		return createVitestSpyFactory(spyLibrary);
	}

	if (
		typeof __vitest_index__ !== "undefined" &&
		isVitestModule(__vitest_index__)
	) {
		return createVitestSpyFactory(__vitest_index__);
	}

	return undefined;
};
