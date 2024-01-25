import { createElement, FC, ReactNode, useEffect, useId, useMemo } from "react";
import { createPortal } from "react-dom";

import { ReactiveMap } from "@/library/ReactiveMap";
import { classContext } from "@/utils/classContext";
import { signalRef } from "@/utils/signalRef";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

export type HudPortalProps = {
  children?: ReactNode;
};

export class NodeHudItem {
  ref = signalRef<HTMLDivElement>();
  show = signal(true);
  constructor(public hud: NodeHudCtx) { }
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

  Portal: FC<HudPortalProps> = ({ children }) => {
    const item = this.useItem();

    return (
      createElement(() => (
        useSignals(),
        item.ref.current &&
        createPortal(
          children,
          item.ref.current
        )
      ))
    );
  };
}

export const [
  NodeHudProvider,
  useNodeHud
] = classContext(NodeHudCtx);