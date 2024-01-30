import { connect } from "@/decorators/connect";
import { signalRef } from "@/utils/signalRef";

@connect([])
export class NodePortCtx {
  ref = signalRef<HTMLSpanElement>();

}