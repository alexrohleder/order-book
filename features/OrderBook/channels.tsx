import { buffers, END, eventChannel } from "@redux-saga/core";
import { SocketChannelError, SocketClosedByServer } from "./lib/errors";
import { SocketMessage, ProductId } from "./types";

export type SocketEvent =
  | { type: "connection-established"; payload: true }
  | { type: "message"; payload: SocketMessage }
  | SocketChannelError
  | END;

export function createSocketChannel(
  productId: ProductId,
  createSocket = () => new WebSocket("wss://www.cryptofacilities.com/ws/v1")
) {
  return eventChannel<SocketEvent>((emitter) => {
    const socket = createSocket();

    socket.addEventListener("open", () => {
      emitter({
        type: "connection-established",
        payload: true,
      });

      socket.send(
        JSON.stringify({
          event: "subscribe",
          feed: "book_ui_1",
          product_ids: [productId],
        })
      );
    });

    socket.addEventListener("message", (event) => {
      if (event.data.includes("bids")) {
        emitter({
          type: "message",
          payload: JSON.parse(event.data),
        });
      }
    });

    socket.addEventListener("close", (event) => {
      emitter(new SocketClosedByServer());
    });

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            event: "unsubscribe",
            feed: "book_ui_1",
            product_ids: [productId],
          })
        );
      }

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, buffers.expanding<SocketEvent>());
}

type BrowserEvent = { type: "visibilitychange" };

export function createBrowserChannel() {
  return eventChannel<BrowserEvent>((emitter) => {
    const handler = (event) => emitter({ type: event.type });

    window.addEventListener("visibilitychange", handler);

    return () => {
      window.removeEventListener("visibilitychange", handler);
    };
  });
}
