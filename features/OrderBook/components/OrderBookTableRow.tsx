import { ReactNode } from "react";
import { useSelector } from "../hooks/useStore";
import { formatFloat, formatInt } from "../lib/formatter";
import { selectPrice, selectSize, selectTotal } from "../selectors";
import { DeltaType } from "../types";
import OrderBookTableRowBackground from "./OrderBookTableRowDepth";

type Props = {
  type: DeltaType;
  rtl: boolean;
  index: number;
};

export const ROW_HEIGHT = 24;

function OrderBookTableRow(props: Props) {
  const price = useSelector((s) => selectPrice(s, props.type, props.index));
  const size = useSelector((s) => selectSize(s, props.type, props.index));
  const total = useSelector((s) => selectTotal(s, props.type, props.index));

  if (!price || !size || !total) {
    return <Row />;
  }

  return (
    <Row>
      <Cell>{formatInt(total)}</Cell>
      <Cell>{formatInt(size)}</Cell>
      <Cell color={props.type}>{formatFloat(price)}</Cell>
      <OrderBookTableRowBackground {...props} total={total} />
    </Row>
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

function Cell(props: {
  children: ReactNode;
  color?: DeltaType;
  className?: string;
}) {
  let className = "";

  if (props.color === "bids") {
    className += "text-green-600";
  } else if (props.color === "asks") {
    className += "text-red-600";
  }

  return (
    <div role="cell" dir="rtl" className={props.className}>
      {props.children}
    </div>
  );
}

export default OrderBookTableRow;
