import { PitchShift as PitchShiftNode } from "tone";

import { Range } from "../../components/Range";
import { baseToneNode } from "../../library/BaseToneNode";
import { CustomAudioParam } from "../../library/CustomAudioParam";
import { AudioPort } from "../../port/AudioPort";

export class PitchShift extends baseToneNode(PitchShiftNode) {
  static showName = 'PitchShift';
  pitch = new CustomAudioParam(this.node, 'pitch', -14, 14);

  ports = [
    new AudioPort('in', this.input),
    new AudioPort('out', this.output),
  ];

  render() {
    return (
      <>
        <Range
          param={this.pitch}
          label="Pitch"
          accuracy={2}
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