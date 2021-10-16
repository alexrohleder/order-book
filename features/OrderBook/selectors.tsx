import { createSelector } from "reselect";
import { Delta, DeltaType, Orientation, State } from "./types";

export const selectSortedDeltas = createSelector(
  (state: State, props: { type: DeltaType }) => state[props.type],
  (state: State, props: { type: DeltaType }) => props.type,
  (state: State, props: { orientation: Orientation }) => props.orientation,
  (deltas, type, orientation) => {
    let data: Delta[] = [];

    if (type === "asks" && orientation === "HORIZONTAL") {
      for (let i = deltas.length - 1; i > -1; i--) {
        data.push(deltas[i]);
      }
    } else {
      data = deltas;
    }

    return data;
  }
);

export const selectTotals = createSelector(selectSortedDeltas, (deltas) => {
  let totals: number[] = [];
  let lastSize = 0;

  for (const [, size] of deltas) {
    lastSize = lastSize + size;
    totals.push(lastSize);
  }

  return totals;
});

export function selectTotal(
  state: State,
  props: { type: DeltaType; orientation: Orientation; index: number }
) {
  const totals = selectTotals(state, props);

  return totals[props.index] ? totals[props.index] : null;
}

export function selectPrice(
  state: State,
  props: { type: DeltaType; orientation: Orientation; index: number }
) {
  const deltas = selectSortedDeltas(state, props);

  return deltas[props.index] ? deltas[props.index][0] : null;
}

export function selectSize(
  state: State,
  props: { type: DeltaType; orientation: Orientation; index: number }
) {
  const deltas = selectSortedDeltas(state, props);

  return deltas[props.index] ? deltas[props.index][1] : null;
}

export function selectLevelDepth(
  state: State,
  props: { type: DeltaType; orientation: Orientation; index: number }
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
