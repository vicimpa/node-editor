declare type TCallback<A extends any[], R = any> = (...args: A) => R;

declare class DOMRect {
  count: (n: number) => number;
}