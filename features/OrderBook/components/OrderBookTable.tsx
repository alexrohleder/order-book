import { useRef } from "react";
import useElementSize from "../hooks/useElementSize";
import { DeltaType, Orientation } from "../types";
import OrderBookTableRow, { ROW_HEIGHT } from "./OrderBookTableRow";

type Props = {
  type: DeltaType;
  orientation: Orientation;
};

function OrderBookTable(props: Props) {
  const tableRef = useRef(null);
  const tableSize = useElementSize(tableRef);

  const totalRowCount = Math.floor(tableSize.height / ROW_HEIGHT);
  const vertical = props.orientation === "VERTICAL";
  const dir = props.type === "bids" && !vertical ? "ltr" : "rtl";

  return (
    <div
      ref={tableRef}
      dir={dir}
      role="table"
      className="flex flex-col h-full w-full overflow-hidden font-mono"
    >
      {Array.from(Array(totalRowCount)).map((_, i) => (
        <OrderBookTableRow
          key={i}
          type={props.type}
          index={i}
          orientation={props.orientation}
          rtl={dir === "rtl"}
        />
      ))}
    </div>
  );
}

export default OrderBookTable;
