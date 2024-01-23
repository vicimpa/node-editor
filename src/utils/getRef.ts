import { ForwardedRef, RefObject } from "react";

export const getRef = <T>(
  ref: (
    never
    | ForwardedRef<T>
    | RefObject<T>
  )
) => {
  if (!ref || ref instanceof Function)
    return null;

  return ref.current;
};