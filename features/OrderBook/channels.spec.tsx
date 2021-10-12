import { END } from "@redux-saga/core";
import { take } from "@redux-saga/core/effects";
import WS from "jest-websocket-mock";
import { expectSaga } from "redux-saga-test-plan";
import { createSocketChannel } from "./channels";

describe("In the OrderBook channels", () => {
  describe("The SocketChannel", () => {
    let server: WS;
    let client: WebSocket;
    let createSocket: () => WebSocket;

    beforeEach(async () => {
      server = new WS("ws://localhost:6000");

      createSocket = () => {
        return (client = new WebSocket("ws://localhost:6000"));
      };
    });

    afterEach(() => {
      WS.clean();
    });

    it("should send subscribe message on open", async () => {
      createSocketChannel("PI_XBTUSD", createSocket);
      await server.connected;

      await expect(server).toReceiveMessage(
        JSON.stringify({
          event: "subscribe",
          feed: "book_ui_1",
          product_ids: ["PI_XBTUSD"],
        })
      );
    });

    it("should send unsubscribe message when closing", async () => {
      const channel = createSocketChannel("PI_XBTUSD", createSocket);

      await server.connected;
      await server.nextMessage; // skip subscribe message

      channel.close();

      await expect(server).toReceiveMessage(
        JSON.stringify({
          event: "unsubscribe",
          feed: "book_ui_1",
          product_ids: ["PI_XBTUSD"],
        })
      );
    });

    it("should close the socket when terminating the saga", async () => {
      const channel = createSocketChannel("PI_XBTUSD", createSocket);
      await server.connected;
      expect(client.readyState).toBe(WebSocket.OPEN);
      channel.close();
      expect(client.readyState).toBe(WebSocket.CLOSING);
    });

    it("should terminate the saga when closing the socket", (done) => {
      const channel = createSocketChannel("PI_XBTUSD", createSocket);
      expect.assertions(1);

      server.connected.then(() => {
        channel.take((message) => expect(message).toBe(END));
        server.close();
        done();
      });
    });

    it("should terminate the saga on socket errors", (done) => {
      const channel = createSocketChannel("PI_XBTUSD", createSocket);
      expect.assertions(1);

      server.connected.then(() => {
        channel.take((message) => expect(message).toBe(END));
        server.error();
        done();
      });
    });

    it("should emit for messages containing deltas", (done) => {
      const channel = createSocketChannel("PI_XBTUSD", createSocket);
      expect.assertions(1);

      server.connected.then(() => {
        channel.take((message) => {
          expect(message).toMatchObject({
            type: "message",
            payload: {
              bids: [[1000, 100]],
              asks: [],
            },
          });

          done();
        });

        server.send(
          JSON.stringify({
            bids: [[1000, 100]],
            asks: [],
          })
        );
      });
    });
  });
});
