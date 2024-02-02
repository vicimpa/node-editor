import { Component, createElement, ReactNode } from "react";

import { useConnect } from "@/hooks/useConnect";
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
          createElement(() => {
            ctx.map = useNodeMap();
            useConnect(ctx);
            return null;
          })
        }
        {this.props.children}
        {
          createElement(() => (
            ctx.list.use()
              .map((item, key) => (
                createElement(() => {
                  useConnect(item);

                  return <LinesItem {...item} />;
                }, { key })
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