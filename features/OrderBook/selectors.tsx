import { createSelector } from "reselect";
import { DeltaType, State } from "./types";

export const selectTotals = createSelector(
  (state: State, props: { type: DeltaType }) => state[props.type],
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
  const total = selectTotal(state, props);

  if (total === null) {
    return 0;
  }

  const totals = selectTotals(state, props);
  const highestTotal = totals[totals.length - 1];
  return (total / highestTotal) * 100;
}
