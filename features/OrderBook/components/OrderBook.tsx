import useStore from "../hooks/useStore";
import { connectingSocket, disconnectedSocket } from "../reducers";

function OrderBook() {
  const store = useStore();

  return (
    <div className="flex gap-4">
      <button onClick={() => store.dispatch(disconnectedSocket())}>
        disconnect
      </button>
      <button onClick={() => store.dispatch(connectingSocket())}>
        connecting
      </button>
    </div>
  );
}

export default OrderBook;
