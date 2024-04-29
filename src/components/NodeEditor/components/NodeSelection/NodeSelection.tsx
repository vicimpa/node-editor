import { Component, ReactNode } from "react";

import { useNodeList } from "@/components/NodeEditor";
import { useConnect } from "@/hooks/useConnect";
import { Vec2 } from "@/library/Vec2.ts";
import { compute } from "@/utils/compute";
import { Signal } from "@preact/signals-react";

import { NodeSelectionCtx, NodeSelectionProvider } from "./NodeSelectionCtx.ts";
import { NodeSelectionRect } from "./NodeSelectionRect.tsx";

export type NodeSelectionProps = {
  children?: ReactNode;
};

export class NodeSelection extends Component<NodeSelectionProps> {
  ctx = new NodeSelectionCtx();

  render() {
    const { ctx } = this;

    return (
      <NodeSelectionProvider value={ctx}>
        {
          compute(() => {
            ctx.list = useNodeList();
            useConnect(ctx);
            return null;
          })
        }
        {this.props.children}
        {
          compute(() => (
            ctx.selectFrom.value && ctx.selectTo.value &&
            <NodeSelectionRect from={ctx.selectFrom as Signal<Vec2>} to={ctx.selectTo as Signal<Vec2>} />
          ))
        }
      </NodeSelectionProvider>
    );
  }
}