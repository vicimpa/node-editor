import { effect } from "@preact/signals-react";

import { Connect } from "../ConnectList";

export const detectRemove = (connect: Connect) => {
  return (
    effect(() => {
      if (!connect.to.item.ref.current || !connect.from.item.ref.current) {
        connect.list.delete(connect);
      }
    })
  );
};