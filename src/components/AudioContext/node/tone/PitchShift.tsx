
import { connect, context, PitchShift as PitchShiftNode } from "tone";

import { Range } from "../../components/Range";
import { BaseNode } from "../../library/BaseNode";
import { CustomAudioParam } from "../../library/CustomAudioParam";
import { AudioPort } from "../../port/AudioPort";

export class PitchShift extends BaseNode {
  node = new PitchShiftNode();
  input = context.createGain();
  output = context.createGain();

  pitch = new CustomAudioParam(this.node, 'pitch', -14, 14);

  ports = [
    new AudioPort('in', this.input),
    new AudioPort('out', this.output),
  ];

  test = [
    connect(this.input, this.node),
    connect(this.node, this.output),
  ];

  render() {

    return (
      <>
        <Range
          param={this.pitch}
          label="Pitch"
          accuracy={2}
        />
      </>
    );
  }
}