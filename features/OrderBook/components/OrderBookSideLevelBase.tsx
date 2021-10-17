import { ReactNode } from "react";

export const ROW_HEIGHT = 26;

export function Row(props: { children?: ReactNode; rtl?: boolean }) {
  return (
    <div
      dir={props.rtl ? "rtl" : "ltr"}
      style={{ minHeight: ROW_HEIGHT }}
      className="flex-1 grid grid-cols-3 items-center relative px-4 lg:px-16"
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
