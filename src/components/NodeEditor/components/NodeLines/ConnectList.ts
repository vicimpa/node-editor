import { connect } from "@/decorators/connect";
import { ReactiveSet } from "@/library/ReactiveSet";
import { signalRef } from "@/utils/signalRef";

import { NodePortCtx } from "../NodePort";
import { NodeLinesCtx } from "./";
import { detectReconnect } from "./lib/detectReconnect";

@connect([detectReconnect])
export class Connect {
  ref = signalRef<SVGPathElement>();

  constructor(
    public from: NodePortCtx,
    public to: NodePortCtx,
    public list: ConnectList,
  ) { }
}

export class ConnectList extends ReactiveSet<Connect> {
  get nodemap() {
    return this.lines.map;
  }

  constructor(public lines: NodeLinesCtx) {
    super();
  }

  connect(from: NodePortCtx, to: NodePortCtx) {
    if (from.isOutput === to.isOutput)
      return;

    if (from.item === to.item)
      return;

    if (to.isOutput)
      [from, to] = [to, from];

    for (const connect of this) {
      if (connect.from === from && connect.to === to)
        return;
    }

    try {
      if (
        false
        || (from.onConnect && !from.onConnect?.(to))
        || (to.onConnect && !to.onConnect?.(from))
      ) return;

      this.add(new Connect(from, to, this));
    } catch (e) {
      console.error(e);
    }
  }
}