import { FC, memo, ReactNode } from "react";

import { Vec2 } from "@/library/Vec2";
import { counter } from "@/utils/counter";

import { BasePort } from "./BasePort";

const getId = counter();

export abstract class BaseNode {
  #memo: FC | undefined;
  id = `#${getId()}`;
  color = '#999';
  single = false;
  start = new Vec2();

  get title() {
    return Object.getPrototypeOf(this).constructor.name;
  };

  abstract ports: BasePort[];
  abstract render(): ReactNode;

  get Render() {
    return this.#memo ?? (
      this.#memo = memo(() => {
        return this.render();
      }, () => true)
    );
  }
}