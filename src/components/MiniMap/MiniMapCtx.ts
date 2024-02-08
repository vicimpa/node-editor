import { signalRef } from "@/utils/signalRef.ts";
import { classContext } from "@/utils/classContext.ts";
import { connect } from "@/decorators/connect.ts";
import { NodeListCtx } from "@/components/NodeEditor";
import { detectDrag } from "@/components/MiniMap/lib/detectClick.ts";

@connect([detectDrag])
export class MiniMapCtx {
  list!: NodeListCtx;
  canvas = signalRef<HTMLCanvasElement>();

  width = 180;
  height = 180;
}

export const [
  MiniMapProvider,
  useMiniMap
] = classContext(MiniMapCtx);