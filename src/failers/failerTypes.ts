export type Failer = {
    check: () => boolean;
    run: () => void;
};
