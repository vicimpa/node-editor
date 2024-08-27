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

const names = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

function convertToFrequency(n: number) {
  const baseFrequency = 440;
  const semitoneRatio = Math.pow(2, 1 / 12);
  return baseFrequency * Math.pow(semitoneRatio, n);
}

const notes = Array.from({ length: 4 * 12 }, (_, i) => ({
  freq: convertToFrequency(i - 36),
  name: names[i % names.length] + `(${(i / 12 | 0) + 2})`
}));

console.log(JSON.stringify(notes, null, 2));

export class Oscillator extends BaseNode {
  static showName = 'Oscillator';
  color = '#df3';
  gain = context.createGain();
  node = context.createOscillator();
  playing = signal(false);
  activate = signal(false);
  keydown = signal('');
  register = false;
  freq = signal('');
  baseFreq = signal(0);

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
      effect(() => {
        if (this.freq.value === '')
          return;
        this.node.frequency.value = +this.freq.value;
        this.node.detune.value = 0;

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

        <rsp.select bind-value={this.freq}>
          <option value={''}>Manual settings</option>
          {notes.map((note, i) => {
            return <option key={i} value={note.freq}>{note.name}</option>;
          })}
        </rsp.select>

        {compute(() => (
          this.freq.value === '' &&
          <>
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
          </>

        ))}


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