import { ReactNode } from "react";
import { connect } from "tone";

import { context } from "../../context";
import { BaseNode } from "../../library/BaseNode";
import { BasePort } from "../../library/BasePort";
import { AudioPort } from "../../port/AudioPort";

export class Destination extends BaseNode {
  static showName = 'Destination';
  color = '#33f';
  single = true;
  dest = context.createGain();

  ports: BasePort[] = [
    new AudioPort('in', this.dest)
  ];

  test = [
    connect(this.dest, context.destination)
  ];

  render(): ReactNode {

    return null;
  }
}