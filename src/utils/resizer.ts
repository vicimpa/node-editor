export type TResizeListener = (entry: ResizeObserverEntry) => any;

const LISTENERS = new Set<TResizeListener>();

const observer = new ResizeObserver(
  (entries) => (
    entries.forEach(entry => (
      LISTENERS.forEach(sub => (
        sub(entry)
      ))
    ))
  )
);

export const resizer = (
  element: Element,
  listener: TResizeListener
) => {
  const calledListener = (entry: ResizeObserverEntry) => {
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