import { createElement, FC, ReactNode } from "react";
import { createPortal } from "react-dom";

import { useSignals } from "@preact/signals-react/runtime";

import { useNodeList } from "../NodeList";
import { NodeItemCtx } from "./";

export type BaseNodeItemProps = {
  id?: string;
  x?: number;
  y?: number;
};

export const makeNodeItem = <T extends object>(
  hoc: (
    props: Omit<T, 'id' | 'x' | 'y'>,
    ctx: NodeItemCtx
  ) => ReactNode
): FC<BaseNodeItemProps & T> => ({
  id,
  x = 0,
  y = 0,
  ...props
}) => {
    const ctx = useNodeList().useItem(id);

    return (
      createElement(() => (
        useSignals(),
        ctx.div.current &&
        createPortal(
          createElement(() => (
            hoc(props, ctx)
          )),
          ctx.div.current
        )
      ))
    );
  };