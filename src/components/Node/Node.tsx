import { ReactNode } from "react";

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
      id,
      title = 'Unnamed',
      input = [],
      output = [],
      children,
    },
    elem
  ) => (
    <div id={id} className={s.node}>
      <div data-drag className={s.head}>
        {title}
      </div>
      <div className={s.content}>
        <div className={s.left}>
          {
            input.map((e, i) => (
              <Point parent={elem} {...e} key={i} />
            ))
          }
        </div>
        <div className={s.center}>
          {children}
        </div>
        <div className={s.right}>
          {
            output.map((e, i) => (
              <Point parent={elem} output {...e} key={i} />
            ))
          }
        </div>
      </div>
    </div>
  )
);