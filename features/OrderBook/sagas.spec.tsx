import { expectSaga, testSaga } from "redux-saga-test-plan";
import { createSocketChannel } from "./channels";
import reducers, { receivedDeltas, connectingSocket } from "./reducers";
import rootSaga, {
  awaitForNextBatch,
  handleSocket,
  handleSocketMessages,
} from "./sagas";
import mockChannel from "./__mocks__/mockChannel";
import mockState from "./__mocks__/mockState";

describe("In the OrderBook sagas", () => {
  describe("The rootSaga", () => {
    it("should initiate the socket handler", () => {
      return expectSaga(rootSaga)
        .withReducer(reducers)
        .fork(handleSocket)
        .silentRun();
    });

    it("should initialize the socket connection", () => {
      return expectSaga(rootSaga)
        .withReducer(reducers)
        .put(connectingSocket())
        .silentRun();
    });
  });

  describe("The handleSocket", () => {
    it("should create the socket channel", () => {
      return expectSaga(handleSocket)
        .withReducer(reducers, mockState({ productId: "PI_ETHUSD" }))
        .call(createSocketChannel, "PI_ETHUSD")
        .silentRun();
    });

    it("should fork the socket message handler", () => {
      return expectSaga(handleSocket)
        .withReducer(reducers)
        .fork.like({ fn: handleSocketMessages })
        .silentRun();
    });
  });

  describe("The handleSocketMessages", () => {
    it("should dispatch messages from the given channel", () => {
      const channel = mockChannel([
        {
          type: "message",
          payload: { bids: [[1000, 100]], asks: [] },
        },
      ]);

      return expectSaga(handleSocketMessages, channel)
        .withReducer(reducers)
        .putResolve(receivedDeltas({ bids: [[1000, 100]], asks: [] }))
        .silentRun();
    });

    it("should batch messages from channel", () => {
      const channel = mockChannel([
        {
          type: "message",
          payload: { bids: [[1000, 100]], asks: [] },
        },
        {
          type: "message",
          payload: { bids: [[2000, 200]], asks: [[3000, 300]] },
        },
      ]);

      return expectSaga(handleSocketMessages, channel)
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

    it("should await for the next message batch to form", () => {
      return expectSaga(handleSocketMessages, mockChannel())
        .withReducer(reducers)
        .call.like({ fn: awaitForNextBatch })
        .silentRun();
    });
  });

  describe("The awaitForNextBatch", () => {
    it("should delay execution for 50ms on fast machines", () => {
      testSaga(awaitForNextBatch, performance.now()).next().delay(50);
    });

    it("should increase execution delay to 250ms on slow machines", () => {
      testSaga(awaitForNextBatch, performance.now() - 100)
        .next()
        .delay(250);
    });
  });
});
