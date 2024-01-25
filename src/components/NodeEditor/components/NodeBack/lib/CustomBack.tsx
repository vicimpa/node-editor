import { FC, ReactNode } from "react";

export type CustomBackProps = {
  children?: ReactNode;
};

export const CustomBack: FC<CustomBackProps> = ({ children }) => (
  children
);