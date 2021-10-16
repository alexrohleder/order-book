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

  if (!price || !size || !total) {
    return <Row />;
  }

  return (
    <RowWithDeph {...props}>
      <Cell>{formatInt(total)}</Cell>
      <Cell>{formatInt(size)}</Cell>
      <Cell color={props.type === "bids" ? "text-green-600" : "text-red-600"}>
        {formatFloat(price)}
      </Cell>
    </RowWithDeph>
  );
}

function Row(props: { children?: ReactNode }) {
  return (
    <div
      role="row"
      style={{ minHeight: ROW_HEIGHT }}
      className="flex-1 grid grid-cols-3 items-center relative px-16"
    >
      {props.children}
    </div>
  );
}

function RowWithDeph(props: { children: ReactNode } & Props) {
  const levelDepth = useSelector((state) => selectLevelDepth(state, props));
  const multi = props.rtl ? -1 : 1;
  const color = props.type === "asks" ? "bg-red-900" : "bg-green-900";

  return (
    <Row>
      {props.children}
      <div
        className={`${color} bg-opacity-50 absolute h-full w-full`}
        style={{ transform: `translateX(${levelDepth * multi}%)`, zIndex: -1 }}
        data-testid="OrderBookTableRowBackground"
      />
    </Row>
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
