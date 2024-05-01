import { createRef, ReactNode } from "react";

import { useSubEmit } from "@/hooks/useSubEmit";
import { ReactiveMap } from "@/library/ReactiveMap";
import { compute } from "@/utils/compute";
import { signal, useSignalEffect } from "@preact/signals-react";

import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { openFile } from "../../library/openFile";
import { AudioPort } from "../../port/AudioPort";

export class Convolver extends BaseNode {
  ref = createRef<HTMLSelectElement>();
  node = context.createConvolver();
  sounds = new ReactiveMap<string, Promise<AudioBuffer>>([
    [
      'irHall.ogg',
      import('../../sound/irHall.ogg')
        .then(url => fetch(url.default))
        .then(res => res.arrayBuffer())
        .then(buffer => context.decodeAudioData(buffer))
    ]
  ]);
  value = signal(this.sounds.keys().next().value);

  ports = [
    new AudioPort('in', this.node),
    new AudioPort('out', this.node)
  ];

  render(): ReactNode {
    useSignalEffect(() => {
      this.sounds.get(this.value.value)
        ?.then(buffer => this.node.buffer = buffer);

      if (this.ref.current)
        this.ref.current.value = this.value.value;
    });
    return (
      <>
        <select
          ref={this.ref}
          defaultValue={this.value.value}
          onChange={(e) => {
            this.value.value = e.currentTarget.value as any;
          }}
        >
          {
            compute(() => (
              useSubEmit(this.sounds),
              [...this.sounds].map(([key]) => (
                <option value={key}>{key}</option>
              ))
            ))
          }
        </select>
        <button
          onClick={() => {
            openFile('audio/*')
              .then(([file]) => {
                if (file)
                  this.sounds.set(
                    file.name,
                    file.arrayBuffer()
                      .then(buffer => context.decodeAudioData(buffer))
                      .then(buffer => (this.value.value = file.name, buffer))
                  );
              });
          }}
        >
          Upload file
        </button>
      </>
    );
  }
}