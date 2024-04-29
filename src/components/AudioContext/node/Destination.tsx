import { ReactNode } from "react";

import { context } from "../context";
import { BaseNode } from "../library/BaseNode";
import { BasePort } from "../library/BasePort";
import { AudioPort } from "../port/AudioPort";

export class Destination extends BaseNode {
  single = true;

  ports: BasePort[] = [
    new AudioPort('in', context.destination)
  ];


  render(): ReactNode {
    return null;
  }
}