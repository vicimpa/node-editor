import { useCallback, useState } from "react";

export const useRerender = () => {
  const [_, update] = useState({});
  return useCallback(() => update({}), []);
};