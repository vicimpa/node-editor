import { FC, ReactNode } from "react";

import s from "./MainLayout.module.sass";

export const MainLayout: FC<{ children?: ReactNode; }> = ({ children }) => (

  <div className={s.layout}>
    <div className={s.header}>
      какой-то заголовок
    </div>
    <div className={s.main}>
      <div className={s.sidebar}>
        какой-то сайдбар
      </div>
      <div className={s.content}>
        {children}
      </div>
    </div>
  </div>
);