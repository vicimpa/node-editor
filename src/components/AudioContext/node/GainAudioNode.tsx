import { ReactNode } from "react";

import { signal, useSignalEffect } from "@preact/signals-react";

import { Range } from "../components/Range";
import { context } from "../context";
import { AudioPort } from "../port/AudioPort";
import { BaseNode } from "./BaseNode";

export class GainAudioNode extends BaseNode {
  node = context.createGain();
  gain = signal(1);

  ports = [
    new AudioPort('in', this.node),
    new AudioPort('out', this.node),
  ];

  render(): ReactNode {
    useSignalEffect(() => {
      this.node.gain.value = this.gain.value;
    });

    return (
      <>
        <Range value={this.gain} min={0} max={10} step={0.01} />
      </>
    );
  }
}