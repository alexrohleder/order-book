import { useRef } from "react";
import useElementSize from "../hooks/useElementSize";
import { useSelector } from "../hooks/useStore";
import { DeltaType } from "../types";
import OrderBookTableRow, { ROW_HEIGHT } from "./OrderBookTableRow";

type Props = {
  type: DeltaType;
  vertical: boolean;
};

function OrderBookTable(props: Props) {
  const tableRef = useRef(null);
  const tableSize = useElementSize(tableRef);
  const socketState = useSelector((s) => s.socketState);

  const totalRowCount = Math.floor(tableSize.height / ROW_HEIGHT);
  const dir = props.type === "bids" && !props.vertical ? "ltr" : "rtl";

  return (
    <div
      ref={tableRef}
      dir={dir}
      role="table"
      className="flex flex-col h-full w-full overflow-hidden"
    >
      {socketState === "CONNECTED" &&
        Array.from(Array(totalRowCount)).map((_, i) => (
          <OrderBookTableRow
            key={i}
            type={props.type}
            index={i}
            rtl={dir === "rtl"}
          />
        ))}
    </div>
  );
}

export default OrderBookTable;
