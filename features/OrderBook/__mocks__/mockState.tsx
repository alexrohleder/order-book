import { initialState } from "../reducers";
import { State } from "../types";

function mockState(partial: Partial<State> = {}) {
  return {
    ...initialState,
    ...partial,
  };
}

export default mockState;
