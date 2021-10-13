import { EventChannel } from "@redux-saga/core";
import {
  select,
  put,
  fork,
  flush,
  delay,
  putResolve,
  call,
} from "@redux-saga/core/effects";
import { createSocketChannel, SocketEvent } from "./channels";
import { connectingSocket, receivedDeltas } from "./reducers";
import { SocketMessage, State } from "./types";

export function* handleSocket() {
  const productId = yield select((state: State) => state.productId);
  const channel = yield call(createSocketChannel, productId);

  yield fork(handleSocketMessages, channel);
}

export function* handleSocketMessages(channel: EventChannel<SocketEvent>) {
  while (true) {
    const events: SocketEvent[] | undefined = yield flush(channel);
    const startedExecutingAt = performance.now();

    if (events) {
      const deltas = events.reduce(
        (patch, event) => {
          if (event.type === "message") {
            patch.bids.push(...event.payload.bids);
            patch.asks.push(...event.payload.asks);
          }

          return patch;
        },
        { bids: [], asks: [] } as SocketMessage
      );

      if (deltas.bids.length || deltas.asks.length) {
        yield putResolve(receivedDeltas(deltas));
      }
    }

    yield call(awaitForNextBatch, startedExecutingAt);
  }
}

export function* awaitForNextBatch(startedExecutingBatchAt: number) {
  // these are opionated numbers based on runs with CPU throttling
  const lastExecutionTime = performance.now() - startedExecutingBatchAt;
  const ms = lastExecutionTime < 30 ? 50 : 250;

  yield delay(ms);
}

function* rootSaga() {
  yield fork(handleSocket);
  yield put(connectingSocket());
}

export default rootSaga;
