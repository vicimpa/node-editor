import { useMemo } from "react";

export const useClass = <T, A extends any[]>(
  classType: new (...args: A) => T,
  ...args: A
) => (
  useMemo(() => (
    new classType(...args)
  ), [...args])
);