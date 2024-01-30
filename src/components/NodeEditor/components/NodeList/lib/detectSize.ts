import { subscribe } from "@/utils/reactive";

import { NodeListCtx } from "../";

export const detectSize = (list: NodeListCtx) => (
  subscribe(list.list, () => (
    list.itemsCount.value = list.list.size
  ))
);