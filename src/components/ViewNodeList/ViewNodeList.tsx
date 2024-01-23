import { FC, ReactNode, useEffect, useId, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useClass } from "~/hooks/useClass";
import { useElement } from "~/hooks/useElements";
import { useSignalCorrect } from "~/hooks/useSIgnalCorrect";
import { ReactiveMap } from "~/library/ReactiveMap";
import { cropSize } from "~/utils/math";
import { objectContext } from "~/utils/objectContext";

import { batch, useSignalEffect } from "@preact/signals-react";

import { useViewMapCTX } from "../ViewMap";
import s from "./ViewNodeList.module.sass";

const [
  NodeListCTX,
  useNodelist
] = objectContext<ReactiveMap<string, HTMLElement>>();

export const useNodeElement = (x: number = 0, y: number = 0) => {
  const id = useId();
  const list = useNodelist();
  const { width, height } = useViewMapCTX();
  const posX = useSignalCorrect(x, v => cropSize(v, width, .5));
  const posY = useSignalCorrect(y, v => cropSize(v, height, .5));
  const element = useElement('div', e => { e.className = s.node; });

  useLayoutEffect(() => {
    batch(() => {
      posX.value = x;
      posY.value = y;
    });
  }, [x, y]);

  useEffect(() => (
    list.set(id, element),
    () => { list.delete(id); }
  ));

  useSignalEffect(() => {
    const { style } = element;
    const { value: x } = posX;
    const { value: y } = posY;

    style.transform = '' + (
      new DOMMatrix([1, 0, 0, 1, -x, -y])
    );
  });

  return {
    id,
    element,
    posX,
    posY,
    focus() {
      list.delete(id) &&
        list.set(id, element);
    }
  };
};

const NodeItem: FC<{ target: HTMLElement; }> = ({ target }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.appendChild(target);
    return () => { ref.current?.removeChild(target); };
  }, [target]);

  return (
    <div ref={ref} className={s.contents} />
  );
};

export const ViewNodeList: FC<{ children?: ReactNode; }> = ({ children }) => {
  const element = useElement('div');
  const list = useClass(ReactiveMap<string, HTMLElement>).use();

  return (
    <NodeListCTX value={list}>
      {createPortal(<>{children}</>, element)}
      {list.map(([key, target]) => (
        <NodeItem key={key} target={target} />
      ))}
    </NodeListCTX>
  );
};