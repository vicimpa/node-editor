const REACTIVE = new Set<(o: object) => any>();

export const emit = (obj: object) => {
  for (const sub of REACTIVE) {
    if (sub(obj) === true)
      return;
  }
};

export const subscribe = (obj: object, listener: () => any) => {
  const call = (o: object) => {
    if (o !== obj) return;
    return listener();
  };

  return (
    REACTIVE.add(call),
    () => { REACTIVE.delete(call); }
  );
};