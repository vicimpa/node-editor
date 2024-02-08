import { emit } from "@/utils/reactive";

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

  map<E>(fn: (e: V, i: K, m: this) => E) {
    var j = 0, output = new Array<E>(this.size);
    this.forEach((e, i) => output[j++] = fn(e, i, this));
    return output;
  }
}