import {Component, createElement, ReactNode} from "react";

import {useConnect} from "@/hooks/useConnect";
import {compute} from "@/utils/compute";
import {NodeSelectionCtx, NodeSelectionProvider} from "./NodeSelectionCtx.ts";
import {Signal} from "@preact/signals-react";
import {Vec2} from "@/library/Vec2.ts";
import {NodeSelectionRect} from "./NodeSelectionRect.tsx";
import {useNodeList} from "@/components/NodeEditor";


export type NodeSelectionProps = {
  children?: ReactNode;
};

export class NodeSelection extends Component<NodeSelectionProps> {
  ctx = new NodeSelectionCtx();

  render() {
    const {ctx} = this;

    return (
      <NodeSelectionProvider value={ctx}>
        {
          createElement(() => {
            ctx.list = useNodeList()
            useConnect(ctx);
            return null;
          })
        }
        {this.props.children}
        {
          compute(() => (
            ctx.selectFrom.value && ctx.selectTo.value &&
            <NodeSelectionRect from={ctx.selectFrom as Signal<Vec2>} to={ctx.selectTo as Signal<Vec2>}/>
          ))
        }
      </NodeSelectionProvider>
    );
  }
}