import { withErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import useStore from "../hooks/useStore";
import { Orientation } from "../types";
import OrderBookFooter from "./OrderBookFooter";
import OrderBookSideHeader from "./OrderBookSideHeader";
import OrderBookSpread from "./OrderBookSpread";
import OrderBookSide from "./OrderBookSide";
import OrderBookSocketStateDisplay from "./OrderBookSocketStateDisplay";

type Props = {
  orientation: Orientation;
};

function OrderBook(props: Props) {
  const store = useStore();

  if (props.orientation === "VERTICAL") {
    return (
      <Provider store={store}>
        <div className="flex flex-col h-full text-sm lg:text-base">
          <div className="flex items-center w-full h-14 px-8 border-b border-gray-500">
            Order Book
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <OrderBookSocketStateDisplay>
              <OrderBookSideHeader rtl>
                <OrderBookSide type="asks" originX="r" originY="b" />
                <OrderBookSpread />
                <OrderBookSide type="bids" originX="r" />
              </OrderBookSideHeader>
            </OrderBookSocketStateDisplay>
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
      <div className="flex flex-col h-full text-sm lg:text-base relative">
        <div className="flex items-center w-full h-14 justify-center border-b border-gray-500">
          <div className="absolute left-8">Order Book</div>
          <OrderBookSpread />
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <OrderBookSocketStateDisplay>
            <OrderBookSideHeader>
              <OrderBookSide type="bids" />
            </OrderBookSideHeader>
            <OrderBookSideHeader rtl>
              <OrderBookSide type="asks" originX="r" />
            </OrderBookSideHeader>
          </OrderBookSocketStateDisplay>
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
