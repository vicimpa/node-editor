import { windowEvent } from "@/utils/events";
import { effect } from "@preact/signals-react";

import { NodeLinesCtx } from "../";

export const detectMouseUp = (lines: NodeLinesCtx) => (
  effect(() => {
    const { value: active } = lines.active;
    if (!active) return;

    return windowEvent('mouseup', () => {
      lines.active.value = null;
      lines.mouse.value = null;
    });
  })
);