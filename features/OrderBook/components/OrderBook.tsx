import { withErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import useStore from "../hooks/useStore";
import { Orientation } from "../types";
import OrderBookFooter from "./OrderBookFooter";
import OrderBookSideHeader from "./OrderBookSideHeader";
import OrderBookSpread from "./OrderBookSpread";
import OrderBookSide from "./OrderBookSide";

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
            <OrderBookSideHeader dir="rtl">
              <OrderBookSide type="asks" sort="desc" dir="rtl" />
              <OrderBookSpread bidsSort="desc" asksSort="desc" />
              <OrderBookSide type="bids" sort="desc" dir="rtl" />
            </OrderBookSideHeader>
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
          <OrderBookSpread bidsSort="desc" asksSort="asc" />
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <OrderBookSideHeader dir="ltr">
            <OrderBookSide type="bids" sort="desc" dir="ltr" />
          </OrderBookSideHeader>
          <OrderBookSideHeader dir="rtl">
            <OrderBookSide type="asks" sort="asc" dir="rtl" />
          </OrderBookSideHeader>
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
