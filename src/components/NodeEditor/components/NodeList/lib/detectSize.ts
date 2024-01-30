import {subscribe} from "@/utils/reactive";

import {NodeListCtx} from "../";

export const detectSize = (list: NodeListCtx) => (
  list.itemsCount.value = list.list.size,
    subscribe(list.list, () => (
      list.itemsCount.value = list.list.size
    ))
);