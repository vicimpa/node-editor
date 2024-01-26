import { ReactNode, useEffect, useId, useMemo } from "react";

import { ReactiveMap } from "@/library/ReactiveMap";
import { classContext } from "@/utils/classContext";
import { makeSignalPortal } from "@/utils/makeSignalPortal";
import { signalRef } from "@/utils/signalRef";
import { signal } from "@preact/signals-react";

export type HudPortalProps = {
  children?: ReactNode;
};

export class NodeHudItem {
  ref = signalRef<HTMLDivElement>();
  show = signal(true);
  constructor(public hud: NodeHudCtx) { }
  Portal = makeSignalPortal(this.ref);
}

export class NodeHudCtx {
  ref = signalRef<HTMLDivElement>();
  list = new ReactiveMap<string, NodeHudItem>();

  useItem() {
    const id = useId();

    const item = useMemo(() => (
      new NodeHudItem(this)
    ), [id]);

    useEffect(() => (
      this.list.set(id, item),
      () => { this.list.delete(id); }
    ), [id, item]);

    return item;
  }

  get Portal() {
    const item = this.useItem();
    return item.Portal;
  };
}

export const [
  NodeHudProvider,
  useNodeHud
] = classContext(NodeHudCtx);