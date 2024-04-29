import { ReactNode } from "react";

import { counter } from "@/utils/counter";

import { BasePort } from "../port/BasePort";

const getId = counter();

export abstract class BaseNode {
  id = `#${getId()}`;
  color = '#999';

  get title() {
    return Object.getPrototypeOf(this).constructor.name;
  };

  abstract ports: BasePort[];
  abstract render(): ReactNode;
}