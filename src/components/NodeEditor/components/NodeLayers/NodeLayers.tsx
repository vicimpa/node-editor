import { Component, createElement, ReactNode } from "react";

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
            before.use().map(this.renderItem)
          ))
        }

        {children}

        {
          createElement(() => (
            after.use().map(this.renderItem)
          ))
        }
      </NodeLayersProvider>
    );
  }


}