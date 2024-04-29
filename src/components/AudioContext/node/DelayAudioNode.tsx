import { ReactNode } from "react";

import { signal, useSignalEffect } from "@preact/signals-react";

import { Range } from "../components/Range";
import { context } from "../context";
import { AudioPort } from "../port/AudioPort";
import { BaseNode } from "./BaseNode";

export class DelayAudioNode extends BaseNode {
  node = context.createDelay();
  delay = signal(0);

  ports = [
    new AudioPort('in', this.node),
    new AudioPort('out', this.node),
  ];

  render(): ReactNode {
    useSignalEffect(() => {
      this.node.delayTime.value = this.delay.value;
    });

    return (
      <>
        <Range value={this.delay} min={0} max={10} step={0.01} />
      </>
    );
  }
}