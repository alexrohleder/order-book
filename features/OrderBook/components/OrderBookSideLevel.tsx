import { ReactNode } from "react";
import { useSelector } from "../hooks/useStore";
import { formatFloat, formatInt } from "../lib/formatter";
import {
  selectLevelDepth,
  selectPrice,
  selectSize,
  selectTotal,
} from "../selectors";
import { DeltaType, Dir, Sort } from "../types";
import { Cell, Row } from "./OrderBookSideLevelBase";

type Props = {
  index: number;
  type: DeltaType;
  dir: Dir;
  sort: Sort;
};

function OrderBookSideLevel(props: Props) {
  const price = useSelector((state) => selectPrice(state, props));
  const size = useSelector((state) => selectSize(state, props));
  const total = useSelector((state) => selectTotal(state, props));

  if (!price || !size || !total) {
    return <Row dir={props.dir} />;
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

function RowWithDeph(props: { children: ReactNode } & Props) {
  const levelDepth = useSelector((state) => selectLevelDepth(state, props));
  const color = props.type === "asks" ? "bg-red-900" : "bg-green-900";
  const translateX = (100 - levelDepth) * (props.dir === "rtl" ? -1 : 1) + "%";

  return (
    <Row dir={props.dir}>
      {props.children}
      <div
        className={`${color} bg-opacity-50 absolute h-full w-full`}
        style={{ transform: `translateX(${translateX})`, zIndex: -1 }}
      />
    </Row>
  );
}

export default OrderBookSideLevel;
