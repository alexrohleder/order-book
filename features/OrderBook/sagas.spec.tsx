import { expectSaga } from "redux-saga-test-plan";
import { createSocketChannel } from "./channels";
import reducers, { setSocketState } from "./reducers";
import rootSaga, { socketWatcher } from "./sagas";
import mockState from "./__mocks__/mockState";

describe("In the OrderBook sagas", () => {
  describe("The rootSaga", () => {
    it("should initiate the socket watcher", () => {
      return expectSaga(rootSaga)
        .withReducer(reducers)
        .fork(socketWatcher)
        .silentRun();
    });

    it("should initialize the socket connection", () => {
      return expectSaga(rootSaga)
        .withReducer(reducers)
        .put(setSocketState("CONNECTING"))
        .silentRun();
    });
  });

  describe("The socketWatcher", () => {
    it("should initialize the socket connection", () => {
      return expectSaga(socketWatcher)
        .withReducer(reducers, mockState({ productId: "PI_ETHUSD" }))
        .call(createSocketChannel, "PI_ETHUSD")
        .silentRun();
    });
  });
});
