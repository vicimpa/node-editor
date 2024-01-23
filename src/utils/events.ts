export type WEM = WindowEventMap;
export type TListener<T extends Event = Event> = (e: T) => any;

const WINDOW_EVENTS = new Map<keyof WEM, Set<TListener<any>>>();

const getCollect = <K extends keyof WEM>(
  key: K,
  set = new Set<TListener<WEM[K]>>()
) => (
  set = WINDOW_EVENTS.get(key) ?? (
    WINDOW_EVENTS.set(key, set),
    addEventListener(key, (event) => (
      set.forEach(sub => sub(event))
    ), { passive: false }), set
  )
);

export const windowEvent = <K extends keyof WEM>(
  key: K | K[],
  listener: TListener<WEM[K]>
) => {
  if (Array.isArray(key)) {
    const unsub = key.map(e => windowEvent(e, listener));
    return () => { unsub.forEach(u => u()); };
  }

  const collect = getCollect(key).add(listener);
  return () => { collect.delete(listener); };
};