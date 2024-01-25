import { FC, ReactNode, RefObject, useContext, useEffect, useMemo } from "react";

import { useClass } from "@/hooks/useClass";
import { useDrag } from "@/hooks/useDrag";
import { useEvent } from "@/hooks/useEvent";
import { useSignalCorrect } from "@/hooks/useSIgnalCorrect";
import { useSignalRef } from "@/hooks/useSignalRef";
import { ReactiveMap } from "@/library/ReactiveMap";
import { Vec2 } from "@/library/Vec2";
import { attribute } from "@/utils/attribute";
import { fixed } from "@/utils/fixed";
import { cropSize } from "@/utils/math";
import { objectContext } from "@/utils/objectContext";
import { Signal, useSignal, useSignalEffect } from "@preact/signals-react";

import { Debug } from "../Debug";
import { useNodeMap } from "./";
import { NodeItem, NodeItemContext } from "./NodeItem";

export type NodeListItem = {
  id: string;
  x: Signal<number>;
  y: Signal<number>;
  width: Signal<number>;
  height: Signal<number>;
  target: RefObject<SVGForeignObjectElement>;
  focus(): void;
};

export type NodeListCtx = ReactiveMap<string, NodeListItem>;

export type NodeListProps = {
  children?: ReactNode;
};

const [NodeListProvider, useNodeListCtx] = (
  objectContext<NodeListCtx>('NodeList')
);

export const useNodeItem = (id: string, startX?: number, startY?: number) => {
  const topCtx = useContext(NodeItemContext);

  if (topCtx)
    return topCtx;

  const { width: w, height: h } = useNodeMap();
  const x = useSignalCorrect(startX ?? 0, v => cropSize(v, w, .5));
  const y = useSignalCorrect(startY ?? 0, v => cropSize(v, h, .5));
  const width = useSignal(0);
  const height = useSignal(0);
  const target = useSignalRef<SVGForeignObjectElement>(null);
  const list = useNodeListCtx();
  const elem = useMemo<NodeListItem>(() => ({
    x, y, width, height, target, id, focus() {
      list.delete(id);
      list.set(id, elem);
    }
  }), [x, y, width, height, id]);

  const drag = useDrag(({ target }) => {
    elem.focus();
    attribute(target, { moved: true });
    const start = Vec2.fromSignals(x, y);

    return ({ offsetDelta }) => (
      start.cminus(offsetDelta).toSignals(x, y),
      () => { attribute(target, { moved: false }); }
    );
  }, 0);

  const mouseDown = useEvent(
    (e: MouseEvent) => {
      const { current: el } = target;
      const { target: down } = e;
      if (!el || !down) return;

      elem.focus();

      for (const find of el.querySelectorAll('[data-drag]')) {
        if (!(down instanceof HTMLElement))
          continue;

        if (find !== down && !find.contains(down))
          continue;

        drag(e);
      }
    }
  );

  useSignalEffect(() => {
    const { current: elem } = target;
    if (!elem) return;
    elem.addEventListener('mousedown', mouseDown);
    return () => {
      elem.removeEventListener('mousedown', mouseDown);
    };
  });

  useSignalEffect(() => {
    const { current: elem } = target;
    if (!elem) return;
    elem.x.baseVal.value = x.value - width.value / 2;
    elem.y.baseVal.value = y.value - height.value / 2;
    elem.width.baseVal.value = width.value;
    elem.height.baseVal.value = height.value;
  });

  useEffect(() => (
    list.set(id, elem),
    () => { list.delete(id); }
  ), [id, elem, list]);

  return elem;
};

export const NodeList: FC<NodeListProps> = ({ children }) => {
  const map = useClass<NodeListCtx, []>(ReactiveMap).use();
  const lastId = [...map.keys()].at(-1);
  const lastItem = map.get(lastId!);

  return (
    <NodeListProvider value={map}>
      {children}
      {
        map.map((ref, key) => (
          <NodeItem
            id={`n${key}`}
            key={key}
            ref={ref.target} />
        ))
      }
      {
        lastItem ? (
          <Debug title="LastItem">
            {{
              Id: <>{lastId}</>,
              PosX: <>{fixed(lastItem.x)}</>,
              PosY: <>{fixed(lastItem.y)}</>,
              Width: <>{fixed(lastItem.width)}</>,
              Height: <>{fixed(lastItem.height)}</>,
            }}
          </Debug>
        ) : (
          <Debug title="LastItem">
            {{
              Id: <>None</>
            }}
          </Debug>
        )
      }
    </NodeListProvider>
  );
};