import { createSelector } from "reselect";
import { Delta, DeltaType, Orientation, State } from "./types";

export const select = createSelector(
  (state: State, props: { type: DeltaType }) => state[props.type],
  (state: State, props: { type: DeltaType }) => props.type,
  (state: State, props: { orientation: Orientation }) => props.orientation,
  (deltas, type, orientation) => {
    const totals: number[] = [];
    const data: Delta[] = [];
    let lastSize = 0;

    const insertFn =
      type === "asks" && orientation === "HORIZONTAL" ? "push" : "unshift";

    for (const delta of deltas) {
      data[insertFn](delta);
    }

    for (const [, size] of data) {
      lastSize = lastSize + size;
      totals.push(lastSize);
    }

    return { data, totals };
  }
);

export function selectTotal(
  state: State,
  props: { type: DeltaType; orientation: Orientation; index: number }
) {
  const { totals } = select(state, props);
  return totals[props.index] ? totals[props.index] : null;
}

export function selectPrice(
  state: State,
  props: { type: DeltaType; orientation: Orientation; index: number }
) {
  const { data } = select(state, props);

  return data[props.index] ? data[props.index][0] : null;
}

export function selectSize(
  state: State,
  props: { type: DeltaType; orientation: Orientation; index: number }
) {
  const { data } = select(state, props);

  return data[props.index] ? data[props.index][1] : null;
}

export function selectLevelDepth(
  state: State,
  props: { type: DeltaType; orientation: Orientation; index: number }
) {
  const { totals } = select(state, props);

  if (!totals[props.index]) {
    return 0;
  }

  const highestTotal =
    totals[0] > totals[totals.length - 1]
      ? totals[0]
      : totals[totals.length - 1];

  return (totals[props.index] / highestTotal) * 100;
}
