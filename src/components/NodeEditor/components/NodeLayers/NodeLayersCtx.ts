import { createElement, FC, ReactNode } from "react";

import { useAdd } from "@/hooks/useAdd";
import { useClass } from "@/hooks/useClass";
import { ReactiveSet } from "@/library/ReactiveSet";
import { classContext } from "@/utils/classContext";
import { counter } from "@/utils/counter";
import { makeSignalPortal } from "@/utils/makeSignalPortal";
import { signalRef } from "@/utils/signalRef";

const itemId = counter();

export type NodeLayersPortalProps = {
  isBefore?: boolean;
  children?: ReactNode;
};

export class NodeLayersItem {
  id = itemId();
  ref = signalRef<SVGGElement>();
  Portal = makeSignalPortal(this.ref);
}

export class NodeLayersCtx {
  before = new ReactiveSet<NodeLayersItem>();
  after = new ReactiveSet<NodeLayersItem>();

  useItem(isBefore = false) {
    const { before, after } = this;
    const list = isBefore ? before : after;
    const item = useClass(NodeLayersItem);
    return useAdd(list, item);
  }

  Portal: FC<NodeLayersPortalProps> = ({ isBefore = false, ...props }) => {
    const item = this.useItem(isBefore);
    return createElement(item.Portal, props);
  };
}

export const [
  NodeLayersProvider,
  useNodeLayers
] = classContext(NodeLayersCtx);