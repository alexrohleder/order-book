import { select, call, take, put, fork } from "@redux-saga/core/effects";
import { createSocketChannel, SocketEvent } from "./channels";
import { patchLevels, setSocketState } from "./reducers";
import { State } from "./types";

export function* socketWatcher() {
  const productId = yield select((state: State) => state.productId);
  const socketChannel = yield call(createSocketChannel, productId);

  while (true) {
    const event: SocketEvent | undefined = yield take(socketChannel);

    if (event && event.type === "message") {
      yield put(patchLevels(event.payload));
    }
  }
}

function* rootSaga() {
  yield fork(socketWatcher);
  yield put(setSocketState("CONNECTING"));
}

export default rootSaga;
