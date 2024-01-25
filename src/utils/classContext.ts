import { createContext, useContext } from "react";

export const classContext = <T, A extends any[]>(
  ClassType: new (...args: A) => T
) => {
  const Context = createContext<T | null>(null);
  const Provider = Context.Provider;
  const use = () => {
    const ctx = useContext(Context);

    if (!(ctx instanceof ClassType))
      throw new Error(`You need provide ${ClassType}`);

    return ctx;
  };

  return [
    Provider,
    use,
    Context
  ] as [
      typeof Provider,
      typeof use,
      typeof Context
    ];
};