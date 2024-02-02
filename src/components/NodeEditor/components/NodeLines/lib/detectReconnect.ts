import { Vec2 } from "@/library/Vec2";
import { refSvgEvent } from "@/utils/events";
import { makeDrag } from "@/utils/makeDrag";
import { effect } from "@preact/signals-react";

import { Connect } from "../ConnectList";

export const detectReconnect = (connect: Connect) => (
  effect(() => {
    const { current: line } = connect.ref;
    const { from, to } = connect;

    if (!line) return;

    const drag = makeDrag(({ current }) => {
      current = connect.list.nodemap.offset(current);

      const disFrom = new Vec2(from.position.value).distance(current);
      const disTo = new Vec2(to.position.value).distance(current);
      const need = disFrom < disTo ? from : to;

      return () => {

      };
    });

    return refSvgEvent(connect.ref, 'mousedown', drag);
  })
);