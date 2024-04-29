import { ReactNode } from "react";

import { signal } from "@preact/signals-react";

import { AudioPlayer } from "../components/AudioPlayer";
import { context } from "../context";
import { openFile } from "../library/openFile";
import { AudioPort } from "../port/AudioPort";
import { BaseNode } from "./BaseNode";

export class AudioPlayerNode extends BaseNode {
  audio = new Audio();
  node = context.createMediaElementSource(this.audio);
  file = signal<File | null>(null);

  ports = [
    new AudioPort('out', this.node)
  ];

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
        <AudioPlayer audio={this.audio} file={this.file} />
      </>

    );
  }
}