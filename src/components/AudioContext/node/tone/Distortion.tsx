import { ReactNode } from "react";
import { Distortion as DistortionNode } from "tone";

import { Range } from "../../components/Range";
import { baseToneNode } from "../../library/BaseToneNode";
import { CustomAudioParam } from "../../library/CustomAudioParam";
import { AudioPort } from "../../port/AudioPort";

export class Distortion extends baseToneNode(DistortionNode) {
  distortion = new CustomAudioParam(this.node, 'distortion', 0, 1);

  ports = [
    new AudioPort('in', this.input),
    new AudioPort('out', this.output),
  ];

  render(): ReactNode {
    return (
      <>
        <Range
          param={this.distortion}
          label="Discortion"
          accuracy={3}
        />
        <Range
          param={this.node.wet}
          label="Wet"
          accuracy={3}
        />
      </>
    );
  }
}