import {
    createContext, createElement, FC, ReactNode, RefObject, useContext, useEffect
} from "react";
import { createPortal } from "react-dom";

import { useClass } from "@/hooks/useClass";
import { useSignalRef } from "@/hooks/useSignalRef";
import { ReactiveSet } from "@/library/ReactiveSet";
import { useSignals } from "@preact/signals-react/runtime";

type NodeLayersCtx = ReactiveSet<RefObject<SVGGElement>>;

const BeforeCTX = createContext<NodeLayersCtx | null>(null);
const AfterCTX = createContext<NodeLayersCtx | null>(null);

export type NodeLayerType = 'before' | 'after';

const useLayer = (type: NodeLayerType = 'after') => {
  const list = useContext(type === 'before' ? BeforeCTX : AfterCTX);
  const ref = useSignalRef<SVGGElement>(null);

  if (!list)
    throw new Error('You need using in NodeLayers context');

  useEffect(() => (
    list.add(ref),
    () => { list.delete(ref); }
  ), [list, ref]);

  return ref;
};

export type NodeLayerItemProps = {
  type?: NodeLayerType;
  children?: ReactNode;
};

export const NodeLayerPortal: FC<NodeLayerItemProps> = ({ type, children }) => {
  const ref = useLayer(type);

  return createElement(() => {
    useSignals();

    if (!ref.current)
      return null;

    return createPortal(children, ref.current);
  });
};

export const NodeLayers: FC<{ children?: ReactNode; }> = ({ children }) => {
  const beforeSet = useClass<NodeLayersCtx, []>(ReactiveSet);
  const afterSet = useClass<NodeLayersCtx, []>(ReactiveSet);

  return (
    <>
      {
        createElement(() => (
          beforeSet.use(),
          beforeSet.map((el, i) => (
            <g ref={el} key={i} />
          ))
        ))
      }
      <BeforeCTX.Provider value={beforeSet}>
        <AfterCTX.Provider value={afterSet}>
          <g>
            {children}
          </g>
        </AfterCTX.Provider>
      </BeforeCTX.Provider>
      {
        createElement(() => (
          afterSet.use(),
          afterSet.map((el, i) => (
            <g ref={el} key={i} />
          ))
        ))
      }
    </>
  );
};