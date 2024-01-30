import { useEffect, useRef } from "react";

export type TDiffFunction<T extends object> = (diff: Partial<T>) => any;

export const useDiff = <T extends object>(obj: T, func: TDiffFunction<T>) => {
  const preview = useRef({} as Partial<T>).current;

  useEffect(() => {
    const diff = Object.entries(obj)
      .reduce((acc, [_key, val]) => {
        const key = _key as keyof T;

        if (val !== preview[key]) {
          preview[key] = val;
          acc[key] = val;
        }

        return acc;
      }, {} as Partial<T>);

    if (Object.keys(diff))
      func(diff);
  });
};