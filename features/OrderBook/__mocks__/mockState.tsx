import { initialState } from "../reducers";
import { State } from "../types";

function mockState(partial: Partial<State> = {}) {
  return {
    ...initialState,
    ...partial,
  };
}

export const mockStateWithDeltas: Partial<State> = {
  bids: [
    [1000, 50],
    [1005, 100],
    [1010, 1000],
  ],
  asks: [
    [1000, 200],
    [2050, 100],
    [2050.5, 150],
  ],
};

export default mockState;
