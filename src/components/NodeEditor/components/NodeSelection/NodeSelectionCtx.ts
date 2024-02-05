import { NodeItemCtx, NodeListCtx } from "@/components/NodeEditor";
import { detectDrag } from "@/components/NodeEditor/components/NodeSelection/lib/detectDrag.ts";
import { connect } from "@/decorators/connect";
import { ReactiveSet } from "@/library/ReactiveSet";
import { Vec2 } from "@/library/Vec2";
import { classContext } from "@/utils/classContext.ts";
import { signal } from "@preact/signals-react";

@connect([detectDrag])
export class NodeSelectionCtx {
  list!: NodeListCtx;

  items = new ReactiveSet<NodeItemCtx>();

  selectFrom = signal<Vec2 | undefined>(undefined);
  selectTo = signal<Vec2 | undefined>(undefined);

  constructor() {
  }

  toSelection(item: NodeItemCtx, force = false) {
    if (force) {
      this.items.add(item);
      return;
    }

    if (!this.items.has(item)) {
      this.items.clear();
      this.items.add(item);
    }
  }

  clearSelection() {
    this.items.clear();
  }

}

export const [
  NodeSelectionProvider,
  useNodeSelection
] = classContext(NodeSelectionCtx);