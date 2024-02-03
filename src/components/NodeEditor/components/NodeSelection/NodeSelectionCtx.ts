import {connect} from "@/decorators/connect";
import {Vec2} from "@/library/Vec2";
import {classContext} from "@/utils/classContext.ts";
import {signal} from "@preact/signals-react";
import {NodeItemCtx, NodeListCtx} from "@/components/NodeEditor";
import {ReactiveMap} from "@/library/ReactiveMap.ts";
import {detectDrag} from "@/components/NodeEditor/components/NodeSelection/lib/detectDrag.ts";

@connect([detectDrag])
export class NodeSelectionCtx {
  list!: NodeListCtx;

  items = new ReactiveMap<string, NodeItemCtx>();

  selectFrom = signal<Vec2 | undefined>(undefined);
  selectTo = signal<Vec2 | undefined>(undefined);

  constructor() {
  }

  toSelection(item: NodeItemCtx) {
    this.items.set(item.id, item)
  }

  clearSelection() {
    this.items.clear()
  }

}

export const [
  NodeSelectionProvider,
  useNodeSelection
] = classContext(NodeSelectionCtx);