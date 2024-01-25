import { Component, createElement, ReactNode, useEffect } from "react";

import { Debug } from "@/components/Debug";
import { useDrag } from "@/hooks/useDrag";
import { useWindowEvent } from "@/hooks/useWindowEvent";
import { Vec2 } from "@/library/Vec2";
import { fixed } from "@/utils/fixed";

import { NodeMapCtx, NodeMapProvider } from "./";
import s from "./NodeMap.module.sass";

export type NodeMapProps = {
  children?: ReactNode;
};

export class NodeMap extends Component<NodeMapProps> {
  ctx = new NodeMapCtx();

  render(): ReactNode {
    const { ctx, props } = this;
    const { children } = props;

    return (
      <NodeMapProvider value={ctx}>
        {
          createElement(() => {
            useEffect(() => ctx.connect(), [ctx]);

            const drag = useDrag(({ start }) => (
              start = Vec2.fromSignals(ctx.x, ctx.y),
              ({ delta }) => {
                delta
                  .div(ctx.scale)
                  .plus(start)
                  .toSignals(ctx.x, ctx.y);
              }
            ), 1);

            useWindowEvent('wheel', (e) => {
              const { scale, x, y } = ctx;
              const { current: div } = ctx.div;
              const { current: svg } = ctx.svg;

              if (
                false
                || !div
                || !svg
                || !(e.target instanceof Element)
                || !div.contains(e.target)
              ) return;

              e.preventDefault();
              e.stopPropagation();

              if (!e.ctrlKey) {
                const delta = Vec2.fromDeltaXY(e);

                if (e.shiftKey && !delta.x)
                  delta.inverse();

                delta
                  .div(ctx.scale)
                  .plus(ctx.x, ctx.y)
                  .toSignals(ctx.x, ctx.y);

                return;
              }

              const mouse = Vec2.fromPageXY(e);
              const start = ctx.offset(mouse);
              scale.value -= e.deltaY * .001;
              start.minus(ctx.offset(mouse));
              start.plus(x, y);
              start.toSignals(x, y);
            });

            return (
              <>
                <div className={s.map} ref={ctx.div} onMouseDown={drag}>
                  <svg ref={ctx.svg} viewBox="0 0 0 0">
                    {children}
                  </svg>
                </div>

                <Debug title="NodeMap">
                  {{
                    PosX: <>{fixed(ctx.x)}</>,
                    PosY: <>{fixed(ctx.y)}</>,
                    Scale: <>{fixed(ctx.scale)}</>,
                    Width: <>{fixed(ctx.width)}</>,
                    Height: <>{fixed(ctx.height)}</>,
                  }}
                </Debug>
              </>
            );
          })
        }
      </NodeMapProvider>
    );

  }
}