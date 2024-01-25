import { FC, RefObject, useLayoutEffect } from "react";

import { Vec2 } from "@/library/Vec2";
import { rectCenter } from "@/utils/domrect";
import { minMax } from "@/utils/math";
import { batch } from "@preact/signals-react";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react/runtime";

import { NodeLayerPortal, NodeListItem, useNodeMap } from "../NodeEditor";

export type Target = {
  parent: NodeListItem;
  point: RefObject<HTMLSpanElement>;
  call?: number;

};

export type LineProps = {
  from: Target;
  to?: Vec2 | Target;
};


const line = (from: Vec2, to: Vec2, callA = 0) => {
  const size = minMax(from.distance(to) / 4, 0, 100);
  const step1 = from.cplus(callA * size, 0);
  const step2 = to.cminus(callA * size, 0);
  const center = from.cplus(to.cminus(from).div(2));

  return `M${from} Q${step1} ${center} Q${step2} ${to}`;
};

export const Line: FC<LineProps> = ({ from, to }) => {
  const { offset } = useNodeMap();
  const path = useSignal('');
  const subTo = useSignal(to);
  const baseCorrect = useSignal<Vec2>(new Vec2());
  const targetCorrect = useSignal<Vec2 | null>(null);
  const pathElement = useComputed(() => (
    <path key="path" d={path.value} strokeWidth={4} fill="none" stroke="#fff" />
  ));

  useSignalEffect(() => {
    batch(() => {
      const { parent, point } = from;
      const { current: span } = point;
      const { x, y, width, height } = parent;
      if (!span) return;

      width.value;
      height.value;
      baseCorrect.value = offset(rectCenter(span)).minus(x, y);
    });
  });

  useSignalEffect(() => {
    batch(() => {
      const { value: to } = subTo;
      if (!to) return;

      if (to instanceof Vec2) {
        targetCorrect.value = new Vec2();
        return;
      }

      const { parent, point } = to;
      const { current: span } = point;
      const { x, y, width, height } = parent;
      if (!span) return;

      width.value;
      height.value;
      targetCorrect.value = offset(rectCenter(span)).minus(x, y);
    });
  });

  useSignalEffect(() => {
    batch(() => {
      const { value: bcorrect } = baseCorrect;
      const { value: tcorrect } = targetCorrect;
      const { value: to } = subTo;
      const { x, y } = from.parent;

      if (!to || !tcorrect) return;

      const base = bcorrect.cplus(x.value, y.value);
      const target = to instanceof Vec2 ? to : tcorrect.plus(to.parent.x.value, to.parent.y.value);
      const newPath = line(base, target, from.call);

      if (path.peek() !== newPath) {
        path.value = newPath;
      }
    });
  });

  useLayoutEffect(() => {
    subTo.value = to;
  }, [to]);

  return (
    !to ||
    (
      <NodeLayerPortal type="before">
        {pathElement}
      </NodeLayerPortal>
    )
  );
};