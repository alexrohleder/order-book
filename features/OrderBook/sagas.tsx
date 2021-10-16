import {
  select,
  put,
  flush,
  putResolve,
  call,
  take,
  takeEvery,
  delay,
  fork,
} from "@redux-saga/core/effects";
import {
  createBrowserChannel,
  createSocketChannel,
  SocketEvent,
} from "./channels";
import {
  connectedSocket,
  connectingSocket,
  disconnectedSocket,
  receivedDeltas,
  resetDeltas,
  switchedProducts,
} from "./reducers";
import { SagaContext, SocketMessage, State } from "./types";

export function* disconnectOnBrowserEvents() {
  const browserChannel = createBrowserChannel();

  while (true) {
    yield take(browserChannel);
    yield put(disconnectedSocket());
  }
}

export function* delayNextDispatch(startedExecutingBatchAt: number) {
  const lastExecutionTime = performance.now() - startedExecutingBatchAt;
  yield delay(lastExecutionTime < 30 ? 50 : 250);
}

export function* handleConnectingSocket(ctx: SagaContext) {
  try {
    const productId = yield select((state: State) => state.productId);

    if (ctx.socketChannel === null) {
      ctx.socketChannel = yield call(createSocketChannel, productId);
    }

    const message: SocketEvent = yield take(ctx.socketChannel!);

    if (message.type === "connection-established") {
      yield put(connectedSocket());
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("handle connecting socket failed", error); // todo: dispatch user notification
    }

    yield put(disconnectedSocket());
  }
}

export function* handleConnectedSocket(ctx: SagaContext) {
  try {
    while (true) {
      if (ctx.socketChannel === null) {
        break;
      }

      const events = yield flush(ctx.socketChannel);
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

      yield call(delayNextDispatch, startedExecutingAt);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("handle connected socket failed", error); // todo: dispatch user notification
    }

    yield put(disconnectedSocket());
  }
}

export function* handleDisconnectedSocket(ctx: SagaContext) {
  ctx.socketChannel?.close();
  ctx.socketChannel = null;
}

export function* handleProductChange() {
  yield putResolve(disconnectedSocket());
  yield putResolve(resetDeltas());
  yield putResolve(connectingSocket());
}

function* rootSaga() {
  const ctx: SagaContext = {
    socketChannel: null,
  };

  yield takeEvery(connectingSocket.type, handleConnectingSocket, ctx);
  yield takeEvery(connectedSocket.type, handleConnectedSocket, ctx);
  yield takeEvery(disconnectedSocket.type, handleDisconnectedSocket, ctx);
  yield takeEvery(switchedProducts.type, handleProductChange);

  yield fork(disconnectOnBrowserEvents);
  yield put(connectingSocket());
}

export default rootSaga;
