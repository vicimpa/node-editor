import { ReactNode } from "react";

import { effect, signal } from "@preact/signals-react";

import { AudioPlayer as AudioPlayerComponent } from "../components/AudioPlayer";
import { context } from "../context";
import { BaseNode } from "../library/BaseNode";
import { openFile } from "../library/openFile";
import { AudioPort } from "../port/AudioPort";

export class AudioPlayer extends BaseNode {
  color = '#fff';
  audio = new Audio();
  node = context.createMediaElementSource(this.audio);
  file = signal<File | null>(null);

  ports = [
    new AudioPort('out', this.node)
  ];

  constructor() {
    super();
    effect(() => {
      if (this.file.value)
        this.audio.src = URL.createObjectURL(this.file.value);
    });
  }

  render(): ReactNode {
    return (
      <>
        <button
          onClick={() => {
            openFile('audio/*')
              .then(([file]) => {
                if (file) {
                  this.file.value = file;
                }
              });
          }}
        >
          Browse file
        </button>
        <AudioPlayerComponent audio={this.audio} file={this.file} />
      </>
    );
  }
}