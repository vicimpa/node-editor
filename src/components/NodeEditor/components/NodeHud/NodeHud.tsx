import { Component, createElement, ReactNode } from "react";

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
        {children}

        <div className={s.hud}>
          {
            createElement(() => (
              ctx.list.use()
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
      </NodeHudProvider>
    );
  }
}