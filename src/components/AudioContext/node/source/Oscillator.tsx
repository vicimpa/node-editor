import { ReactNode } from "react";

import { compute } from "@/utils/compute";
import { dispose } from "@/utils/dispose";
import { windowEvent } from "@/utils/events";
import { effect, signal } from "@preact/signals-react";
import rsp from "@vicimpa/rsp";

import { Range } from "../../components/Range";
import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { frequencies } from "../../library/frequencies";
import { AudioPort } from "../../port/AudioPort";

const types = [
  "custom",
  "sawtooth",
  "sine",
  "square",
  "triangle"
];

export class Oscillator extends BaseNode {
  static showName = 'Oscillator';
  color = '#df3';
  gain = context.createGain();
  node = context.createOscillator();
  playing = signal(false);
  activate = signal(false);
  keydown = signal('');
  register = false;

  ports = [
    new AudioPort('out', this.gain)
  ];

  keyDown(e: KeyboardEvent) {
    if (this.register) {
      this.playing.value = false;
      this.keydown.value = e.code;
      this.register = false;
      return;
    }

    if (this.activate.peek() && e.code === this.keydown.value) {
      e.preventDefault();
      this.playing.value = true;

    }
  }

  keyUp(e: KeyboardEvent) {
    if (e.code === this.keydown.value) {
      e.preventDefault();
      this.playing.value = false;
    }
  }

  mount(): void | (() => void) {
    this.node.start();
    this.gain.gain.value = 0;
    this.node.connect(this.gain);

    return dispose([
      () => {
        this.node.disconnect(this.gain);
      },
      effect(() => {
        this.activate.value;
        if (this.playing.peek())
          this.playing.value = false;
      }),
      effect(() => {
        if (this.playing.value) {
          this.gain.gain.value = 1;
        } else {
          this.gain.gain.value = 0;
        }
      }),
      windowEvent('keydown', e => this.keyDown(e)),
      windowEvent('keyup', e => this.keyUp(e))
    ]);
  }

  toggle() {
    this.playing.value = !this.playing.value;
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
          accuracy={2}
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
            <rsp.button disabled={this.activate} onClick={() => this.toggle()}>{this.playing.value ? 'Stop' : 'Start'}</rsp.button>
          ))
        }

        <label>
          <rsp.input type="checkbox" bind-checked={this.activate} />
          {' '}
          Key activate: "{compute(() => (this.keydown.value || 'Unknow'))}"
        </label>

        <button onClick={() => { this.register = true; }}>Change</button>
      </>
    );
  }
}