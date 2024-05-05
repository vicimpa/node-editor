import { Reverb as ReverbNode } from "tone";

import { Range } from "../../components/Range";
import { baseToneNode } from "../../library/BaseToneNode";
import { CustomAudioParam } from "../../library/CustomAudioParam";
import { AudioPort } from "../../port/AudioPort";

export class Reverb extends baseToneNode(ReverbNode) {
  static showName = 'Reverb';
  decay = new CustomAudioParam(this.node, 'decay' as any, 0.001, 50);
  preDelay = new CustomAudioParam(this.node, 'preDelay' as any, 0, 10);

  ports = [
    new AudioPort('in', this.input),
    new AudioPort("out", this.output),
  ];

  render() {
    return (
      <>
        <Range
          param={this.decay}
          accuracy={2}
          label="Decay"
          batch={50}
        />
        <Range
          param={this.preDelay}
          accuracy={2}
          label="Pre Delay"
          batch={50}
        />
        <Range
          param={this.node.wet}
          accuracy={3}
          label="Wet"
        />
      </>
    );
  }
}