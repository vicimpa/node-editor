import { FC, MouseEventHandler } from "react";

import s from "./DeleteButton.module.sass";

export const DeleteButton: FC<{ onClick?: MouseEventHandler; }> = (props) => {

  return (
    <a {...props} className={s.delete}>
      ⓧ
    </a>
  );
};