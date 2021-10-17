import { ReactNode } from "react";
import { useSelector } from "../hooks/useStore";
import { formatFloat, formatInt } from "../lib/formatter";
import {
  selectLevelDepth,
  selectPrice,
  selectSize,
  selectTotal,
} from "../selectors";
import { DeltaType } from "../types";
import { Cell, Row } from "./OrderBookSideLevelBase";

type Props = {
  index: number;
  type: DeltaType;
  rtl?: boolean;
};

function OrderBookSideLevel(props: Props) {
  const price = useSelector((state) => selectPrice(state, props));
  const size = useSelector((state) => selectSize(state, props));
  const total = useSelector((state) => selectTotal(state, props));

  if (!price || !size || !total) {
    return <Row rtl={props.rtl} />;
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
  const backgroundColor = props.type === "asks" ? "#361A24" : "#0D2A2E";
  const translateX = (100 - levelDepth) * (props.rtl ? -1 : 1) + "%";

  return (
    <Row rtl={props.rtl}>
      {props.children}
      <div
        className="absolute h-full w-full"
        style={{
          transform: `translateX(${translateX})`,
          zIndex: -1,
          backgroundColor,
        }}
      />
    </Row>
  );
}

export default OrderBookSideLevel;
