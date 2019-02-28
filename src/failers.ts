export type Environment = {
    console: Console;
};

export type Failer<TEnvironment extends Environment> = {
    check: (environment: {}) => environment is TEnvironment;
    run: (environment: TEnvironment) => void;
};
