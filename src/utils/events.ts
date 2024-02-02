import { RefObject } from "react";

import { effect } from "@preact/signals-react";

export type WEM = WindowEventMap;
export type DEM = DocumentEventMap;
export type HEM = HTMLElementEventMap;
export type SEM = SVGElementEventMap;
export type TListener<T extends Event = Event> = (e: T) => any;

export const refSvgEvent = <T extends SVGElement, K extends keyof SEM>(
  ref: RefObject<T>,
  key: K | K[],
  listener: TListener<SEM[K]>
) => {
  if (Array.isArray(key)) {
    const unsub = key.map(e => refSvgEvent(ref, e, listener));
    return () => { unsub.forEach(u => u?.()); };
  }

  return effect(() => {
    const { current: elem } = ref;
    if (elem) {
      elem.addEventListener(key, listener);
      return () => { elem.removeEventListener(key, listener); };
    }
  });
};

export const refEvent = <T extends HTMLElement, K extends keyof HEM>(
  ref: RefObject<T>,
  key: K | K[],
  listener: TListener<HEM[K]>
) => {
  if (Array.isArray(key)) {
    const unsub = key.map(e => refEvent(ref, e, listener));
    return () => { unsub.forEach(u => u?.()); };
  }

  return effect(() => {
    const { current: elem } = ref;
    if (elem) {
      elem.addEventListener(key, listener);
      return () => { elem.removeEventListener(key, listener); };
    }
  });
};

export const windowEvent = <K extends keyof WEM>(
  key: K | K[],
  listener: TListener<WEM[K]>
) => {
  if (Array.isArray(key)) {
    const unsub = key.map(e => windowEvent(e, listener));
    return () => { unsub.forEach(u => u()); };
  }

  return (
    addEventListener(key, listener),
    () => { removeEventListener(key, listener); }
  );
};

export const documentEvent = <K extends keyof DEM>(
  key: K | K[],
  listener: TListener<DEM[K]>
) => {
  if (Array.isArray(key)) {
    const unsub = key.map(e => documentEvent(e, listener));
    return () => { unsub.forEach(u => u()); };
  }

  return (
    document.addEventListener(key, listener),
    () => { document.removeEventListener(key, listener); }
  );
};