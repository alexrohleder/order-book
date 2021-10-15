import { ReactNode } from "react";
import { useSelector } from "../hooks/useStore";
import { formatFloat, formatInt } from "../lib/formatter";
import {
  selectLevelDepth,
  selectPrice,
  selectSize,
  selectTotal,
} from "../selectors";
import { DeltaType, Orientation } from "../types";

type Props = {
  type: DeltaType;
  orientation: Orientation;
  rtl: boolean;
  index: number;
};

export const ROW_HEIGHT = 26;

function OrderBookTableRow(props: Props) {
  const price = useSelector((state) => selectPrice(state, props));
  const size = useSelector((state) => selectSize(state, props));
  const total = useSelector((state) => selectTotal(state, props));
  const levelDepth = useSelector((state) => selectLevelDepth(state, props));

  if (!price || !size || !total) {
    return <Row />;
  }

  return (
    <Row bg={{ rtl: props.rtl, type: props.type, pos: levelDepth }}>
      <Cell>{formatInt(total)}</Cell>
      <Cell>{formatInt(size)}</Cell>
      <Cell color={props.type === "bids" ? "text-green-600" : "text-red-600"}>
        {formatFloat(price)}
      </Cell>
    </Row>
  );
}

function Row(props: {
  children?: ReactNode;
  bg?: { rtl: boolean; type: DeltaType; pos: number };
}) {
  const dir = props.bg?.rtl ? "right" : "left";

  const color =
    props.bg?.type === "asks"
      ? "rgba(220, 38, 38, 0.25)"
      : "rgba(5, 150, 105, 0.25)";

  return (
    <div
      role="row"
      style={{
        minHeight: ROW_HEIGHT,
        background: props.bg
          ? `linear-gradient(to ${dir}, ${color} ${props.bg.pos}%, transparent ${props.bg.pos}%)`
          : undefined,
      }}
      className="flex-1 grid grid-cols-3 items-center relative px-16"
    >
      {props.children}
    </div>
  );
}

function Cell(props: { children: ReactNode; color?: string }) {
  return (
    <div role="cell" dir="rtl" className={props.color}>
      {props.children}
    </div>
  );
}

export default OrderBookTableRow;
