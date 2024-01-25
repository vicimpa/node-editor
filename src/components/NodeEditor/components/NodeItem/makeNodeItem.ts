import { createElement, FC, ReactNode, useId } from "react";
import { createPortal } from "react-dom";

import { useComputed } from "@preact/signals-react/runtime";

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
    const reserveId = useId();
    const ctx = NodeItemCtx.use(id ?? reserveId);

    return (
      useComputed(() => (
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