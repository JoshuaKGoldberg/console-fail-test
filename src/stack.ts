export const createStack = () => {
    // tslint:disable-next-line:no-non-null-assertion
    return new Error().stack!.split(/\r\n|\r|\n/g);
};
