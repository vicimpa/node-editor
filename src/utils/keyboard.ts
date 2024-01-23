import ShoSho, { Handler } from "shosho";

const base = new ShoSho({
  capture: true,
  target: window
});

base.start();

export type TArgs = [
  type: string | string[],
  event: Handler
];

export const shortcut = (...args: TArgs) => {
  return base.register(...args);
};

export const shortcuts = (list: TArgs[]) => {
  const unsub = list.map(args => shortcut(...args));
  return () => { unsub.forEach(u => u()); };
};