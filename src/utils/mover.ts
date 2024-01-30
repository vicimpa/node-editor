import { BoundingRectObserver, BoundingRectObserverEntry } from "@/library/BoundingRectObserver";

export type TResizeListener = (entry: BoundingRectObserverEntry) => any;

const LISTENERS = new Set<TResizeListener>();

const observer = new BoundingRectObserver(
  (entries) => (
    entries.forEach(entry => (
      LISTENERS.forEach(sub => (
        sub(entry)
      ))
    ))
  )
);

export const mover = (
  element: Element,
  listener: TResizeListener
) => {
  const calledListener = (entry: BoundingRectObserverEntry) => {
    if (element !== entry.target) return;
    listener(entry);
  };

  LISTENERS.add(calledListener);
  observer.observe(element);

  return () => {
    LISTENERS.delete(calledListener);
    observer.unobserve(element);
  };
};