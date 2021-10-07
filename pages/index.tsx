import { useEffect, useState } from "react";

export default function Home() {
  const [orders, setOrders] = useState({
    bids: {},
    asks: {},
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
        let mutable = { ...state };

        const patch = (prop, tuples) => {
          for (const [price, size] of tuples) {
            if (size > 0) {
              mutable = {
                ...mutable,
                [prop]: {
                  ...mutable[prop],
                  [price]: size,
                },
              };
            } else {
              delete mutable[prop][price];
            }
          }
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

  return (
    <div className="container mx-auto my-12 grid grid-cols-2">
      <pre>{JSON.stringify(orders.bids, null, 4)}</pre>
      <pre>{JSON.stringify(orders.asks, null, 4)}</pre>
    </div>
  );
}
