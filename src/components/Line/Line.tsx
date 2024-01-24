import { createElement, FC, ReactNode, RefObject } from "react";

import { Vec2 } from "@/library/Vec2";
import { rectCenter } from "@/utils/domrect";
import { abs, minMax } from "@/utils/math";
import { useSignals } from "@preact/signals-react/runtime";

import { NodeListItem, useNodeMap } from "../NodeEditor";

export type Target = {
  parent: NodeListItem;
  point: RefObject<HTMLSpanElement>;
  call?: number;

};

export type LineProps = {
  from: Target;
  to?: Vec2 | Target;
};


const line = (from: Vec2, to: Vec2, callA = 0, callB = 0) => (
  createElement(() => {
    const size = minMax(abs(from.y - to.y) / 2, 0, 500);
    const step1 = from.cplus(callA * size, 0);
    const step2 = to.cminus(callB * size, 0);

    return (
      <path
        d={`M${from} C${step1}, ${step2}, ${to}`}
        fill="none"
        stroke="#fff"
        strokeWidth={4} />
    );
  })
);

const fromTarget = (target: Target, calc: (v: Vec2) => ReactNode) => {
  const { offset } = useNodeMap();

  return (
    createElement(() => {
      useSignals();
      const { parent, point } = target;
      const { current: span } = point;
      const { x, y, width, height } = parent;
      if (!span) return null;

      width.value;
      height.value;

      const correct = offset(rectCenter(span)).minus(x, y);

      return createElement(() => (
        useSignals(),
        calc(correct.cplus(x.value, y.value))
      ));
    })
  );
};

export const Line: FC<LineProps> = ({ from, to }) => (
  !to ||
  fromTarget(from, (base) => {
    if (to instanceof Vec2)
      return line(base, to, from.call, 1);

    return (
      fromTarget(to, (end) => line(base, end, from.call, to.call))
    );
  })
);