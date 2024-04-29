import { ReactNode } from "react";

import { context } from "../context";
import { AudioPort } from "../port/AudioPort";
import { BasePort } from "../port/BasePort";
import { BaseNode } from "./BaseNode";

export class DestinationNode extends BaseNode {
  ports: BasePort[] = [
    new AudioPort('in', context.destination)
  ];

  render(): ReactNode {
    return null;
  }
}