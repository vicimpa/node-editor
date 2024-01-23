import { forwardRef, JSX } from "react";

type Source = JSX.IntrinsicElements;
type DocElements = HTMLElementTagNameMap;
type SvgElements = SVGElementTagNameMap;

type Elements = {
  [K in keyof Source]: (
    K extends keyof DocElements ? {
      props: Source[K],
      element: DocElements[K];
    } :
    K extends keyof SvgElements ? {
      props: Source[K],
      element: SvgElements[K];
    } :
    never
  )
};

type Params<K extends keyof Elements, T extends object> = (
  Parameters<
    typeof forwardRef<
      Elements[K]['element'],
      Omit<
        Elements[K]['props'],
        'ref' | keyof T
      > & T
    >
  >
);

export const forward = (
  <
    K extends keyof Elements,
    T extends object = {}
  >(...args: Params<K, T>) => (
    forwardRef(...args)
  )
);