import { END, eventChannel } from "@redux-saga/core";
import { SocketMessage, ProductId } from "./types";

export type SocketEvent = { type: "message"; payload: SocketMessage } | END;

export function createSocketChannel(
  productId: ProductId,
  createSocket = () => new WebSocket("wss://www.cryptofacilities.com/ws/v1")
) {
  return eventChannel<SocketEvent>((emitter) => {
    const socket = createSocket();

    socket.addEventListener("open", () => {
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
      if (event.code) {
        emitter(END); // code being available means this socket was closed by the server
      }
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
  });
}
