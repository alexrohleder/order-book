import { useDispatch } from "react-redux";
import { useSelector } from "../hooks/useStore";
import { connectingSocket, switchedProducts } from "../reducers";

function OrderBookFooter() {
  const dispatch = useDispatch();
  const socketState = useSelector((s) => s.socketState);

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
