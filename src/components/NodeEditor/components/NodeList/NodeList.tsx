import { Component, createElement, ReactNode, useEffect } from "react";

import { NodeItem } from "../NodeItem";
import { NodeMapCtx, useNodeMap } from "../NodeMap";
import { NodeListCtx, NodeListProvider } from "./";

export type NodeListProps = {
  children?: ReactNode;
};

export class NodeList extends Component<NodeListProps> {
  map!: NodeMapCtx;
  ctx = new NodeListCtx(this);

  render(): ReactNode {
    const { ctx, props } = this;
    const { children } = props;

    return (
      <NodeListProvider value={ctx}>
        {
          createElement(() => (
            this.map = useNodeMap(),
            useEffect(() => ctx.connect(), [ctx]),
            <>
              {children}

              <g ref={ctx.ref}>
                {
                  createElement(() => (
                    ctx.list.use()
                      .map((ctx, key) => (
                        <NodeItem key={key} ctx={ctx} />
                      ))
                  ))
                }
              </g>
            </>
          ))
        }
      </NodeListProvider>
    );
  }
};