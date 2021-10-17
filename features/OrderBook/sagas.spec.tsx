import { expectSaga, testSaga } from "redux-saga-test-plan";
import { createSocketChannel } from "./channels";
import SocketStateReasons from "./lib/enums/SocketStateReasons";
import { SocketClosedByServer } from "./lib/errors";
import reducers, {
  receivedDeltas,
  connectingSocket,
  switchedProducts,
  disconnectedSocket,
  resetDeltas,
  connectedSocket,
} from "./reducers";
import rootSaga, {
  delayNextDispatch,
  handleProductChange,
  handleConnectedSocket,
  handleConnectingSocket,
  disconnectOnBrowserEvents,
} from "./sagas";
import mockChannel from "./__mocks__/mockChannel";
import mockSagaContext from "./__mocks__/mockSagaContext";
import mockState from "./__mocks__/mockState";

describe("In the OrderBook sagas", () => {
  describe("The rootSaga", () => {
    it("should initiate the socket state watchers", () => {
      return expectSaga(rootSaga)
        .withReducer(reducers)
        .take(connectingSocket.type)
        .take(connectedSocket.type)
        .take(disconnectedSocket.type)
        .silentRun();
    });

    it("should watch for changes on product and call a side-effect", () => {
      return expectSaga(rootSaga)
        .withReducer(reducers)
        .take(switchedProducts.type)
        .silentRun();
    });

    it("should initialize the socket connection", () => {
      return expectSaga(rootSaga)
        .withReducer(reducers)
        .put(connectingSocket())
        .silentRun();
    });
  });

  describe("The handleConnectingSocket", () => {
    it("should create the socket channel when the context one is null", () => {
      const ctx = mockSagaContext({ socketChannel: null });

      return expectSaga(handleConnectingSocket, ctx)
        .withReducer(reducers, mockState({ productId: "PI_ETHUSD" }))
        .dispatch(connectingSocket())
        .call(createSocketChannel, "PI_ETHUSD")
        .silentRun();
    });

    it("should dispatch connectedSocket after connection established event", () => {
      const ctx = mockSagaContext({
        socketChannel: mockChannel([
          {
            type: "connection-established",
            payload: true,
          },
        ]),
      });

      return expectSaga(handleConnectingSocket, ctx)
        .withReducer(reducers)
        .put(connectedSocket())
        .silentRun();
    });

    it("should dispatch disconnectedSocket if the socket gets closed by the server", () => {
      const error = new SocketClosedByServer();
      const ctx = mockSagaContext({ socketChannel: mockChannel([error]) });

      return expectSaga(handleConnectingSocket, ctx)
        .withReducer(reducers)
        .put(disconnectedSocket({ reason: SocketStateReasons.BAD_CONNECTION }))
        .silentRun();
    });
  });

  describe("The handleConnectedSocket", () => {
    it("should dispatch messages from the given channel", () => {
      const ctx = mockSagaContext({
        socketChannel: mockChannel([
          {
            type: "message",
            payload: { bids: [[1000, 100]], asks: [] },
          },
        ]),
      });

      return expectSaga(handleConnectedSocket, ctx)
        .withReducer(reducers)
        .putResolve(receivedDeltas({ bids: [[1000, 100]], asks: [] }))
        .silentRun();
    });

    it("should batch messages from channel", () => {
      const ctx = mockSagaContext({
        socketChannel: mockChannel([
          {
            type: "message",
            payload: { bids: [[1000, 100]], asks: [] },
          },

          {
            type: "message",
            payload: { bids: [[2000, 200]], asks: [[3000, 300]] },
          },
        ]),
      });

      return expectSaga(handleConnectedSocket, ctx)
        .withReducer(reducers)
        .putResolve(
          receivedDeltas({
            bids: [
              [1000, 100],
              [2000, 200],
            ],
            asks: [[3000, 300]],
          })
        )
        .silentRun();
    });

    it("should delay next dispatch", () => {
      const ctx = mockSagaContext();

      return expectSaga(handleConnectedSocket, ctx)
        .withReducer(reducers)
        .call.like({ fn: delayNextDispatch })
        .silentRun();
    });
  });

  describe("The delayNextDispatch", () => {
    it("should delay execution for 50ms on fast machines", () => {
      testSaga(delayNextDispatch, performance.now()).next().delay(50);
    });

    it("should increase execution delay to 250ms on slow machines", () => {
      testSaga(delayNextDispatch, performance.now() - 100)
        .next()
        .delay(250);
    });
  });

  describe("The handleProductChange", () => {
    it("should reset socket connection", () => {
      return expectSaga(handleProductChange)
        .withReducer(reducers)
        .putResolve(
          disconnectedSocket({
            reason: SocketStateReasons.SWITCHING_PRODUCTS,
          })
        )
        .putResolve(connectingSocket())
        .silentRun();
    });

    it("should reset deltas before re-connecting", () => {
      return expectSaga(handleProductChange)
        .withReducer(reducers)
        .putResolve(resetDeltas())
        .putResolve(connectingSocket())
        .silentRun();
    });
  });

  describe("The disconnectOnBrowserEvents", () => {
    it("should disconnect the socket when browser emits and event", () => {
      const channel = mockChannel();

      testSaga(disconnectOnBrowserEvents, channel)
        .next()
        .take(channel)
        .next()
        .put(
          disconnectedSocket({
            reason: SocketStateReasons.SAVE_BANDWIDTH,
          })
        );
    });
  });
});
