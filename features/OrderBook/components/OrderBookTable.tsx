import { useRef } from "react";
import useElementSize from "../hooks/useElementSize";
import { DeltaType, Dir, Sort } from "../types";
import OrderBookTableRow, { ROW_HEIGHT } from "./OrderBookTableRow";

type Props = {
  type: DeltaType;
  dir: Dir;
  sort: Sort;
};

function OrderBookTable(props: Props) {
  const tableRef = useRef(null);
  const tableSize = useElementSize(tableRef);

  const totalRowCount = Math.floor(tableSize.height / ROW_HEIGHT);

  return (
    <div
      ref={tableRef}
      dir={props.dir}
      role="table"
      className="flex flex-col h-full w-full overflow-hidden font-mono"
    >
      {Array.from(Array(totalRowCount)).map((_, i) => (
        <OrderBookTableRow
          key={i}
          index={i}
          type={props.type}
          dir={props.dir}
          sort={props.sort}
        />
      ))}
    </div>
  );
}

export default OrderBookTable;
