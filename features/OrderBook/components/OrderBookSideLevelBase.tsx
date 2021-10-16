import { ReactNode } from "react";
import { Dir } from "../types";

export const ROW_HEIGHT = 26;

export function Row(props: { children?: ReactNode; dir: Dir }) {
  return (
    <div
      dir={props.dir}
      style={{ minHeight: ROW_HEIGHT }}
      className="flex-1 grid grid-cols-3 items-center relative px-16"
    >
      {props.children}
    </div>
  );
}

export function Cell(props: { children: ReactNode; color?: string }) {
  return (
    <div dir="rtl" className={props.color}>
      {props.children}
    </div>
  );
}
