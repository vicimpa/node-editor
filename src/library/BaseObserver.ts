import { looper, runLoop, TLoop } from "@/utils/looper";

export class BaseObserver<T, R, E> {
  #map = new Map<T, R | null>();

  #loop: TLoop;
  #dispose?: () => void;

  constructor(
    calculate: (target: T) => R,
    condition: (a: R | null, b: R) => any,
    makeEntry: (result: R, target: T, time: number) => E,
    callback: (entries: E[]) => any
  ) {
    this.#loop = (time) => {
      var entries: E[] = [];

      this.#map.forEach((result, target) => {
        const newResult = calculate(target);

        if (!condition(result, newResult)) {
          entries.push(
            makeEntry(
              newResult,
              target,
              time
            )
          );

          this.#map.set(target, newResult);
        }
      });

      entries.length && callback(entries);
    };
  }

  observe(target: T) {
    this.#map.set(target, null);

    runLoop(this.#loop);

    if (!this.#dispose)
      this.#dispose = looper(this.#loop);

    return () => {
      this.unobserve(target);
    };
  }

  unobserve(target: T) {
    this.#map.delete(target);

    if (this.#dispose && this.#map.size)
      this.disconnect();
  }

  disconnect() {
    this.#map.clear();
    this.#dispose?.();
    this.#dispose = undefined;
  }
}