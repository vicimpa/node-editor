import { ReactNode } from "react";

import { Range } from "../../components/Range";
import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { AudioPort } from "../../port/AudioPort";

export class Gain extends BaseNode {
  static showName = 'Gain';
  color = '#0f0';
  node = context.createGain();

  ports = [
    new AudioPort('in', this.node),
    new AudioPort('out', this.node),
  ];

  render(): ReactNode {
    return (
      <>
        <Range
          param={this.node.gain}
          minValue={0}
          maxValue={10}
          accuracy={2}
          label="Gain" />
      </>
    );
  }
}