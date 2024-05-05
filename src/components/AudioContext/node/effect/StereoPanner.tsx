import { Range } from "../../components/Range";
import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { AudioPort } from "../../port/AudioPort";

export class StereoPanner extends BaseNode {
  static showName = 'StereoPanner';
  color = '#aa5858';
  node = context.createStereoPanner();
  ports = [
    new AudioPort('in', this.node),
    new AudioPort('out', this.node)
  ];

  render() {
    return (
      <>
        <Range
          param={this.node.pan}
          label="Pan"
          accuracy={3}
        />
      </>
    );
  }
}