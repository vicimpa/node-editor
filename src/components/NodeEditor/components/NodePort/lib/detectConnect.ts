import { dispose } from "@/utils/dispose";
import { refEvent } from "@/utils/events";
import { effect } from "@preact/signals-react";

import { NodePortCtx } from "../";

export const detectConnect = (port: NodePortCtx) => (
  effect(() => {
    if (!port.ref.current)
      return;

    return dispose([
      refEvent(port.ref, 'mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        port.lines.from(port);
      }),
      refEvent(port.ref, 'mouseup', () => {
        port.lines.to(port);
      })
    ]);
  })
);