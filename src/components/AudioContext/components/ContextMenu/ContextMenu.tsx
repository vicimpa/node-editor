import { FC, MouseEventHandler, useMemo } from "react";

import s from "./ContextMenu.module.sass";

export type TContextMenuItem = {
  name: string;
  children?: TContextMenuItem[];
  onClick?: MouseEventHandler;
};

export type ContextMenuProps = {
  head?: string;
  menu: TContextMenuItem[];
};

export const ContextMenu: FC<ContextMenuProps> = ({
  head, menu
}) => {
  const sortMenu = useMemo(() => {
    return menu.toSorted((a, b) => +!!b.children - +!!a.children);
  }, []);

  return (
    <div className={s.menu}>
      {head && (
        <h5>{head}</h5>
      )}

      {sortMenu.map((item, key) => (
        <button onClick={item.onClick} key={key}>
          {item.name}
        </button>
      ))}
    </div>
  );
};