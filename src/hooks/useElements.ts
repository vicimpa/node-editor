import { useEffect, useMemo } from "react";

type HM = HTMLElementTagNameMap;

export const useElement = <T extends keyof HM>(type: T, init?: (e: HM[T]) => void | (() => void)) => {
  const element = useMemo(() => (
    document.createElement(type)
  ), [type]);

  useEffect(() => (
    init?.(element)
  ), [element]);

  return element;
};