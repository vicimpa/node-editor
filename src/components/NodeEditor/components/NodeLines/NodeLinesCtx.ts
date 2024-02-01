import {connect} from "@/decorators/connect";
import {classContext} from "@/utils/classContext.ts";

@connect([])
export class NodeLinesCtx {

}

export const [
  NodeLinesProvider,
  useNodeLines
] = classContext(NodeLinesCtx);