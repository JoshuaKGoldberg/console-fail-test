import { CftRequest } from "../types";

export type SpyFactoryGetter = (request: CftRequest) => SpyFactory | undefined;

/**
 * Creates method spies that abstract the spy library implementation.
 */
export type SpyFactory = (container: any, methodName: string) => MethodSpy;

/**
 * Record for a single method being spied upon.
 */
export interface MethodSpy {
  /**
   * @returns For each call to the spy, its arguments and stack.
   */
  getCalls(): MethodCall[];

  /**
   * Restores the original method on the container.
   */
  restore(): void;
}

export interface MethodCall {
  args: unknown[];
  stack: string[];
}
