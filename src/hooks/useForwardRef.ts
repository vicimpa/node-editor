import { ForwardedRef, RefObject, useRef } from "react";

export const useForwardRef = <T>(ref: ForwardedRef<T>): RefObject<T> => {
  const alternative = useRef<T>();
  return ref as any ?? alternative;
};