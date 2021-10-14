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
  const vertical = props.orientation === "VERTICAL";

  return (
    <Provider store={store}>
      <div className="flex flex-col h-full relative">
        <div className="flex items-center w-full justify-center h-14 border-b border-gray-500">
          <div className="absolute left-8">Order Book</div>
          ...
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <OrderBookTable />
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
