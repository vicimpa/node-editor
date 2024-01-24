import { useId } from "react";

export const useVariID = (prefix: string) => {
  const vari = useId().replace(/[^\d]/g, '_');
  return prefix + vari;
};