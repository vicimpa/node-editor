import { BaseSchema, parse } from "valibot";

import { emit } from "./reactive";

const MAPPED_SCHEMA = new Map<string, BaseSchema>();
const MAPPED_STORE = new Map<string, TValiStore<any>>();

type TValiStore<T> = {
  value: T;
};

export const valistore = <T>(
  key: string,
  schema: BaseSchema<T>,
  initial: T
) => {
  if (MAPPED_SCHEMA.has(key)) {
  } else {
    MAPPED_SCHEMA.set(key, schema);
  }

  if (MAPPED_STORE.has(key))
    return MAPPED_STORE.get(key)! as TValiStore<T>;

  var isInit = false;
  var value!: T;

  const store: TValiStore<T> = ({
    get value(): T {
      if (isInit)
        return value;

      try {
        const data = localStorage.getItem(key) ?? '';
        return value = parse(schema, JSON.parse(data));
      } catch (e) {
        return this.value = value = initial;
      } finally {
        isInit = true;
      }
    },
    set value(newValue: T) {
      const json = JSON.stringify(
        value = parse(schema, newValue)
      );
      localStorage.setItem(key, json);
      emit(store);
    }
  });

  return (MAPPED_STORE.set(key, store), store);
};