import { context } from "tone";

import { compute } from "@/utils/compute";
import { signal } from "@preact/signals-react";

import { AudioContextPort } from "../../AudioContextPort";
import { MixerLine } from "../../components/Mixer";
import { BaseNode } from "../../library/BaseNode";
import { AudioPort } from "../../port/AudioPort";
import s from "./Mixer.module.sass";

export class MixItem {
  constructor(
    public num: number,
    public mixer: Mixer,
  ) {
    for (const port of this.ports)
      port.name = `#${num}`;

    this.mixer.mixIn.connect(this.input);
    this.input.connect(this.pan);
    this.pan.connect(this.mute);
    this.mute.connect(this.output);
    this.output.connect(this.mixer.mixOut);
  }

  input = context.createGain();
  output = context.createGain();
  pan = context.createStereoPanner();
  mute = context.createGain();

  ports = [
    new AudioPort('in', this.input),
    new AudioPort('out', this.output),
  ];
}

export class Mixer extends BaseNode {
  mixIn = context.createGain();
  mixOut = context.createGain();

  mixInPort = new AudioPort('in', this.mixIn, 'mixIn');
  mixOutPort = new AudioPort('out', this.mixOut, 'mixOut');
  maxLines = 8;
  lines = signal([
    new MixItem(0, this),
    new MixItem(1, this),
  ]);

  append() {
    if (this.lines.value.length === this.maxLines)
      return;
    this.lines.value = [
      ...this.lines.value,
      new MixItem(this.lines.value.length, this)
    ];
  }

  remove() {
    const remove = this.lines.value.splice(-1);
    remove.forEach(e => e.output.disconnect(this.mixOut));
    this.lines.value = [...this.lines.value];
  }

  render() {
    return (
      <>
        <AudioContextPort port={this.mixInPort} />
        <AudioContextPort port={this.mixOutPort} />
        <div className={s.mixer}>
          {compute(() => (
            this.lines.value.map((item, i) => (
              <MixerLine item={item} key={i} />
            ))
          ))}
          {
            compute(() => (
              this.lines.value.length < this.maxLines && (
                <div className={s.btns}>
                  <button onClick={() => this.append()}>Append</button>
                  {/* <button onClick={() => this.remove()}>Remove line</button> */}
                </div>
              )
            ))
          }
        </div>
      </>
    );
  }
}