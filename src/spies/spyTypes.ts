/**
 * Creates method spies that abstract the spy library implementation.
 */
export type SpyFactory = {
    /**
     * @returns Whether this spy factory's library is usable (has been loaded).
     */
    canSpy(): boolean;

    /**
     * Spies on calls to a method on a container by name.
     */
    spyOn(container: any, methodName: string): MethodSpy;
};

/**
 * Record for a single method being spied upon.
 */
export type MethodSpy = {
    /**
     * @returns For each call to the spy, its arguments and stack.
     */
    getCalls(): MethodCall[];

    /**
     * Restores the original method on the container.
     */
    restore(): void;
};

export type MethodCall = {
    args: unknown[];
    stack: string[];
};
