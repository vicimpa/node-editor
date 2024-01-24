import { createContext, useContext } from "react";

export const objectContext = <T extends object>(name?: string) => {
  const CTX = createContext<T | null>(null);
  const { Provider } = CTX;
  const useCurrentContext = () => {
    const ctx = useContext(CTX);

    if (!ctx)
      throw new Error(`Using only in ${name ?? 'current'} context`);

    return ctx;
  };

  return [Provider, useCurrentContext, CTX] as [
    typeof Provider,
    typeof useCurrentContext,
    typeof CTX
  ];
}; 