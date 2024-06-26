import {
    createContext, createElement, FC, Fragment, ReactNode, useContext, useEffect, useId,
    useLayoutEffect
} from "react";
import { boolean } from "valibot";

import { useClass } from "@/hooks/useClass";
import { useShortcut } from "@/hooks/useShortcut.ts";
import { useSubEmit } from "@/hooks/useSubEmit";
import { useValistore } from "@/hooks/useValistore";
import { ReactiveMap } from "@/library/ReactiveMap";

import { useNodeHud } from "../NodeEditor";
import s from "./Debug.module.sass";

export type TDebugCTXValue = Record<string, ReactNode>;

const DebugCTX = createContext<ReactiveMap<string, TDebugCTXValue> | null>(null);
const DebugTitleCTX = createContext<ReactiveMap<string, string> | null>(null);

export const useDebug = (children: TDebugCTXValue, title?: string) => {
  const id = useId();
  const ctx = useContext(DebugCTX);
  const titles = useContext(DebugTitleCTX);

  if (!ctx || !titles)
    throw new Error('Using only in DebugCTX');

  useLayoutEffect(() => {
    ctx.set(id, children);
    titles.set(id, title ?? 'Unnamed');

  });

  useEffect(() => (
    () => {
      ctx.delete(id);
      titles.delete(id);
    }
  ), []);

  return null;
};

export const schema = boolean();

export const DebugProvider: FC<{ children?: ReactNode; }> = ({ children }) => {
  const showDebug = useValistore('SHOW_DEBUG', schema, false);

  const list = useClass(ReactiveMap<string, TDebugCTXValue>);
  const titles = useClass(ReactiveMap<string, string>);
  const hud = useNodeHud();

  useSubEmit(list);
  useSubEmit(titles);

  useShortcut('`', () => {
    showDebug.value = !showDebug.value;
  });

  return (
    <>
      <DebugCTX.Provider value={list}>
        <DebugTitleCTX.Provider value={titles}>
          {children}
        </DebugTitleCTX.Provider>
      </DebugCTX.Provider>
      <hud.Portal>
        <div className={s.debug} key="debug" data-show={showDebug.value || undefined}>
          {
            list.size ? (
              list.map((value, key) => (
                <div key={key} className={s.item}>
                  <h4 className={s.head}>
                    {titles.get(key) ?? 'Unnamed'}:
                  </h4>
                  <div className={s.contents}>
                    {
                      Object.entries(value)
                        .map(([key, value]) => (
                          createElement(Fragment, { key }, [
                            <span key={key + 'key'}>{key}:</span>,
                            <span key={key + 'value'}>{value}</span>
                          ])
                        ))
                    }
                  </div>
                </div>
              ))
            ) : (
              <p>Debug empty</p>
            )
          }
        </div>
      </hud.Portal>
    </>
  );
};