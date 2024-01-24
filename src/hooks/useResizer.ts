import { RefObject, useEffect, useMemo } from "react";

import { resizer } from "@/utils/resizer";
import { batch, useSignal } from "@preact/signals-react";

export const useResizer = <T extends Element>(ref: RefObject<T>, offset = false) => {
  const width = useSignal(0);
  const height = useSignal(0);

  useEffect(() => (
    ref.current ? resizer(ref.current, (
      ({ contentRect, target }) => {
        batch(() => {
          width.value = contentRect.width;
          height.value = contentRect.height;

          if (offset && target instanceof HTMLElement) {
            width.value = target.offsetWidth;
            height.value = target.offsetHeight;
          }
        });
      }
    )) : undefined
  ));

  return useMemo(() => ({
    get width() {
      return width.value;
    },
    peekWidth() {
      return width.peek();
    },
    get height() {
      return height.value;
    },
    peekHeight() {
      return height.peek();
    },
  }), []);
};