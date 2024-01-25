import { ReactNode } from "react";

import { makeNodeItem } from "../NodeEditor";
import s from "./Node.module.sass";

export type TNodeProps = {
  title?: string;
  children?: ReactNode;
};

export const Node = makeNodeItem<TNodeProps>(
  (
    {
      title = 'Unnamed',
      children,
    }
  ) => (
    <div className={s.node}>
      <div className={s.head}>
        {title}
      </div>
      <div className={s.content}>
        <div className={s.center}>
          {children}
          <button data-drag>Drag And Drop</button>
        </div>

        <div className={s.pins}>

        </div>
      </div>
    </div>
  )
);