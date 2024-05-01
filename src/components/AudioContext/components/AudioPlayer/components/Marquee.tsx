import { createElement, FC, ReactNode } from "react";

import s from "../AudioPlayer.module.sass";

export type MarqueeProps = {
  children?: ReactNode;
};

export const Marquee: FC<MarqueeProps> = ({ children }) => (
  createElement('marquee', { className: s.marquee }, children)
);
