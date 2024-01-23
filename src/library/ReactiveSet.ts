import { useLayoutEffect, useMemo } from "react";
import { useEvent } from "~/hooks/useEvent";
import { useRerender } from "~/hooks/useRerender";
import { emit, subscribe } from "~/utils/reactive";

export class ReactiveSet<T> extends Set<T> {
  add(value: T): this {
    var size = this.size;
    try {
      return super.add(value);
    } finally {
      size !== this.size && emit(this);
    }
  }

  delete(value: T): boolean {
    var size = this.size;
    try {
      return super.delete(value);
    } finally {
      size !== this.size && emit(this);
    }
  }

  clear(): void {
    var size = this.size;
    try {
      return super.clear();
    } finally {
      size !== this.size && emit(this);
    }
  }

  map<E>(fn: (e: T, i: number) => E) {
    return Array.from([...this], fn);
  }

  use() {
    const rerender = useRerender();
    const unsub = useEvent(subscribe(this, rerender));
    useLayoutEffect(() => unsub, []);
    return this;
  }

  static use<T>(init: Iterable<T> = []) {
    return useMemo(() => (
      new this(init)
    ), [...init]).use();
  }
}