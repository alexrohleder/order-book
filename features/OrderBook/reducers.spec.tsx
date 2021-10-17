import reducer, { receivedDeltas, switchedProducts } from "./reducers";
import { State } from "./types";
import mockState from "./__mocks__/mockState";

describe("In the OrderBook reducers", () => {
  describe("The receivedDeltas reducer", () => {
    it("should add initial levels", () => {
      const state = mockState();

      expect(
        reducer(
          state,
          receivedDeltas({
            bids: [[1000, 100]],
            asks: [[2000, 200]],
          })
        )
      ).toStrictEqual<State>({
        ...state,
        bids: [[1000, 100]],
        asks: [[2000, 200]],
      });
    });

    it("should add levels by ascending price order", () => {
      const state = mockState({
        bids: [[1000, 100]],
        asks: [[2000, 200]],
      });

      expect(
        reducer(
          state,
          receivedDeltas({
            bids: [
              [5000, 50],
              [3000, 300],
            ],
            asks: [
              [6000, 60],
              [1000, 400],
              [7000, 70],
            ],
          })
        )
      ).toStrictEqual<State>({
        ...state,
        bids: [
          [5000, 50],
          [3000, 300],
          [1000, 100],
        ],
        asks: [
          [1000, 400],
          [2000, 200],
          [6000, 60],
          [7000, 70],
        ],
      });
    });

    it("should update levels", () => {
      const state = mockState({
        bids: [[1000, 100]],
        asks: [[2000, 200]],
      });

      expect(
        reducer(
          state,
          receivedDeltas({
            bids: [[1000, 150]],
            asks: [[2000, 250]],
          })
        )
      ).toStrictEqual<State>({
        ...state,
        bids: [[1000, 150]],
        asks: [[2000, 250]],
      });
    });

    it("should remove levels when it's size is 0", () => {
      const state = mockState({
        bids: [[1000, 100]],
        asks: [[2000, 200]],
      });

      expect(
        reducer(
          state,
          receivedDeltas({
            bids: [[1000, 0]],
            asks: [[2000, 0]],
          })
        )
      ).toStrictEqual<State>({
        ...state,
        bids: [],
        asks: [],
      });
    });

    it("should not remove levels when they are omitted", () => {
      const state = mockState({
        bids: [[1000, 100]],
        asks: [[2000, 200]],
      });

      expect(
        reducer(
          state,
          receivedDeltas({
            bids: [],
            asks: [],
          })
        )
      ).toStrictEqual<State>({
        ...state,
        bids: [[1000, 100]],
        asks: [[2000, 200]],
      });
    });
  });

  describe("The switchedProducts reducer", () => {
    it("should switch from PI_XBTUSD to PI_ETHUSD", () => {
      const state = mockState({
        productId: "PI_XBTUSD",
      });

      expect(reducer(state, switchedProducts())).toStrictEqual<State>({
        ...state,
        productId: "PI_ETHUSD",
      });
    });

    it("should switch from PI_ETHUSD to PI_XBTUSD", () => {
      const state = mockState({
        productId: "PI_ETHUSD",
      });

      expect(reducer(state, switchedProducts())).toStrictEqual<State>({
        ...state,
        productId: "PI_XBTUSD",
      });
    });
  });
});
