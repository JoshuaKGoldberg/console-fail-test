import { SpyCallArgs, SpyFactory, SpyFactoryGetter } from "./spyTypes.js";

declare interface Sinon {
	spy(callback: Function): SinonSpy;
}

type SinonSpy = Function & {
	getCalls(): SpyCallArgs[];
	restore(): void;
};

declare const sinon: Sinon | undefined;

const isSinonModule = (spyLibrary: unknown): spyLibrary is Sinon => {
	return (
		typeof spyLibrary === "object" &&
		typeof (spyLibrary as Partial<Sinon>).spy === "function"
	);
};

const createSinonSpyFactory = (spyLibrary: Sinon): SpyFactory => {
	return (container: any, methodName: string) => {
		const methodCalls: SpyCallArgs[] = [];
		const originalMethod = container[methodName];

		const spyMethod = spyLibrary.spy(function (
			this: unknown,
			...args: SpyCallArgs
		) {
			methodCalls.push(args);
			return originalMethod.apply(this, args);
		});

		container[methodName] = spyMethod;

		return {
			getCalls: () => methodCalls,
			restore() {
				container[methodName] = originalMethod;
			},
		};
	};
};

export const selectSinonSpyFactory: SpyFactoryGetter = ({ spyLibrary }) => {
	if (isSinonModule(spyLibrary)) {
		return createSinonSpyFactory(spyLibrary);
	}

	if (typeof sinon !== "undefined" && isSinonModule(sinon)) {
		return createSinonSpyFactory(sinon);
	}

	return undefined;
};
