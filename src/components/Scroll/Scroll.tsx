import { MouseEvent, useCallback } from "react";

import { NodeHudWrapper } from "@/components/NodeEditor/components/NodeHud/NodeHudWrapper.tsx";
import { useDrag } from "@/hooks/useDrag";
import { Vec2 } from "@/library/Vec2";
import { rectCenter } from "@/utils/domrect.ts";
import { looper } from "@/utils/looper.ts";
import { computed, ReadonlySignal, useComputed } from "@preact/signals-react";

import { Debug } from "../Debug";
import { useNodeList, useNodeMap } from "../NodeEditor";
import s from "./Scroll.module.sass";

export const Scroll = () => {
  const list = useNodeList();

  const sizes = useComputed(() => {
    const { value: rect } = list.rect;
    const viewRect = list.map.rect.value;
    const viewSize = Vec2.fromSize(viewRect);
    const biggerSize = Vec2.fromSize(rect).plus(rect)
      .minus(viewSize.cplus(viewRect)).cropMin(0);
    const lowerSize = new Vec2(viewRect).minus(rect).cropMin(0);
    const summ = viewSize.cplus(biggerSize).plus(lowerSize);

    viewSize.div(summ).times(100);
    lowerSize.div(summ).times(100);
    biggerSize.div(summ).times(100);

    return {
      viewSize,
      lowerSize,
      biggerSize,
    };
  });

  return (
    <>
      <NodeHudWrapper>
        <ScrollLines sizes={sizes} />
      </NodeHudWrapper>

      <Debug title="Scroll">
        {{
          lowX: <>{computed(() => sizes.value.lowerSize.x.toFixed(2))}%</>,
          lowY: <>{computed(() => sizes.value.lowerSize.y.toFixed(2))}%</>,
          bigX: <>{computed(() => sizes.value.biggerSize.x.toFixed(2))}%</>,
          bigY: <>{computed(() => sizes.value.biggerSize.y.toFixed(2))}%</>,
        }}
      </Debug>
    </>
  );
};

type ScrollProps = {
  sizes: ReadonlySignal<{ viewSize: Vec2, lowerSize: Vec2, biggerSize: Vec2; }>;
};
const ScrollLines = ({ sizes }: ScrollProps) => {
  const map = useNodeMap();

  const drag = useDrag(({ delta, meta }) => {
    map.animation.value = undefined;

    const dispose = looper(() => {
      const center = rectCenter(map.rect.value);

      const vecDelta = delta
        .cdiv(-20)
        .plus(center);

      if (meta === "x")
        map.x.value = vecDelta.x;

      if (meta === "y")
        map.y.value = vecDelta.y;
    });

    return ({ delta: newDelta }) => {
      delta.set(newDelta);
      return dispose;
    };
  });

  const onMouseDown = useCallback((e: MouseEvent, type: "x" | "y") => {
    drag(e, type);
  }, []);

  const horizontal = useComputed(() => {
    const size = sizes.value.viewSize.x;
    const left = sizes.value.lowerSize.x + '%';
    const right = sizes.value.biggerSize.x + '%';

    return (
      <div
        onMouseDown={(e) => onMouseDown(e, "x")}
        className={s.item}
        data-show={(size !== 100) || undefined}
        style={{ left, right }} />
    );
  });

  const vertical = useComputed(() => {
    const size = sizes.value.viewSize.y;
    const top = sizes.value.lowerSize.y + '%';
    const bottom = sizes.value.biggerSize.y + '%';

    return (
      <div
        onMouseDown={(e) => onMouseDown(e, "y")}
        className={s.item}
        data-show={(size !== 100) || undefined}
        style={{ bottom, top }} />
    );
  });

  const lines = [
    {
      className: s.bottom,
      elt: horizontal
    },
    {
      className: s.left,
      elt: vertical
    },
    // {
    //   className: s.top,
    //   elt: horizontal
    // },
    // {
    //   className: s.right,
    //   elt: vertical
    // },
  ];

  return (
    lines.map(({ className, elt }, i) => (
      <div className={className} key={i}>{elt}</div>
    ))
  );
};