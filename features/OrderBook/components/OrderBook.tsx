import { withErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import useStore from "../hooks/useStore";
import { Orientation } from "../types";
import OrderBookFooter from "./OrderBookFooter";
import OrderBookTable from "./OrderBookTable";

type Props = {
  orientation: Orientation;
};

function OrderBook(props: Props) {
  const store = useStore();

  if (props.orientation === "VERTICAL") {
    return (
      <Provider store={store}>
        <div className="flex flex-col h-full">
          <div className="flex items-center w-full h-14 px-8 border-b border-gray-500">
            Order Book
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <OrderBookTable type="asks" orientation="VERTICAL" />
            <div>...</div>
            <OrderBookTable type="bids" orientation="VERTICAL" />
          </div>
          <div className="flex items-center justify-center h-14">
            <OrderBookFooter />
          </div>
        </div>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <div className="flex flex-col h-full relative">
        <div className="flex items-center w-full h-14 justify-center border-b border-gray-500">
          <div className="absolute left-8">Order Book</div>
          <div>...</div>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <OrderBookTable type="bids" orientation={props.orientation} />
          <OrderBookTable type="asks" orientation={props.orientation} />
        </div>
        <div className="flex items-center justify-center h-14">
          <OrderBookFooter />
        </div>
      </div>
    </Provider>
  );
}

export default withErrorBoundary(OrderBook, {
  fallback: (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <p>Oops, something went wrong 😢</p>
      <button className="btn">Retry</button>
    </div>
  ),
});
