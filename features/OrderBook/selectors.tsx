import { createSelector } from "reselect";
import { State } from "./types";

export const selectTotals = createSelector(
  (state: State, type: "asks" | "bids") => state[type],
  (deltas) => {
    const totals: number[] = [];
    let lastPrice = 0;

    for (let i = 0; i < deltas.length; i++) {
      totals.push(lastPrice + deltas[i][1]);
      lastPrice = totals[i];
    }

    return totals;
  }
);

export function selectTotal(
  state: State,
  type: "asks" | "bids",
  index: number
): number | undefined {
  return selectTotals(state, type)[index];
}

export function selectHighestTotal(
  state: State,
  type: "asks" | "bids"
): number | undefined {
  const totals = selectTotals(state, type);
  return totals[totals.length - 1];
}

export function selectPrice(
  state: State,
  type: "asks" | "bids",
  index: number
): number | undefined {
  return state[type][index]?.[0];
}

export function selectSize(
  state: State,
  type: "asks" | "bids",
  index: number
): number | undefined {
  return state[type][index]?.[1];
}
