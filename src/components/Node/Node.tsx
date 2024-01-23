import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDrag } from "~/hooks/useDrag";
import { Vec2 } from "~/library/Vec2";

import { useViewMapCTX } from "../ViewMap";
import { useNodeElement } from "../ViewNodeList";
import s from "./Node.module.sass";

export type TNodeProps = {
  title?: string;
  children?: ReactNode;
};

export const Node: FC<TNodeProps> = ({
  title = 'Unnamed',
  children,
}) => {
  const { posX, posY, element, focus } = useNodeElement();
  const { scale, lock, moved } = useViewMapCTX();

  const drag = useDrag(({ start }) => (
    moved.value ? undefined : (
      focus(),
      lock.value = true,
      start = Vec2.fromSignals(posX, posY),
      ({ delta }) => {

        delta
          .div(scale)
          .plus(start)
          .toSignals(posX, posY);

        return () => {
          lock.value = false;
        };
      }
    )
  ));

  return createPortal(
    <div className={s.node} onMouseDown={focus}>
      <div className={s.head} onMouseDown={drag}>
        {title}
      </div>
      <div className={s.content}>
        {children}
      </div>
    </div>,
    element
  );
};