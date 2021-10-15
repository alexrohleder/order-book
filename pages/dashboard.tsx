import OrderBook from "../features/OrderBook";

export default function Dashboard() {
  return (
    <div className="h-screen grid lg:grid-cols-4 lg:grid-rows-3 gap-8 p-8">
      <div className="border border-gray-500 rounded lg:col-span-3 lg:row-span-3">
        <OrderBook orientation="HORIZONTAL" />
      </div>
      <div className="border border-gray-500 rounded lg:row-span-2">
        <OrderBook orientation="VERTICAL" />
      </div>
    </div>
  );
}
