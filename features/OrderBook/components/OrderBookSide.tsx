import { useRef } from "react";
import useElementSize from "../hooks/useElementSize";
import { DeltaType, Dir, Sort } from "../types";
import OrderBookSideLevel from "./OrderBookSideLevel";
import { ROW_HEIGHT } from "./OrderBookSideLevelBase";

type Props = {
  type: DeltaType;
  dir: Dir;
  sort: Sort;
};

function OrderBookSide(props: Props) {
  const tableRef = useRef(null);
  const tableSize = useElementSize(tableRef);
  const totalRowCount = Math.floor(tableSize.height / ROW_HEIGHT);

  return (
    <div
      ref={tableRef}
      className="flex flex-col h-full w-full overflow-hidden font-mono"
    >
      {Array.from(Array(totalRowCount)).map((_, i) => (
        <OrderBookSideLevel
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

export default OrderBookSide;
