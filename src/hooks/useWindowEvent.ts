import { useLayoutEffect } from "react";
import { TListener, WEM, windowEvent } from "~/utils/events";

import { useEvent } from "./useEvent";

export const useWindowEvent = <K extends keyof WEM>(
  key: K | K[],
  _listener: TListener<WEM[K]>
) => {
  const listener = useEvent(_listener);

  useLayoutEffect(() => (
    windowEvent(key, listener)
  ), []);
};