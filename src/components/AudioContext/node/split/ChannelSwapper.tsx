import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { AudioPort } from "../../port/AudioPort";

export class ChannelSwapper extends BaseNode {
  static showName = 'ChannelSwapper';
  color = '#631547';
  input = context.createChannelSplitter(2);
  output = context.createChannelMerger();

  ports = [
    new AudioPort('in', this.input),
    new AudioPort('out', this.output),
  ];

  test = [
    this.input.connect(this.output, 0, 1),
    this.input.connect(this.output, 1, 0),
  ];

  render() {
    return null;
  }
}