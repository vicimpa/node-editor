export const dispose = (array: Array<(() => void) | void>) => {
  return () => {
    array.forEach(u => u?.());
  };
};