import { ReactNode } from "react";

import { Range } from "../../components/Range";
import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { AudioPort } from "../../port/AudioPort";

export class Delay extends BaseNode {
  color = '#f33';
  node = context.createDelay(10);

  ports = [
    new AudioPort('in', this.node),
    new AudioPort('out', this.node),
  ];

  render(): ReactNode {
    return (
      <>
        <Range
          param={this.node.delayTime}
          label="Delay Time"
          postfix="sec"
          accuracy={3} />
      </>
    );
  }
}