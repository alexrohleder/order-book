import { useSelector } from "../hooks/useStore";
import OrderBookTableRow from "./OrderBookTableRow";

function OrderBookTable() {
  const socketState = useSelector((s) => s.socketState);

  return (
    <div role="table" className="flex flex-col h-full w-full overflow-hidden">
      {socketState === "CONNECTED" &&
        Array.from(Array(35)).map((_, i) => (
          <OrderBookTableRow key={i} index={i} />
        ))}
    </div>
  );
}

export default OrderBookTable;
