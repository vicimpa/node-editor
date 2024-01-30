import { createElement, FC, ReactNode } from "react";

import { useAdd } from "@/hooks/useAdd";
import { useClass } from "@/hooks/useClass";
import { ReactiveSet } from "@/library/ReactiveSet";
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
  list = new ReactiveSet<NodeHudItem>();

  useItem() {
    const item = useClass(NodeHudItem, this);
    return useAdd(this.list, item, [item]);
  }

  Portal: FC<HudPortalProps> = (props) => {
    const item = this.useItem();
    return createElement(item.Portal, props);
  };
}

export const [
  NodeHudProvider,
  useNodeHud
] = classContext(NodeHudCtx);