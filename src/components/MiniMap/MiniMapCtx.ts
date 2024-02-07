import { signalRef } from "@/utils/signalRef.ts";
import { classContext } from "@/utils/classContext.ts";
import { connect } from "@/decorators/connect.ts";
import { NodeListCtx } from "@/components/NodeEditor";

@connect([])
export class MiniMapCtx {
  list!: NodeListCtx;
  canvas = signalRef<HTMLCanvasElement>();

}

export const [
  MiniMapProvider,
  useMiniMap
] = classContext(MiniMapCtx);