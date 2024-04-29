import { ReactNode } from "react";

import { compute } from "@/utils/compute";
import { signal } from "@preact/signals-react";

import { Range } from "../components/Range";
import { context } from "../context";
import { BaseNode } from "../library/BaseNode";
import { frequencies } from "../library/frequencies";
import { AudioPort } from "../port/AudioPort";

const types = [
  "custom",
  "sawtooth",
  "sine",
  "square",
  "triangle"
];

export class Oscillator extends BaseNode {
  color = '#df3';
  gain = context.createGain();
  node = context.createOscillator();
  playing = signal(false);

  ports = [
    new AudioPort('out', this.gain)
  ];

  test = [
    this.node.start()
  ];

  toggle() {
    this.playing.value = !this.playing.value;
    if (this.playing.value) {
      this.node.connect(this.gain);
    } else {
      this.node.disconnect(this.gain);
    }
  }

  render(): ReactNode {
    return (
      <>
        <select
          defaultValue={this.node.type}
          onChange={(e) => {
            this.node.type = e.currentTarget.value as any;
          }}
        >
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <Range
          param={this.node.frequency}
          label="Frequency"
          postfix="HZ"
          minValue={frequencies.at(0)}
          maxValue={frequencies.at(-1)}
        />

        <Range
          param={this.node.detune}
          label="Detune"
          postfix="cents"
          minValue={-1200}
          maxValue={1200}
        />

        {
          compute(() => (
            <button onClick={() => this.toggle()}>{this.playing.value ? 'Stop' : 'Start'}</button>
          ))
        }
      </>
    );
  }
}