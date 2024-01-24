import { createElement, FC, ReactNode, RefObject } from "react";

import { Vec2 } from "@/library/Vec2";
import { rectCenter } from "@/utils/domrect";
import { minMax } from "@/utils/math";
import { useSignals } from "@preact/signals-react/runtime";

import { NodeLayerPortal, NodeListItem, useNodeMap } from "../NodeEditor";
import s from "./Line.module.sass";

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
    const size = minMax(from.distance(to) / 4, 0, 100);
    const step1 = from.cplus(callA * size, 0);
    const step2 = to.cminus(callB * size, 0);
    const center = from.cplus(to.cminus(from).div(2));

    var path = `M${from} Q${step1} ${center} Q${step2} ${to}`;

    if (step2.equal(to)) {
      path = `M${from} C${step1} ${step2} ${to}`;
    }

    return (
      <>
        <path
          d={path}
          fill="none"
          stroke="#fff"
          strokeWidth={4}
          style={{
            strokeDasharray: '25 10',
            strokeLinecap: 'round'
          }}
          className={s.line} />
        {/* <circle className={s.connect} cx={from.x} cy={from.y} r={5} fill="#fff" />
        <circle className={s.connect} cx={to.x} cy={to.y} r={5} fill="#fff" /> */}

      </>
    );
  }, { key: 'line' })
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
      ), { key: 'post' });
    }, { key: 'pre' })
  );
};

export const Line: FC<LineProps> = ({ from, to }) => (
  <>
    <NodeLayerPortal type="before">
      {
        !to ||
        fromTarget(from, (base) => {
          if (to instanceof Vec2)
            return line(base, to, from.call, 1);

          return (
            fromTarget(to, (end) => (
              line(base, end, from.call, to.call)
            ))
          );
        })
      }
    </NodeLayerPortal>
  </>
);