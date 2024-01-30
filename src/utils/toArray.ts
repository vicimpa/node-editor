export const toArray = <T>(input: T | T[]) => (
  ([] as T[]).concat(input)
);