export const counter = (n = 0) => (v?: number) => {
  if (typeof v === 'number')
    n = v;

  return n++;
};