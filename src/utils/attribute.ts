export type TDate = {
  [key: string]: boolean;
};

export const attribute = (target: any, data: TDate) => {
  if (target instanceof Element) {
    for (const key in data) {
      const method = data[key] ? 'setAttribute' : 'removeAttribute';
      target[method](`data-${key}`, '');
    }
  }
};