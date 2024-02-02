import { ReactiveSet } from "@/library/ReactiveSet";

import { NodePortCtx } from "../NodePort";

export class Connect {
  constructor(
    public from: NodePortCtx,
    public to: NodePortCtx
  ) { }
}

export class ConnectList extends ReactiveSet<Connect> {
  connect(from: NodePortCtx, to: NodePortCtx) {
    if (from.isOutput === to.isOutput)
      return;

    if (from.item === to.item)
      return;

    if (to.isOutput)
      [from, to] = [to, from];

    for (const connect of this) {
      if (
        false
        || (connect.from === from && connect.to === to)
        || (connect.to === from && connect.from === to)
      ) return;
    }

    try {
      if (
        false
        || from.onConnect?.(to) === false
        || to.onConnect?.(from) === false
      ) return;

      this.add(new Connect(from, to));
    } catch (e) {
      console.error(e);
      return;
    }
  }
}