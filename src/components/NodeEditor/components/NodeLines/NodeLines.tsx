import { Component, createElement, ReactNode } from "react";

import { useConnect } from "@/hooks/useConnect";
import { useSubEmit } from "@/hooks/useSubEmit";
import { compute } from "@/utils/compute";

import { useNodeMap } from "../NodeMap";
import { NodeLinesCtx, NodeLinesProvider } from "./";
import { LinesItem } from "./NodeLinesItem";

export type NodeLinesProps = {
  children?: ReactNode;
};

export class NodeLines extends Component<NodeLinesProps> {
  ctx = new NodeLinesCtx();

  render() {
    const { ctx } = this;

    return (
      <NodeLinesProvider value={ctx}>
        {
          compute(() => {
            ctx.map = useNodeMap();
            useConnect(ctx);
            return null;
          })
        }
        {this.props.children}
        {
          compute(() => (
            useSubEmit(ctx.list)
              .map((item, key) => (
                createElement(() => (
                  useConnect(item),
                  <LinesItem {...item} />
                ), { key })
              ))
          ))
        }
        {
          compute(() => (
            ctx.active.value &&
            <LinesItem from={ctx.active.value} vec={ctx.mouse} />
          ))
        }
      </NodeLinesProvider>
    );
  }
}