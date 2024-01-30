import { signalRef } from "@/utils/signalRef";

export class NodePortCtx {
  ref = signalRef<HTMLSpanElement>();

  connect() {
    const dispose: Array<() => void> = [];

    return () => { dispose.forEach(u => u()); };
  }
}