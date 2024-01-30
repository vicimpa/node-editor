import { useEffect } from "react";

export const useAdd = <T>(set: Set<T>, value: T, deps: any[] = []) => (
  useEffect(() => (
    set.add(value),
    () => { set.delete(value); }
  ), deps),
  value
);