import { createSelector } from "reselect";
import { DeltaType, State } from "./types";

export const selectTotals = createSelector(
  (state: State, props: { type: DeltaType }) => state[props.type],
  (deltas) => {
    let totals: number[] = [];
    let lastSize = 0;

    for (const [, size] of deltas) {
      lastSize = lastSize + size;
      totals.push(lastSize);
    }

    return totals;
  }
);

export function selectTotal(
  state: State,
  props: { type: DeltaType; index: number }
) {
  const totals = selectTotals(state, props);

  return totals[props.index] ? totals[props.index] : null;
}

export function selectPrice(
  state: State,
  props: { type: DeltaType; index: number }
) {
  return state[props.type][props.index]
    ? state[props.type][props.index][0]
    : null;
}

export function selectSize(
  state: State,
  props: { type: DeltaType; index: number }
) {
  return state[props.type][props.index]
    ? state[props.type][props.index][1]
    : null;
}

export function selectLevelDepth(
  state: State,
  props: { type: DeltaType; index: number }
) {
  const totals = selectTotals(state, props);

  if (!totals[props.index]) {
    return 0;
  }

  const highestTotal =
    totals[0] > totals[totals.length - 1]
      ? totals[0]
      : totals[totals.length - 1];

  return (totals[props.index] / highestTotal) * 100;
}

export function selectSpread(state: State) {
  return state.asks.length && state.bids.length
    ? state.asks[0][0] - state.bids[0][0]
    : null;
}

export function selectSpreadPercentage(state: State) {
  const spread = selectSpread(state);

  if (spread === null) {
    return null;
  }

  return (spread / state.asks[0][0]) * 100;
}
