import { CftRequest } from "../types.js";

export type SpyFactoryGetter = (request: CftRequest) => SpyFactory | undefined;

/**
 * Creates method spies that abstract the spy library implementation.
 * @param container An object whose method is to be spied on.
 * @param methodName The key of the method to spy on, such as `"log"`.
 */
export type SpyFactory = (container: unknown, methodName: string) => MethodSpy;

/**
 * Record for a single method being spied upon.
 */
export interface MethodSpy {
	/**
	 * @returns For each call to the spy, its arguments.
	 */
	getCalls(): SpyCallArgs[];

	/**
	 * Restores the original method on the container.
	 */
	restore(): void;
}

export type SpyCallArgs = unknown[];
