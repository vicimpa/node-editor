import { useEffect, useRef } from "react";
import { useDrag } from "~/hooks/useDrag";
import { useForwardRef } from "~/hooks/useForwardRef";
import { useSignalCorrect } from "~/hooks/useSIgnalCorrect";
import { useWindowEvent } from "~/hooks/useWindowEvent";
import { Vec2 } from "~/library/Vec2";
import { fixed } from "~/utils/fixed";
import { forward } from "~/utils/forward";
import { cropSize, minMax } from "~/utils/math";

import { batch, useSignal, useSignalEffect } from "@preact/signals-react";

import { Debug } from "../Debug";
import { ViewNodeList } from "../ViewNodeList";
import s from "./ViewMap.module.sass";
import { ViewMapProvider } from "./ViewMapCTX";

export type TViewMapProps = {
  x?: number;
  y?: number;
  s?: number;
  width?: number;
  height?: number;
};

const CONFIG = {
  minScale: .3,
  maxScale: 5
};

export const ViewMap = forward<'div', TViewMapProps>(
  (
    {
      x: startX = 0,
      y: startY = 0,
      s: startScale = .7,
      width = 10000,
      height = 10000,
      className,
      children,
      ...props
    },
    _ref
  ) => {
    const ref = useRef<HTMLDivElement>(null);
    const lock = useSignal(false);
    const mainRef = useForwardRef(_ref);
    const { minScale, maxScale } = CONFIG;
    const posX = useSignalCorrect(0, v => cropSize(v, width, .5));
    const posY = useSignalCorrect(0, v => cropSize(v, height, .5));
    const scale = useSignalCorrect(startScale, v => minMax(v, minScale, maxScale));
    const moved = useSignal(false);

    const drag = useDrag(({ start }) => (
      lock.value ? undefined : (
        moved.value = true,
        start = Vec2.fromSignals(posX, posY),
        ({ delta }) => {
          delta.div(scale)
            .plus(start)
            .toSignals(posX, posY);
          return () => { moved.value = false; };
        }
      )
    ), 1);

    useEffect(() => {
      batch(() => {
        posX.value = startX;
        posY.value = startY;
        scale.value = startScale;
      });

      ref.current && Object.assign(ref.current.style, {
        width: width + 'px',
        height: height + 'px'
      });
    }, [startX, startY, startScale, width, height]);

    useSignalEffect(() => {
      const { current: el } = ref;
      const cursor = moved.value ? 'grabbing' : '';
      el && Object.assign(el.style, { cursor });
    });

    useSignalEffect(() => {
      const { current: el } = ref;
      const { value: x } = posX;
      const { value: y } = posY;
      const { value: s } = scale;
      el && (el.style.transform = '' + (
        new DOMMatrix([s, 0, 0, s, -x * s, -y * s])
      ));
    });

    useWindowEvent('wheel', (e) => {
      if (!mainRef.current?.contains(e.target as Node))
        return;

      e.preventDefault();

      if (lock.value)
        return;

      const delta = Vec2.fromDeltaXY(e);

      if (!e.ctrlKey) {
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

      scale.value -= e.deltaY * .001;
    });

    return (
      <div ref={mainRef} className={`${s.map} ${className ?? ''}`} {...props}>
        <div ref={ref} className={s.view} onMouseDown={drag}>
          <ViewMapProvider value={{ posX, posY, scale, width, height, lock, moved }}>
            <ViewNodeList>
              {children}
            </ViewNodeList>
          </ViewMapProvider>
          <Debug title="ViewMap">
            {{
              PosX: <>{fixed(posX)}</>,
              PosY: <>{fixed(posY)}</>,
              Scale: <>{fixed(scale)}</>,
            }}
          </Debug>
        </div>
      </div>
    );
  }
);