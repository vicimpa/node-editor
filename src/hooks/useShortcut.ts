import { useEffect, useLayoutEffect } from "react";
import { Handler } from "shosho";

import { castArray } from "@/utils/castArray";
import { shortcut } from "@/utils/keyboard";

import { useClass } from "./useClass";

export const useShortcut = (type: string | string[], listener: Handler) => {
  const set = useClass(Map<string, () => void>);
  const types = castArray(type);

  useLayoutEffect(() => {
    for (const [type, dispose] of set) {
      if (!types.includes(type))
        set.delete(type) && dispose();
    }

    for (const type of types) {
      if (!set.has(type))
        set.set(type, shortcut(type, listener));
    }
  });

  useEffect(() => (
    set.forEach.bind(set, (u => u()))
  ), []);
};