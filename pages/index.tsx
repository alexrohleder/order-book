import { useEffect, useState } from "react";

export default function Home() {
  const [orders, setOrders] = useState({
    bids: { priceOrder: [], totals: {}, sizesByPrice: {} },
    asks: { priceOrder: [], totals: {}, sizesByPrice: {} },
  });

  useEffect(() => {
    const socket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          event: "subscribe",
          feed: "book_ui_1",
          product_ids: ["PI_XBTUSD"],
        })
      );
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      setOrders((state) => {
        let mutable = state;

        const patch = (prop, tuples) => {
          for (const [price, size] of tuples) {
            if (size > 0) {
              mutable = {
                ...mutable,
                [prop]: {
                  sizesByPrice: {
                    ...mutable[prop].sizesByPrice,
                    [price]: size,
                  },
                },
              };
            } else {
              delete mutable[prop].sizesByPrice[price];
            }
          }

          mutable[prop].priceOrder = Object.keys(mutable[prop].sizesByPrice)
            .map(Number)
            .sort();

          const totals = {};
          let totalsAcc = 0;

          for (const index in mutable[prop].priceOrder) {
            const price = mutable[prop].priceOrder[index];
            totalsAcc += mutable[prop].sizesByPrice[price];
            totals[price] = totalsAcc;
          }

          mutable[prop].totals = totals;
        };

        if (data.bids) {
          patch("bids", data.bids);
        }

        if (data.asks) {
          patch("asks", data.asks);
        }

        return mutable;
      });
    });

    return () => {
      socket.close();
    };
  }, []);

  const build = (what) =>
    what.priceOrder.map((price) => (
      <div className="flex text-right" key={price}>
        <div className="w-24">{what.totals[price]}</div>
        <div className="w-24">{what.sizesByPrice[price]}</div>
        <div className="w-24">{price.toFixed(2)}</div>
      </div>
    ));

  return (
    <div className="container mx-auto my-12 grid grid-cols-2">
      {build(orders.bids)}
      {build(orders.asks)}
    </div>
  );
}
