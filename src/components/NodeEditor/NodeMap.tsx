import { FC, ReactNode, RefObject, useCallback, useLayoutEffect, useMemo } from "react";

import { useDrag } from "@/hooks/useDrag";
import { useForwardRef } from "@/hooks/useForwardRef";
import { useResizer } from "@/hooks/useResizer";
import { useSignalCorrect } from "@/hooks/useSIgnalCorrect";
import { useSignalRef } from "@/hooks/useSignalRef";
import { useWindowEvent } from "@/hooks/useWindowEvent";
import { Vec2 } from "@/library/Vec2";
import { compute } from "@/utils/compute";
import { fixed } from "@/utils/fixed";
import { forward } from "@/utils/forward";
import { cropSize, minMax } from "@/utils/math";
import { objectContext } from "@/utils/objectContext";
import { offsetSvgVec } from "@/utils/offsetVec";
import { batch, Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals-react";

import { Debug } from "../Debug";
import s from "./NodeEditor.module.sass";

export type NodeMapProps = {
  x?: number;
  y?: number;
  scale?: number;
  width?: number;
  height?: number;
  fill?: string;
  children?: ReactNode;
};

export type NodeMapCtx = {
  svgRef: RefObject<SVGSVGElement>;
  posX: Signal<number>;
  posY: Signal<number>;
  scale: Signal<number>;
  width: number;
  height: number;
};

const [NodeMapProvider, useNodeMap] = (
  objectContext<NodeMapCtx>()
);

export { useNodeMap };

export const NodeMap: FC<NodeMapProps> = forward<'div', NodeMapProps>(
  (
    {
      x: startY = 0,
      y: startX = 0,
      scale: startScale = 1,
      width = 10000,
      height = 10000,
      className = '',
      children,
      ...props
    },
    _ref
  ) => {
    const divRef = useForwardRef(_ref);
    const svgRef = useSignalRef<SVGSVGElement>(null);
    const size = useResizer(divRef);
    const posX = useSignalCorrect(0, v => cropSize(v, width, .5));
    const posY = useSignalCorrect(0, v => cropSize(v, height, .5));
    const scale = useSignalCorrect(2, v => minMax(v, .05, 4));
    const move = useSignal(false);

    const calculateRect = useCallback(() => {
      const { value: x } = posX;
      const { value: y } = posY;
      const { value: s } = scale;

      const sizeVec = Vec2
        .fromSize(size)
        .div(s);

      const center = sizeVec
        .cdiv(2)
        .times(-1)
        .plus(x, y);

      return new DOMRect(
        center.x,
        center.y,
        sizeVec.x,
        sizeVec.y
      );
    }, []);

    useLayoutEffect(() => { posX.value = startX; }, [startX]);
    useLayoutEffect(() => { posY.value = startY; }, [startY]);
    useLayoutEffect(() => { scale.value = startScale; }, [startScale]);

    const cursor = useComputed(() => move.value ? 'grabbing' : '');
    const viewBox = useComputed(() => calculateRect());

    useSignalEffect(() => {
      const { current: svg } = svgRef;
      const { value: c } = cursor;
      const { value: v } = viewBox;
      if (!svg) return;
      svg.style.cursor = c;
      Object.assign(svg.viewBox.baseVal, v.toJSON());
    });

    const drag = useDrag(({ start }) => (
      move.value = true,
      start = Vec2.fromSignals(posX, posY),
      ({ delta }) => {
        delta
          .div(scale)
          .plus(start)
          .toSignals(posX, posY);

        return () => {
          move.value = false;
        };
      }
    ), 1);

    useWindowEvent('wheel', (e) => {
      const { current: div } = divRef;
      const { current: svg } = svgRef;

      if (!div || !svg)
        return;

      if (!div.contains(e.target as Element))
        return;

      e.preventDefault();

      if (!e.ctrlKey) {
        const delta = Vec2.fromDeltaXY(e);

        if (e.shiftKey && !delta.x) {
          delta.x = delta.y;
          delta.y = 0;
        }

        delta
          .div(scale)
          .plus(posX, posY)
          .toSignals(posX, posY);

        return;
      }

      batch(() => {
        const mouse = Vec2.fromPageXY(e);
        const delta = offsetSvgVec(div, svg, mouse);
        scale.value -= e.deltaY * .001;
        delta.minus(offsetSvgVec(div, calculateRect(), mouse));
        posX.value += delta.x;
        posY.value += delta.y;
      });
    });

    const ctx = useMemo(() => ({
      posX,
      posY,
      scale,
      svgRef,
      width,
      height
    }), [posX, posY, scale, svgRef, width, height]);

    return (
      <div
        ref={divRef}
        className={`${s.map} ${className}`}
        {...props}
      >
        <svg
          ref={svgRef}
          onMouseDown={drag}
          viewBox="0 0 0 0"
          xmlns="http://www.w3.org/2000/svg"
        >
          {
            compute(() => (
              svgRef.current &&
              <NodeMapProvider value={ctx}>
                {children}
              </NodeMapProvider>
            ))
          }

          <Debug title="NodeMap">
            {{
              PosX: <>{fixed(posX)}</>,
              PosY: <>{fixed(posY)}</>,
              Scale: <>{fixed(scale)}</>,
              Width: <>{fixed(size.width)}</>,
              Height: <>{fixed(size.height)}</>,
            }}
          </Debug>
        </svg>
      </div>
    );
  }
);