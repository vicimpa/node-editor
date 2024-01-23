import { FC } from "react";

import { TDebugCTXValue, useDebug } from "./DebugProvider";

export type TDebugProps = {
  children: TDebugCTXValue;
  title?: string;
};

export const Debug: FC<TDebugProps> = (
  ({ children, title }) => (
    useDebug(children, title)
  )
);