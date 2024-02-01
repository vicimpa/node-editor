import {Component} from "react";

import {NodeLinesCtx, NodeLinesProvider} from "./";

export class NodeLines extends Component {
  ctx = new NodeLinesCtx();

  render() {
    const {} = this.ctx

    return (
      <NodeLinesProvider value={this.ctx}>
        
      </NodeLinesProvider>
    );
  }
}