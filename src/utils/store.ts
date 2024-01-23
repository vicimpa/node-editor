export const store = <T>(init: () => T) => {
  const symbol = Symbol('store');

  return (obj: object & { [symbol]?: T; }) => (
    obj[symbol] ?? (
      obj[symbol] = init()
    )
  );
};