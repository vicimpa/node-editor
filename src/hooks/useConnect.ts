import { useEffect } from "react";

import { connectStore } from "@/decorators/connect";

export const useConnect = <T extends object>(obj: T) => {
  useEffect(() => {
    const disconnect = [...connectStore(obj)].map(e => e(obj));
    return () => { disconnect.forEach(e => e?.()); };
  }, [obj]);
};