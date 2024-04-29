import { BaseNode } from "./library/BaseNode";
import { Destination } from "./node/destination/Destination";
import { BQuadFilter } from "./node/effect/BQuadFilter";
import { Convolver } from "./node/effect/Convolver";
import { Delay } from "./node/effect/Delay";
import { DynamicsCompressor } from "./node/effect/DynamicsCompressor";
import { Gain } from "./node/effect/Gain";
import { StereoPanner } from "./node/effect/StereoPanner";
import { AudioPlayer } from "./node/source/AudioPlayer";
import { Oscillator } from "./node/source/Oscillator";
import { ChannelMerger } from "./node/split/ChannelMerger";
import { ChannelSplitter } from "./node/split/ChannelSplitter";
import { ChannelSwapper } from "./node/split/ChannelSwapper";
import { PitchShift } from "./node/tone/PitchShift";

export type TNodeCollection = {
  name: string;
  children: TNodeCollectionList;
};

export type TNodeCollectionList = (typeof BaseNode | TNodeCollection)[];

export const NodeCollection: TNodeCollectionList = [
  {
    name: 'Append node',
    children: [
      {
        name: 'Source',
        children: [
          AudioPlayer,
          Oscillator,
        ]
      },
      {
        name: 'Effect',
        children: [
          Gain,
          Delay,
          DynamicsCompressor,
          BQuadFilter,
          Convolver,
          StereoPanner,
        ]
      },
      {
        name: 'Splitting',
        children: [
          ChannelSplitter,
          ChannelMerger,
          ChannelSwapper,
        ]
      },
      {
        name: 'Tone.js',
        children: [
          PitchShift
        ]
      },
      Destination,
    ]
  }
];