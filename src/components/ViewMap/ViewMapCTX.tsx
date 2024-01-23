import { objectContext } from "~/utils/objectContext";

import { Signal } from "@preact/signals-react";

export type TViewMapCTX = {
  posX: Signal<number>;
  posY: Signal<number>;
  scale: Signal<number>;
  lock: Signal<boolean>;
  moved: Signal<boolean>;
  width: number;
  height: number;
};

export const [
  ViewMapProvider,
  useViewMapCTX
] = objectContext<TViewMapCTX>('ViewMap');