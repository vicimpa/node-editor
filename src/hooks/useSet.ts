import { useEffect } from "react";

export const useSet = <K, V>(map: Map<K, V>, key: K, value: V, deps: any[] = []) => {
  useEffect(() => (
    map.set(key, value),
    () => { map.delete(key); }
  ), deps);

  return value;
};