import { Task, END, EventChannel } from "@redux-saga/core";
import {
  select,
  put,
  fork,
  flush,
  delay,
  putResolve,
  call,
  take,
  cancel,
  takeEvery,
} from "@redux-saga/core/effects";
import { createSocketChannel, SocketEvent } from "./channels";
import {
  connectingSocket,
  disconnectedSocket,
  receivedDeltas,
  resetDeltas,
  switchedProducts,
} from "./reducers";
import { SocketMessage, State } from "./types";

export function* awaitForNextBatch(startedExecutingBatchAt: number) {
  // these are opionated numbers based on runs with CPU throttling
  const lastExecutionTime = performance.now() - startedExecutingBatchAt;
  const ms = lastExecutionTime < 30 ? 50 : 250;

  yield delay(ms);
}

export function* handleSocketMessages(channel: EventChannel<SocketEvent>) {
  while (true) {
    const events: SocketEvent[] | END = yield flush(channel);
    const startedExecutingAt = performance.now();

    if (Array.isArray(events)) {
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

export function* watchSocket() {
  let task: Task | null = null;
  let socketChannel: ReturnType<typeof createSocketChannel> | null = null;

  try {
    while (true) {
      yield take(connectingSocket.type);
      const productId = yield select((state: State) => state.productId);
      socketChannel = yield call(createSocketChannel, productId);
      task = yield fork(handleSocketMessages, socketChannel!);
      yield take(disconnectedSocket.type);
      yield call(task!.cancel);
      yield call(socketChannel!.close);
    }
  } finally {
    task?.cancel();
    socketChannel?.close();
  }
}

export function* handleProductChange() {
  yield putResolve(disconnectedSocket());
  yield putResolve(resetDeltas());
  yield putResolve(connectingSocket());
}

function* rootSaga() {
  yield fork(watchSocket);
  yield takeEvery(switchedProducts.type, handleProductChange);
  yield put(connectingSocket());
}

export default rootSaga;
