import { BaseNode } from "./library/BaseNode";
import { AudioPlayer } from "./node/AudioPlayer";
import { BQuadFilter } from "./node/BQuadFilter";
import { ChannelMerger } from "./node/ChannelMerger";
import { ChannelSplitter } from "./node/ChannelSplitter";
import { ChannelSwapper } from "./node/ChannelSwapper";
import { Convolver } from "./node/Convolver";
import { Delay } from "./node/Delay";
import { Destination } from "./node/Destination";
import { DynamicsCompressor } from "./node/DynamicsCompressor";
import { Gain } from "./node/Gain";
import { Oscillator } from "./node/Oscillator";
import { StereoPanner } from "./node/StereoPanner";

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
      Destination,
    ]
  }
];