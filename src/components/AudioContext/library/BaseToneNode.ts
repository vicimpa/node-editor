import { connect, context, ToneAudioNode } from "tone";

import { BaseNode } from "./BaseNode";

export class BaseToneNode<T extends ToneAudioNode> extends BaseNode {
  input = context.createGain();
  output = context.createGain();

  constructor(public node: T) {
    super();
    connect(this.input, node);
    connect(node, this.output);
  }
}

export const baseToneNode = <T extends ToneAudioNode, A extends any[]>(
  node: new (...args: A) => T,
  ...args: A
) => {
  return class extends BaseToneNode<T> {
    constructor() {
      super(new node(...args));
    }
  };
};