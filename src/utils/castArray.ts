export const castArray = <T>(input: T | T[]) => (
  ([] as T[]).concat(input)
);