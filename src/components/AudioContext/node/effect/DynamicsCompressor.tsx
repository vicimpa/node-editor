import { ReactNode } from "react";

import { Range } from "../../components/Range";
import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { AudioPort } from "../../port/AudioPort";

export class DynamicsCompressor extends BaseNode {
  color = '#0f6f8c';
  node = context.createDynamicsCompressor();

  ports = [
    new AudioPort('in', this.node),
    new AudioPort('out', this.node)
  ];

  render(): ReactNode {
    return (
      <>
        <Range
          param={this.node.threshold}
          label="Trashold"
          postfix="DB"
          accuracy={2} />

        <Range
          param={this.node.knee}
          label="KNEE"
          postfix="DB"
          accuracy={2} />

        <Range
          param={this.node.ratio}
          label="Ratio"
          accuracy={2} />

        <Range
          param={this.node.attack}
          label="Attack"
          postfix="sec"
          accuracy={2} />

        <Range
          param={this.node.release}
          label="Release"
          postfix="sec"
          accuracy={2} />
      </>
    );
  }
}