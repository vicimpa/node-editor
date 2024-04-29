import { BaseNode } from "./library/BaseNode";
import { AudioPlayer } from "./node/AudioPlayer";
import { BQuadFilter } from "./node/BQuadFilter";
import { Delay } from "./node/Delay";
import { Destination } from "./node/Destination";
import { DynamicsCompressor } from "./node/DynamicsCompressor";
import { Gain } from "./node/Gain";
import { Oscillator } from "./node/Oscillator";

export type TNodeCollection = {
  name: string;
  children: TNodeCollectionList;
};

export type TNodeCollectionList = (typeof BaseNode | TNodeCollection)[];

export const NodeCollection: TNodeCollectionList = [
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
    ]
  },
  Destination,
];