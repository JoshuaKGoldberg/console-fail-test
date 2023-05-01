import { SpyCallArgs, SpyFactory, SpyFactoryGetter } from "./spyTypes";

declare interface Vitest {
  vi: {
    spyOn(container: unknown, methodName: string): ViSpy;
  };
}

declare interface ViSpy {
  mock: ViSpyMock;
  mockRestore(): void;
}

declare interface ViSpyMock {
  calls: SpyCallArgs[];
}

declare const __vitest_index__: Vitest | undefined;

const isVitestModule = (spyLibrary: unknown): spyLibrary is Vitest => {
  return (
    typeof spyLibrary === "object" &&
    !!(spyLibrary as Partial<Vitest>).vi &&
    typeof (spyLibrary as Vitest).vi.spyOn === "function"
  );
};

const createVitestSpyFactory = (spyLibrary: Vitest): SpyFactory => {
  return (container: any, methodName: string) => {
    const spy = spyLibrary.vi.spyOn(container, methodName);

    return {
      getCalls: () => spy.mock.calls,
      restore: spy.mock.restore,
    };
  };
};

export const selectVitestSpyFactory: SpyFactoryGetter = ({ spyLibrary }) => {
  if (isVitestModule(spyLibrary)) {
    return createVitestSpyFactory(spyLibrary);
  }

  if (typeof __vitest_index__ !== "undefined" && isVitestModule(__vitest_index__)) {
    return createVitestSpyFactory(__vitest_index__);
  }

  return undefined;
};
