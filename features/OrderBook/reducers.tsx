import { original } from "immer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Delta, SocketMessage, State } from "./types";
import SocketStateReasons from "./lib/enums/SocketStateReasons";

export const initialState: State = {
  bids: [],
  asks: [],
  productId: "PI_XBTUSD",
  socketState: "DISCONNECTED",
  socketStateReason: "",
};

const orderBook = createSlice({
  name: "OrderBook",
  initialState,
  reducers: {
    receivedDeltas(state, action: PayloadAction<SocketMessage>) {
      const originalState = original(state);

      function patch(type: "bids" | "asks") {
        const nextState = [...originalState![type]];

        for (const [newPrice, newSize] of action.payload[type]) {
          let lowestIndex = 0;
          let highestIndex = nextState.length;

          let replace = 0;
          let newElement: Delta = [newPrice, newSize];

          while (lowestIndex < highestIndex) {
            const midIndex = (lowestIndex + highestIndex) >>> 1;
            const currentPrice = nextState[midIndex][0];

            if (newPrice === currentPrice) {
              replace = 1;
              lowestIndex = midIndex;
              break;
            }

            if (
              type === "bids"
                ? currentPrice > newPrice // desc
                : newPrice > currentPrice // asc
            ) {
              lowestIndex = midIndex + 1;
            } else {
              highestIndex = midIndex;
            }
          }

          if (newSize > 0) {
            nextState.splice(lowestIndex, replace, newElement);
          } else {
            nextState.splice(lowestIndex, 1);
          }
        }

        return nextState;
      }

      return {
        bids: patch("bids"),
        asks: patch("asks"),
        productId: state.productId,
        socketState: state.socketState,
        socketStateReason: state.socketStateReason,
      };
    },

    switchedProducts(state) {
      state.productId =
        state.productId === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";
    },

    disconnectedSocket(
      state,
      action: PayloadAction<{ reason: SocketStateReasons }>
    ) {
      state.socketState = "DISCONNECTED";
      state.socketStateReason = action.payload.reason;
    },

    connectingSocket(state) {
      state.socketState = "CONNECTING";
      state.socketStateReason = "";
    },

    connectedSocket(state) {
      state.socketState = "CONNECTED";
      state.socketStateReason = "";
    },

    resetDeltas(state) {
      state.bids = [];
      state.asks = [];
    },
  },
});

export const {
  receivedDeltas,
  switchedProducts,
  disconnectedSocket,
  connectingSocket,
  connectedSocket,
  resetDeltas,
} = orderBook.actions;

export default orderBook.reducer;
