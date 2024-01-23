import { useLayoutEffect, useMemo } from "react";
import { useEvent } from "~/hooks/useEvent";
import { useRerender } from "~/hooks/useRerender";
import { emit, subscribe } from "~/utils/reactive";

export class ReactiveMap<K, V> extends Map<K, V> {
  set(key: K, value: V): this {
    try {
      return super.set(key, value);
    } finally {
      emit(this);
    }
  }

  delete(key: K): boolean {
    try {
      return super.delete(key);
    } finally {
      emit(this);
    }
  }

  clear(): void {
    try {
      return super.clear();
    } finally {
      emit(this);
    }
  }

  map<E>(fn: (e: [K, V], i: number) => E) {
    return Array.from(this, fn);
  }

  use() {
    const rerender = useRerender();
    const unsub = useEvent(subscribe(this, rerender));
    useLayoutEffect(() => unsub, []);
    return this;
  }

  static use<K, V>(init: Iterable<[K, V]> = []) {
    return useMemo(() => (
      new this(init)
    ), [...init]).use();
  }
}