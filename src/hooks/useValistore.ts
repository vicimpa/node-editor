import { useLayoutEffect, useMemo } from "react";
import { BaseSchema } from "valibot";

import { subscribe } from "@/utils/reactive";
import { valistore } from "@/utils/valistore";

import { useRerender } from "./useRerender";

export const useValistore = <T>(
  key: string,
  schema: BaseSchema<T>,
  initial: T
) => {
  const rerender = useRerender();

  const store = useMemo(() => (
    valistore(key, schema, initial)
  ), [key]);

  useLayoutEffect(() => (
    subscribe(store, rerender)
  ), [key]);

  return store;
};