import { useRef } from "react";
import useElementSize from "../hooks/useElementSize";
import { DeltaType } from "../types";
import OrderBookSideLevel from "./OrderBookSideLevel";
import { ROW_HEIGHT } from "./OrderBookSideLevelBase";

type Props = {
  type: DeltaType;
  originX?: "r" | "l";
  originY?: "t" | "b";
  vertical?: boolean;
};

function OrderBookSide(props: Props) {
  const tableRef = useRef(null);
  const tableSize = useElementSize(tableRef);
  const totalRowCount = Math.floor(tableSize.height / ROW_HEIGHT);

  return (
    <div
      ref={tableRef}
      className="flex-1 flex flex-col overflow-hidden font-mono"
    >
      {Array.from(Array(totalRowCount)).map((_, i) => {
        const index = props.originY === "b" ? ~(i - totalRowCount) : i;

        return (
          <OrderBookSideLevel
            key={index}
            index={index}
            type={props.type}
            rtl={props.originX === "r"}
          />
        );
      })}
    </div>
  );
}

export default OrderBookSide;
