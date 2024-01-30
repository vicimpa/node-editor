export const store = <T>(init: () => T, name = 'store') => {
  const symbol = Symbol(name);

  return (obj: object & { [symbol]?: T; }) => (
    obj[symbol] ?? (
      obj[symbol] = init()
    )
  );
};