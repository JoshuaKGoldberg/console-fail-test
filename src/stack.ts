export const createStack = () => {
  return new Error().stack!.split(/\r\n|\r|\n/g);
};
