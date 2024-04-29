import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { AudioPort } from "../../port/AudioPort";

export class ChannelMerger extends BaseNode {
  color = '#632470';
  node = context.createChannelMerger(2);
  left = context.createGain();
  right = context.createGain();

  ports = [
    new AudioPort('out', this.node),
    new AudioPort('in', this.left, 'left'),
    new AudioPort('in', this.right, 'right')
  ];

  test = [
    this.left.connect(this.node, 0, 0),
    this.right.connect(this.node, 0, 1),
  ];

  render() {
    return null;
  }
}