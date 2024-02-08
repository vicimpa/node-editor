import { useEffect, useMemo } from "react";

import { subscribe } from "@/utils/reactive";

import { useRerender } from "./useRerender";

export const useSubEmit = <T extends object>(obj: T) => {
  const rerender = useRerender();
  const unsub = useMemo(() => subscribe(obj, rerender), [obj]);
  return (useEffect(() => unsub, [unsub]), obj);
};