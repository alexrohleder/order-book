import { useSelector } from "../hooks/useStore";

type Props = {
  children: any;
};

function OrderBookSocketStateDisplay(props: Props) {
  const socketState = useSelector((state) => state.orderBook.socketState);
  const socketStateReason = useSelector(
    (state) => state.orderBook.socketStateReason
  );

  if (socketState === "CONNECTING") {
    return (
      <div className="flex-1 flex items-center justify-center">
        Connecting... ⌛
      </div>
    );
  }

  if (socketState === "DISCONNECTED") {
    return (
      <div className="flex-1 flex items-center justify-center">
        {socketStateReason}
      </div>
    );
  }

  return props.children;
}

export default OrderBookSocketStateDisplay;
