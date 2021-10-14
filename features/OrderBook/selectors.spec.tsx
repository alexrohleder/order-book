import { selectHighestTotal, selectTotals } from "./selectors";
import mockState, { mockStateWithDeltas } from "./__mocks__/mockState";

describe("In the OrderBook selectors", () => {
  describe("The selectTotals", () => {
    it("should calculate the totals for each price", () => {
      const state = mockState(mockStateWithDeltas);

      expect(selectTotals(state, "bids")).toMatchObject([50, 150, 1150]);
      expect(selectTotals(state, "asks")).toMatchObject([200, 300, 450]);
    });
  });

  describe("The selectHighestTotal", () => {
    it("should return the highest total", () => {
      const state = mockState(mockStateWithDeltas);

      expect(selectHighestTotal(state, "bids")).toBe(1150);
      expect(selectHighestTotal(state, "asks")).toBe(450);
    });
  });
});
