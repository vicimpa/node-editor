export type TFV<T, A extends any[] = []> = T | ((...args: A) => T);

export const fv = <T, A extends any[]>(fvc: TFV<T, A>, ...args: A) => (
  fvc instanceof Function ? fvc(...args) : fvc
);