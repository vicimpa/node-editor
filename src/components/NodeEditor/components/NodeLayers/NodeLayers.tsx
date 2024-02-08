import { Component, createElement, ReactNode } from "react";

import { useSubEmit } from "@/hooks/useSubEmit";

import { NodeLayersCtx, NodeLayersItem, NodeLayersProvider } from "./";

export type NodeLayersProps = {
  children?: ReactNode;
};

export class NodeLayers extends Component<NodeLayersProps> {
  ctx = new NodeLayersCtx();

  renderItem(item: NodeLayersItem) {
    return (
      <g ref={item.ref} key={item.id} />
    );
  }

  render() {
    const { props: { children } } = this;
    const { before, after } = this.ctx;

    return (
      <NodeLayersProvider value={this.ctx}>
        {
          createElement(() => (
            useSubEmit(before).map(this.renderItem)
          ))
        }

        {children}

        {
          createElement(() => (
            useSubEmit(after).map(this.renderItem)
          ))
        }
      </NodeLayersProvider>
    );
  }


}