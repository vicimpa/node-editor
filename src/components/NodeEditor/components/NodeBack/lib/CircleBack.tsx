import { FC } from "react";

export type CircleBackProps = {
  r?: number;
  fill?: string;
};

export const CircleBack: FC<CircleBackProps> = ({ r = 2, fill = '#fff' }) => (
  <circle {...{ r, fill }} />
);