import { useDispatch, useSelector } from "react-redux";
import { connectingSocket, switchedProducts } from "../reducers";
import { State } from "../types";

function OrderBookFooter() {
  const dispatch = useDispatch();
  const socketState = useSelector((state: State) => state.socketState);

  if (socketState === "DISCONNECTED") {
    return (
      <button
        type="button"
        className="btn"
        onClick={() => dispatch(connectingSocket())}
      >
        Reconnect
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={socketState === "CONNECTING"}
      className="btn btn--purple"
      onClick={() => dispatch(switchedProducts())}
    >
      Toggle Feed
    </button>
  );
}

export default OrderBookFooter;
