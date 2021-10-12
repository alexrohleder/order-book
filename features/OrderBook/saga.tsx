import { select, call, take, put } from "@redux-saga/core/effects";
import { createSocketChannel, SocketEvent } from "./channels";
import { patchLevels } from "./reducers";
import { State } from "./types";

function* rootSaga() {
  const productId = yield select((state: State) => state.productId);
  const socketChannel = yield call(createSocketChannel, productId);

  while (true) {
    const event: SocketEvent = yield take(socketChannel);

    if (event.type === "message") {
      yield put(patchLevels(event.payload));
    }
  }
}

export default rootSaga;
