import { ReactNode, useId } from "react";

import { makeNodeItem } from "../NodeEditor";
import { Point, TPointParam } from "../Point";
import s from "./Node.module.sass";

export type TNodeProps = {
  title?: string;
  input?: TPointParam[];
  output?: TPointParam[];
  children?: ReactNode;
};

export const Node = makeNodeItem<TNodeProps>(
  (
    {
      title = 'Unnamed',
      input = [],
      output = [],
      children,
    }
  ) => {
    const id = useId();

    return (
      <div id={id} className={s.node}>
        <div data-drag className={s.head}>
          {title}
        </div>
        <div className={s.content}>
          <div className={s.left}>
            {
              input.map((e, i) => (
                <Point id={id} {...e} key={i} />
              ))
            }
          </div>
          <div className={s.center}>
            {children}
          </div>
          <div className={s.right}>
            {
              output.map((e, i) => (
                <Point output id={id} {...e} key={i} />
              ))
            }
          </div>
        </div>
      </div>
    );
  }
);