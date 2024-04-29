import { context } from "../context";
import { BaseNode } from "../library/BaseNode";
import { AudioPort } from "../port/AudioPort";

export class ChannelSplitter extends BaseNode {
  color = '#748320';
  node = context.createChannelSplitter(2);
  left = context.createGain();
  right = context.createGain();

  ports = [
    new AudioPort('in', this.node),
    new AudioPort('out', this.left),
    new AudioPort('out', this.right)
  ];

  test = [
    this.node.connect(this.left, 0, 0),
    this.node.connect(this.right, 1, 0),
  ];

  render() {
    return null;
  }
}