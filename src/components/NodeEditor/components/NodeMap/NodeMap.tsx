import { Component, createElement, ReactNode } from "react";

import { Debug } from "@/components/Debug";
import { useConnect } from "@/hooks/useConnect";
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
          createElement(
            () => (
              useConnect(ctx),
              <>
                <div className={s.map} ref={ctx.div}>
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
            )
          )
        }
      </NodeMapProvider>
    );
  }
}