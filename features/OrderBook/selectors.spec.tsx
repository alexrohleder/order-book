import { selectLevelDepth, selectTotals } from "./selectors";
import mockState, { mockStateWithDeltas } from "./__mocks__/mockState";

describe("In the OrderBook selectors", () => {
  describe("The selectTotals", () => {
    it("should calculate the totals for each price", () => {
      const state = mockState(mockStateWithDeltas);

      expect(selectTotals(state, { type: "bids" })).toMatchObject([
        50, 150, 1150,
      ]);

      expect(selectTotals(state, { type: "asks" })).toMatchObject([
        200, 300, 450,
      ]);
    });
  });

  describe("The selectLevelDepth", () => {
    it("should return the highest total", () => {
      const state = mockState(mockStateWithDeltas);

      expect(selectLevelDepth(state, { type: "bids", index: 0 })).toBeCloseTo(
        4.34,
        1
      );

      expect(selectLevelDepth(state, { type: "asks", index: 0 })).toBeCloseTo(
        44.44,
        1
      );
    });
  });
});
