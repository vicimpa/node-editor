import { Component, createElement, ReactNode } from "react";

import { useSubEmit } from "@/hooks/useSubEmit";
import { compute } from "@/utils/compute";
import { useSignals } from "@preact/signals-react/runtime";

import { NodeHudCtx, NodeHudProvider } from "./";
import s from "./NodeHud.module.sass";

export type NodeHudProps = {
  children?: ReactNode;
};

export class NodeHud extends Component<NodeHudProps> {
  ctx = new NodeHudCtx();

  render(): ReactNode {
    const { ctx, props } = this;
    const { children } = props;

    return (
      <NodeHudProvider value={ctx}>
        <div ref={ctx.ref} className={s.container}>
          {children}

          <div className={s.hud}>
            {
              compute(() => (
                useSubEmit(ctx.list)
                  .map((item, key) => (
                    createElement(() => (
                      useSignals(),
                      (
                        <div
                          className={s.item}
                          key={key}
                          ref={item.ref}
                          hidden={!item.show.value} />
                      )
                    ), { key })
                  ))
              ))
            }
          </div>
        </div>
      </NodeHudProvider>
    );
  }
}