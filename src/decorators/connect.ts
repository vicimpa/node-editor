import { store } from "@/utils/store";

export type TPlugin<T extends object> = (object: T) => (() => void) | void;

export const connectStore = store(() => new Set<TPlugin<any>>, 'connect');

export const connect = <T extends object>(
  plugin: TPlugin<T>[]
) => (
  (target: Function) => {
    const store = connectStore(target.prototype);
    plugin.forEach(p => store.add(p));
  }
) as ClassDecorator;